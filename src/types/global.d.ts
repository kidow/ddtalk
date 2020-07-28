export {}
declare global {
  interface Window {
    registration: {
      showNotification: (title: string, options: any) => void
    }
  }
}
