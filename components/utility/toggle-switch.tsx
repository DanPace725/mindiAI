"use client"

import { useState } from "react"
import { FC } from "react"

interface ToggleSwitchProps {
  onToggle: (isToggled: boolean) => void
}

export const ToggleSwitch: FC<ToggleSwitchProps> = ({ onToggle }) => {
  const [isToggled, setIsToggled] = useState(false)

  const handleToggle = () => {
    setIsToggled(!isToggled)
    onToggle(!isToggled)
  }

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        left: "50%",
        transform: "translateX(-50%)"
      }}
    >
      <label className="switch">
        <input type="checkbox" onChange={handleToggle} />
        <span className="slider round"></span>
      </label>
    </div>
  )
}
