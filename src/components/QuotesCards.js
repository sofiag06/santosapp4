import React from 'react';
import './QuotesCards.css';

const QuotesCards = ({ saints }) => {
  // Función para obtener 3 santos aleatorios
  const getRandomSaints = () => {
    const shuffled = [...saints].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  const randomSaints = getRandomSaints();

  return (
    <div className="quotes-section">
      <h2>Frases Memorables de los Santos</h2>
      <div className="quotes-grid">
        {randomSaints.map((saint) => (
          <div key={saint.id} className="quote-card">
            <div className="quote-content">
              <p className="quote-text">"{saint.memorableQuotes}"</p>
              <p className="quote-author">- {saint.name}</p>
              <p className="quote-date">{saint.commemorationDate}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuotesCards; 