import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { router } from "@inertiajs/react";   

interface NestedTabProps {
  tabs: {
    value: string
    label: string
    icon: React.ReactNode
    activeIcon: React.ReactNode
    href?: string
    item?: {
      subValue: string
      subLabel: string
      subLink?: string
    }[]
  }[]
  defaultValue?: string
  defaultSubValue?: string
  headerLeft?: React.ReactNode
  children?: React.ReactNode
}


export function NestedTabGroup({
  tabs,
  defaultValue,
  defaultSubValue,
  headerLeft,
  children,
}: Readonly<NestedTabProps>) {
  const [activeTab, setActiveTab] = useState(defaultValue || tabs[0].value)

  const activeMasterTab = tabs.find((t) => t.value === activeTab)
  const subTabs = activeMasterTab?.item || []

  const [activeSub, setActiveSub] = useState(
    defaultSubValue || subTabs?.[0]?.subValue || ''
  )

  useEffect(() => {
    if (subTabs.length > 0 && !defaultSubValue) {
      setActiveSub(subTabs[0].subValue)
    }
  }, [activeTab])

  return (
    <div className="flex w-full flex-col gap-6">

      {/* 🔹 HEADER ROW */}
      <div className="flex items-center justify-between gap-6">
        {/* Left: Heading */}
        <div className="flex flex-col gap-1">
          {headerLeft}
        </div>

        {/* Right: Top Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList
            className='
              flex
              bg-white
              border border-tab-border
              rounded-md
              overflow-hidden
              divide-x
            '
          >
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className='
                  flex items-center justify-center
                  p-4
                  text-gray-600
                  bg-white
                  data-[state=active]:bg-kseb-primary
                  data-[state=active]:text-kseb-bg-blue
                  cursor-pointer
                '
                onClick={() => tab.href && router.visit(tab.href)}
              >
                {activeTab === tab.value ? tab.activeIcon : tab.icon}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* 🔹 SUB TABS */}
      
      {subTabs.length > 0 && (
        <div className="flex justify-start pt-3">
          <Tabs value={activeSub} onValueChange={setActiveSub}>
            <TabsList className="flex gap-6 bg-white p-2 border">
              {subTabs.map((st) => (
                <TabsTrigger
                  key={st.subValue}
                  value={st.subValue}
                  className='p-2 font-semibold border-b-2  
                  data-[state=active]:border-blue-400 
                  data-[state=active]:text-blue-400 
                  data-[state=active]:bg-blue-50 cursor-pointer'
                  onClick={() => {
                  if (st.subLink) {
                    router.visit(st.subLink)
                  }
                }}

                >
                  {st.subLabel}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      )}

      {/* 🔹 CONTENT */}
      <div>{children}</div>
    </div>
  )
}

