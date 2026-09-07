import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Update from '../src/components/update'

describe('Update', () => {
  it('does not render or subscribe when the Electron preload bridge is unavailable', () => {
    window.ipcRenderer = undefined

    render(<Update />)

    expect(screen.queryByRole('button', { name: 'Check update' })).toBeNull()
  })
})
