// components/FormRadioGroup.jsx
const FormRadioGroup = ({ icon, label, options, selected, onChange }) => (
  <div className="form-control">
    <label className="label">
      <span className="label-text font-medium flex items-center gap-2">{icon} {label}</span>
    </label>
    <div className="flex gap-4">
      {options.map(option => (
        <label key={option} className="label cursor-pointer gap-2">
          <input
            type="radio"
            name="deliveryMethod"
            className="radio checked:bg-primary"
            value={option}
            checked={selected === option}
            onChange={() => onChange(option)}
          />
          <span className="label-text">{option}</span>
        </label>
      ))}
    </div>
  </div>
);

export default FormRadioGroup;
