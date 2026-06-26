import json
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def charger_donnees():
    try:
        with open("lignes_ddd.json", "r") as f:
            return json.load(f)
    except FileNotFoundError:
        return []

def charger_arrets():
    try:
        with open("arrets.json", "r") as f:
            return json.load(f)
    except FileNotFoundError:
        return []

@app.route("/")
def accueil():
    return jsonify({
        "message": "Bienvenue sur l'API SenTransport !",
        "endpoints": ["/lignes", "/lignes/<id>", "/arrets", "/stats", "/lignes/recherche", "/arrets/liste-noms", "/incidents"]
    })

@app.route("/arrets")
def get_arrets():
    return jsonify(charger_arrets())

@app.route("/arrets/liste-noms")
def get_arrets_noms():
    lignes = charger_donnees()
    tous_les_arrets = []
    for ligne in lignes:
        tous_les_arrets.extend(ligne.get("listeArrets", []))
    unique_arrets = list(set(tous_les_arrets))
    return jsonify(unique_arrets)

@app.route("/stats")
def get_stats():
    lignes = charger_donnees()
    total_lignes = len(lignes)
    total_arrets_count = sum(len(ligne.get("listeArrets", [])) for ligne in lignes)

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
    lignes = charger_donnees()
    query = request.args.get("q", "")
    resultats = [
        l for l in lignes
        if query.lower() in l["depart"].lower() or query.lower() in l["arrivee"].lower()
    ]
    return jsonify(resultats)

@app.route("/lignes")
def get_lignes():
    lignes = charger_donnees()
    return jsonify(lignes)

@app.route("/lignes/<int:ligne_id>")
def get_ligne(ligne_id):
    lignes = charger_donnees()
    ligne = next((l for l in lignes if l["id"] == ligne_id), None)
    if ligne is None:
        return jsonify({"erreur": "Ligne non trouvee"}), 404
    return jsonify(ligne)

incidents = []

@app.route("/incidents", methods=["GET"])
def get_incidents():
    return jsonify(incidents)

@app.route("/incidents", methods=["POST"])
def post_incident():
    data = request.get_json()
    if not data or "ligne" not in data or "description" not in data:
        return jsonify({"erreur": "Champs requis manquants"}), 400

    incident = {
        "id": len(incidents) + 1,
        "ligne": data["ligne"],
        "description": data["description"],
        "lieu": data.get("lieu", "Non precise"),
    }
    incidents.append(incident)
    return jsonify(incident), 201

if __name__ == "__main__":
    app.run(debug=True, port=5000)