// src/components/Form.tsx
import React from 'react';

interface Field {
  label: string;
  name: string;
  type: string;
}

interface FormProps {
  fields: Field[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
}

const Form: React.FC<FormProps> = ({ fields, onChange, onSubmit }) => {
  return (
    <div>
      {fields.map((field) => (
        <div key={field.name} className="mb-3">
          <label>{field.label}</label>
          <input
            type={field.type}
            name={field.name}
            onChange={onChange}
            className="form-control"
          />
        </div>
      ))}
      <button onClick={onSubmit} className="btn btn-primary mb-3">
        Submit
      </button>
    </div>
  );
};

export default Form;
