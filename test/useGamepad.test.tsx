import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { GamepadState, useGamepad } from '../src/hooks/useGamepad'

const gamepad: GamepadState = {
  index: 0,
  id: 'Test Controller',
  mapping: 'standard',
  buttons: [{ pressed: false, value: 0 }],
  axes: [0, 0, 0, 0],
  connected: true,
}

const browserGamepad = {
  ...gamepad,
  buttons: [{ ...gamepad.buttons[0], touched: false }],
} as unknown as Gamepad

describe('useGamepad', () => {
  afterEach(() => vi.useRealTimers())

  it('forwards a poll request to the main process and consumes gamepad updates', () => {
    const listeners = new Map<string, (...args: any[]) => void>()
    const send = vi.fn()
    window.ipcRenderer = {
      on: vi.fn((channel, listener) => listeners.set(channel, listener)),
      off: vi.fn(),
      send,
      invoke: vi.fn(),
    }
    vi.stubGlobal('navigator', {
      ...navigator,
      getGamepads: vi.fn(() => [browserGamepad]),
    })

    const { result, unmount } = renderHook(() => useGamepad())

    act(() => listeners.get('poll-gamepads')?.())
    expect(send).toHaveBeenCalledWith('gamepad-data', [gamepad])
    expect(result.current).toEqual([gamepad])

    const updated = { ...gamepad, axes: [1, 0, 0, 0] }
    act(() => listeners.get('gamepad-update')?.({}, [updated]))
    expect(result.current).toEqual([updated])

    unmount()
    expect(window.ipcRenderer.off).toHaveBeenCalledWith('poll-gamepads', expect.any(Function))
  })
})
