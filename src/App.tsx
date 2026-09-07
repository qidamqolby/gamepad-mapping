import UpdateElectron from "@/components/update";
import { useCallback, useEffect, useState } from "react";
import "./App.css";
import {
  ControllerVisualization,
  SelectedControl,
} from "./components/ControllerVisualization";
import { DeviceList } from "./components/DeviceList";
import { MappingPanel } from "./components/MappingPanel";
import { useGamepad } from "./hooks/useGamepad";
import { useGamepadMapping } from "./hooks/useGamepadMapping";

function App() {
  const gamepads = useGamepad();
  const {
    getMapping,
    setButtonMapping,
    setAxisMapping,
    setDpadMapping,
    removeButtonMapping,
    removeAxisMapping,
    removeDpadMapping,
    editingButton,
    setEditingButton,
    editingAxis,
    setEditingAxis,
    editingDpad,
    setEditingDpad,
  } = useGamepadMapping(gamepads);

  const [selectedGamepadIndex, setSelectedGamepadIndex] = useState<
    number | null
  >(null);
  const [selectedControl, setSelectedControl] = useState<SelectedControl>(null);

  // Automatically select the first gamepad if available
  useEffect(() => {
    if (gamepads.length > 0 && selectedGamepadIndex === null) {
      setSelectedGamepadIndex(gamepads[0].index);
    } else if (gamepads.length === 0) {
      setSelectedGamepadIndex(null);
      setSelectedControl(null);
    }
  }, [gamepads, selectedGamepadIndex]);

  const selectedGamepad = gamepads.find(
    (g) => g.index === selectedGamepadIndex
  );
  const selectedMapping = selectedGamepad
    ? getMapping(selectedGamepad.index)
    : undefined;
  const selectedGamepadName = selectedGamepad
    ? selectedGamepad.id.split("(")[0].trim() ||
      `Gamepad ${selectedGamepad.index + 1}`
    : "No controller";
  const mappingCount =
    (selectedMapping?.buttonMappings.length || 0) +
    (selectedMapping?.axisMappings.length || 0) +
    (selectedMapping?.dpadMappings?.length || 0);

  const handleControlSelect = useCallback(
    (control: SelectedControl) => {
      setSelectedControl(control);
      setEditingButton(null);
      setEditingAxis(null);
    },
    [setEditingButton, setEditingAxis]
  );

  const handleSelectGamepad = (index: number) => {
    setSelectedGamepadIndex(index);
    setSelectedControl(null);
  };

  return (
    <div className="app">
      <header className="app-topbar">
        <div className="app-brand">
          <span className="brand-mark" aria-hidden="true">GM</span>
          <div>
            <h1>Gamepad Mapping</h1>
            <p>Input workspace</p>
          </div>
        </div>
        <div className="active-device-summary" aria-live="polite">
          <span className={`connection-dot ${selectedGamepad ? "connected" : ""}`} />
          <div>
            <span className="active-device-label">Active controller</span>
            <strong>{selectedGamepadName}</strong>
          </div>
        </div>
        <div className="app-topbar-actions">
          <UpdateElectron />
        </div>
      </header>
      {gamepads.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🎮</div>
          <h1>No Gamepad Detected</h1>
          <p>Connect a controller and press any button to activate it.</p>
        </div>
      ) : (
        <div className="app-container">
          <DeviceList
            gamepads={gamepads}
            selectedGamepadIndex={selectedGamepadIndex}
            onSelectGamepad={handleSelectGamepad}
          />

          <main className="visualization-panel">
            {selectedGamepad && (
              <>
                <div className="workspace-section-header">
                  <div>
                    <p className="eyebrow">Controller canvas</p>
                    <h2>{selectedGamepadName}</h2>
                  </div>
                  <span className="live-status"><i /> Live input</span>
                </div>
                <div className="visualization-content">
                  <ControllerVisualization
                    gamepad={selectedGamepad}
                    mapping={selectedMapping}
                    selectedControl={selectedControl}
                    onControlSelect={handleControlSelect}
                  />
                </div>
              </>
            )}
          </main>

          <aside className="mapping-panel">
            <div className="workspace-section-header inspector-header">
              <div>
                <p className="eyebrow">Inspector</p>
                <h2>{selectedControl ? "Control mapping" : "All mappings"}</h2>
              </div>
              <span className="mapping-count">{mappingCount}</span>
            </div>
            <div className="mapping-content">
              {selectedGamepad ? (
                <MappingPanel
                  gamepad={selectedGamepad}
                  mapping={selectedMapping}
                  selectedControl={selectedControl}
                  onSetButtonMapping={(buttonIndex, key, label) =>
                    setButtonMapping(
                      selectedGamepad.index,
                      buttonIndex,
                      key,
                      label
                    )
                  }
                  onSetAxisMapping={(
                    stickIndex,
                    direction,
                    key,
                    label,
                    threshold,
                    type,
                    sensitivity,
                    acceleration,
                    invertX,
                    invertY
                  ) =>
                    setAxisMapping(
                      selectedGamepad.index,
                      stickIndex,
                      direction,
                      key,
                      label,
                      threshold,
                      type,
                      sensitivity,
                      acceleration,
                      invertX,
                      invertY
                    )
                  }
                  onSetDpadMapping={(direction, key, label) =>
                    setDpadMapping(selectedGamepad.index, direction, key, label)
                  }
                  onRemoveButtonMapping={(buttonIndex) =>
                    removeButtonMapping(selectedGamepad.index, buttonIndex)
                  }
                  onRemoveAxisMapping={(stickIndex, direction) =>
                    removeAxisMapping(
                      selectedGamepad.index,
                      stickIndex,
                      direction
                    )
                  }
                  onRemoveDpadMapping={(direction) =>
                    removeDpadMapping(selectedGamepad.index, direction)
                  }
                  editingButton={editingButton}
                  editingAxis={editingAxis}
                  editingDpad={editingDpad}
                  onSetEditingButton={setEditingButton}
                  onSetEditingAxis={setEditingAxis}
                  onSetEditingDpad={setEditingDpad}
                  onSelectControl={handleControlSelect}
                />
              ) : (
                <div className="no-selection">
                  <div className="no-selection-icon">👆</div>
                  <p>
                    Click on a button or stick direction in the controller to
                    map it
                  </p>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

export default App;
