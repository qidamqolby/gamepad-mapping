import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  localStorage.clear()
})

beforeEach(() => {
  window.keySimulator = {
    keyToggle: vi.fn().mockResolvedValue({ success: true }),
  }
  window.mouseSimulator = {
    moveMouse: vi.fn().mockResolvedValue({ success: true }),
    buttonToggle: vi.fn().mockResolvedValue({ success: true }),
  }
  window.ipcRenderer = undefined
})
