"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"

const STORAGE_KEY = "amapels-theme"

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const sync = () => setDark(document.documentElement.dataset.theme === "dark")
    sync()
    // Keep every toggle on the page (desktop + mobile drawer) in sync
    const observer = new MutationObserver(sync)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    })
    return () => observer.disconnect()
  }, [])

  function toggle() {
    const next = !dark
    setDark(next)
    try {
      document.documentElement.dataset.theme = next ? "dark" : "light"
      localStorage.setItem(STORAGE_KEY, next ? "dark" : "light")
    } catch {
      // localStorage unavailable — theme still applies visually for this visit
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={dark}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
      className={`btn-mobile p-2 text-ink/75 transition-colors duration-300 hover:text-ink ${className}`}
    >
      <span className="sr-only">Toggle theme</span>
      {dark ? <Sun size={19} /> : <Moon size={19} />}
    </button>
  )
}
