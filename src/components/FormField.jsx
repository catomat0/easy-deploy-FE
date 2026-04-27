const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#94a3b8',
    letterSpacing: '0.3px',
  },
  required: {
    color: '#f87171',
    marginLeft: '3px',
  },
  input: {
    background: '#1e2130',
    border: '1px solid #2d3148',
    borderRadius: '8px',
    padding: '10px 14px',
    color: '#e2e8f0',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  inputError: {
    border: '1px solid #f87171',
  },
  textarea: {
    background: '#1e2130',
    border: '1px solid #2d3148',
    borderRadius: '8px',
    padding: '10px 14px',
    color: '#e2e8f0',
    fontSize: '13px',
    fontFamily: 'ui-monospace, monospace',
    outline: 'none',
    resize: 'vertical',
    minHeight: '100px',
    transition: 'border-color 0.2s',
  },
  hint: {
    fontSize: '11px',
    color: '#64748b',
  },
  errorMsg: {
    fontSize: '11px',
    color: '#f87171',
  },
}

export default function FormField({ label, name, type = 'text', placeholder, hint, required, value, onChange, error }) {
  const isTextarea = type === 'textarea'
  const hasError = !!error

  return (
    <div style={styles.wrapper}>
      <label style={styles.label}>
        {label}
        {required && <span style={styles.required}>*</span>}
      </label>
      {isTextarea ? (
        <textarea
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          style={{ ...styles.textarea, ...(hasError ? styles.inputError : {}) }}
        />
      ) : (
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          style={{ ...styles.input, ...(hasError ? styles.inputError : {}) }}
        />
      )}
      {hasError && <span style={styles.errorMsg}>{error}</span>}
      {!hasError && hint && <span style={styles.hint}>{hint}</span>}
    </div>
  )
}
