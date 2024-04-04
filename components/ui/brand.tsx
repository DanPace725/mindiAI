"use client"

import Link from "next/link"
import { FC } from "react"
import { ChatbotUISVG } from "../icons/chatbotui-svg"

interface BrandProps {
  theme?: "dark" | "light"
}

export const Brand: FC<BrandProps> = ({ theme = "dark" }) => {
  return (
    <div
      className="flex cursor-pointer flex-col items-center "
      rel="noopener noreferrer"
    >
      <div className="text-4xl font-bold tracking-wide">Mindi AI</div>
      <div className="text-center text-sm text-gray-600">
        Your personal chatbot and note-taking assistant
      </div>
    </div>
  )
}
