import { Button, Key } from '@nut-tree-fork/nut-js'

const keyMap: Record<string, Key> = {
  Meta: Key.LeftSuper,
  Space: Key.Space,
  Enter: Key.Enter,
  Escape: Key.Escape,
  Backspace: Key.Backspace,
  Tab: Key.Tab,
  Delete: Key.Delete,
  ArrowUp: Key.Up,
  ArrowDown: Key.Down,
  ArrowLeft: Key.Left,
  ArrowRight: Key.Right,
  Home: Key.Home,
  End: Key.End,
  PageUp: Key.PageUp,
  PageDown: Key.PageDown,
  Insert: Key.Insert,
  F1: Key.F1,
  F2: Key.F2,
  F3: Key.F3,
  F4: Key.F4,
  F5: Key.F5,
  F6: Key.F6,
  F7: Key.F7,
  F8: Key.F8,
  F9: Key.F9,
  F10: Key.F10,
  F11: Key.F11,
  F12: Key.F12,
  Shift: Key.LeftShift,
  Control: Key.LeftControl,
  Alt: Key.LeftAlt,
}

const charKeyMap: Record<string, Key> = {
  a: Key.A, b: Key.B, c: Key.C, d: Key.D, e: Key.E, f: Key.F, g: Key.G,
  h: Key.H, i: Key.I, j: Key.J, k: Key.K, l: Key.L, m: Key.M, n: Key.N,
  o: Key.O, p: Key.P, q: Key.Q, r: Key.R, s: Key.S, t: Key.T, u: Key.U,
  v: Key.V, w: Key.W, x: Key.X, y: Key.Y, z: Key.Z,
  '0': Key.Num0, '1': Key.Num1, '2': Key.Num2, '3': Key.Num3, '4': Key.Num4,
  '5': Key.Num5, '6': Key.Num6, '7': Key.Num7, '8': Key.Num8, '9': Key.Num9,
  '-': Key.Minus, '=': Key.Equal, '[': Key.LeftBracket, ']': Key.RightBracket,
  '\\': Key.Backslash, ';': Key.Semicolon, "'": Key.Quote, ',': Key.Comma,
  '.': Key.Period, '/': Key.Slash, '`': Key.Grave,
}

export const mouseButtonMap: Record<string, Button> = {
  MouseLeft: Button.LEFT,
  MouseRight: Button.RIGHT,
  MouseMiddle: Button.MIDDLE,
}

export function getNutKey(key: string): Key | null {
  if (keyMap[key] !== undefined) return keyMap[key]
  if (key.length === 1) return charKeyMap[key.toLowerCase()] ?? null
  return null
}

export function clampMousePosition(
  current: { x: number; y: number },
  deltaX: number,
  deltaY: number,
  bounds: { x: number; y: number; width: number; height: number }
) {
  return {
    x: Math.max(bounds.x, Math.min(bounds.x + bounds.width - 1, current.x + Math.round(deltaX))),
    y: Math.max(bounds.y, Math.min(bounds.y + bounds.height - 1, current.y + Math.round(deltaY))),
  }
}
