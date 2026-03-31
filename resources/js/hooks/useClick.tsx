import { MutableRefObject, useEffect, useState } from 'react'

const useClick = (
  reference?: MutableRefObject<HTMLElement | null>,
  onOutsideClick?: () => void
): [target: Element | null] => {
  const [target, setTarget] = useState<Element | null>(null)

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      setTarget(event.target as Element)
    }
    document.body.addEventListener('click', handler)
    return () => {
      document.body.removeEventListener('click', handler)
    }
  }, [])

  useEffect(() => {
    if (target == null) return
    if (reference?.current?.contains(target) !== true) {
      onOutsideClick?.()
    }
  }, [target, onOutsideClick, reference])

  return [target]
}

export default useClick
