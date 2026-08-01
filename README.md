# Pong Multijoueur

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
