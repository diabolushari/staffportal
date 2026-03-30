import { toast } from 'react-toastify'

export function showSuccess(message?: string | null): void {
  if (message == null) {
    return
  }
  toast.success(message, {
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'dark',
  })
}

export function showError(message?: string | null): void {
  if (message == null) {
    return
  }
  toast.error(message, {
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'dark',
  })
}

export function showInfo(message?: string | null): void {
  if (message == null) {
    return
  }
  toast.info(message, {
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'dark',
  })
}

export function getHttpError(error: any): string | null {
  if (error == null || error.response == null || error.response.data == null) {
    return null
  }
  console.log(error?.response?.data?.message)
  if (error?.response?.data?.message != '') {
    return error?.response?.data?.message
  }
  return error?.message
}

export function handleHttpErrors(err: any, showToast = true): any {
  console.log(err)
  if (err?.response?.status == 422) {
    const errors = get422Errors(err)
    if (showToast) {
      for (const key in errors) {
        if (errors.hasOwnProperty(key)) {
          showError(errors[key])
        }
      }
    }
    return errors
  }
  const error = getHttpError(err)
  if (error != null) {
    showError(error)
  }
  return {}
}

export function get422Errors(error: any): any {
  const result: any = {}
  if (error == null || error.response == null || error.response.data == null) {
    return result
  }
  const errors = error.response.data.errors
  if (errors == null) {
    return result
  }
  for (const key in errors) {
    if (errors.hasOwnProperty(key)) {
      const error = errors[key][0]
      result[key] = error
    }
  }
  return result
}

export function showErrorObj(err: any): void {
  if (err == null || err.response == null || err.response.data == null) {
    console.log(err)
    return
  }
  console.log(err.response.data)
  if (err.response.data.errors != null) {
    const keys = Object.keys(err.response.data.errors)
    keys.map((key) => {
      showError(err.response.data.errors[key][0])
    })
    return
  }
  showError(err.response.data.message)
}
