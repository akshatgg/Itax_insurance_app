"use client"

import type React from "react"

import { ResponsiveLayout } from "./responsive-layout"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return <ResponsiveLayout>{children}</ResponsiveLayout>
}
