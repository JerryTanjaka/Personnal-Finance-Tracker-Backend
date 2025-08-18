# Utiliser Node.js
FROM node:20

# Créer le dossier de travail
WORKDIR /app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le projet
COPY . .

# Exposer le port
EXPOSE 3000

# Commande par défaut
CMD ["npm", "run", "dev"]  # ou start selon ton package.json
