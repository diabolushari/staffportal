import { showError } from '@/ui/alerts'
import { LaravelFlash } from '@/ui/ui_interfaces'
import { router } from '@inertiajs/react'
import { useCallback, useState } from 'react'

export interface PostOptions {
  showErrorToast?: boolean
  forceFormData?: boolean
  replace?: boolean
  preserveState?: boolean
  preserveScroll?: boolean
  onComplete?: () => unknown
  onError?: () => unknown
}

const useInertiaPost = <T,>(url: string, options?: PostOptions) => {
  const [errors, setErrors] = useState<Record<keyof T, string | undefined>>({} as any)
  const [loading, setLoading] = useState(false)
  const post = useCallback(
    (form: T) => {
      setLoading(true)
      router.post(
        url,
        {
          ...form,
        } as any,
        {
          forceFormData: options?.forceFormData ?? false,
          preserveState: options?.preserveState ?? true,
          preserveScroll: options?.preserveScroll ?? false,
          onFinish: () => {
            setLoading(false)
          },
          onSuccess: (data) => {
            const flash = data.props.flash as LaravelFlash
            setErrors({} as any)
            if (flash.error == null && options?.onComplete != null) {
              options.onComplete()
            }
            if (flash.error != null && options?.onError != null) {
              console.log(flash.error)
              options.onError()
            }
          },
          onError: (errors) => {
            const keys = Object.keys(errors)
            if (options?.showErrorToast) {
              keys.forEach((key) => {
                showError(errors[key])
              })
            }
            if (keys.length > 0) {
              showError(
                'Data Submitted Is Incomplete/Invalid, Please Try Again After Fixing All Errors.'
              )
            }
            setErrors(errors as any)
          },
          replace: options?.replace ?? true,
        }
      )
    },
    [
      options?.onComplete,
      options?.onError,
      url,
      options?.showErrorToast,
      options?.forceFormData,
      options?.replace,
      options?.preserveState,
      options?.preserveScroll,
    ]
  )

  return { post, loading, errors }
}

export default useInertiaPost
