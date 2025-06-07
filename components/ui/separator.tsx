interface SeparatorProps {
  className?: string
  orientation?: "horizontal" | "vertical"
}

export function Separator({ className = "", orientation = "horizontal" }: SeparatorProps) {
  return (
    <div
      className={`
        ${orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]"}
        bg-gray-200 ${className}
      `}
      role="separator"
    />
  )
}
