# Babyfoot Tournament Manager
Application de gestion de tournois de babyfoot

## Installation

Le projet est entièrement conteneurisé avec **Docker**. L'installation ne nécessite que deux commandes

### Pré-requis
* Docker et Docker Compose

### Démarrage rapide
1. **Cloner le projet**
2. **Lancer l'application** :
   ```bash
   docker-compose up --build
   ```
3. L'application est accessible sur les ports suivants :
   * Interface Utilisateur (Nuxt 3) : http://localhost:3000
   * API REST (NestJS) : http://localhost:4000

### Stack Technique
* **Frontend** : Nuxt 3 (Vue3, TypeScript)
* **Backend** : NestJS (Node.js)
* **ORM** : Sequelize
* **Base de données** : MySQL
* **DevOps** : Docker & Docker Compose