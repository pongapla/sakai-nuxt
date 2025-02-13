// composables/useToast.ts
import { useToast } from 'primevue/usetoast'

export const useCustomToast = () => {
  const toast = useToast()

  const showSuccess = (text: string) => {
    toast.add({ severity: 'success', summary: 'Success Message', detail: text, life: 3000 })
  }

  const showInfo = (text: string) => {
    toast.add({ severity: 'info', summary: 'Info Message', detail: text, life: 3000 })
  }

  const showWarn = (text: string) => {
    toast.add({ severity: 'warn', summary: 'Warn Message', detail: text, life: 3000 })
  }

  const showError = (text: string) => {
    toast.add({ severity: 'error', summary: 'Error Message', detail: text, life: 3000 })
  }

  const showSecondary = (text: string) => {
    toast.add({ severity: 'secondary', summary: 'Secondary Message', detail: text, life: 3000 })
  }

  const showContrast = (text: string) => {
    toast.add({ severity: 'contrast', summary: 'Contrast Message', detail: text, life: 3000 })
  }

  return { showSuccess, showInfo, showWarn, showError, showSecondary, showContrast }
}
