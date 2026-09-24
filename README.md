# L'Antre du Nuton Grognon

Site personnel hébergé sur GitHub Pages, à la fois un espace pour présenter mes projets et un terrain d'apprentissage du développement web (HTML, CSS, workflows Git, automatisation légère en backend).

[Voir le site en ligne](https://ghubin.github.io)

## Fonctionnalités

La page d'accueil met en scène un bureau interactif : un tableau blanc affichant mes projets, le bureau lui-même, et un panneau perforé Skadis (Ikea) destiné à accueillir d'autres éléments au fil du temps.

`listeningRoom`, en cours de construction, sera dédiée à l'écoute musicale, avec deux volets : les données Spotify mises à jour automatiquement, et une sélection de vinyles maintenue manuellement.

## Pipeline Spotify

Un pipeline automatisé alimente `listeningRoom` avec mes écoutes récentes, en s'appuyant sur l'API Spotify pour générer et mettre à jour les données affichées sur le site.

## Stack technique

- HTML / CSS pur, pas de framework
- Python pour l'automatisation Spotify
- GitHub Actions pour les tâches planifiées
- GitHub Pages pour l'hébergement

## À venir

- Habillage visuel complet de `listeningRoom`, avec affichage des données Spotify et de la collection de vinyles
- Migration éventuelle hors de GitHub Pages, vers un serveur personnel
