"use client"
import { ReactNode, useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"

interface TabItem {
  id: string
  label: ReactNode
  content: ReactNode
}

interface ModernTabsProps {
  tabs: TabItem[]
  defaultTab?: string
  onChange?: (tabId: string) => void
  variant?: "underline" | "pills" | "contained"
  fullWidth?: boolean
  animated?: boolean
}

export function ModernTabs({
  tabs,
  defaultTab,
  onChange,
  variant = "underline",
  fullWidth = false,
  animated = true,
}: ModernTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  // Update the indicator position when the active tab changes
  useEffect(() => {
    const activeIndex = tabs.findIndex((tab) => tab.id === activeTab)
    if (activeIndex >= 0 && tabRefs.current[activeIndex]) {
      const tabElement = tabRefs.current[activeIndex]
      if (tabElement) {
        const { offsetLeft, offsetWidth } = tabElement
        setIndicatorStyle({ left: offsetLeft, width: offsetWidth })
      }
    }
  }, [activeTab, tabs])

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    if (onChange) {
      onChange(tabId)
    }
  }

  const getTabStyles = () => {
    switch (variant) {
      case "pills":
        return {
          container: "flex space-x-2 p-1 rounded-lg bg-gray-100",
          tab: (isActive: boolean) =>
            `px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              isActive
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-200/50"
            }`,
          indicator: "hidden",
        }
      case "contained":
        return {
          container: "flex rounded-lg border border-gray-200 p-1",
          tab: (isActive: boolean) =>
            `px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              isActive
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`,
          indicator: "hidden",
        }
      case "underline":
      default:
        return {
          container: "flex border-b border-gray-200",
          tab: (isActive: boolean) =>
            `px-4 py-2.5 font-medium text-sm transition-colors relative ${
              isActive
                ? "text-blue-600"
                : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`,
          indicator: "absolute bottom-0 h-0.5 bg-blue-500 transition-all duration-300",
        }
    }
  }

  const styles = getTabStyles()

  return (
    <div className="w-full">
      <div className="relative">
        <div className={styles.container}>
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              className={`${styles.tab(activeTab === tab.id)} ${fullWidth ? "flex-1 text-center" : ""}`}
              onClick={() => handleTabChange(tab.id)}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`tabpanel-${tab.id}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {variant === "underline" && (
          <motion.div
            className={styles.indicator}
            initial={false}
            animate={{
              left: indicatorStyle.left,
              width: indicatorStyle.width,
            }}
          />
        )}
      </div>

      <div className="mt-4">
        {animated ? (
          <AnimatedTabContent tabs={tabs} activeTab={activeTab} />
        ) : (
          tabs.map((tab) => (
            <div
              key={tab.id}
              role="tabpanel"
              id={`tabpanel-${tab.id}`}
              aria-labelledby={`tab-${tab.id}`}
              hidden={activeTab !== tab.id}
            >
              {tab.content}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function AnimatedTabContent({ tabs, activeTab }: { tabs: TabItem[]; activeTab: string }) {
  return (
    <div className="relative">
      {tabs.map((tab) => (
        <motion.div
          key={tab.id}
          role="tabpanel"
          id={`tabpanel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: activeTab === tab.id ? 1 : 0,
            y: activeTab === tab.id ? 0 : 10,
            zIndex: activeTab === tab.id ? 1 : 0,
            position: activeTab === tab.id ? "relative" : "absolute",
            top: 0,
            left: 0,
            width: "100%",
          }}
          transition={{ duration: 0.3 }}
        >
          {tab.content}
        </motion.div>
      ))}
    </div>
  )
}
