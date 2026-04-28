import './App.css';
import Header from './Header';
import ListeLignes from './ListeLignes';
import StatReseau from './StatReseau';
import Footer from './Footer';

function App() {
  const lignes = [
    { id: 1,  numero: "1",  depart: "Parcelles Assainies", arrivee: "Plateau",     arrets: 14, couleur: "#e74c3c" },
    { id: 2,  numero: "7",  depart: "Guediawaye",          arrivee: "Place Obé",   arrets: 18, couleur: "#3498db" },
    { id: 3,  numero: "15", depart: "Pikine",              arrivee: "Médina",      arrets: 12, couleur: "#9b59b6" },
    { id: 4,  numero: "23", depart: "Ouakam",              arrivee: "Grand Dakar", arrets: 10, couleur: "#e67e22" },
    { id: 5,  numero: "8",  depart: "Almadies",            arrivee: "Colobane",    arrets: 16, couleur: "#1abc9c" },
    { id: 6,  numero: "12", depart: "Yoff",                arrivee: "Sandaga",     arrets: 11, couleur: "#f39c12" },
    // Exercice 3 — 4 nouvelles lignes
    { id: 7,  numero: "3",  depart: "Fann",                arrivee: "HLM",         arrets: 9,  couleur: "#2980b9" },
    { id: 8,  numero: "19", depart: "Liberté 6",           arrivee: "Dieuppeul",   arrets: 7,  couleur: "#c0392b" },
    { id: 9,  numero: "27", depart: "Sicap Baobab",        arrivee: "Médina",      arrets: 13, couleur: "#27ae60" },
    { id: 10, numero: "31", depart: "HLM Grand Yoff",      arrivee: "Plateau",     arrets: 15, couleur: "#8e44ad" },
  ];

  return (
    <div className="App">
      <Header />
      <main className="contenu">
        <StatReseau lignes={lignes} />
        <ListeLignes lignes={lignes} />
      </main>
      <Footer />
    </div>
  );
}

export default App;