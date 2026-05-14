import json
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Charger les données depuis le fichier JSON
# Assurez-vous que le nom du fichier ne contient pas d'espaces inutiles
with open("lignes_ddd.json", "r") as f:
    lignes = json.load(f)

@app.route("/")
def accueil():
    return jsonify({
        "message": "Bienvenue sur l'API SenTransport !",
        "endpoints": ["/lignes", "/lignes/<id>", "/arrets", "/stats", "/lignes/recherche"]
    })

@app.route("/arrets")
def get_arrets():
    # --- EXERCICE 1 : Liste de tous les arrêts sans doublons ---
    tous_les_arrets = []
    for ligne in lignes:
        tous_les_arrets.extend(ligne.get("listeArrets", []))
    
    unique_arrets = list(set(tous_les_arrets))
    return jsonify(unique_arrets)

@app.route("/stats")
def get_stats():
    # --- EXERCICE 2 : Statistiques sur les lignes et les arrêts ---
    total_lignes = len(lignes)
    
    # Somme de tous les arrêts (nombre total d'arrêts mentionnés dans toutes les lignes)
    total_arrets_count = sum(len(ligne.get("listeArrets", [])) for ligne in lignes)
    
    # Numéro de la ligne ayant le plus d'arrêts
    if lignes:
        ligne_max = max(lignes, key=lambda l: len(l.get("listeArrets", [])))
        numero_ligne_max = ligne_max["numero"]
    else:
        numero_ligne_max = None

    return jsonify({
        "total_lignes": total_lignes,
        "total_arrets": total_arrets_count,
        "ligne_plus_arrets": numero_ligne_max
    })

@app.route("/lignes/recherche")
def recherche_lignes():
    # --- EXERCICE 3 : Recherche de lignes par départ ou arrivée ---
    query = request.args.get("q", "")
    
    resultats = [
        l for l in lignes 
        if query.lower() in l["depart"].lower() or query.lower() in l["arrivee"].lower()
    ]
    
    return jsonify(resultats)

@app.route("/lignes")
def get_lignes():
    return jsonify(lignes)

@app.route("/lignes/<int:ligne_id>")
def get_ligne(ligne_id):
    # Recherche de la ligne par son ID
    ligne = next(
        (l for l in lignes if l["id"] == ligne_id),
        None
    )
    
    if ligne is None:
        return jsonify({"erreur": "Ligne non trouvee"}), 404
        
    return jsonify(ligne)

if __name__ == "__main__":
    app.run(debug=True, port=5000)