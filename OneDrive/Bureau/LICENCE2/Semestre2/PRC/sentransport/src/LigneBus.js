import './LigneBus.css';

function LigneBus({ numero, depart, arrivee, arrets, listeArrets, estSelectionnee, onClick }) {
  return (
    <>
      <div
        className={`ligne-bus ${estSelectionnee ? 'ligne-bus-active' : ''}`}
        onClick={onClick}
      >
        <div className="ligne-numero">{numero}</div>
        <div className="ligne-info">
          <span className="ligne-trajet">
            {depart} &rarr; {arrivee}
          </span>
          <span className="ligne-arrets">{arrets} arrêts</span>
        </div>
      </div>
      
      {/* Arrêts affichés en expansion */}
      {estSelectionnee && listeArrets && (
        <div className="ligne-arrets-expanded">
          <h4 className="arrets-titre">Arrêts principaux :</h4>
          <ul className="arrets-liste">
            {listeArrets.map((arret, index) => (
              <li key={index} className="arret-item">
                <span className="arret-numero">{index + 1}</span>
                <span className="arret-nom">{arret}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export default LigneBus;
