# Déploiement continu (CD)

## Vue d'ensemble

```
push sur main
      │
      ├──► CI (.github/workflows/ci.yml)
      │      lint + tests, sur Node 18.x et 20.x
      │
      └──► Railway (auto-deploy natif, branché sur main)
             build (npm ci) → npm start → serveur en prod
```

Le déploiement est géré par [Railway](https://railway.app), configuré en
"Infrastructure as Code" via [`railway.json`](railway.json) à la racine du
repo — la configuration de déploiement est donc versionnée avec le code,
pas seulement cliquée dans un dashboard externe.

## Pourquoi Railway plutôt qu'un script de déploiement custom

Le serveur (`server/index.js`) est un process Node.js **stateful** :
l'état des parties (`GameState`, les rooms) vit en mémoire, et le serveur
maintient des connexions WebSocket ouvertes en continu. Ça exclut les
plateformes serverless classiques (pas de process persistant) et impose
une plateforme qui garde le process vivant durablement — Railway répond à
ce besoin sans nécessiter de gérer un VPS à la main.

## Configuration (`railway.json`)

```json
{
  "build": { "builder": "NIXPACKS" },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

- **Build** : Nixpacks détecte automatiquement un projet Node.js (via
  `package.json` / `engines.node`) et exécute `npm ci`.
- **Deploy** : démarre avec `npm start` (→ `node server/index.js`), et
  redémarre automatiquement en cas de crash (jusqu'à 10 tentatives).
- **Port** : Railway injecte la variable `PORT`, déjà lue par le serveur
  (`process.env.PORT`, voir `server/index.js:11`) — aucune configuration
  supplémentaire nécessaire.

## Déclenchement

Le service Railway est connecté au repo GitHub avec **Auto Deploy** activé
sur la branche `main` (Settings → Source, dans le dashboard Railway) :
chaque push sur `main` déclenche automatiquement un nouveau déploiement.

## Limite connue : CI et déploiement ne sont pas couplés

Le plan Railway utilisé ici n'expose pas d'option native pour faire
attendre le déploiement jusqu'à ce que le workflow CI soit vert — CI et
déploiement se déclenchent **en parallèle** sur le même push. Concrètement :
si un commit casse un test, il est quand même déployé (la CI vire rouge
sur GitHub, mais après coup).

**Mitigation recommandée** : activer la protection de branche sur `main`
côté GitHub (Settings → Branches → Branch protection rules) en exigeant
que le check `CI` passe avant tout merge. Ainsi `main` ne contient jamais
que du code déjà testé, et Railway — qui déploie tout ce qui atteint
`main` — ne peut déployer que du code vert.

## Vérifier un déploiement

- Dashboard Railway → onglet **Deployments** : historique, logs de build
  et de runtime pour chaque déploiement.
- `GET /` sur l'URL du service doit répondre 200 (sert `client/index.html`).

## Rollback

Dans l'onglet **Deployments** du service Railway, chaque déploiement
précédent peut être re-promu en un clic ("Redeploy") sans repasser par
Git — utile en cas d'incident le temps de corriger et repush.
