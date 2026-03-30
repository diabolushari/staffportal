import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'
import { SheetSidebarMenu } from './SheetSidebarMenu'

/**
 * MobileNavSheet
 * Renders the CustomNavbar inside a left side sheet for < lg breakpoints.
 */
export function MobileNavSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className='mr-2 h-10 w-10 xl:hidden'
          aria-label='Open navigation menu'
        >
          <Menu className='h-5 w-5' />
        </Button>
      </SheetTrigger>
      <SheetContent
        side='left'
        className='xl:hidden'
      >
        <SheetHeader className='pb-2'>
          <SheetTitle className='text-sm font-medium'>Menu</SheetTitle>
        </SheetHeader>
        <nav className='mt-2 flex flex-col gap-1'>
          <SheetSidebarMenu />
        </nav>
      </SheetContent>
    </Sheet>
  )
}
