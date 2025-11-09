// titlebar.tsx
import { useEffect, useState } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"; // shadcn Tabs
import { Button } from "@/components/ui/button"; // or your IconButton
import { Plus, Minus, Square, SquareArrowOutDownLeft, X } from "lucide-react";

export default function Titlebar({
  tabs,
  value,
  onValueChange,
  onNewTab,
  onCloseTab,
}: {
  tabs: { id: string; title: string }[];
  value: string;
  onValueChange: (val: string) => void;
  onNewTab: () => void;
  onCloseTab: (id: string) => void;
}) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [currentWindow, setCurrentWindow] = useState<any>(null);

  useEffect(() => {
    const initWindow = async () => {
      const appWindow = getCurrentWindow();
      setCurrentWindow(appWindow);
      try {
        const maximized = await appWindow.isMaximized();
        setIsMaximized(maximized);
      } catch (error) {
        console.error("Failed to check maximized state:", error);
      }
    };

    initWindow();
  }, []);

  const handleMinimize = async () => {
    try {
      await currentWindow?.minimize();
    } catch (error) {
      console.error("Failed to minimize the window:", error);
    }
  };

  const handleToggleMaximize = async () => {
    try {
      await currentWindow?.toggleMaximize();
      const maximized = await currentWindow?.isMaximized();
      setIsMaximized(maximized);
    } catch (error) {
      console.error("Failed to toggle maximize:", error);
    }
  };

  const handleClose = async () => {
    try {
      await currentWindow?.close();
    } catch (error) {
      console.error("Failed to close the window:", error);
    }
  };

  return (
    <div
      className="titlebar-drag h-10 flex bg-muted"
      // double-click to toggle maximize on the draggable area (excluding no-drag children)
      onDoubleClick={handleToggleMaximize}
      // NOTE: keep all interactive children as no-drag
    >
      {/* left side: optional app icon / mac traffic lights - make them no-drag */}
      <div className="titlebar-no-drag flex items-center">
        {/* Example new tab button (no-drag) */}
        <Button
          variant="ghost"
          size="icon"
          aria-label="New tab"
          onClick={onNewTab}
          onDoubleClick={(e) => e.stopPropagation()}
          className="titlebar-no-drag hover:bg-input! rounded-none"
        >
          <Plus size={14} />
        </Button>
      </div>

      {/* center: shadcn Tabs */}
      <div className="tabs-wrap flex-1 min-w-0 h-full flex items-center">
        <Tabs
          value={value}
          onValueChange={onValueChange}
          className="titlebar-no-drag"
          onDoubleClick={(e) => e.stopPropagation()}
        >
          <TabsList
            className="flex gap-1 overflow-x-auto scrollbar-hidden rounded-none p-0"
            // each trigger must be no-drag so clicks work
          >
            {tabs.map((t) => (
              <TabsTrigger
                key={t.id}
                value={t.id}
                className="titlebar-no-drag whitespace-nowrap px-0 pl-2 rounded-none text-sm flex justify-between items-center w-36"
              >
                {t.title}
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Close tab"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onCloseTab(t.id);
                  }}
                  onDoubleClick={(e) => e.stopPropagation()}
                  className="hover:bg-destructive! rounded-none"
                >
                  <X size={14} />
                </Button>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* right side: window controls */}
      <div className="titlebar-no-drag flex items-center gap-1 pr-0">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Minimize"
          onClick={handleMinimize}
          onDoubleClick={(e) => e.stopPropagation()}
          className="titlebar-no-drag hover:bg-input! rounded-none"
        >
          <Minus size={14} />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          aria-label={isMaximized ? "Restore" : "Maximize"}
          onClick={handleToggleMaximize}
          onDoubleClick={(e) => e.stopPropagation()}
          className="titlebar-no-drag hover:bg-input! rounded-none"
        >
          {isMaximized ? (
            <SquareArrowOutDownLeft size={14} />
          ) : (
            <Square size={14} />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          aria-label="Close"
          onClick={handleClose}
          onDoubleClick={(e) => e.stopPropagation()}
          className="titlebar-no-drag hover:bg-destructive! rounded-none"
        >
          <X size={14} />
        </Button>
      </div>
    </div>
  );
}
