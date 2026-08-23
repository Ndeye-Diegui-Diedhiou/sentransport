import { useState, useEffect } from 'react';
import './Meteo.css';

function Meteo() {
    const [meteo, setMeteo] = useState(null);
    const [previsions, setPrevisions] = useState([]);
    const [erreur, setErreur] = useState(null);

    useEffect(() => {
        const API_KEY = process.env.REACT_APP_OWM_KEY;
        if (!API_KEY) {
        setErreur("Cle API manquante (.env)");
        return;
        }

        // Meteo actuelle
        const urlActuelle =
        `https://api.openweathermap.org/data/2.5/weather`
        + `?q=Dakar&appid=${API_KEY}`
        + `&units=metric&lang=fr`;

        fetch(urlActuelle)
        .then(r => {
            if (!r.ok) throw new Error("Erreur : " + r.status);
            return r.json();
        })
        .then(data => {
            setMeteo({
            temperature: Math.round(data.main.temp),
            description: data.weather[0].description,
            condition: data.weather[0].main,
            humidite: data.main.humidity,
            icone: data.weather[0].icon,
            });
        })
        .catch(err => setErreur(err.message));

        // Exercice 2 : previsions a 5 jours (donnees toutes les 3h)
        const urlForecast =
        `https://api.openweathermap.org/data/2.5/forecast`
        + `?q=Dakar&appid=${API_KEY}`
        + `&units=metric&lang=fr`;

        fetch(urlForecast)
        .then(r => {
            if (!r.ok) throw new Error("Erreur forecast : " + r.status);
            return r.json();
        })
        .then(data => {
            // L'API renvoie des previsions toutes les 3h sur 5 jours.
            // On garde une seule prevision par jour (vers midi, plus representative).
            const parJour = {};
            data.list.forEach(item => {
            const jour = item.dt_txt.split(" ")[0]; // "2026-06-27"
            const heure = item.dt_txt.split(" ")[1]; // "12:00:00"
            if (heure === "12:00:00") {
                parJour[jour] = {
                date: jour,
                temperature: Math.round(item.main.temp),
                description: item.weather[0].description,
                icone: item.weather[0].icon,
                };
            }
            });

            // On exclut aujourd'hui et on garde les 3 prochains jours
            const aujourdHui = new Date().toISOString().split("T")[0];
            const joursTries = Object.values(parJour)
            .filter(j => j.date !== aujourdHui)
            .sort((a, b) => a.date.localeCompare(b.date))
            .slice(0, 3);

            setPrevisions(joursTries);
        })
        .catch(err => console.error("Erreur previsions:", err.message));
    }, []);

    function getAlerte(condition) {
        if (condition === "Rain" || condition === "Drizzle") {
        return {
            message: "Pluie detectee - risque de retards",
            classe: "alerte-pluie"
        };
        }
        if (condition === "Thunderstorm") {
        return {
            message: "Orage en cours - soyez prudents",
            classe: "alerte-orage"
        };
        }
        return null;
    }

    function formaterJour(dateStr) {
        const date = new Date(dateStr);
        const jours = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
        return jours[date.getDay()];
    }

    if (erreur) {
        return (
        <div className="meteo meteo-erreur">
            <p>Meteo indisponible</p>
            <p className="meteo-detail">{erreur}</p>
        </div>
        );
    }

    if (!meteo) {
        return <div className="meteo">Chargement meteo...</div>;
    }

    const alerte = getAlerte(meteo.condition);

    return (
        <div className="meteo">
        <div className="meteo-info">
            <img
            src={`https://openweathermap.org/img/wn/${meteo.icone}@2x.png`} 
            alt={meteo.description}
            className="meteo-icone"
            />
            <div>
            <span className="meteo-temp">
                {meteo.temperature}&deg;C
            </span>
            <span className="meteo-desc">
                {meteo.description}
            </span>
            </div>
            <span className="meteo-humidite">
            Humidite : {meteo.humidite}%
            </span>
        </div>

        {alerte && (
            <div className={`meteo-alerte ${alerte.classe}`}>
            {alerte.message}
            </div>
        )}

        {/* Exercice 2 : previsions des 3 prochains jours */}
        {previsions.length > 0 && (
            <div className="meteo-previsions">
            {previsions.map(jour => (
                <div key={jour.date} className="prevision-jour">
                <span className="prevision-nom-jour">{formaterJour(jour.date)}</span>
                <img
                    src={`https://openweathermap.org/img/wn/${jour.icone}.png`}
                    alt={jour.description}
                    className="prevision-icone"
                />
                <span className="prevision-temp">{jour.temperature}&deg;C</span>
                </div>
            ))}
            </div>
        )}
        </div>
    );
}

export default Meteo;