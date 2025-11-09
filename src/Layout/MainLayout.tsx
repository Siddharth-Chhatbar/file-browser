import { AppSidebar } from "@/components/app-sidebar";
import Taskbar from "@/components/taskbar";
import Titlebar from "@/components/titlebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useEffect, useMemo, useState } from "react";
import { Outlet } from "react-router";

function getCookieValue(name: string) {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="))
    ?.split("=")[1];
}

const MainLayout = () => {
  // temp default tab
  // add a setting for user to setup a default tab on open
  const [tabs, setTabs] = useState([{ id: "tab-1", title: "Home" }]);
  const [activeTab, setActiveTab] = useState<string>(tabs[0].id);

  useEffect(() => {
    if (!tabs.find((t) => t.id === activeTab) && tabs.length > 0) {
      setActiveTab(tabs[0].id);
    }
  }, [tabs, activeTab]);

  function handleNewTab() {
    const id = `tab-${Date.now()}`;
    // change this to the tab opened by the user
    // add a setting to open a specific location
    const title = "New Tab";
    setTabs((prev) => [...prev, { id, title }]);
    setActiveTab(id);
  }

  function handleCloseTab(tabIdToClose: string) {
    if (tabs.length === 1) {
      console.warn("Cannot close the last remaining tab.");
      return;
    }

    setTabs((prev) => {
      const newTabs = prev.filter((tab) => tab.id !== tabIdToClose);

      if (tabIdToClose === activeTab) {
        const closedIndex = prev.findIndex((tab) => tab.id === tabIdToClose);
        const newActiveIndex = closedIndex > 0 ? closedIndex - 1 : 0;
        setActiveTab(newTabs[newActiveIndex].id);
      }

      return newTabs;
    });
  }

  function handleChangeTab(id: string) {
    setActiveTab(id);
  }

  const titlebarTabs = useMemo(
    () => tabs.map((t) => ({ id: t.id, title: t.title })),
    [tabs],
  );
  const cookieStore = getCookieValue("sidebar_state");
  const defaultOpen = cookieStore === "true";

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Titlebar
        tabs={titlebarTabs}
        value={activeTab}
        onValueChange={handleChangeTab}
        onNewTab={handleNewTab}
        onCloseTab={handleCloseTab}
      />

      <div className="flex grow overflow-hidden">
        <SidebarProvider defaultOpen={defaultOpen}>
          <AppSidebar variant="sidebar" className="h-full" />
          <div className="w-full h-full">
            <main className="px-4 pb-4">
              <Outlet />
            </main>
          </div>
        </SidebarProvider>
      </div>
      <Taskbar />
    </div>
  );
};

export default MainLayout;
