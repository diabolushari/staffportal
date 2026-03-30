import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { handleHttpErrors } from '@/ui/alerts'
import { Paginator } from '@/ui/ui_interfaces'

export default function useFetchRecord<T>(url: string): [Paginator<T> | null, boolean] {
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState<Paginator<T> | null>(null)

  const fetchList = useCallback(async () => {
    setLoading(true)
    setList(null)
    try {
      const { data } = await axios.get(url)
      setList(data)
    } catch (error) {
      handleHttpErrors(error)
    } finally {
      setLoading(false)
    }
  }, [url])

  useEffect(() => {
    fetchList()
  }, [fetchList])

  return [list, loading]
}
