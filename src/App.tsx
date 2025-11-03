import React, { useState, useEffect } from "react";
import { Toaster } from "./components/ui/sonner";
import { Header } from "./components/Header";
import { BottomNav } from "./components/BottomNav";
import { HomePage } from "./components/HomePage";
import { InstallationsPage } from "./components/InstallationsPage";
import { EquipmentPage } from "./components/EquipmentPage";
import { EventsPage } from "./components/EventsPage";
import { ConsumablesPage } from "./components/ConsumablesPage";
import { StatisticsPage } from "./components/StatisticsPage";
import { SearchPage } from "./components/SearchPage";
import { SettingsPage } from "./components/SettingsPage";
import { HistoryPage } from "./components/HistoryPage";
import { HelpPage } from "./components/HelpPage";
import { EquipmentDetailPage } from "./components/EquipmentDetailPage";
import { NotificationsSheet } from "./components/NotificationsSheet";

// Глобальное событие для обновления активности
const activityUpdateEvent = new Event('activityNeedsUpdate');

export default function App() {
  const [activePage, setActivePage] = useState(() => {
    // Восстанавливаем активную страницу из localStorage или используем "home"
    return localStorage.getItem('activePage') || 'home';
  });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [equipmentDetailType, setEquipmentDetailType] = useState<"laptop" | "brother" | "godex">("laptop");
  const [equipmentDetailId, setEquipmentDetailId] = useState<number>(15);
  
  // Отслеживаем изменения страницы для обновления активности
  useEffect(() => {
    if (activePage === 'home') {
      // При возврате на главную страницу обновляем активность
      window.dispatchEvent(activityUpdateEvent);
    }
  }, [activePage]);

  // Сохраняем активную страницу в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('activePage', activePage);
  }, [activePage]);

  useEffect(() => {
    // Инициализация Telegram WebApp (без применения темы - используем свою палитру)
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
    }
  }, []);

  const handleCreateInstallation = () => {
    setIsCreateDialogOpen(true);
    setActivePage("installations");
  };

  const handleSearchNavigate = (page: string, ...args: any[]) => {
    if (page === "equipment-detail") {
      setEquipmentDetailType(args[0]);
      setEquipmentDetailId(args[1]);
      setActivePage("equipment-detail");
    } else {
      setActivePage(page);
    }
  };

  const renderPage = () => {
    switch (activePage) {
      case "home":
        return <HomePage 
          onCreateInstallation={handleCreateInstallation} 
          onNavigate={setActivePage}
        />;
      case "installations":
        return (
          <InstallationsPage
            isCreateDialogOpen={isCreateDialogOpen}
            onCloseCreateDialog={() => setIsCreateDialogOpen(false)}
            onCreateInstallation={handleCreateInstallation}
          />
        );
      case "equipment":
        return <EquipmentPage onViewDetails={(type, id) => {
          setEquipmentDetailType(type);
          setEquipmentDetailId(id);
          setActivePage("equipment-detail");
        }} />;
      case "equipment-detail":
        return <EquipmentDetailPage 
          onBack={() => setActivePage("equipment")} 
          equipmentType={equipmentDetailType}
          equipmentId={equipmentDetailId}
        />;
      case "events":
        return <EventsPage />;
      case "consumables":
        return <ConsumablesPage />;
      case "statistics":
        return <StatisticsPage />;
      case "search":
        return <SearchPage onNavigate={handleSearchNavigate} />;
      case "settings":
        return <SettingsPage />;
      case "history":
        return <HistoryPage />;
      case "help":
        return <HelpPage />;
      default:
        return <HomePage onCreateInstallation={handleCreateInstallation} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[600px]">
        <Header 
          onSearchClick={() => setActivePage("search")}
          onNotificationsClick={() => setIsNotificationsOpen(true)}
          onMenuItemClick={(page) => setActivePage(page)}
        />
        <main className="px-4 pb-24 pt-6">{renderPage()}</main>
        <BottomNav activePage={activePage} onPageChange={setActivePage} />
      </div>

      {/* Modals and Sheets */}
      <NotificationsSheet open={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
      
      <Toaster />
    </div>
  );
}

// Types are declared in useTelegramAuth.ts to avoid conflicts
