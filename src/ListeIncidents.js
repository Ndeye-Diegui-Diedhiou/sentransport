import { useState, useEffect } from 'react';
import './ListeIncidents.css';

function ListeIncidents() {
    const [incidents, setIncidents] = useState([]);
    const [chargement, setChargement] = useState(true);
    const [erreur, setErreur] = useState(null);

    useEffect(() => {
        fetch("http://localhost:5000/incidents")
        .then(r => {
            if (!r.ok) throw new Error("Erreur serveur");
            return r.json();
        })
        .then(data => {
            setIncidents(data);
            setChargement(false);
        })
        .catch(err => {
            setErreur(err.message);
            setChargement(false);
        });
    }, []);

    if (chargement) {
        return <div className="liste-incidents">Chargement des incidents...</div>;
    }

    if (erreur) {
        return (
        <div className="liste-incidents liste-incidents-erreur">
            Impossible de charger les incidents : {erreur}
        </div>
        );
    }

    return (
        <div className="liste-incidents">
        <h2 className="liste-incidents-titre">Incidents signalés</h2>
        {incidents.length === 0 ? (
            <p className="liste-incidents-vide">Aucun incident signalé pour le moment.</p>
        ) : (
            <ul className="liste-incidents-ul">
            {incidents.map(inc => (
                <li key={inc.id} className="incident-item">
                <span className="incident-ligne">Ligne {inc.ligne}</span>
                <span className="incident-description">{inc.description}</span>
                <span className="incident-lieu">{inc.lieu}</span>
                </li>
            ))}
            </ul>
        )}
        </div>
    );
}

export default ListeIncidents;