"use client"

import { Sidebar } from "@/components/sidebar/sidebar"
import { SidebarSwitcher } from "@/components/sidebar/sidebar-switcher"
import { Button } from "@/components/ui/button"
import { Tabs } from "@/components/ui/tabs"
import useHotkey from "@/lib/hooks/use-hotkey"
import { cn } from "@/lib/utils"
import { ContentType } from "@/types"
import { IconChevronCompactRight } from "@tabler/icons-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { FC, useState } from "react"
import { useSelectFileHandler } from "../chat/chat-hooks/use-select-file-handler"
import { CommandK } from "../utility/command-k"
import NotesComponent from "./notesComponent" // Adjust the import path as necessary
import { ToggleSwitch } from "@/components/utility/toggle-switch"
import { ChatbotUIContext } from "@/context/context"
import { useContext } from "react"


export const SIDEBAR_WIDTH = 350

interface DashboardProps {
  children: React.ReactNode
}

export const Dashboard: FC<DashboardProps> = ({ children }) => {
  useHotkey("s", () => setShowSidebar(prevState => !prevState))

  const pathname = usePathname()
  const router = useRouter()
  const { selectedWorkspace } = useContext(ChatbotUIContext)
  const searchParams = useSearchParams()
  const tabValue = searchParams.get("tab") || "chats"

  const { handleSelectDeviceFile } = useSelectFileHandler()
  

  const [contentType, setContentType] = useState<ContentType>(
    tabValue as ContentType
  )
  const [showSidebar, setShowSidebar] = useState(
    localStorage.getItem("showSidebar") === "true"
  )

  const [isDragging, setIsDragging] = useState(false)

  const onFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()

    const files = event.dataTransfer.files
    const file = files[0]

    handleSelectDeviceFile(file)

    setIsDragging(false)
  }

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
  }

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const handleToggleSidebar = () => {
    setShowSidebar(prevState => !prevState)
    localStorage.setItem("showSidebar", String(!showSidebar))
  }
  const [showNotes, setShowNotes] = useState(false)

  const handleToggle = (toggled: boolean) => {
    setShowNotes(toggled)
  }
  const handleContentTypeChange = (contentType: ContentType) => {
    if (contentType === "notes") {
      setShowNotes(true)
      if (selectedWorkspace) {
        router.push(`/${selectedWorkspace.id}/notes/new`)
      } else {
        console.error("No workspace selected")
      }
    } else {
      setShowNotes(false)
    }
  }

  return (
    <>
      <div className="flex size-full">
        <CommandK />

        <Button
          className={cn(
            "absolute left-[4px] top-[50%] z-10 size-[32px] cursor-pointer"
          )}
          style={{
            marginLeft: showSidebar ? `${SIDEBAR_WIDTH}px` : "0px",
            transform: showSidebar ? "rotate(180deg)" : "rotate(0deg)"
          }}
          variant="ghost"
          size="icon"
          onClick={handleToggleSidebar}
        >
          <IconChevronCompactRight size={24} />
        </Button>

        <div
          className={cn("border-r-2 duration-200 dark:border-none")}
          style={{
            // Sidebar
            minWidth: showSidebar ? `${SIDEBAR_WIDTH}px` : "0px",
            maxWidth: showSidebar ? `${SIDEBAR_WIDTH}px` : "0px",
            width: showSidebar ? `${SIDEBAR_WIDTH}px` : "0px"
          }}
        >
          {showSidebar && (
            <Tabs
              className="flex h-full overflow-auto"
              value={contentType}
              onValueChange={tabValue => {
                setContentType(tabValue as ContentType)
                router.replace(`${pathname}?tab=${tabValue}`)
              }}
            >
              <SidebarSwitcher onContentTypeChange={handleContentTypeChange} />

              <Sidebar contentType={contentType} showSidebar={showSidebar} />
            </Tabs>
          )}
        </div>

        <div
          className="bg-muted/50 flex grow flex-col"
          onDrop={onFileDrop}
          onDragOver={onDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
        >
          {isDragging ? (
            <div className="flex h-full items-center justify-center bg-black/50 text-2xl text-white">
              drop file here
            </div>
          ) : showNotes ? (
            <NotesComponent />
          ) : (
            children
          )}
        </div>
      </div>

      <div className="fixed right-4 top-12 md:right-12 md:top-12">
        <ToggleSwitch onToggle={handleToggle} />
      </div>
    </>
  )
}
