import type React from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  children: React.ReactNode
}

export function Button({ className = "", variant = "default", size = "default", children, ...props }: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50"

  const variantStyles = {
    default: "bg-teal-600 text-white hover:bg-teal-700",
    outline: "border border-gray-300 bg-transparent hover:bg-gray-100",
    link: "text-teal-600 underline-offset-4 hover:underline",
    destructive: "bg-red-600 text-white hover:bg-red-700",
  }

  const sizeStyles = {
    default: "h-10 px-4 py-2",
    sm: "h-8 px-3 text-sm",
    lg: "h-12 px-6 text-lg",
    icon: "h-10 w-10",
  }

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  )
}
