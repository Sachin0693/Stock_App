import React from 'react';

function Sidebar({ indexNames, selectedIndex, onIndexClick }) {
  return (
    <div className="p-3">
      <h5>Available Indices</h5>
      <ul className="list-group">
        {indexNames.map((index) => (
          <li
            key={index}
            className={`list-group-item ${selectedIndex === index ? 'active' : ''}`}
            style={{ cursor: 'pointer' }}
            onClick={() => onIndexClick(index)}
          >
            {index}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
