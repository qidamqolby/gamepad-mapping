import { Key } from '@nut-tree-fork/nut-js'
import { describe, expect, it } from 'vitest'
import { clampMousePosition, getNutKey, mouseButtonMap } from '../electron/main/input'

describe('Electron input helpers', () => {
  it('maps supported keys case-insensitively and rejects unsupported keys', () => {
    expect(getNutKey('A')).toBe(Key.A)
    expect(getNutKey('ArrowLeft')).toBe(Key.Left)
    expect(getNutKey('NotAKey')).toBeNull()
  })

  it('exposes the supported mouse buttons', () => {
    expect(Object.keys(mouseButtonMap)).toEqual(['MouseLeft', 'MouseRight', 'MouseMiddle'])
  })

  it('rounds and clamps mouse movement to the active display bounds', () => {
    expect(clampMousePosition({ x: 10, y: 10 }, 3.6, -30, { x: 0, y: 0, width: 12, height: 12 }))
      .toEqual({ x: 11, y: 0 })
  })
})
