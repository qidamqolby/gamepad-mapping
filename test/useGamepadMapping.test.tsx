import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { GamepadState } from '../src/hooks/useGamepad'
import { useGamepadMapping } from '../src/hooks/useGamepadMapping'

const idleGamepad: GamepadState = {
  index: 0,
  id: 'Test Controller',
  mapping: 'standard',
  buttons: Array.from({ length: 16 }, () => ({ pressed: false, value: 0 })),
  axes: [0, 0, 0, 0],
  connected: true,
}

const connectedGamepads = [idleGamepad]

describe('useGamepadMapping', () => {
  it('initializes, persists, and updates button mappings', async () => {
    const { result } = renderHook(() => useGamepadMapping(connectedGamepads))

    await waitFor(() => expect(result.current.getMapping(0)).toBeDefined())
    act(() => result.current.setButtonMapping(0, 1, 'a', 'A'))
    expect(result.current.getMapping(0)?.buttonMappings).toEqual([{ buttonIndex: 1, key: 'a', label: 'A' }])

    act(() => result.current.setButtonMapping(0, 1, 'b', 'B'))
    expect(result.current.getMapping(0)?.buttonMappings).toEqual([{ buttonIndex: 1, key: 'b', label: 'B' }])
    expect(JSON.parse(localStorage.getItem('gamepad-mappings') ?? '[]')[0].buttonMappings[0].key).toBe('b')
  })

  it('keeps mouse and hotkey mappings mutually exclusive per stick', async () => {
    const { result } = renderHook(() => useGamepadMapping(connectedGamepads))
    await waitFor(() => expect(result.current.getMapping(0)).toBeDefined())

    act(() => result.current.setAxisMapping(0, 0, 'up', 'w', 'W'))
    act(() => result.current.setAxisMapping(0, 0, 'up', '', '', 0.3, 'mouse', 2, 1, false, false))
    expect(result.current.getMapping(0)?.axisMappings).toHaveLength(1)
    expect(result.current.getMapping(0)?.axisMappings[0].type).toBe('mouse')

    act(() => result.current.setAxisMapping(0, 0, 'left', 'a', 'A'))
    expect(result.current.getMapping(0)?.axisMappings).toEqual(expect.arrayContaining([
      expect.objectContaining({ type: 'hotkey', direction: 'left', key: 'a' }),
    ]))
    expect(result.current.getMapping(0)?.axisMappings).toHaveLength(1)
  })

  it('holds a shared key until all mapped controls are released', async () => {
    const { result, rerender } = renderHook(({ gamepads }) => useGamepadMapping(gamepads), {
      initialProps: { gamepads: [idleGamepad] },
    })
    await waitFor(() => expect(result.current.getMapping(0)).toBeDefined())
    act(() => {
      result.current.setButtonMapping(0, 0, 'a', 'A')
      result.current.setButtonMapping(0, 1, 'a', 'A')
    })

    const bothPressed = {
      ...idleGamepad,
      buttons: idleGamepad.buttons.map((button, index) => ({ ...button, pressed: index < 2 })),
    }
    rerender({ gamepads: [bothPressed] })
    await waitFor(() => expect(window.keySimulator.keyToggle).toHaveBeenCalledWith('a', true))

    const onePressed = {
      ...bothPressed,
      buttons: bothPressed.buttons.map((button, index) => ({ ...button, pressed: index === 1 })),
    }
    rerender({ gamepads: [onePressed] })
    expect(window.keySimulator.keyToggle).toHaveBeenCalledTimes(1)

    rerender({ gamepads: [{ ...onePressed, buttons: idleGamepad.buttons }] })
    await waitFor(() => expect(window.keySimulator.keyToggle).toHaveBeenLastCalledWith('a', false))
  })

  it('logs malformed stored mappings without preventing initialization', async () => {
    localStorage.setItem('gamepad-mappings', '{')
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const { result } = renderHook(() => useGamepadMapping(connectedGamepads))
    await waitFor(() => expect(result.current.getMapping(0)).toBeDefined())
    expect(error).toHaveBeenCalledWith('Failed to load mappings:', expect.any(SyntaxError))
  })
})
