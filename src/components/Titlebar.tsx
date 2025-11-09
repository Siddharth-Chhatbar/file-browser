// titlebar.tsx
import { useEffect, useState } from "react";
import { getCurrentWindow, type Window } from "@tauri-apps/api/window";
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
  const [currentWindow, setCurrentWindow] = useState<Window | null>(null);

  useEffect(() => {
    let unlisten: (() => void) | undefined;

    const initWindow = async () => {
      const appWindow = getCurrentWindow();
      setCurrentWindow(appWindow);

      unlisten = await appWindow.onResized(async () => {
        try {
          const isMax = await currentWindow?.isMaximized();
          setIsMaximized(!!isMax);
        } catch (error) {
          console.error("Failed to get maximized state on resize:", error);
        }
      });

      try {
        const maximized = await appWindow.isMaximized();
        setIsMaximized(!!maximized);
      } catch (error) {
        console.error("Failed to check maximized state:", error);
      }
    };

    initWindow();

    return () => {
      unlisten?.();
    };
  }, []);

  const handleMinimize = async () => {
    if (!currentWindow) return;
    try {
      await currentWindow.minimize();
    } catch (error) {
      console.error("Failed to minimize the window:", error);
    }
  };

  const handleToggleMaximize = async () => {
    try {
      await currentWindow?.toggleMaximize();
      const maximized = await currentWindow?.isMaximized();
      setIsMaximized(!!maximized);
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
      {/* left side: add tab */}
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

      {/* center: Tabs */}
      <div className="tabs-wrap flex-1 min-w-0 h-full flex items-center">
        <div
          className="tabs-scroll titlebar-no-drag overflow-x-auto"
          onWheel={(e) => {
            const el = e.currentTarget;
            if (el.scrollWidth > el.clientWidth) {
              const delta = e.deltaY || e.deltaX;
              if (delta) {
                el.scrollLeft += delta;
                e.preventDefault();
              }
            }
          }}
        >
          <Tabs
            value={value}
            onValueChange={onValueChange}
            className="titlebar-no-drag"
            onDoubleClick={(e) => e.stopPropagation()}
          >
            <TabsList className="flex gap-1 whitewhitespace-nowrap rounded-none p-0">
              {tabs.map((t) => (
                <TabsTrigger
                  key={t.id}
                  value={t.id}
                  className="titlebar-no-drag whitespace-nowrap px-0 pl-2 rounded-none text-sm flex-none justify-between items-center w-36"
                >
                  <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                    {t.title}
                  </div>
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
          {/*{isMaximized ? (
            <SquareArrowOutDownLeft size={14} />
          ) : (
            <Square size={14} />
          )}
          */}
          <Square size={14} />
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
