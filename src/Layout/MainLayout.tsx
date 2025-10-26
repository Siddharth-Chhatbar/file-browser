import { AppSidebar } from "@/components/app-sidebar";
import Taskbar from "@/components/Taskbar";
import Titlebar from "@/components/Titlebar";
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
  // sample initial tabs
  const [tabs, setTabs] = useState([
    { id: "tab-1", title: "Home" },
    { id: "tab-2", title: "Documents" },
  ]);

  // active tab id
  const [activeTab, setActiveTab] = useState<string>(tabs[0].id);

  // ensure activeTab stays valid when tabs change
  useEffect(() => {
    if (!tabs.find((t) => t.id === activeTab) && tabs.length > 0) {
      setActiveTab(tabs[0].id);
    }
  }, [tabs, activeTab]);

  // handler to create a new tab
  function handleNewTab() {
    const id = `tab-${Date.now()}`;
    const title = "New Tab";
    setTabs((prev) => [...prev, { id, title }]);
    setActiveTab(id);
  }

  // handler to close tabs
  function handleCloseTab(tabIdToClose: string) {
    // Prevent closing the last remaining tab
    if (tabs.length === 1) {
      console.warn("Cannot close the last remaining tab.");
      return;
    }

    setTabs((prev) => {
      // Filter out the tab being closed
      const newTabs = prev.filter((tab) => tab.id !== tabIdToClose);

      // If the closed tab was the active one, switch the active tab
      if (tabIdToClose === activeTab) {
        // Find the index of the closed tab in the *old* array
        const closedIndex = prev.findIndex((tab) => tab.id === tabIdToClose);

        // Determine the new active tab: prefer the tab immediately to the left,
        // or the rightmost tab if the closed tab was the first one.
        const newActiveIndex = closedIndex > 0 ? closedIndex - 1 : 0;

        setActiveTab(newTabs[newActiveIndex].id);
      }

      return newTabs;
    });
  }

  // handler when user switches tabs via shadcn Tabs
  function handleChangeTab(id: string) {
    setActiveTab(id);
  }

  // memoized props for Titlebar
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
