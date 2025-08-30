# Journal de Bord du Projet : Chercheur de Livres Scolaires

Ce fichier sert à documenter les décisions techniques, les objectifs et les discussions importantes concernant ce projet.

## 1. Objectif Initial du Projet

Créer une application web simple et efficace qui permet aux utilisateurs de trouver des manuels scolaires. L'application doit :
- Charger les données depuis une Google Sheet pour une mise à jour facile.
- Proposer des filtres en cascade (Niveau -> Matière -> Titre).
- Afficher la couverture du livre sélectionné.
- Fournir un lien direct pour télécharger le PDF du manuel.

## 2. Le Problème du Déploiement Manuel

**Question initiale :** "Comment mettre à jour le site sans avoir à faire `npm run build` et un glisser-déposer manuel à chaque fois ?"

Le processus manuel est lent, source d'erreurs et n'est pas une pratique professionnelle durable. L'objectif est d'automatiser entièrement le processus de mise en ligne après chaque modification du code.

## 3. Solution : Workflow de Déploiement Continu (CI/CD)

Nous avons mis en place un workflow standard de l'industrie utilisant trois outils clés qui fonctionnent en synergie :

1.  **Vite** : Le compilateur de projet (build tool) qui transforme notre code source (`.tsx`) en fichiers statiques optimisés pour le web (`.js`, `.html`, `.css`) dans un dossier `dist`.
2.  **GitHub** : La plateforme d'hébergement pour notre code source. C'est la source de vérité unique pour notre projet.
3.  **Vercel** : La plateforme d'hébergement et de déploiement. Elle se connecte à GitHub, détecte les nouvelles modifications, et automatise entièrement le processus de build et de mise en ligne.

### Le Workflow Automatisé

1.  **Développement Local** : Modifier le code sur son ordinateur.
2.  **Versionnement** : Sauvegarder les modifications avec Git.
    ```bash
    git add .
    git commit -m "Description claire de la modification"
    ```
3.  **Publication** : Pousser les modifications vers le dépôt GitHub.
    ```bash
    git push
    ```
4.  **Déploiement Magique** :
    - Vercel reçoit une notification (webhook) de GitHub.
    - Vercel lance un nouveau conteneur, y copie le code.
    - Il exécute `npm install` puis `npm run build`.
    - Il prend le contenu du dossier `dist` généré et le déploie sur son réseau mondial (CDN).
    - Le site est mis à jour en moins d'une minute, sans aucune intervention manuelle.

### Avantages de cette approche

- **Rapidité et Efficacité** : Le déploiement prend quelques secondes de votre temps.
- **Fiabilité** : Le processus est reproductible et élimine les erreurs humaines.
- **Standard de l'Industrie** : C'est une compétence clé et une pratique utilisée par toutes les entreprises tech modernes.
- **Scalabilité** : Ce workflow fonctionnera pour toutes les futures applications, qu'elles soient simples ou complexes (avec backend, base de données, etc.).

## 4. Garder une Trace des Discussions

**Problème :** L'environnement de développement interactif est "sans état" (stateless) et ne conserve pas l'historique de nos conversations entre les sessions.

**Solutions :**
1.  **Historique de la Plateforme :** Utiliser la fonctionnalité intégrée de la plateforme pour recharger les sessions précédentes.
2.  **Ce Fichier (`notes.md`) :** Documenter manuellement les décisions importantes et la logique du projet. C'est la meilleure pratique pour la maintenance à long terme.
3.  **Messages de Commit Git :** Rédiger des messages de commit descriptifs pour créer un historique clair des changements techniques directement dans Git.
