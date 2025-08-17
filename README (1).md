# 📌 Postgres Manipulation Sequelize

Un projet backend Node.js + Express + Sequelize avec PostgreSQL, exécuté dans des conteneurs Docker.

---

## 🚀 Installation & Lancement

### 1. Cloner le projet
```bash
git clone https://github.com/ton-compte/ton-projet.git
cd ton-projet
```

---

### 2. Vérifier les fichiers
Le projet doit contenir :
- `docker-compose.yml`
- `Dockerfile`
- `package.json`
- Le dossier `src/` avec le code backend (routes, models, server.js)

---

### 3. Construire et lancer les conteneurs
```bash
docker-compose up --build
```

👉 Cela va :
- Lancer PostgreSQL (port **5433** exposé sur l’hôte)
- Lancer le backend Express (port **3000** exposé sur l’hôte)

---

### 4. Vérifier que les conteneurs tournent
Dans un autre terminal :
```bash
docker ps
```

Tu devrais voir :
- `postgress_manipulation_sequelize-db-1`
- `postgress_manipulation_sequelize-backend-1`

---

### 5. Tester le backend
Ouvre ton navigateur ou fais un `curl` :
```bash
curl http://localhost:3000/expenses
```

👉 Réponse attendue :
```
Expense route works!
```

---

### 6. Tester la base de données PostgreSQL
Connexion en local :
```bash
psql -h localhost -p 5433 -U postgres -d sequelizedb
```

Mot de passe :  
```
king aff
```

Lister les tables :
```sql
\dt
```

---

## 🛠️ Commandes utiles

🔄 Rebuild des conteneurs :
```bash
docker-compose up --build
```

📜 Suivre les logs :
```bash
docker-compose logs -f backend
```

🛑 Arrêter les conteneurs :
```bash
docker-compose down
```
