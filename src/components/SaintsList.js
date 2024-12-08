import React from 'react';

function SaintsList({ onSaintSelect }) {
  const suggestedSaints = [
    "San Francisco de Asís",
    "San Juan Pablo II",
    "San Antonio de Padua",
    "Santa Rosa de Lima"
  ];

  return (
    <div className="search-tips">
      <p>Sugerencias de búsqueda:</p>
      <ul>
        {suggestedSaints.map((saintName) => (
          <li 
            key={saintName} 
            onClick={() => onSaintSelect(saintName)}
          >
            {saintName}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SaintsList; 