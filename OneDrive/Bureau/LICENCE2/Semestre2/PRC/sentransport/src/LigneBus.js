import './LigneBus.css';

function LigneBus({ numero, depart, arrivee, arrets, couleur }) {
    return (
        <div className="ligne-bus">
            <div
                className="ligne-numero"
                style={{ background: couleur || 'linear-gradient(135deg, #0a6e31 0%, #084c1f 100%)' }}
            >
                {numero}
            </div>
            <div className="ligne-info">
                <span className="ligne-trajet">
                {depart} &rarr; {arrivee}
                </span>
                <span className="ligne-arrets">{arrets} arrêts</span>
            </div>
        </div>
    );
}

export default LigneBus;