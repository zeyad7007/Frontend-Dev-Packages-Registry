import React from 'react';

interface ListProps {
  items: {
    label: string;
    value: string;
  }[];
}

const List: React.FC<ListProps> = ({ items }) => {
  return (
    <ul aria-live="polite" className="list-group">
      {items.map((item, index) => (
        <li key={index} className="list-group-item">
          <strong>{item.label}:</strong> {item.value}
        </li>
      ))}
    </ul>
  );
};

export default List;
