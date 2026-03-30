'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import React, { useState } from 'react'

interface Props {
  tabs: {
    value: string
    label: string
    href?: string
  }[]
  children: React.ReactNode
  defaultValue?: string
}

export function TabGroup({ tabs, children, defaultValue }: Readonly<Props>) {
  const [activeTab, setActiveTab] = useState(defaultValue || tabs[0].value)

  return (
    <div className='flex w-full flex-col gap-10 p-0'>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className='mb-4 flex justify-start gap-10 bg-white p-3'>
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              onClick={() => {
                if (tab.href) {
                  window.location.href = tab.href
                } else {
                  setActiveTab(tab.value)
                }
              }}
              className='w-full rounded-none border-b-2 border-transparent p-3 text-sm font-normal data-[state=active]:border-black data-[state=active]:font-semibold'
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* children are your <TabsContent> */}
        {children}
      </Tabs>
    </div>
  )
}
