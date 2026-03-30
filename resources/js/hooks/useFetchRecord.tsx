import { useCallback, useEffect, useState } from 'react'
import { handleHttpErrors } from '@/ui/alerts'
import axios from 'axios'

export default function useFetchRecord<T>(url: string): [T | null, boolean] {
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState<T | null>(null)

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
