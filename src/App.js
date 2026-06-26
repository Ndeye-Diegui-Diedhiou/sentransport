import { useState, useEffect } from 'react';
import './App.css';
import Header from './Header';
import Recherche from './Recherche';
import LigneBus from './LigneBus';
import DetailLigne from './DetailLigne';
import Meteo from './Meteo';
import SignalerIncident from './SignalerIncident';
import Carte from './Carte';
import Footer from './Footer';

function App() {
  // États pour les données et la gestion du chargement/erreurs
  const [lignes, setLignes] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);

  // États pour l'interface utilisateur
  const [recherche, setRecherche] = useState("");
  const [ligneSelectionnee, setLigneSelectionnee] = useState(null);

  // --- EXERCICE 1 : Fonction de chargement séparée ---
  const chargerLignes = () => {
    setChargement(true);
    setErreur(null);
    fetch("http://localhost:5000/lignes")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur serveur : " + response.status);
        }
        return response.json();
      })
      .then((data) => {
        setLignes(data);
        setChargement(false);
      })
      .catch((error) => {
        setErreur(error.message);
        setChargement(false);
      });
  };

  // Hook useEffect pour récupérer les données au montage du composant
  useEffect(() => {
    chargerLignes();
  }, []);

  // Logique de filtrage des lignes
  const lignesFiltrees = lignes.filter((l) =>
    l.depart.toLowerCase().includes(recherche.toLowerCase()) ||
    l.arrivee.toLowerCase().includes(recherche.toLowerCase()) ||
    l.numero.includes(recherche)
  );

  // --- EXERCICE 3 : Gestion de la sélection d'une ligne avec chargement des détails ---
  function handleClickLigne(ligne) {
    if (ligneSelectionnee && ligneSelectionnee.id === ligne.id) {
      setLigneSelectionnee(null);
    } else {
      // On charge les détails depuis l'API spécifique au lieu d'utiliser l'objet de la liste
      fetch(`http://localhost:5000/lignes/${ligne.id}`)
        .then(response => {
          if (!response.ok) throw new Error("Erreur lors du chargement des détails");
          return response.json();
        })
        .then(data => {
          setLigneSelectionnee(data);
        })
        .catch(error => {
          console.error("Erreur Exercice 3:", error);
          // On peut décider d'afficher une alerte ou d'utiliser les données partielles
          setLigneSelectionnee(ligne); 
        });
    }
  }

  // Rendu de l'état de chargement
  if (chargement) {
    return (
      <div className="App">
        <Header />
        <main className="contenu">
          <p className="message-chargement">Chargement des lignes...</p>
        </main>
      </div>
    );
  }

  // Rendu de l'état d'erreur
  if (erreur) {
    return (
      <div className="App">
        <Header />
        <main className="contenu">
          <div className="message-erreur">
            <p>Impossible de charger les lignes.</p>
            <p className="erreur-detail">{erreur}</p>
            <p>Vérifiez que le serveur Flask est lancé (python api/app.py).</p>
            {/* Bouton pour réessayer en cas d'erreur */}
            <button onClick={chargerLignes} className="btn-recharger">Réessayer</button>
          </div>
        </main>
      </div>
    );
  }

  // Rendu principal (succès)
  return (
    <div className="App">
      <Header />
      <main className="contenu">
        <Meteo />
        <Recherche valeur={recherche} onChange={setRecherche} />

        <p className="resultat-recherche">
          {lignesFiltrees.length} ligne{lignesFiltrees.length > 1 ? 's' : ''}
          {' '}trouvee{lignesFiltrees.length > 1 ? 's' : ''}
        </p>

        <div className="liste-lignes">
          {lignesFiltrees.map((ligne) => (
            <LigneBus
              key={ligne.id}
              numero={ligne.numero}
              depart={ligne.depart}
              arrivee={ligne.arrivee}
              arrets={ligne.arrets}
              estSelectionnee={ligneSelectionnee && ligneSelectionnee.id === ligne.id}
              onClick={() => handleClickLigne(ligne)}
            />
          ))}
        </div>

        {ligneSelectionnee && <DetailLigne ligne={ligneSelectionnee} />}
        <Carte />
        <SignalerIncident />
      </main>
      <Footer />
    </div>
  );
}

export default App;