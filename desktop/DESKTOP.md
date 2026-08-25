# App desktop — spécifications

## Principe

L'app desktop est une fenêtre [Electron](https://www.electronjs.org/) qui
charge la page du serveur Pong (`client/index.html`, servie par
`server/index.js`) — **aucune logique de jeu n'est dupliquée**. Le client
web et le client desktop sont exactement le même code HTML/CSS/JS ; seule
la fenêtre qui l'affiche change.

```
┌─────────────────────────┐        HTTPS/WSS         ┌──────────────────┐
│   Fenêtre Electron       │ ────────────────────────► │  Serveur Pong    │
│   (main.js)               │ ◄──────────────────────── │  (Node.js + ws)  │
│   BrowserWindow.loadURL   │                            │  Railway / local │
└─────────────────────────┘                            └──────────────────┘
```

Ce choix (se connecter à un serveur distant plutôt qu'embarquer un serveur
local) a été fait pour rester cohérent avec le jeu web : un seul serveur
fait autorité pour tout le monde, desktop et navigateur peuvent
s'affronter dans la même partie.

## Structure des fichiers

| Fichier | Rôle |
|---|---|
| `main.js` | Process principal Electron : crée la `BrowserWindow`, résout l'URL du serveur, gère le cycle de vie de l'app |
| `preload.js` | Script de préchargement — intentionnellement vide, la page distante n'a besoin d'aucune API privilégiée |
| `config.json` | URL du serveur par défaut (`serverUrl`) |
| `package.json` | Dépendances (`electron`, `electron-builder`) et config de build (`build`) |

## Configuration de l'URL du serveur

Résolue dans cet ordre (`main.js`, `resolveServerUrl()`) :

1. Variable d'environnement `PONG_SERVER_URL` (prioritaire — utile pour
   pointer vers Railway sans modifier de fichier)
2. `serverUrl` dans `config.json` (par défaut `http://localhost:3000`)

## Sécurité

- `contextIsolation: true` — la page chargée ne peut pas accéder aux API
  Node.js du process Electron.
- `preload.js` vide — aucune API custom exposée via `contextBridge`,
  puisque la page n'en a pas besoin (elle ne fait que du WebSocket/DOM,
  identique au navigateur).
- Pas de `nodeIntegration` activé (valeur par défaut Electron : `false`).

Concrètement, la page tourne dans les mêmes conditions de sandboxing
qu'un onglet de navigateur classique — la fenêtre desktop n'élargit pas
la surface d'attaque par rapport au client web.

## Build / packaging

Configuration `electron-builder` dans `package.json` :

```json
{
  "win": { "target": "nsis" },
  "mac": { "target": "dmg" },
  "linux": { "target": "AppImage" }
}
```

```
npm run build
```

Génère un exécutable installable par OS dans `desktop/dist/` (ignoré par
git — voir `.gitignore`) :

- **Windows** : installeur `.exe` (NSIS)
- **macOS** : image disque `.dmg`
- **Linux** : `.AppImage` (portable, sans installation)

## Limites actuelles

- Pas de mode hors-ligne : l'app ne fonctionne que si le serveur configuré
  est joignable (comportement identique au client web).
- Pas d'auto-update intégré (`electron-updater` n'est pas configuré) —
  une nouvelle version doit être redistribuée manuellement.
- Une seule langue (français), voir la piste `desktop_multilingual`.
