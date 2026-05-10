import './Recherche.css';

function Recherche({ valeur, onChange }) {
    return (
        <div className="recherche">
        <input
            type="text"
            className="recherche-input"
            placeholder="Rechercher une ligne..."
            value={valeur}
            onChange={e => onChange(e.target.value)}
        />
        {/* Bouton pour effacer la recherche  */}
        {valeur && (
            <button 
              type="button" 
              onClick={(e) => { e.stopPropagation(); onChange(""); }} 
              className="btn-effacer"
            >
              Effacer
            </button>
        )}
        </div>
    );
}
export default Recherche;