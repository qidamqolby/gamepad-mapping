import { describe, expect, it } from 'vitest'
import { getDpadDirection, getStickAxes, getStickDirection } from '../src/utils/stickDirection'

describe('stick direction utilities', () => {
  it('returns null in the dead zone and resolves cardinal and diagonal directions', () => {
    expect(getStickDirection(0.5, 0, 0.5)).toBeNull()
    expect(getStickDirection(0, -0.6, 0.5)).toBe('up')
    expect(getStickDirection(-0.6, 0.7, 0.5)).toBe('down-left')
  })

  it('resolves D-pad directions and tolerates incomplete button arrays', () => {
    expect(getDpadDirection([])).toBeNull()
    const buttons = Array.from({ length: 16 }, () => ({ pressed: false }))
    buttons[12].pressed = true
    buttons[15].pressed = true
    expect(getDpadDirection(buttons)).toBe('up-right')
  })

  it('uses standard axes for each stick', () => {
    expect(getStickAxes(0)).toEqual({ axisXIndex: 0, axisYIndex: 1 })
    expect(getStickAxes(1)).toEqual({ axisXIndex: 2, axisYIndex: 3 })
  })
})
