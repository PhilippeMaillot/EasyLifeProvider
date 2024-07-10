# Projet d'Automatisation de Création de Projets API

Ce projet est une application web locale permettant d'automatiser la création de projets API. Utilisant Node.js pour le backend et Next.js pour le frontend, il se connecte à une base de données MySQL via phpMyAdmin (grâce à XAMPP) et génère automatiquement les fichiers nécessaires pour un projet API complet.

## Fonctionnalités

1. **Création de la Base de Données** :
    - Utilise phpMyAdmin pour créer une base de données MySQL.
    
2. **Génération Automatique de Projets Node.js/Express** :
    - Génération automatique d'un projet Node.js avec Express.
    - Création d'un fichier `.env` contenant les configurations nécessaires (nom de la base de données, utilisateur, mot de passe, etc.).

3. **Génération Automatique de Routes, Contrôleurs et Modèles** :
    - Pour chaque table de la base de données, l'application génère automatiquement :
        - Un fichier de route : `[nomdelatable].js`
        - Un fichier de contrôleur : `[nomdelatable]Controller.js`
        - Un fichier de modèle : `[nomdelatable]Model.js`
    - Les routes principales (GET, POST, PUT, DELETE) sont créées pour chaque table.

## Prérequis

- **XAMPP** : Pour gérer votre serveur Apache et MySQL.
- **Node.js** : Pour le backend.
- **Next.js** : Pour le frontend.
- **npm** : Pour la gestion des packages Node.js.

## Installation

1. **Cloner le Repository** :
    ```bash
    git clone https://github.com/PhilippeMaillot/EasyLifeProvider.git
    cd EasyLifeProvider/elp-back
    ```

2. **Installer les Dépendances** :
    ```bash
    npm install
    ```

3. **Configurer le Fichier `.env`** :
    - Créez un fichier `.env` à la racine du projet et ajoutez-y les configurations nécessaires :
    ```
    DB_HOST=localhost
    DB_PORT=3306
    DB_USER=root
    DB_PASSWORD=
    ```

4. **Lancer l'Application (API)** :
    ```bash
    nodemon
    ```
    ou
     ```bash
    npm run dev
    ```

## Utilisation

1. **Accéder à l'Interface Web** :
    - cd EasyLifeProvider/elp-front
    ```bash
    npm run dev
    ```
    - Ouvrez votre navigateur et accédez à `http://localhost:3000`.

2. **Récuperer une base de donnée** :
    - Récuprez la base de donnée avec laquelle vous voulez travailler.
    - Utilisez l'interface pour créer une nouvelle base de données (à venir).

3. **Générer le Projet API** :
    - Sélectionnez la base de données créée/séléctionnée et cliquez sur "Générer le projet API".
    - L'application va automatiquement créer la structure du projet Node.js/Express et générer les fichiers nécessaires pour chaque table.

## Structure du Projet Généré

```
/votre-projet-api
|-- .env
|-- package.json
|-- server.js
|-- /routes
|   |-- [nomdelatable].js
|-- /controllers
|   |-- [nomdelatable]Controller.js
|-- /models
|   |-- [nomdelatable]Model.js
```

## Conseils pour Développement

- **Modularité** : Utilisez des modules pour structurer votre code de manière propre et réutilisable.
- **Sécurité** : Assurez-vous de gérer correctement les informations sensibles dans le fichier `.env` et utilisez des pratiques sécuritaires pour les opérations de base de données.
- **Testing** : Implémentez des tests unitaires pour vos routes, contrôleurs et modèles afin de garantir la fiabilité de votre application.
- **Documentation** : Commentez votre code et maintenez une documentation à jour pour faciliter la maintenance et l'évolution du projet.

## Contribution

Les contributions sont les bienvenues ! Si vous avez des suggestions, des idées d'amélioration ou des bugs à signaler, veuillez créer une issue ou soumettre une pull request.

---
