interface ToggleSwitchProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
}

export function ToggleSwitch({ checked, onChange, label }: ToggleSwitchProps) {
  return (
    <div className="toggle-control">
      <button
        type="button"
        className={`toggle-button ${checked ? "is-on" : ""}`}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
      >
        <span className="toggle-thumb" />
      </button>
      <span className="toggle-text">{label}</span>
    </div>
  );
}
