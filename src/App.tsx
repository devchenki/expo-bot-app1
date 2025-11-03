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

export default function App() {
  const [activePage, setActivePage] = useState(() => {
    // Восстанавливаем активную страницу из localStorage или используем "home"
    return localStorage.getItem('activePage') || 'home';
  });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [equipmentDetailType, setEquipmentDetailType] = useState<"laptop" | "brother" | "godex">("laptop");
  const [equipmentDetailId, setEquipmentDetailId] = useState<number>(15);

  // Сохраняем активную страницу в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('activePage', activePage);
  }, [activePage]);

  useEffect(() => {
    // Apply Telegram theme variables
    const root = document.documentElement;
    
    // Функция для применения цветов темы Telegram
    const applyTelegramTheme = () => {
      if (window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        
        // Применяем все доступные цвета темы Telegram
        if (tg.themeParams.bg_color) {
          root.style.setProperty('--background', tg.themeParams.bg_color);
        }
        if (tg.themeParams.text_color) {
          root.style.setProperty('--foreground', tg.themeParams.text_color);
        }
        if (tg.themeParams.button_color) {
          root.style.setProperty('--primary', tg.themeParams.button_color);
          root.style.setProperty('--ring', tg.themeParams.button_color);
          root.style.setProperty('--sidebar-primary', tg.themeParams.button_color);
          root.style.setProperty('--sidebar-ring', tg.themeParams.button_color);
          root.style.setProperty('--chart-1', tg.themeParams.button_color);
        }
        if (tg.themeParams.button_text_color) {
          root.style.setProperty('--primary-foreground', tg.themeParams.button_text_color);
          root.style.setProperty('--sidebar-primary-foreground', tg.themeParams.button_text_color);
        }
        if (tg.themeParams.secondary_bg_color) {
          root.style.setProperty('--card', tg.themeParams.secondary_bg_color);
          root.style.setProperty('--popover', tg.themeParams.secondary_bg_color);
        }
        if (tg.themeParams.hint_color) {
          root.style.setProperty('--muted-foreground', tg.themeParams.hint_color);
        }
        if (tg.themeParams.link_color) {
          root.style.setProperty('--accent', tg.themeParams.link_color);
        }
        
        console.log('Telegram theme applied:', tg.themeParams);
      }
    };
    
    // Check if Telegram WebApp is available
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      
      // Применяем тему сразу
      applyTelegramTheme();
      
      // Слушаем изменения темы (например, при переключении светлой/темной темы в Telegram)
      if (tg.onEvent) {
        tg.onEvent('themeChanged', () => {
          console.log('Theme changed, reapplying...');
          applyTelegramTheme();
        });
      }
      
      // Также слушаем изменения через viewport
      if (tg.viewportHeight) {
        tg.viewportStableHeight = tg.viewportHeight;
      }
    } else {
      // Если не в Telegram, используем дефолтные цвета из CSS
      console.log('Not in Telegram Web App, using default theme');
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

// Extend Window interface for Telegram WebApp
declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        onEvent?: (event: string, handler: () => void) => void;
        viewportHeight?: number;
        viewportStableHeight?: number;
        themeParams: {
          bg_color?: string;
          text_color?: string;
          hint_color?: string;
          link_color?: string;
          button_color?: string;
          button_text_color?: string;
          secondary_bg_color?: string;
        };
      };
    };
  }
}
