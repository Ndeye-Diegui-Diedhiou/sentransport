# SenTransport - Guide du transport en commun à Dakar

SenTransport est une application full-stack (React & Flask) permettant de consulter, rechercher et analyser les lignes de transport en commun à Dakar. 

Ce projet a été réalisé dans le cadre des travaux pratiques (PRC - Programmation Réseau et Client).

---

## 🚀 Fonctionnalités

### 💻 Client (React)
- **Affichage des lignes** : Liste dynamique des lignes de bus avec numéro, trajets (Départ ➔ Arrivée) et nombre d'arrêts.
- **Recherche en temps réel** : Filtrage instantané des lignes par numéro, ville de départ ou d'arrivée.
- **Chargement à la demande** : Clic sur une ligne pour récupérer ses détails complets (liste complète des arrêts) en temps réel depuis l'API.
- **Rechargement dynamique** : Bouton permettant de rafraîchir les données de l'API sans recharger la page ou redémarrer le serveur.
- **Gestion des états** : Écrans de chargement et de gestion d'erreurs (si le serveur API est hors ligne).

### ⚙️ Serveur API (Flask)
- **Données dynamiques** : Lecture en temps réel du fichier de données lignes_ddd.json sans besoin de redémarrer le serveur à chaque modification.
- **Endpoints REST** :
  - GET / : Accueil & liste des routes disponibles.
  - GET /lignes : Renvoie la liste de toutes les lignes de bus.
  - GET /lignes/<id> : Renvoie les détails complets d'une ligne spécifique.
  - GET /arrets : Renvoie la liste unique de tous les arrêts du réseau (sans doublons).
  - GET /stats : Fournit des statistiques sur le réseau (nombre de lignes, nombre total d'arrêts, ligne avec le plus d'arrêts).
  - GET /lignes/recherche?q=... : Recherche de lignes par mot-clé (départ ou arrivée).

---

## 🛠️ Installation et Démarrage

### Prérequis
- [Node.js](https://nodejs.org/) (version 16+)
- [Python 3](https://www.python.org/)

### 1. Démarrage de l'API (Backend)
Allez dans le dossier pi/ :
`ash
cd api
`

Installez les dépendances nécessaires :
`ash
pip install flask flask-cors
`

Lancez le serveur Flask :
`ash
python app.py
`
Le serveur sera disponible sur http://localhost:5000.

### 2. Démarrage de l'Application React (Frontend)
Revenez à la racine du projet et installez les modules Node :
`ash
npm install
`

Lancez le client React :
`ash
npm start
`
L'application s'ouvrira automatiquement dans votre navigateur à l'adresse http://localhost:3000.

---

## 📂 Structure du Projet

`	ext
sentransport/
├── api/
│   ├── app.py             # Code de l'API Flask
│   └── lignes_ddd.json    # Base de données JSON
├── public/                # Fichiers publics React
└── src/                   # Composants React
    ├── App.js             # Composant principal (Logique & State)
    ├── App.css            # Styles de l'application
    ├── Header.js          # En-tête de l'application
    ├── Footer.js          # Pied de page
    ├── LigneBus.js        # Composant d'affichage d'une ligne
    ├── DetailLigne.js     # Composant d'affichage des détails d'une ligne
    └── Recherche.js       # Composant de barre de recherche
`

---

## 📝 Licence
Projet académique - LICENCE 2 - Semestre 2.
