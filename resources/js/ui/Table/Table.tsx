import {
  Table as ShadcnTable,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import React from 'react'

export default function Table({
  children,
  heads,
  editColumn,
}: {
  children?: React.ReactNode
  heads: string[]
  editColumn?: boolean
}) {
  return (
    <ShadcnTable>
      <TableHeader className='rounded-md bg-gray-50 p-3 dark:bg-gray-800'>
        <TableRow className='text-xs font-medium text-gray-500 dark:text-gray-400'>
          {heads.map((head) => (
            <TableHead key={head}>{head}</TableHead>
          ))}
          {editColumn && <TableHead />}
        </TableRow>
      </TableHeader>
      <TableBody>{children}</TableBody>
    </ShadcnTable>
  )
}
