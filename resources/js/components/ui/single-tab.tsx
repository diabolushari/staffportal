
import React, { useEffect, useState } from "react";
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
  headerLeft?: React.ReactNode
  children?: React.ReactNode
}

export default function SingleTabGroup({ tabs, defaultValue, headerLeft, children }: SingleTabProps) {
  const [activeSub, setActiveSub] = useState(defaultValue)

    return (
    
        <div className="flex justify-start pt-3">
          <Tabs value={activeSub} onValueChange={setActiveSub}>
            <TabsList className="flex gap-6 bg-white p-2 border">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className='p-2 font-semibold border-b-2  
                  data-[state=active]:border-blue-400 
                  data-[state=active]:text-blue-400 
                  data-[state=active]:bg-blue-50 cursor-pointer'
                  onClick={() => {
                  if (tab.href) {
                    router.visit(tab.href)
                  }
                }}

                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
    )
}