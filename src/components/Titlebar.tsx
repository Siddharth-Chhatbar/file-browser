// Titlebar.tsx
import React, { useEffect, useState } from "react";
import { Window } from "@tauri-apps/api/window";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"; // shadcn Tabs
import { Button } from "@/components/ui/button"; // or your IconButton
import { Plus, Minimize, Maximize, X } from "lucide-react";

const appWindow = new Window("theUniqueLabel");

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

  useEffect(() => {
    (async () => {
      const maximized = await appWindow.isMaximized();
      setIsMaximized(maximized);
    })();
    // you can add listeners for maximize/unmaximize if needed
  }, []);

  async function toggleMaximize() {
    if (await appWindow.isMaximized()) {
      await appWindow.unmaximize();
      setIsMaximized(false);
    } else {
      await appWindow.maximize();
      setIsMaximized(true);
    }
  }

  return (
    <div
      className="titlebar -webkit-app-region-drag h-10 flex items-center gap-2 px-2 bg-muted"
      // double-click to toggle maximize on the draggable area (excluding no-drag children)
      onDoubleClick={() => toggleMaximize()}
      // NOTE: keep all interactive children as no-drag
    >
      {/* left side: optional app icon / mac traffic lights - make them no-drag */}
      <div className="no-drag flex items-center gap-2 p-2">
        {/* Example new tab button (no-drag) */}
        <Button
          variant="ghost"
          size="icon"
          aria-label="New tab"
          onClick={onNewTab}
          className="no-drag"
        >
          <Plus size={14} />
        </Button>
      </div>

      {/* center: shadcn Tabs */}
      <div className="tabs-wrap flex-1 min-w-0">
        <Tabs value={value} onValueChange={onValueChange} className="no-drag">
          <TabsList
            className="flex gap-1 overflow-x-auto scrollbar-hidden rounded-none p-0"
            // each trigger must be no-drag so clicks work
          >
            {tabs.map((t) => (
              <TabsTrigger
                key={t.id}
                value={t.id}
                className="no-drag whitespace-nowrap pl-3 pr-2 py-0 rounded-none text-sm flex justify-center items-center"
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
                  className="hover:bg-destructive!"
                >
                  <X size={4} />
                </Button>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* right side: window controls */}
      {/*<div className="no-drag flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Minimize"
          onClick={() => appWindow.minimize()}
          className="no-drag"
        >
          <Minimize size={14} />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          aria-label={isMaximized ? "Restore" : "Maximize"}
          onClick={() => toggleMaximize()}
          className="no-drag"
        >
          <Maximize size={14} />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          aria-label="Close"
          onClick={() => appWindow.close()}
          className="no-drag"
        >
          <X size={14} />
        </Button>
      </div>*/}
    </div>
  );
}
