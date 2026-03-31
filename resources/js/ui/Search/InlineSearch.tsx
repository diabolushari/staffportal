import { router } from '@inertiajs/react'
import { useState } from 'react'
import Input from '@/ui/form/Input'
import Button from '@/ui/button/Button'

interface Props {
  url: string
  placeholder?: string
  defaultValue?: string
  extraFilters?: Record<string, string | number>
}

export default function InlineSearch({
  url,
  placeholder = 'Search...',
  defaultValue = '',
  extraFilters = {},
}: Props) {
  const [search, setSearch] = useState(defaultValue)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    router.get(
      url,
      {
        ...extraFilters,
        search: search,
      },
      {
        preserveState: true,
        replace: true,
      }
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='mb-4 flex items-center gap-3'
    >
      <Input
        value={search}
        setValue={setSearch}
        placeholder={placeholder}
        showClearButton
      />
      <Button
        type='submit'
        label='Search'
      />
    </form>
  )
}
