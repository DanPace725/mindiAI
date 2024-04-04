import { useState } from "react"
import { Toggle } from "../ui/toggle" // Adjust the path as necessary

export const ToggleSwitch = ({
  onToggle
}: {
  onToggle: (value: boolean) => void
}) => {
  const [isToggled, setIsToggled] = useState(false)

  const handleToggle = () => {
    const newState = !isToggled
    setIsToggled(newState)
    onToggle(newState)
  }

  return (
    <div className="flex items-center justify-center">
      <label className="Toggle hover:bg-accent">
        <Toggle pressed={isToggled} onPressedChange={handleToggle} />
        <span
          className={`slider round ${isToggled ? "active" : ""} hover:opacity-50`}
        ></span>
      </label>
    </div>
  )
}
