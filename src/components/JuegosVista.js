import React, { useEffect, useState } from "react";
import blackjackImg from "../assets/images/blackjack.jpg";
import ruletaImg from "../assets/images/ruleta.jpg";
import pokerImg from "../assets/images/poker.jpeg";
import customImg from "../assets/images/logomiku.png";

const imagenes = {
  Blackjack: blackjackImg,
  Ruleta: ruletaImg,
  Poker: pokerImg,
};

function JuegosVista({ onGoBlackjack, isLoggedIn, onLoginRequest, onRegisterRequest }) {
  const [juegos, setJuegos] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [showCrud, setShowCrud] = useState(false);
  const [form, setForm] = useState({ nombre: "", descripcion: "", tipo: "", estado: "Activo" });
  const [editId, setEditId] = useState(null);
  const [showAuth, setShowAuth] = useState(false);

  // CREATE
  const createJuego = async () => {
    try {
      const nuevoJuego = {
        nombre: form.nombre,
        descripcion: form.descripcion,
        jugadores: 0,
        dineroMovido: 0,
        estado: form.estado,
        tipo: form.tipo,
        descripcionCorta: form.descripcion,
        winrate: 0,
        vetados: [],
        ultimoJackpot: 0,
        nota: ""
      };
      const response = await fetch("http://localhost:8080/api/juegos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoJuego),
      });
      if (response.ok) {
        const juegoCreado = await response.json();
        setJuegos((prev) => [...prev, juegoCreado]);
        setMensaje("Juego creado exitosamente");
        setTimeout(() => setMensaje(""), 1500);
        setForm({ nombre: "", descripcion: "", tipo: "", estado: "Activo" });
      } else {
        setMensaje("Error al crear juego");
        setTimeout(() => setMensaje(""), 1500);
      }
    } catch {
      setMensaje("Error de red al crear juego");
      setTimeout(() => setMensaje(""), 1500);
    }
  };

  // UPDATE
  const updateJuego = async () => {
    try {
      const juegoActualizado = {
        id: editId,
        nombre: form.nombre,
        descripcion: form.descripcion,
        jugadores: 0,
        dineroMovido: 0,
        estado: form.estado,
        tipo: form.tipo,
        descripcionCorta: form.descripcion,
        winrate: 0,
        vetados: [],
        ultimoJackpot: 0,
        nota: ""
      };
      const response = await fetch(`http://localhost:8080/api/juegos/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(juegoActualizado),
      });
      if (response.ok) {
        const juegoActualizadoResp = await response.json();
        setJuegos((prev) => prev.map(j => j.id === editId ? juegoActualizadoResp : j));
        setMensaje("Juego actualizado exitosamente");
        setTimeout(() => setMensaje(""), 1500);
        setForm({ nombre: "", descripcion: "", tipo: "", estado: "Activo" });
        setEditId(null);
      } else {
        setMensaje("Error al actualizar juego");
        setTimeout(() => setMensaje(""), 1500);
      }
    } catch {
      setMensaje("Error de red al actualizar juego");
      setTimeout(() => setMensaje(""), 1500);
    }
  };

  // DELETE
  const deleteJuego = async (id) => {
    const juego = juegos.find(j => j.id === id);
    if (juego && juego.nombre && juego.nombre.toLowerCase() === 'blackjack') {
      setMensaje("No tienes permisos para eliminar el juego Blackjack.");
      setTimeout(() => setMensaje(""), 2500);
      return;
    }
    const confirmar = window.confirm("¿Estás seguro de que quieres eliminar este juego?");
    if (!confirmar) return;
    try {
      const response = await fetch(`http://localhost:8080/api/juegos/${id}`, { method: "DELETE" });
      if (response.ok) {
        setJuegos((prev) => prev.filter(j => j.id !== id));
        setMensaje("Juego eliminado exitosamente");
        setTimeout(() => setMensaje(""), 1500);
      } else {
        setMensaje("Error al eliminar juego");
        setTimeout(() => setMensaje(""), 1500);
      }
    } catch {
      setMensaje("Error de red al eliminar juego");
      setTimeout(() => setMensaje(""), 1500);
    }
  };

  useEffect(() => {
    fetch("http://localhost:8080/api/juegos")
      .then((response) => response.json())
      .then((data) => setJuegos(data))
      .catch(() => setJuegos([]));
  }, []);

  return (
    <div className="juegos-vista">
      <h1 className="casino-title" style={{ marginBottom: 32, color: 'var(--gold)', fontFamily: 'Cinzel Decorative, serif', fontWeight: 'bold', textShadow: '0 0 10px #FFD700, 0 0 20px #FFD700, 2px 2px 4px rgba(0,0,0,0.5)', textAlign: 'center' }}>Juegos</h1>
      <div className="juegos-vista-lista" style={{ display: 'flex', gap: 24 }}>
        {juegos.map((juego) => {
          const nombreLower = juego.nombre.toLowerCase();
          const isBlackjack = nombreLower === 'blackjack';
          const isRuleta = nombreLower === 'ruleta';
          const isPoker = nombreLower === 'poker';
          const esJuegoPersonalizado = !isBlackjack && !isRuleta && !isPoker;
          const backgroundImg = esJuegoPersonalizado ? customImg : (imagenes[juego.nombre] || '');
          const handleClick = () => {
            if (isBlackjack) {
              onGoBlackjack();
            } else if (isRuleta || isPoker) {
              setMensaje('Proximamente...');
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
                  backgroundImage: `url(${backgroundImg})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  height: 340,
                  width: 340,
                  maxWidth: 400,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto'
                }}
              >
                <div className="hero-text" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                  <h2 className="blackjack-title" style={{ textAlign: 'center', width: '100%', margin: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>{juego.nombre}</h2>
                  {esJuegoPersonalizado && juego.estado === 'Próximamente' && (
                    <span style={{ color: '#FFD700', fontWeight: 'bold', fontSize: 20, marginTop: 4 }}>(Próximamente)</span>
                  )}
                </div>
              </div>
            </section>
          );
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '32px 0' }}>
        <style>{`
          .haz-tu-juego-btn {
            padding: 18px 48px;
            background: #232526;
            color: #FFD700;
            border: 2px solid #FFD700;
            border-radius: 16px;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 4px 24px rgba(0,0,0,0.3);
            transition: background 0.25s, color 0.25s, border-color 0.25s, transform 0.18s;
          }
          .haz-tu-juego-btn:hover {
            background: #FFD700;
            color: #232526;
            border-color: #232526;
            transform: scale(1.06);
          }
        `}</style>
        <button
          className="haz-tu-juego-btn"
          onClick={() => {
            setShowCrud(true);
            setForm({ nombre: "", descripcion: "", tipo: "", estado: "Activo" });
            setEditId(null);
          }}
        >
          Haz tu juego
        </button>
      </div>

      {/* Eliminado el mensaje de inicio de sesión */}
      {showCrud && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#181818', padding: 36, borderRadius: 22, minWidth: 350, maxWidth: 420, width: '100%', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', color: '#FFD700', position: 'relative', border: '2px solid #FFD700' }}>
            <button style={{ position: 'absolute', top: 10, right: 16, background: 'none', border: 'none', fontSize: 28, cursor: 'pointer', color: '#FFD700' }} onClick={() => setShowCrud(false)}>×</button>
            <h2 style={{ color: '#FFD700', textAlign: 'center', marginBottom: 24, fontFamily: 'Cinzel Decorative, serif', fontWeight: 'bold', fontSize: 32, letterSpacing: 1 }}>{editId ? 'Editar Juego' : 'Crea tu juego'}</h2>
            <form onSubmit={e => { e.preventDefault(); editId ? updateJuego() : createJuego(); }}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ color: '#FFD700', fontWeight: 'bold', fontSize: 16 }}>Nombre:</label>
                <input value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} required style={{ width: '100%', borderRadius: 8, border: '1px solid #FFD700', padding: 8, marginTop: 4, background: '#232526', color: '#FFD700', fontSize: 16 }} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ color: '#FFD700', fontWeight: 'bold', fontSize: 16 }}>Descripción:</label>
                <input value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} required style={{ width: '100%', borderRadius: 8, border: '1px solid #FFD700', padding: 8, marginTop: 4, background: '#232526', color: '#FFD700', fontSize: 16 }} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ color: '#FFD700', fontWeight: 'bold', fontSize: 16 }}>Tipo:</label>
                <select value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))} required style={{ width: '100%', borderRadius: 8, border: '1px solid #FFD700', padding: 8, marginTop: 4, background: '#232526', color: '#FFD700', fontSize: 16 }}>
                  <option value="">Selecciona un tipo</option>
                  <option value="Cartas">Cartas</option>
                  <option value="Mesa">Mesa</option>
                  <option value="Tragamonedas">Tragamonedas</option>
                  <option value="Dados">Dados</option>
                  <option value="Ruleta">Ruleta</option>
                  <option value="Apuestas">Apuestas</option>
                  <option value="Bingo">Bingo</option>
                  <option value="Lotería">Lotería</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ color: '#FFD700', fontWeight: 'bold', fontSize: 16 }}>Estado:</label>
                <select value={form.estado} onChange={e => setForm(f => ({ ...f, estado: e.target.value }))} style={{ width: '100%', borderRadius: 8, border: '1px solid #FFD700', padding: 8, marginTop: 4, background: '#232526', color: '#FFD700', fontSize: 16 }}>
                  <option value="Activo">Activo</option>
                  <option value="Próximamente">Próximamente</option>
                </select>
              </div>
              <button type="submit" style={{ background: '#FFD700', color: '#232526', fontWeight: 'bold', border: 'none', borderRadius: 8, padding: '10px 32px', marginRight: 8, fontSize: 18, boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>{editId ? 'Actualizar' : 'Crear'}</button>
              {editId && (
                <div style={{ height: 12 }}></div>
              )}
              {editId && (
                <button type="button" onClick={() => { setEditId(null); setForm({ nombre: "", descripcion: "", tipo: "", estado: "Activo" }); }} style={{ background: '#ccc', color: '#232526', border: 'none', borderRadius: 8, padding: '10px 32px', fontSize: 18 }}>Cancelar edición</button>
              )}
            </form>
            <hr style={{ margin: '28px 0', borderColor: '#FFD700', opacity: 0.3 }} />
            <h3 style={{ color: '#FFD700', textAlign: 'center', fontFamily: 'Cinzel Decorative, serif', fontWeight: 'bold', fontSize: 22, marginBottom: 12 }}>Tus juegos</h3>
            <ul style={{ maxHeight: 140, overflowY: 'auto', padding: 0, listStyle: 'none' }}>
              {juegos.map(j => (
                <li key={j.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, color: '#FFD700', fontSize: 17 }}>
                  <span>{j.nombre}</span>
                  <span style={{ display: 'flex', gap: 12 }}>
                    <button style={{ background: '#FFD700', color: '#232526', border: 'none', borderRadius: 8, padding: '4px 16px', fontWeight: 'bold', cursor: 'pointer', fontSize: 15 }} onClick={() => {
                      setEditId(j.id);
                      setForm({
                        nombre: j.nombre || '',
                        descripcion: j.descripcionCorta || j.descripcionLarga || j.descripcion || '',
                        tipo: j.tipo || '',
                        estado: j.estado || 'Activo'
                      });
                      setShowCrud(true);
                    }}>Editar</button>
                    <button style={{ background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 8, padding: '4px 16px', fontWeight: 'bold', cursor: 'pointer', fontSize: 15 }} onClick={() => deleteJuego(j.id)}>Eliminar</button>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {mensaje && (
        <div style={{ position: 'fixed', top: '8%', left: 0, right: 0, zIndex: 20001, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
          <div style={{ background: '#232526', color: '#FFD700', padding: '16px 32px', borderRadius: 16, fontSize: 22, fontWeight: 'bold', boxShadow: '0 4px 24px rgba(0,0,0,0.3)', pointerEvents: 'auto' }}>
            {mensaje}
          </div>
        </div>
      )}
    </div>
  );
}

export default JuegosVista;