import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Carte.css';

// Corriger les icones Leaflet (bug webpack)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// --- Exercice 1 : icone orange pour l'arret le plus proche ---
const iconeProche = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    className: 'icone-arret-proche',
});

// icone par defaut explicite
const iconeDefaut = new L.Icon.Default();

// Calculer la distance entre 2 points GPS (km)
function calculerDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// --- Exercice 2 : composant bouton qui recentre la carte ---
function BoutonRecentrer({ position }) {
  const map = useMap(); // hook react-leaflet : acces a l'instance de la carte

    const recentrer = () => {
        if (position) {
        map.setView(position, 15);
        }
    };

    if (!position) return null;

    return (
        <button className="btn-recentrer" onClick={recentrer}>
        📍 Centrer sur ma position
        </button>
    );
    }

    function Carte() {
    const [arrets, setArrets] = useState([]);
    const [positionUtilisateur, setPositionUtilisateur] = useState(null);
    const [arretProche, setArretProche] = useState(null);
    const [troisArretsProches, setTroisArretsProches] = useState([]); // Exercice 3
    const DAKAR = [14.6928, -17.4467];

    // Charger les arrets depuis Flask
    useEffect(() => {
        fetch("http://localhost:5000/arrets")
        .then(r => r.json())
        .then(data => setArrets(data))
        .catch(err => console.error("Erreur arrets:", err));
    }, []);

    // Geolocalisation
    useEffect(() => {
        if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            pos => {
            setPositionUtilisateur([
                pos.coords.latitude,
                pos.coords.longitude
            ]);
            },
            () => console.log("Geolocation refusee")
        );
        }
    }, []);

    // Trouver l'arret le plus proche + Exercice 3 : les 3 plus proches
    useEffect(() => {
        if (positionUtilisateur && arrets.length > 0) {
        const arretsAvecDistance = arrets.map(a => ({
            ...a,
            distance: calculerDistance(
            positionUtilisateur[0],
            positionUtilisateur[1],
            a.lat,
            a.lon
            )
        }));

        // Tri par distance croissante
        arretsAvecDistance.sort((x, y) => x.distance - y.distance);

        setArretProche(arretsAvecDistance[0]);
        setTroisArretsProches(arretsAvecDistance.slice(0, 3)); // Exercice 3
        }
    }, [positionUtilisateur, arrets]);

    return (
        <div className="carte-container">
        <h2 className="carte-titre">Carte des arrets</h2>

        {arretProche && (
            <p className="arret-proche">
            Arret le plus proche :{" "}
            <strong>{arretProche.nom}</strong>
            {" "}({arretProche.distance.toFixed(1)} km)
            </p>
        )}

        {/* Exercice 3 : liste des 3 arrets les plus proches */}
        {troisArretsProches.length > 0 && (
            <div className="liste-arrets-proches">
            <p className="liste-titre">Les 3 arrets les plus proches :</p>
            <ol>
                {troisArretsProches.map(a => (
                <li key={a.id}>
                    <strong>{a.nom}</strong> — {a.distance.toFixed(1)} km
                </li>
                ))}
            </ol>
            </div>
        )}

        <MapContainer center={DAKAR} zoom={13} className="carte">
            <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap"
            />

            {arrets.map(a => (
            <Marker
                key={a.id}
                position={[a.lat, a.lon]}
                icon={arretProche && a.id === arretProche.id ? iconeProche : iconeDefaut}
            >
                <Popup>
                <strong>{a.nom}</strong><br />
                Lignes : {a.lignes ? a.lignes.join(", ") : "Non renseigné"}
                </Popup>
            </Marker>
            ))}

            {positionUtilisateur && (
            <Marker position={positionUtilisateur}>
                <Popup>Vous etes ici</Popup>
            </Marker>
            )}

            {/* Exercice 2 : bouton de recentrage, doit etre DANS le MapContainer */}
            <BoutonRecentrer position={positionUtilisateur} />
        </MapContainer>
        </div>
    );
}

export default Carte;