

import React, { useEffect, useState } from "react";
import dadoGif from "../assets/images/dado.gif";



function JuegosApi({ onVerJuegos }) {
  const [juegos, setJuegos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/juegos")
      .then((response) => response.json())
      .then((data) => setJuegos(data))
      .catch((error) => console.error("Error al obtener juegos:", error));
  }, []);

  return (
    <section className="hero-card">
      <div className="hero-card-content">
        <div className="hero-text">
          <h2 className="blackjack-title">🎲 JUEGOS</h2>
          <p className="hero-subtitle">Elige tu juego favorito</p>
          <ul className="juegos-lista">
            {juegos.map((juego) => (
              <li key={juego.id} className="juegos-lista-item">
                <strong>{juego.nombre}:</strong> {juego.descripcion}
              </li>
            ))}
          </ul>
          <button className="btn-play" style={{marginTop: '10px'}} onClick={onVerJuegos}>
            ▶ Ver Juegos
          </button>
        </div>
        <div className="hero-image-container">
          <img src={dadoGif} alt="Juegos" className="hero-image" style={{ width: 300, height: 220, background: '#fff', objectFit: 'contain' }} />
        </div>
      </div>
    </section>
  );
}

export default JuegosApi;
