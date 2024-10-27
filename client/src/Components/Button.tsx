import React from 'react';

interface ButtonProps {
  label: string;
  onClick: () => void;
  ariaLabel?: string;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, ariaLabel }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="btn btn-primary"
      aria-label={ariaLabel || label}
    >
      {label}
    </button>
  );
};

export default Button;
