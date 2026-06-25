import LigneBus from './LigneBus';
import './ListeLignes.css';

function ListeLignes({ lignes, ligneSelectionnee, onClickLigne }) {
    return (
        <div className="liste-lignes">
        <h2 className="liste-titre">Lignes Dakar Dem Dikk</h2>
        <p className="liste-description">{lignes.length} lignes disponibles</p>
        {lignes.map(ligne => (
            <LigneBus
            key={ligne.id}
            {...ligne}
            estSelectionnee={ligneSelectionnee && ligneSelectionnee.id === ligne.id}
            onClick={() => onClickLigne(ligne)}
            />
        ))}
        </div>
    );
}

export default ListeLignes;