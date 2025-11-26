
import React, { useEffect, useState } from "react";
import blackjackImg from "../assets/images/blackjack.jpg";
import ruletaImg from "../assets/images/ruleta.jpg";
import pokerImg from "../assets/images/poker.jpeg";

const imagenes = {
  Blackjack: blackjackImg,
  Ruleta: ruletaImg,
  Poker: pokerImg,
};


function JuegosVista({ onGoBlackjack }) {
  const [juegos, setJuegos] = useState([]);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/juegos")
      .then((response) => response.json())
      .then((data) => setJuegos(data))
      .catch((error) => setJuegos([]));
  }, []);

  return (
    <div className="juegos-vista">
      <h1 className="casino-title" style={{marginBottom: 32, color: 'var(--gold)', fontFamily: 'Cinzel Decorative, serif', fontWeight: 'bold', textShadow: '0 0 10px #FFD700, 0 0 20px #FFD700, 2px 2px 4px rgba(0,0,0,0.5)', textAlign: 'center'}}>Juegos</h1>
      <div className="juegos-vista-lista">
        {juegos.map((juego) => {
          const nombreLower = juego.nombre.toLowerCase();
          const isBlackjack = nombreLower === 'blackjack';
          const isRuleta = nombreLower === 'ruleta';
          const isPoker = nombreLower === 'poker';
          const handleClick = () => {
            if (isBlackjack) {
              onGoBlackjack();
            } else if (isRuleta || isPoker) {
              setMensaje('Prontamente...');
              setTimeout(() => setMensaje(""), 1500);
            }
          };
          return (
            <section
              key={juego.id}
              className="hero-card"
              style={{ margin: 0, cursor: (isBlackjack || isRuleta || isPoker) ? 'pointer' : 'default' }}
              onClick={handleClick}
            >
              <div
                className="hero-card-content"
                style={{
                  backgroundImage: `url(${imagenes[juego.nombre] || ''})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  minHeight: 340,
                  minWidth: 340,
                  maxWidth: 400,
                }}
              >
                <div
                  className="hero-text"
                  style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                  <h2 className="blackjack-title" style={{ textAlign: 'center', width: '100%' }}>{juego.nombre}</h2>
                </div>
              </div>
            </section>
          );
        })}
      </div>
      {mensaje && (
        <div style={{position: 'fixed', top: 80, left: 0, right: 0, zIndex: 9999, display: 'flex', justifyContent: 'center'}}>
          <div style={{background: '#232526', color: '#FFD700', padding: '16px 32px', borderRadius: 16, fontSize: 22, fontWeight: 'bold', boxShadow: '0 4px 24px rgba(0,0,0,0.3)'}}>
            {mensaje}
          </div>
        </div>
      )}
    </div>
  );
}

export default JuegosVista;
