import { useState, useEffect } from "react";
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
import { QRScannerModal } from "./components/QRScannerModal";
import { NotificationsSheet } from "./components/NotificationsSheet";

export default function App() {
  const [activePage, setActivePage] = useState("home");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [equipmentDetailType, setEquipmentDetailType] = useState<"laptop" | "brother" | "godex">("laptop");
  const [equipmentDetailId, setEquipmentDetailId] = useState<number>(15);

  useEffect(() => {
    // Apply Telegram theme variables
    const root = document.documentElement;
    
    // Check if Telegram WebApp is available
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      
      // Apply Telegram theme colors if available
      if (tg.themeParams.bg_color) {
        root.style.setProperty('--background', tg.themeParams.bg_color);
      }
      if (tg.themeParams.text_color) {
        root.style.setProperty('--foreground', tg.themeParams.text_color);
      }
      if (tg.themeParams.button_color) {
        root.style.setProperty('--primary', tg.themeParams.button_color);
      }
      if (tg.themeParams.button_text_color) {
        root.style.setProperty('--primary-foreground', tg.themeParams.button_text_color);
      }
    }
  }, []);

  const handleCreateInstallation = () => {
    setIsCreateDialogOpen(true);
    setActivePage("installations");
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
        return <SearchPage />;
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
          onQRClick={() => setIsQRScannerOpen(true)}
          onNotificationsClick={() => setIsNotificationsOpen(true)}
          onMenuItemClick={(page) => setActivePage(page)}
        />
        <main className="px-4 pb-24 pt-6">{renderPage()}</main>
        <BottomNav activePage={activePage} onPageChange={setActivePage} />
      </div>

      {/* Modals and Sheets */}
      <QRScannerModal open={isQRScannerOpen} onClose={() => setIsQRScannerOpen(false)} />
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
