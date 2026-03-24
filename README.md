# 🧬 Bio by JLV

Plateforme éducative interactive et immersive sur **l'ADN** et le **monde bactérien**, avec des visualisations 3D en temps réel.

![Status](https://img.shields.io/badge/status-production-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Pages](https://img.shields.io/badge/deploy-GitHub%20Pages-black)

---

## 📋 Présentation

**Bio by JLV** est un site web éducatif haut de gamme conçu pour vulgariser la biologie moléculaire. Il propose une approche interactive et visuelle de deux sujets fondamentaux :

- **L'ADN** — structure, bases azotées, réplication, mutations
- **Les bactéries** — morphologie, classification, rôles, résistance antibiotique

Le site est conçu avec un design **dark mode futuriste** inspiré des interfaces scientifiques premium (Apple, Tesla, NASA/biotech).

---

## ✨ Fonctionnalités

### Contenu éducatif
- Sections pédagogiques complètes sur l'ADN et les bactéries
- Statistiques clés et données scientifiques
- Schémas explicatifs et cartes interactives
- Tableau comparatif ADN humain vs ADN bactérien
- Section applications (médecine, biotech, IA, CRISPR)

### Module 3D — Double Hélice ADN
- Visualisation 3D interactive (Three.js)
- Rotation automatique + contrôle souris (drag, zoom)
- Paramètres ajustables :
  - Vitesse de rotation
  - Zoom
  - Nombre de paires de bases (5 à 40)
  - Intensité du glow
  - Couleurs personnalisables pour chaque base (A, T, C, G)
  - Mode animation (rotation / pulsation / onde)
- Mode plein écran
- Bouton reset

### Module 3D — Bactéries
- Visualisation 3D de bactéries (Three.js)
- Types sélectionnables : Coccus, Bacille, Spirille, Mixte
- Animation réaliste (mouvement, vibration, rotation)
- Paramètres ajustables :
  - Type de bactérie
  - Nombre (3 à 50)
  - Taille
  - Vitesse de mouvement
  - Mode (dynamique / statique / colonie)
  - Couleur personnalisable
- Mode plein écran
- Bouton reset

### Design & UX
- Dark mode futuriste
- Animations scroll (AOS)
- Particules interactives en arrière-plan (hero)
- Navigation fixe avec scroll fluide
- Effets hover premium
- Design responsive (desktop + mobile)

---

## 🚀 Installation

### Option 1 — GitHub Pages

1. Forkez ou clonez ce dépôt :
   ```bash
   git clone https://github.com/votre-username/bio-by-jlv.git
   ```

2. Allez dans **Settings > Pages** du dépôt GitHub

3. Sélectionnez la branche `main` et le dossier `/root`

4. Votre site sera accessible à `https://votre-username.github.io/bio-by-jlv/`

### Option 2 — Serveur local

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/votre-username/bio-by-jlv.git
   cd bio-by-jlv
   ```

2. Lancez un serveur local :
   ```bash
   # Python 3
   python -m http.server 8000

   # ou Node.js
   npx serve .
   ```

3. Ouvrez `http://localhost:8000` dans votre navigateur

---

## 🎮 Utilisation

- **Navigation** : utilisez le menu fixe pour accéder aux différentes sections
- **Modules 3D** : cliquez et faites glisser pour faire pivoter les modèles, scrollez pour zoomer
- **Paramètres** : cliquez sur "⚙️ Paramètres" pour ouvrir/fermer le panneau de contrôle
- **Plein écran** : cliquez sur "⛶ Plein écran" pour une visualisation immersive
- **Reset** : cliquez sur "↺ Reset" pour réinitialiser tous les paramètres

---

## 🎨 Personnalisation

### Couleurs (styles.css)

Les couleurs sont définies via des variables CSS dans `:root` :

```css
:root {
  --bg-deep: #020408;        /* Fond principal */
  --cyan: #00e5ff;            /* Couleur accent */
  --magenta: #ff2d78;         /* Base T */
  --amber: #ffb800;           /* Base C */
  --emerald: #00ff88;         /* Base G */
}
```

### Typographie

Le site utilise 4 familles de polices (Google Fonts) :
- **Oxanium** — titres principaux (display)
- **Syne** — sous-titres et sections
- **Outfit** — texte courant
- **JetBrains Mono** — éléments techniques

### Contenu

Tout le contenu est directement dans `index.html`. Modifiez les textes, ajoutez des sections ou adaptez le contenu à vos besoins.

---

## 🛠️ Technologies utilisées

| Technologie | Usage |
|---|---|
| **HTML5** | Structure sémantique |
| **CSS3** | Design, animations, responsive |
| **JavaScript (ES6+)** | Interactivité, logique |
| **Three.js** | Visualisations 3D WebGL |
| **AOS** | Animations au scroll |
| **Google Fonts** | Typographie |

---

## 📁 Structure des fichiers

```
bio-by-jlv/
├── index.html      # Page principale
├── styles.css      # Feuille de styles
├── script.js       # JavaScript (particules, Three.js, contrôles)
├── logo_JLV.jpg    # Logo JLV
└── README.md       # Documentation
```

---

## 🔮 Améliorations possibles

- [ ] Ajout d'un mode clair (light mode toggle)
- [ ] Quiz interactif sur l'ADN et les bactéries
- [ ] Effets sonores ambiants (activation optionnelle)
- [ ] Post-processing Three.js (bloom/glow avancé)
- [ ] Ajout de modèles 3D importés (GLTF) pour les bactéries
- [ ] Internationalisation (EN/FR toggle)
- [ ] Mode accessibilité amélioré (ARIA, contraste)
- [ ] PWA (Progressive Web App) pour utilisation hors-ligne
- [ ] Simulation de division binaire animée
- [ ] Ajout d'un module CRISPR interactif

---

## 📄 Licence

Ce projet est distribué sous licence MIT. Vous êtes libre de l'utiliser, le modifier et le distribuer.

---

**Bio by JLV** — Créé avec passion pour la science et la technologie.
