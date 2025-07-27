// components/FormInput.jsx
const FormInput = ({ icon, label, placeholder, type = "text", value, onChange, rightIcon }) => (
  <div className="form-control">
    <label className="label">
      <span className="label-text font-medium">{label}</span>
    </label>
    <div className="relative">
      <span className="absolute inset-y-0 left-0 pl-3 flex items-center">{icon}</span>
      <input
        type={type}
        className="input input-bordered w-full pl-10 pr-10"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {rightIcon && <span className="absolute inset-y-0 right-0 pr-3 flex items-center">{rightIcon}</span>}
    </div>
  </div>
);

export default FormInput;
