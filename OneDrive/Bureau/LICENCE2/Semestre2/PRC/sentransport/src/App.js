import { useState } from 'react';
import './App.css';
import Header from './Header';
import Recherche from './Recherche';
import StatReseau from './StatReseau';
import ListeLignes from './ListeLignes';
import LigneBus from './LigneBus';
import Footer from './Footer';

function App() {
  const [ recherche , setRecherche ] = useState ("") ;
  const [ ligneSelectionnee , setLigneSelectionnee ] = useState ( null ) ;
  const lignes = [
      { id: 1, numero: "1", depart: "Parcelles Assainies", arrivee: "Plateau", arrets: 14, listeArrets: ["Parcelles U14", "Parcelles U10", "Camberene", "Patte d'Oie", "Grand Dakar", "Colobane", "Ponty", "Plateau"], couleur: "#3498db" },
      { id: 2, numero: "7", depart: "Guediawaye", arrivee: "Place Obe", arrets: 18, listeArrets: ["Guediawaye", "Pikine", "Thiaroye", "Keur Massar", "Grand Yoff", "Parcelles", "Liberte 6", "Place Obe"], couleur: "#e74c3c" },
      { id: 3, numero: "15", depart: "Pikine", arrivee: "Medina", arrets: 12, listeArrets: ["Pikine Centre", "Thiaroye Gare", "Hann", "Colobane", "Fass", "Medina"], couleur: "#f39c12" },
      { id: 4, numero: "23", depart: "Ouakam", arrivee: "Grand Dakar", arrets: 10, listeArrets: ["Ouakam Village", "Mermoz", "Fann", "Point E", "Liberte 5", "Grand Dakar"], couleur: "#9b59b6" },
      { id: 5, numero: "8", depart: "Almadies", arrivee: "Colobane", arrets: 16, listeArrets: ["Almadies", "Ngor", "Yoff", "Quest Foire", "Liberte 6", "Colobane"], couleur: "#1abc9c" },
      { id: 6, numero: "12", depart: "Yoff", arrivee: "Sandaga", arrets: 11, listeArrets: ["Yoff Village", "Aeroport LSS", "Parcelles U17", "Grand Yoff", "HLM", "Sandaga"], couleur: "#34495e" }
  ];
  // Filtrer les lignes selon le texte tape
  const lignesFiltrees = lignes.filter (l =>
      l.depart.toLowerCase().includes ( recherche.toLowerCase () ) ||
      l.arrivee.toLowerCase().includes ( recherche.toLowerCase () ) ||
      l.numero.includes ( recherche )
  );
  function handleClickLigne(ligne) {
    if (ligneSelectionnee && ligneSelectionnee.id === ligne.id) {
      setLigneSelectionnee(null); // Désélectionne si on reclique
    } else {
      setLigneSelectionnee(ligne); // Sélectionne la nouvelle ligne
    }
  }
  return (
    <div className="App">
      <Header />
      <main className="contenu">
        <Recherche valeur={recherche} onChange={setRecherche} />
        <StatReseau lignes={lignes} />
        {recherche.trim() === '' ? (
          <ListeLignes lignes={lignes} ligneSelectionnee={ligneSelectionnee} onClickLigne={handleClickLigne} />
        ) : (
          <>
            <p className="resultat-recherche">
              {lignesFiltrees.length} ligne{lignesFiltrees.length > 1 ? 's' : ''} trouvée{lignesFiltrees.length > 1 ? 's' : ''}
            </p>
            {lignesFiltrees.length > 0 ? (
              lignesFiltrees.map((ligne) => (
                <LigneBus
                  key={ligne.id}
                  {...ligne}
                  estSelectionnee={ligneSelectionnee && ligneSelectionnee.id === ligne.id}
                  onClick={() => handleClickLigne(ligne)}
                />
              ))
            ) : (
              <p>Aucune ligne trouvée.</p>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;