import React from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { BreadcrumbItem as BreadcrumbItemType } from '@/types'
import { Link } from '@inertiajs/react'

export default function CustomBreadcrumb({ list }: { list: BreadcrumbItemType[] }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {list.map((item, index) => {
          const isLast = index === list.length - 1

          return (
            <React.Fragment key={item.href}>
              <BreadcrumbItem>
                {isLast ? (
                  <span className='text-foreground font-semibold'>{item.title}</span>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link
                      href={item.href}
                      className='normal-font'
                    >
                      {item.title}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>

              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
