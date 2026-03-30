
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { router } from "@inertiajs/react";  

interface SingleTabProps {
  tabs: {
    value: string
    label: string
    icon: React.ReactNode
    href?: string
  }[]
  defaultValue?: string
}

export default function IconSingleTab({ tabs, defaultValue }: SingleTabProps) {
  const [activeSub, setActiveSub] = useState(defaultValue)

    return (
    
        <div className="flex justify-start pt-3">
          <Tabs value={activeSub} onValueChange={setActiveSub}>
            <TabsList className="flex gap-6 ">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className='p-2 font-semibold  
                  data-[state=active]:text-kseb-primary
                  data-[state=inactive]:text-gray-500'
                  onClick={() => {
                  if (tab.href) {
                    router.visit(tab.href)
                  }
                }}

                >
                  {tab.icon} {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
    )
}