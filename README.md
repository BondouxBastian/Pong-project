# Pong Multijoueur

[![CI](https://github.com/BondouxBastian/Pong-project/actions/workflows/ci.yml/badge.svg)](https://github.com/BondouxBastian/Pong-project/actions/workflows/ci.yml)

Jeu Pong jouable dans le navigateur, en temps réel, via WebSocket. Le serveur Node.js fait autorité sur toute la physique (balle, collisions, score) ; le client se contente d'afficher l'état reçu et d'envoyer les touches pressées.

## Installation

```
npm install
```

## Lancer le serveur

```
npm start
```

Puis ouvrir `http://localhost:3000` dans deux onglets/navigateurs différents pour jouer à deux.

## Fonctionnalités

- Matchmaking automatique par salon de 2 joueurs (plusieurs parties en parallèle)
- Physique de la balle et des raquettes calculée côté serveur (anti-triche)
- Synchronisation temps réel de l'état de jeu
- Détection de fin de partie (score max ou déconnexion) et rejouabilité
- Mode spectateur
- Classement des joueurs (victoires/défaites)

## Commandes

- Flèches haut/bas ou W/S : déplacer la raquette

## Architecture

- `server/index.js` : serveur HTTP (fichiers statiques) + serveur WebSocket
- `server/lib/` : logique de jeu (Paddle, Ball, GameState, Room, RoomManager, LeaderboardStore)
- `client/` : page HTML, styles et scripts (rendu canvas, réseau, input, UI)

Chaque `client/js/*.js` (sauf `main.js`) s'exécute en IIFE et expose un seul objet
global (`Network`, `ClientState`, `Renderer`, `InputHandler`, `UI`), chargé dans cet
ordre par `index.html`. `main.js` orchestre ces modules en réagissant aux messages
réseau.

## Protocole réseau (WebSocket, JSON)

Chaque message a un champ `type` (voir `server/lib/messageTypes.js`).

**Client → serveur**

| type | payload | effet |
|---|---|---|
| `join_queue` | `{ name }` | rejoint (ou crée) une room en attente d'un adversaire |
| `join_spectate` | — | rejoint une room déjà en cours en spectateur |
| `input` | `{ input: { up, down } }` | met à jour l'état des touches de la raquette du joueur |
| `request_rematch` | — | relance une partie dans la room courante |
| `get_leaderboard` | — | demande le classement actuel |

**Serveur → client**

| type | payload | signification |
|---|---|---|
| `welcome` | `{ id }` | confirme la connexion, donne l'id du client |
| `waiting_for_opponent` | `{ side, roomId }` | en attente d'un 2e joueur |
| `room_ready` | — | les 2 joueurs sont là, la partie démarre |
| `game_state` | `{ state }` | état du jeu (position balle/raquettes, score), envoyé à `TICK_RATE` Hz |
| `game_over` | `{ winner }` | partie terminée |
| `opponent_disconnected` | — | l'adversaire s'est déconnecté |
| `spectate_joined` | `{ roomId }` | confirme l'entrée en mode spectateur |
| `leaderboard` | `{ ranking }` | classement trié par victoires |
| `error` | `{ message }` | erreur (ex : `room_full`, `no_active_room`) |

## App desktop

Un client desktop (Electron) est disponible dans `desktop/`. C'est une simple
fenêtre qui charge la page du serveur — aucune logique de jeu dupliquée, le
client web et le client desktop sont le même code.

```
cd desktop
npm install
npm start
```

Par défaut elle se connecte à `http://localhost:3000` (voir `desktop/config.json`).
Pour la pointer vers le serveur déployé (Railway), soit modifier `serverUrl` dans
`desktop/config.json`, soit lancer avec :

```
PONG_SERVER_URL=https://<ton-app>.up.railway.app npm start
```

Pour générer un exécutable installable (Windows/Mac/Linux) :

```
npm run build
```

## Tests, qualité de code, CI/CD

```
npm test    # tests unitaires (Jest) — logique de jeu, matchmaking, leaderboard
npm run lint  # ESLint — style et détection d'erreurs (variables inutilisées, etc.)
```

- **CI** (`.github/workflows/ci.yml`) : à chaque push/PR sur `main`, lint + tests
  tournent sur Node 18.x et 20.x.
- **CD** : voir [CD.md](CD.md) pour le détail du pipeline de déploiement
  (Railway, configuration, limites connues, rollback).
