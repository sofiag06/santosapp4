import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import SaintsList from './components/SaintsList';
import ErrorBoundary from './components/ErrorBoundary';
import saintsData from './data/saints.json';
import QuotesCards from './components/QuotesCards';

function App() {
  const [saint, setSaint] = useState('');
  const [saintInfo, setSaintInfo] = useState({
    biography: '',
    image: '',
    feastDay: '',
    quote: '',
    name: ''
  });

  const findSaintInLocalData = (name) => {
    return saintsData.find(saint => 
      saint.name.toLowerCase().includes(name.toLowerCase())
    );
  };

  const fetchSaintInfo = async (saintName) => {
    try {
      if (!saintName.trim()) {
        throw new Error('Por favor ingrese el nombre de un santo');
      }

      console.log('Buscando:', saintName);
      
      const searchTerm = saintName.toLowerCase().includes('san') ? saintName : `San ${saintName}`;
      
      const response = await axios.get(
        `https://es.wikipedia.org/w/api.php?` +
        new URLSearchParams({
          action: 'query',
          format: 'json',
          prop: 'extracts|pageimages',
          generator: 'search',
          gsrsearch: `${searchTerm} santo católico`,
          gsrlimit: 1,
          exintro: true,
          explaintext: true,
          piprop: 'thumbnail',
          pithumbsize: 300,
          origin: '*'
        })
      );
      
      console.log('Respuesta completa:', response.data);
      
      if (!response.data.query || !response.data.query.pages) {
        const localSaintData = findSaintInLocalData(saintName);
        if (localSaintData) {
          const saintData = {
            biography: 'Información de Wikipedia no disponible.',
            image: localSaintData.ImageUrl || '',
            name: localSaintData.name,
            feastDay: localSaintData.commemorationDate,
            quote: localSaintData.memorableQuotes,
            prayer: localSaintData.prayer || "Oración no disponible"
          };
          setSaintInfo(saintData);
          return;
        }
        throw new Error('No se encontraron resultados');
      }

      const pages = response.data.query.pages;
      const pageId = Object.keys(pages)?.[0];
      
      if (!pageId) {
        throw new Error('No se encontraron resultados');
      }

      const page = pages[pageId];
      const localSaintData = findSaintInLocalData(saintName);

      const saintData = {
        biography: page.extract || 'No se encontró biografía disponible.',
        image: page.thumbnail?.source || localSaintData?.ImageUrl || '',
        name: page.title || searchTerm,
        feastDay: localSaintData?.commemorationDate || "Fecha de conmemoración no disponible",
        quote: localSaintData?.memorableQuotes || "Frase memorable no disponible",
        prayer: localSaintData?.prayer || "Oración no disponible"
      };

      console.log('Datos procesados del santo:', saintData);
      setSaintInfo(saintData);
    } catch (error) {
      console.error('Error detallado:', error);
      setSaintInfo({
        biography: `Error: ${error.message || 'No se pudo encontrar información sobre este santo. Intenta con otro nombre o verifica la ortografía.'}`,
        image: '',
        feastDay: '',
        quote: '',
        name: 'Error en la búsqueda'
      });
    }
  };

  const handleKeyUp = (e) => {
    if (e.key === 'Enter') {
      fetchSaintInfo(saint);
    }
  };

  const handleSaintSelect = (saintName) => {
    setSaint(saintName);
    fetchSaintInfo(saintName);
  };

  return (
    <div className="App">
      <ErrorBoundary>
        <h1>Vidas de Santos</h1>
        <div className="search-section">
          <input
            type="text"
            value={saint}
            onChange={(e) => setSaint(e.target.value)}
            onKeyUp={handleKeyUp}
            placeholder="Ejemplo: San Francisco de Asís"
          />
          <button onClick={() => fetchSaintInfo(saint)}>Buscar</button>
        </div>

        <SaintsList onSaintSelect={handleSaintSelect} />

        {saintInfo.name && (
          <div className="saint-card">
            <h2>{saintInfo.name}</h2>
            {saintInfo.image && (
              <div className="image-container">
                <img src={saintInfo.image} alt={saintInfo.name} />
              </div>
            )}
            <div className="saint-details">
              <p className="feast-day"><strong>Fecha de conmemoración:</strong> {saintInfo.feastDay}</p>
              <p className="quote"><strong>Frase memorable:</strong> "{saintInfo.quote}"</p>
            </div>
            <div className="biography">
              <h3>Biografía</h3>
              <p>{saintInfo.biography}</p>
              <p className="source">Fuente: Equipo Encuentro, Wikipedia , Vatican News, EWTN</p>
            </div>
            <div className="prayer-section">
              <h3>Oración</h3>
              <p className="prayer-text">{saintInfo.prayer}</p>
            </div>
          </div>
        )}

        <QuotesCards saints={saintsData} />
      </ErrorBoundary>
    </div>
  );
}

export default App;