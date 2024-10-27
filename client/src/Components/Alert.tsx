import React from 'react';

interface AlertProps {
  message: string;
  type: 'error' | 'success';
}

const Alert: React.FC<AlertProps> = ({ message, type }) => {
  const alertClass = type === 'error' ? 'alert-danger' : 'alert-success';

  return (
    <div
      className={`alert ${alertClass}`}
      role="alert"
      aria-live="assertive"
      tabIndex={-1}
    >
      {message}
    </div>
  );
};

export default Alert;
