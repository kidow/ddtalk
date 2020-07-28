import { toast } from 'react-semantic-toasts'

export const toastInfo = (description: string) =>
  toast({ type: 'info', icon: 'bullhorn', title: '정보', description })
export const toastSuccess = (description: string) =>
  toast({ type: 'success', icon: 'check', title: '성공', description })
export const toastWarn = (description: string) =>
  toast({ type: 'warning', icon: 'warning', title: '주의', description })
export const toastError = (description: string) =>
  toast({ type: 'error', icon: 'frown outline', title: '에러', description })
