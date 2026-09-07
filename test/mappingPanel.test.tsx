import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MappingPanel } from '../src/components/MappingPanel'
import { GamepadState } from '../src/hooks/useGamepad'

const gamepad: GamepadState = {
  index: 0,
  id: 'Test Controller',
  mapping: 'standard',
  buttons: Array.from({ length: 16 }, () => ({ pressed: false, value: 0 })),
  axes: [0, 0, 0, 0],
  connected: true,
}

const actions = {
  onSetButtonMapping: vi.fn(),
  onSetAxisMapping: vi.fn(),
  onSetDpadMapping: vi.fn(),
  onRemoveButtonMapping: vi.fn(),
  onRemoveAxisMapping: vi.fn(),
  onRemoveDpadMapping: vi.fn(),
  onSetEditingButton: vi.fn(),
  onSetEditingAxis: vi.fn(),
  onSetEditingDpad: vi.fn(),
}

describe('MappingPanel', () => {
  it('switches from the mapping summary to the selected control inspector', () => {
    const { rerender } = render(
      <MappingPanel
        gamepad={gamepad}
        mapping={{ gamepadIndex: 0, buttonMappings: [], axisMappings: [], dpadMappings: [] }}
        selectedControl={null}
        editingButton={null}
        editingAxis={null}
        editingDpad={null}
        {...actions}
      />,
    )

    expect(screen.getByRole('heading', { name: 'All Mappings' })).toBeTruthy()

    rerender(
      <MappingPanel
        gamepad={gamepad}
        mapping={{ gamepadIndex: 0, buttonMappings: [], axisMappings: [], dpadMappings: [] }}
        selectedControl={{ type: 'button', buttonIndex: 0 }}
        editingButton={null}
        editingAxis={null}
        editingDpad={null}
        {...actions}
      />,
    )

    expect(screen.getByText('Configure button mapping')).toBeTruthy()
  })
})
