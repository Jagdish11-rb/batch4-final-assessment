export default function FormField({ label, error, required, children }) {
  return (
    <div>
      {label && (
        <label className="form-label">
          {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      {children}
      {error && <p className="error-text">{error}</p>}
    </div>
  )
}
