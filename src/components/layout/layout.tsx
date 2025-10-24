import { ReactNode, useState } from "react";
import { Header } from "./components/header";
import Sidebar from "./components/sidebar";
import { Toolbar } from "./components/toolbar";

export const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-[98vh] bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      {/* Основной контент */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        {/* Основной контент */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Добро пожаловать в панель управления</h1>
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <p className="text-gray-600">Выберите проект из sidebar для начала работы.</p>
            </div>
          </div> */}
          {children}
        </main>
        <Toolbar />
      </div>
    </div>
  );
};
