# Phase 01 · Direction artistique · plan

> Statut : proposé, en attente de la validation de Kerem. Rien n'est exécuté avant son accord.
> Date : 07/11/2026 · Prompt : `prompts/01-direction-artistique.md`
> Plan établi avec l'agent planner, puis fusionné avec mes notes de lecture des skills.

## 1. Ce que je comprends

- **Lecture du brief** : une page de référence autonome qui fixe tout le système visuel du portfolio (couleurs, typographie, grille, composants, mouvement, lumière de la scène) et son storyboard, pour que tu valides le niveau avant la moindre 3D. Les quatre fichiers de `design/` deviennent la source unique que la phase 04 branchera dans l'application.
- **Idée directrice** : la fenêtre allumée de la cabane est la règle de couleur de tout le site. L'ambre n'apparaît que là où quelque chose éclaire : une lumière, un chiffre clé, l'action principale, l'élément actif.
- **Mode de la page** : une page qu'on lit pour comprendre (structure d'abord), au service d'un site qu'on vit comme une expérience.

## 2. Déjà fait pendant la préparation

Aucun fichier de design n'a été produit.

- Prompt enregistré mot pour mot dans `prompts/01-direction-artistique.md`.
- 44 skills lus : les 28 demandés et 16 trouvés par mots-clés. Chaque SKILL.md en entier, ses références quand il y renvoie pour une tâche de cette phase. Les autres références seront lues au moment de la tâche concernée.
- Vérifié :
  - chiffres du README NASA : 2004 Spirit 8, 2009 Hubble 12, 2015 Pluton 20, 2020 Hubble 12, 2022 Webb 10, 2025 Webb 11, conformes au prompt ;
  - licences : General Sans sous « ITF Free Font License » (Fontshare), Geist et Geist Mono sous SIL Open Font License 1.1 ;
  - contrastes : snow/night 16,35:1 · snow/night-2 15,28:1 · mist/night 6,97:1 · mist/night-2 6,51:1 · amber/night 9,20:1 · amber/night-2 8,60:1 · night/amber 9,20:1 ;
  - gris des barres du graphique : #66686C donne 3,43:1 sur night et passe le script du skill dataviz (#5C5E62 échoue à 2,95:1) ;
  - icônes : Lucide 1.70.0 n'a plus GitHub ni LinkedIn, Lucide 0.460.0 les a (licence ISC) ; Simple Icons a les logos de la stack, mais ni LinkedIn, ni Excel, ni Power BI ;
  - paquets npm actuels : playwright 1.65.0, pngjs 7.0.0, vitest 5.1.0, geist 1.9.2 ; un Chromium pour Playwright est déjà installé sur ton PC ;
  - `.claude/` contient 22 scripts CommonJS copiés de Lelon : le `package.json` du projet ne déclarera pas `"type": "module"`.

## 3. Principe d'organisation

- Une page autonome, assemblée par un script à partir de sources rangées par section.
- Trois fichiers font foi : `tokens.css`, `motion.json`, `ambiance.json`. La page lit et affiche leurs valeurs ; rien n'est recopié à la main, la page ne peut donc pas s'écarter de ses sources.
- Les outils de contrôle (captures, part d'ambre, parcours au clavier) sont prêts avant les sections : chaque section est vérifiée dès qu'elle existe.
- Ordre : outillage → fonctions pures testées → sources de vérité → squelette → outils de contrôle → sections → boucle de 5 tours au plus → livraison.

## 4. Étapes, dans l'ordre

**1. Outillage.**
- Fichiers : `package.json` (privé, versions exactes : playwright 1.65.0, pngjs 7.0.0, vitest 5.1.0, et `@axe-core/playwright` en option retirable), `package-lock.json`, `vitest.config.mjs`, `.gitignore` (ajout de `.cache/`).
- Pas de `"type": "module"` : nos fichiers sont en `.mjs`, les scripts CommonJS de `.claude/` continuent de marcher.
- Vitest ne lit que `design/**/*.test.mjs` et `scripts/**/*.test.mjs` ; `.claude/` est exclu.
- Vérifier que Playwright 1.65 attend le Chromium déjà installé ; sinon `npx playwright install chromium` (le navigateur s'installe hors OneDrive).
- Dépend de la question 1.
- *Fin quand* : `npm test` passe sans parcourir `.claude/`, et une capture d'essai sort.

**2. Fonctions pures, tests écrits d'abord** (`design/src/lib/`, chaque module avec son `*.test.mjs`).
- `couleur` (hex, transparence, OKLab et OKLCH, saturation HSL), `contraste` (WCAG, verdict sur la valeur non arrondie), `ambre` (classement d'un pixel), `bezier` (courbe cubic-bezier), `brouillard` (formule FogExp2, visibilité à 95 %), `clamp` (valeur d'un `clamp()` à une largeur donnée), `prng` (aléa à graine), `html` (échappement), `tokens` (lecture de `tokens.css`).
- *Fin quand* : les tests passent sur des valeurs connues (snow/night 16,35 ; mist/night 6,97 ; amber/night 9,20 ; #66686C 3,43 ; #5C5E62 2,95 ; saturation de #3B4148 = 9,9 % ; visibilité à 95 % pour 0,018 ≈ 96 m ; même graine = même suite).

**3. Sources de vérité.**
- `design/tokens.css` (3 couches), `design/motion.json`, `design/ambiance.json` (état « jour », 3 candidates, `choisi: null`). Lecture de design-system (token-architecture, states-and-variants) à ce moment.
- Tests de cohérence : durées et courbes identiques entre le CSS et le JSON ; même version « mouvement réduit » sous la media query et sous `[data-mouvement="reduit"]` ; ambiance avec tous ses champs, des hex valides, une saturation ≤ 8 % et une visibilité cohérente avec la densité.
- *Fin quand* : les tests passent, et chaque valeur absente de la section D est un dérivé documenté.

**4. Fichiers tiers** (`scripts/da-vendor.mjs` → `design/src/vendor/`).
- CSS de l'API Fontshare, réécrite en `https://`.
- Icônes Lucide épinglées (flèches, copier, coché, chevron, plus, courrier, rejouer, pause), GitHub et LinkedIn repris de Lucide 0.460.0.
- Logos de la stack : Simple Icons (CC0) ; pictogrammes Lucide pour Excel, Power BI et les compétences sans logo.
- `docs/missions.png` récupéré dans ton dépôt nasa-data-pipeline avec `gh`, réduit en WebP.
- Contrôles : SVG sans script ni lien externe, signature PNG vérifiée, tailles bornées, source, licence et empreinte sha256 notées dans `sources.json`.
- *Fin quand* : une relance ne change rien, et chaque fichier a sa source et sa licence.

**5. Assemblage et squelette.**
- `scripts/da-build.mjs`, `scripts/da-serveur.mjs` (serveur local sur 127.0.0.1), `design/src/page/`, les coquilles des 13 sections. Lecture d'impeccable/craft-floor.md juste avant.
- Lien d'évitement et un seul h1. Index fixe 01–13 en Geist Mono à partir de 1024 px ; sur mobile, une barre collante « 05/13 · Typographie » et un menu natif. `aria-current` sur la section visible.
- Grain (tuile SVG, opacité 0,04, fusion overlay) et vignettage. Contenu complet sans JavaScript. Pas de `scroll-behavior: smooth`.
- Le build échoue si un gabarit reste vide, si un id est en double, si le JavaScript assemblé ne compile pas ou si un texte n'est pas échappé (« IA & Data »).
- *Fin quand* : la page s'ouvre en double-clic et par le serveur local avec les deux polices, sans erreur console ni débordement de 320 à 1920 px ; le poids du HTML s'affiche à chaque build.

**6. Outils de contrôle** (`scripts/da-captures.mjs`, `da-ambre.mjs`, `da-focus.mjs`, `scripts/lib/`).
- D'abord une sonde : une capture pleine page très haute reste-t-elle juste ? Sinon, capture par tranches de 4 000 px assemblées.
- Mode `?capture=1` : états finaux, boucles arrêtées, neige figée, curseur coupé.
- Étalonnage de la mesure d'ambre (section 7).
- *Fin quand* : sur le squelette, `brut/tour-00` contient les captures à 1440 et 390 px, le rapport d'ambre et le rapport de focus.

**7. Fondations : sections 01 (version fixe), 04, 05, 06.**
- 01 : le titre imposé (avec son tiret), la phrase, la date, la version (v0.x pendant les tours, v1.0 à la validation).
- 04 : les 8 échantillons générés depuis `tokens.css` ; la table des contrastes (paires du prompt, plus night-3, amber-soft, le gris de donnée et les surfaces claires) avec badge AA, AAA, grand texte ou échec ; la barre de proportions avec un repère à 5 % ; l'inventaire « où l'ambre est permis ».
- 05 : le nom en display ; le pitch en h1 avec « éclaire » en ambre ; « Pollution & Météo Data Pipeline » en h2 (le titre le plus long, pour tenir sur 2 lignes) ; l'à-propos à 65 caractères par ligne au plus ; les étiquettes mono ; la table de l'échelle à 1440 et à 390 px calculée par `clamp` ; le bloc 11 246 · 2025 · 25 h · 0 → 100 avec espaces fines insécables si Geist Mono a ce caractère ; les licences des deux polices.
- 06 : maquettes à 1440 px (réduite) et à 390 px avec la grille superposée ; espacements de 4 à 128 ; rayons 6, 12 et 999 ; bordure 1 px ; coins en équerre ; un bouton « afficher la grille » sur toute la page.
- *Fin quand* : chaque valeur affichée vient d'une source et les captures ne montrent aucun écart avec la section D.

**8. Composants (section 07).** Lecture d'animate/RECIPES.md, des références de make-interfaces-feel-better et de fixing-accessibility.
- Pour chaque composant : une matrice fixe des 5 états (repos, survol, focus clavier, actif, désactivé) et un exemplaire vivant. Un état qui n'existe pas est marqué « sans objet », avec la raison.
- Contenus réels : barre du haut à 1440 et à 390 px ; rail social avec des zones de clic de 44 × 44 px ; les 4 statuts (pulsation de 2 s coupée en mouvement réduit) ; carte NASA (01, la question, « 11 246 » en ambre, les outils, le dashboard) ; accordéon « Collecter, nettoyer et préparer les données » avec « Prouvé dans : NASA · Pollution » ; indicateur de niveau ; tuile de stack ; filtres façon Power BI ; pilule de chargement sur fond neige qui devient « Entrer » ; toast « Email copié » ; curseur (pointeur précis seulement) ; bouton son ; ligne de timeline tirée de `parcours.json` ; annotation technique aux conventions du projet (ANCHOR_WINDOW, EMI_*).
- Mots alternés et texte défilant du loader : la liste complète en texte réservé aux lecteurs d'écran, la partie animée masquée pour eux.
- *Fin quand* : tous les états se voient sur les captures, et chaque contrôle se commande au clavier avec un nom accessible et l'anneau de focus.

**9. Dataviz (section 08).** Lecture des références dataviz au moment de construire.
- Barres en HTML/CSS générées à l'assemblage : 24 px de large au plus, bout arrondi de 4 px, une seule ligne de base, aucune grille, gris #66686C, Pluton 2015 en ambre, valeurs en Geist Mono et en couleur de texte.
- Le titre dit le résultat. Un tableau jumeau accompagne le graphique.
- Infobulle au survol et au focus avec le contexte du pic tiré du README.
- Jetons `--chart-*` pour tous les graphiques du site.
- *Fin quand* : le validateur dataviz passe, les valeurs sont celles du README, et aucune barre ne pousse.

**10. Matière et lumière (section 09).**
- Grain : panneau avant/après et interrupteur global. Vignettage. Profondeur de champ par plans flous fixes (0, 1, 2, 4, 8 px). Lueur ambre : le bloom ne touche que l'ambre. Aberration chromatique à sa vraie valeur (0,0012, soit environ 1,7 px à 1440 px), puis agrandie 4 fois pour la voir, étiquetée « transitions seulement ».
- *Fin quand* : le grain se coupe sans décaler la mise en page, et aucun grand flou n'est animé.

**11. Mouvement (section 10).** Lecture de design-motion-principles (create, motion-cookbook, creation-gotchas, accessibility) et de la démo d'animation-systems.
- Table des tokens générée depuis `motion.json`, avec le terme exact en mono.
- Démos a à h, chacune avec « Rejouer » et un interrupteur « mouvement réduit » qui démarre sur le réglage du système. Les démos lisent leurs valeurs dans `motion.json`.
- Le compteur suit une animation qu'on peut mettre en pause et rembobiner ; sa largeur est réservée sur la valeur finale.
- La démo h défile dans son propre cadre, sans prendre le scroll de la page. Les boucles se mettent en pause hors écran.
- Encart « ce qu'on n'anime pas » : navigation, focus, valeurs qu'on lit.
- *Fin quand* : review-animations rend « Approve » ; une planche de 5 instants par démo et une vidéo existent ; les versions réduites sont vérifiées.

**12. Kit SVG et ambiances (section 11).**
- D'abord la cabane au grand format (forme selon la question 2), réutilisée ensuite partout.
- Scène : ciel en dégradé ; 4 plans de crêtes à distance connue, dont la couleur mélange l'éclairage et le brouillard selon la formule FogExp2 ; bandes de brume ; fenêtre émissive et son halo ; neige à graine, en pause hors écran.
- Sous chaque ambiance : les valeurs dont la phase 05 aura besoin, et le contraste mesuré de la micro-interface posée dessus. L'état « jour » commun s'affiche en tête.
- *Fin quand* : les 4 PNG en 1200 × 675 sont dans `making-of/phase-01/ambiances/`, les valeurs affichées sont celles d'`ambiance.json`, et ma recommandation tient en 3 lignes.

**13. Principes (02), références (03), storyboard (12), moment de l'en-tête (01).**
- 6 règles « À faire » et 6 « À ne pas faire », chacune avec sa mini-illustration.
- 19 vignettes A1 à A10 et B1 à B9 : je dessine notre version, jamais l'igloo ni leurs objets.
- 16 vignettes de storyboard avec le chapitre, la plage de scroll et une phrase. L'entrée fait 600 vh sur ordinateur et 450 vh sur mobile, répartis sur 7 temps ; les autres plages sont marquées « à valider ».
- En-tête : un seul moment orchestré, joué une fois, qui ne retarde pas la lecture : des points se relient en treillis de cabane, puis la fenêtre s'allume.
- *Fin quand* : les textes sont passés à stop-slop et copy-editing, et l'ambre ne touche que les sources de lumière et les chiffres clés.

**14. Textes d'interface (section 13).** Lecture de la checklist de copy-editing et de brand-voice.
- Table fr | en générée depuis les deux `ui.json`, puis la liste des propositions : clé, texte actuel, proposition, raison.
- Déjà repéré : clé `navigation.competences` absente ; bouton « FR / EN » au lieu de « English » ; « {n} projet(s) » à passer au pluriel géré par next-intl ; apostrophes typographiques et espaces insécables ; « Background » utilisé 3 fois en anglais ; clés manquantes pour « Prouvé dans » et pour l'échec de la copie de l'email ; le crédit « Conçu et développé par » à reformuler honnêtement, puisque des agents écrivent le code sous ta direction (comme pour LELON).
- *Fin quand* : `content/` n'a pas bougé.

**15. Boucle de vérification, 5 tours au plus.** Chaque tour :
1. build et tests ;
2. captures à 1440 et 390 px, plus un passage en mouvement réduit ;
3. mesure de l'ambre, contrôle du focus, contrôle axe ;
4. comparaison avec les sections C et D et les critères du prompt ;
5. relecteurs demandés : web-design-guidelines, baseline-ui, review-animations ;
6. relecteurs d'appoint : make-interfaces-feel-better, la critique de design-taste-frontend, l'audit d'impeccable ;
7. liste des écarts, corrections.

Si les 5 tours ne suffisent pas, je te montre où j'en suis.

**16. Revue de code et sécurité.**
- Agents code-reviewer et typescript-reviewer sur le JavaScript des scripts et de la page ; les points CRITICAL et HIGH sont corrigés. L'agent e2e-runner peut relire les scripts de captures et de focus.
- Avant le commit : aucun secret, aucun fichier de police General Sans, fichiers tiers validés, `node_modules/` et `brut/` ignorés.

**17. Livraison.** Je te montre les captures finales, la part d'ambre, le tableau des skills avec ce que j'en ai appliqué, la recommandation d'ambiance en 3 lignes et les propositions de textes. Puis j'attends ta validation et ton choix d'ambiance.

**18. Après ta validation.**
- `choisi` est écrit dans `ambiance.json`, avec son origine (ambiance de base et emprunts éventuels) ; les candidates restent en archive.
- CLAUDE.md : section D (ambiance retenue et valeurs clés), tableau des phases (« validée »), bloc « Décisions validées en phase 01 ».
- Corrections de `ui.json` que tu as acceptées, appliquées en fr et en en avec les mêmes clés.
- Entrée de la phase dans `making-of/notes.md` : ce qui a été demandé, ce qui a été refait et pourquoi, les chiffres (tours, durée, poids du HTML, part d'ambre, nombre de SVG).
- Commit « phase 01 : direction artistique », qui inclut le prompt enregistré, puis push.

## 5. Fichiers

```
design/
  tokens.css · motion.json · ambiance.json      livrables, sources de vérité
  direction-artistique.html                      généré (en-tête « ne pas éditer »)
  src/
    page/      page.mjs · base.css · fonts.css · index.js · mode.js (?capture, ?export, ?mouvement)
    sections/  01-entete/ · 02-principes/ · 03-references/ · 04-palette/ · 05-typographie/ · 06-grille/
               07-composants/ · 08-dataviz/ · 09-matiere/ · 10-mouvement/ · 11-ambiances/ · 12-storyboard/ · 13-textes/
    svg/kit.mjs      crête, brume, cabane, fenêtre, réseau, treillis, avatar, bureau, micro-interface, annotation
    data/      meta · principes · references · storyboard · nasa-pics (valeurs du README, avec la source)
    lib/       couleur · contraste · ambre · bezier · brouillard · clamp · prng · html · tokens (.mjs + .test.mjs)
    vendor/    general-sans.css (adresses https, aucun fichier de police) · icons/*.svg · nasa-missions.webp · sources.json
scripts/       da-vendor · da-build · da-serveur · da-captures · da-ambre · da-focus (.mjs) · lib/navigateur.mjs · lib/png.mjs
package.json · package-lock.json · vitest.config.mjs
making-of/phase-01/  plan.md · avant/ · intermediaire/ · apres/ · ambiances/ · mouvement/ · rapports/ · brut/ (ignoré)
```

- Chaque fichier fait moins de 800 lignes, chaque fonction moins de 50, avec des commentaires en français aux endroits clés.
- Pas de `console.log` : les scripts écrivent par une petite fonction `journal()`.
- Tests ciblés, sans objectif de 80 % (règle G8 de CLAUDE.md).
- Après validation : `CLAUDE.md`, `making-of/notes.md` et, si tu acceptes des corrections, les deux `ui.json`.

## 6. Schémas des trois fichiers de design (extraits)

**tokens.css** : trois couches dans un seul fichier commenté. Les noms de la section D restent les primitives ; les noms de jetons n'ont pas d'accent.

```css
/* Couche 1 · primitives : valeurs brutes, noms de la section D */
:root{
 --night:#0E0F11; --night-2:#16171A; --night-3:#1E2024; --line:rgba(237,237,234,.10);
 --mist:#9A9C9F; --snow:#EDEDEA; --amber:#F2A33A; --amber-soft:rgba(242,163,58,.15);
 --gris-donnee:#66686C; --mist-25:rgba(154,156,159,.25); --line-fort:rgba(237,237,234,.24); /* dérivés */
 --font-sans:"General Sans",system-ui,sans-serif; --font-mono:"Geist Mono",ui-monospace,monospace;
 --fs-display:clamp(56px,7vw,120px); --lh-display:.95; --ls-display:-.03em;
 --fs-h1:clamp(40px,4.4vw,72px); --ls-h1:-.02em; --fs-h2:clamp(28px,3vw,44px);
 --fs-h3:clamp(20px,18.5px + .38vw,24px); --fs-texte:clamp(16px,15.3px + .19vw,18px); --lh-texte:1.6;
 --lh-h1:1; --lh-h2:1.1; --lh-h3:1.25; /* proposés : la DA ne les fixe pas */
 --fs-petit:14px; --fs-etiquette:12px; --fs-etiquette-sm:11px; --ls-etiquette:.08em; --ls-etiquette-large:.24em; --mesure:65ch;
 --space-4:4px; /* … 8 12 16 24 32 48 64 96 … */ --space-128:128px;
 --radius-sm:6px; --radius-tuile:12px; --radius-pilule:999px; --trait:1px; --equerre:12px;
 --lueur-ambre:0 0 12px rgba(242,163,58,.45);
 --z-scene:0; --z-contenu:10; --z-rail:20; --z-barre:30; --z-menu:40; --z-toast:50; --z-curseur:60; --z-grain:70; --z-evitement:80;
 --ease-out-expo:cubic-bezier(.16,1,.3,1); --ease-in-out:cubic-bezier(.65,0,.35,1);
 --dur-micro:200ms; --dur-interface:450ms; --dur-apparition:900ms; --ecart-mots:35ms; --montee:16px;
 --colonnes:12; --gouttiere:24px; --marge:24px; --barre:64px;
}
@media (min-width:768px){:root{--marge:clamp(32px,4vw,80px)}}
/* Couche 2 · sémantique : les rôles, nommés --color-* pour Tailwind v4 en phase 04 */
:root{
 --color-bg:var(--night); --color-surface:var(--night-2); --color-surface-hover:var(--night-3);
 --color-border:var(--line); --color-text:var(--snow); --color-text-muted:var(--mist);
 --color-accent:var(--amber); --color-accent-bg:var(--amber-soft); --color-on-accent:var(--night);
 --color-data:var(--gris-donnee); --color-data-accent:var(--amber); --color-track:var(--mist-25);
 --focus-color:var(--amber); --focus-width:2px; --focus-offset:3px;
}
[data-surface="clair"]{--color-bg:var(--snow);--color-text:var(--night);--color-text-muted:var(--night)}
@media (prefers-contrast:more){:root{--color-border:var(--line-fort)}}
@media (prefers-reduced-motion:reduce){:root{/* distances à 0, écarts à 0, fondus raccourcis */}}
[data-mouvement="reduit"]{/* mêmes valeurs, égalité vérifiée par un test */}
/* Couche 3 · composants : ne lisent que la couche 2, jamais un hex */
:root{
 --bouton-fond:var(--color-accent); --bouton-texte:var(--color-on-accent); --bouton-marge:12px 20px; --bouton-fleche:4px;
 --bouton2-contour:var(--color-border); --bouton2-contour-survol:var(--color-accent); --lien-duree:var(--dur-interface);
 --carte-montee:4px; --carte-contour-survol:var(--color-accent);
 --niveau-l:14px; --niveau-h:4px; --niveau-ecart:3px; --niveau-plein:var(--color-accent); --niveau-vide:var(--color-track);
 --tuile:72px; --tuile-logo:28px; --filtre-actif-fond:var(--color-accent-bg); --filtre-barre:var(--color-data); --filtre-barre-active:var(--color-accent);
 --curseur-point:10px; --curseur-anneau:36px; --statut-pulse:2s; --chart-barre-max:24px; --chart-rayon:4px; --chart-base:1px;
}
```

**motion.json** : chaque courbe avec ses équivalents CSS, Motion et GSAP ; chaque animation avec son terme exact, sa fréquence, sa raison quand elle dépasse 300 ms et sa version réduite.

```json
{ "version": "0.1.0", "unites": { "duree": "ms", "distance": "px" },
  "courbes": {
    "outExpo":  { "css": "cubic-bezier(0.16, 1, 0.3, 1)", "motion": [0.16, 1, 0.3, 1], "gsap": "expo.out",
                  "gsapExact": "CustomEase 0.16,1,0.3,1 (à vérifier en phase 04)", "usage": "entrées, révélations, retours d'interaction" },
    "inOut":    { "css": "cubic-bezier(0.65, 0, 0.35, 1)", "motion": [0.65, 0, 0.35, 1], "gsap": "power2.inOut", "usage": "déplacements, accordéon, transitions" },
    "lineaire": { "css": "linear", "motion": "linear", "gsap": "none", "usage": "scroll piloté, boucles" } },
  "durees": { "micro": 200, "interface": 450, "apparition": 900 },
  "ecarts": { "mots": 35, "lignes": 90, "cartes": 70 },
  "distances": { "montee": 16, "survolCarte": 4, "fleche": 4, "flouSection": 8 },
  "animations": {
    "texteMotParMot": { "terme": "Stagger (word reveal)", "frequence": "rare", "declencheur": { "visible": 0.2, "uneFois": true },
      "de": { "opacity": 0, "y": 16 }, "vers": { "opacity": 1, "y": 0 }, "duree": "apparition", "courbe": "outExpo", "ecart": "mots",
      "raison": "plus de 300 ms : lecture lente voulue, textes courts seulement (décalage total < 500 ms)",
      "reduit": { "de": { "opacity": 0 }, "vers": { "opacity": 1 }, "duree": 300, "ecart": 0 } },
    "survolCarte": { "terme": "Hover lift", "frequence": "frequente", "condition": "(hover: hover) and (pointer: fine)",
      "pistes": [ { "propriete": "transform", "duree": "micro" }, { "propriete": "border-color", "duree": "micro" },
                  { "propriete": "opacity du calque couleur", "duree": "interface" } ], "courbe": "outExpo",
      "reduit": { "transform": null, "border-color": 200, "opacity": 200 } },
    "compteur": { "terme": "Number ticker", "de": 0, "vers": 11246, "duree": 1200, "courbe": "outExpo",
      "format": "fr-FR, largeur réservée", "reduit": { "duree": 0 } } },
  "scroll": { "moteur": "Lenis + ScrollTrigger (phase 04)", "reduit": "scroll natif, caméra non pilotée, intro en image fixe" } }
```

Les autres entrées suivent la même forme : titreMasque, accordeon, transitionSection, motsAlternes (masque de 600 ms toutes les 2 800 ms), pointTimeline, flecheBouton, soulignementLien, toast (entrée 450 ms, sortie 200 ms), iconeCopie, curseur, pulseStatut, egaliseurSon, defilementLoader, piluleChargement, barreFiltre. Les propriétés animées sont `transform` et `opacity`, avec trois exceptions nommées : le `clip-path` du masque, le flou de la transition de section, le `grid-template-rows` de l'accordéon.

**ambiance.json** : l'état « jour » et les trois candidates ont exactement la même structure.

```json
{ "version": "0.1.0",
  "conventions": { "couleurs": "hex sRGB", "distances": "m, 1 unité three.js = 1 m (à confirmer en phase 03)",
    "brouillard": "FogExp2 : 1 − exp(−(densité × distance)²) ; visibilite95 = 1,7308 / densité",
    "saturationMax": "8 % HSL pour les gris 3D", "noms": "génériques ; correspondance avec three.js et @react-three/postprocessing vérifiée en phase 05" },
  "plans": [ { "nom": "premier plan", "distance": 15 }, { "nom": "crête", "distance": 45 }, { "nom": "massif", "distance": 90 }, { "nom": "lointain", "distance": 160 } ],
  "jour": {
    "ciel": { "haut": "#…", "horizon": "#…" }, "brouillard": { "couleur": "#…", "densite": 0.035, "visibilite95": 49 },
    "bandesBrume": [], "neige": { "albedo": "#…" }, "roche": { "albedo": "#…" },
    "lumieres": { "ambiante": 1.0, "hemisphere": { "ciel": "#…", "sol": "#…", "intensite": 0.8 }, "directionnelle": { "couleur": "#…", "intensite": 1.2 } },
    "fenetre": { "emissif": "#F2A33A", "intensiteEmissive": 0, "lumiere": 0 }, "exposition": 1.0,
    "post": { "bloom": { "intensite": 0, "seuil": 1.0, "rayon": 0.6 }, "grain": 0.04, "vignette": { "decalage": 0.3, "obscurite": 0.25 },
              "profondeurDeChamp": { "miseAuPoint": 0, "flou": 0 }, "aberration": 0 },
    "interface": { "texte": "night", "contrasteMin": null } },
  "candidates": { "brume-claire": {}, "heure-bleue": {}, "nuit-tombee": {} },
  "choisi": null }
```

Les valeurs en « # » sont placées puis affinées à l'étape 12. Après ta validation, `choisi` prend la forme `{ "origine": { "base": "heure-bleue", "emprunts": { … } }, "valeurs": { … } }`.

## 7. Vérification

**Part d'ambre**
- Mesurée sur des captures sans perte, à une densité de 1 pixel par pixel CSS, jamais sur les JPEG d'archive.
- Deux comptes : les pixels « ambre » (proches de #F2A33A, distance OKLab ≤ 0,10) et les pixels « teinte ambre » (halos, fonds --amber-soft, bords lissés : teinte OKLCH 70° ± 15°, chroma ≥ 0,02). L'objectif de 5 % s'applique à la somme des deux, la mesure la plus sévère.
- La section 04 (palette) est retirée du calcul : sa position est lue dans la page au moment de la capture.
- Sorties : le pourcentage global hors palette pour chaque capture, le maximum sur une fenêtre de la hauteur d'un écran (la DA parle « d'un écran »), le pourcentage par section, en JSON dans `making-of/phase-01/rapports/`.
- Étalonnage d'abord : une page de test avec un aplat de 3,00 % d'ambre, un texte ambre, un halo et le grain ; on attend 3,00 ± 0,10 % sur l'aplat seul, puis les seuils sont figés.

**Contrastes**
- Paires de tokens calculées à l'assemblage et testées ; contrôle axe sur la page si tu gardes cet outil.
- Texte posé sur une ambiance : la zone est capturée sans le texte, et on exige 4,5:1 contre le fond le plus clair (95e centile).
- Deux contrastes non textuels faibles, assumés et compensés : le contour --line du bouton secondaire (1,25:1, son texte suffit à l'identifier) et les segments vides du niveau (1,50:1, le niveau est aussi écrit). Les deux sont renforcés en `prefers-contrast: more`.

**Focus clavier** (`da-focus.mjs`, à 1440 et à 390 px)
1. La liste des éléments focalisables, dans l'ordre de la page.
2. Tabulation jusqu'au bout puis quelques retours : même suite, aucun piège, ordre visuel respecté.
3. Pour chaque élément : contour plein de 2 px, couleur ambre, décalé de 3 px.
4. Jamais masqué ni rogné par un parent.
5. Contraste de l'anneau ≥ 3:1 face aux pixels voisins, mesuré sur la capture.
6. Actions au clavier : l'accordéon s'ouvre, les filtres changent d'état, la copie de l'email est annoncée, le bouton son change de libellé, les boutons « Rejouer » et les interrupteurs répondent, le lien d'évitement mène au contenu.
7. Une planche réunit toutes les captures de focus.

**Captures**
- Par tour : pleine page à 1440 et 390 px, une capture par section, les vues 1440 × 900 et 390 × 844, la planche de focus, 5 instants par démo de mouvement, une vidéo de la section 10, les rapports JSON.
- La pleine page d'archive est en JPEG qualité 85 (le grain empêche le PNG de se compresser). Toutes les mesures se font sur des données sans perte.
- Je relis les captures section par section : une pleine page réduite est illisible.
- Commités : `avant/` (tour 1), `intermediaire/` (un tour choisi), `apres/`, `ambiances/`, `mouvement/`, `rapports/`. Le reste va dans `brut/`, ignoré par git.

**Critères de réussite**
- Ambre ≤ 5 % par capture, hors palette ; le maximum par écran est publié, et tout dépassement est corrigé ou expliqué (par exemple une matrice d'états).
- Texte ≥ 4,5:1 partout ; ≥ 3:1 pour le grand texte et les éléments non textuels essentiels.
- 100 % des contrôles atteints au clavier, dans l'ordre visuel, avec un anneau visible, non rogné et ≥ 3:1.
- Aucune erreur console, aucune police manquante, aucun débordement horizontal.
- review-animations rend « Approve ». Les tests de cohérence passent.

## 8. Décisions prises par défaut

Tu peux contester chacune en validant le plan.

1. **Index 01 à 13** : le prompt annonce « 01 à 12 » mais décrit 13 sections.
2. **Grille à 390 px** : avec 24 px de gouttière, les 12 colonnes font 6,5 px. Je les montre telles quelles et j'écris la règle mobile : un bloc couvre 3, 6, 9 ou 12 colonnes, soit 4 colonnes utiles de 67,5 px. La section D ne change pas.
3. **Mist reste tel quel** : 6,97:1 sur night, AA mais juste sous AAA (7:1). La DA demande AA.
4. **Saturation ≤ 8 % mesurée en HSL** : trois points de départ du prompt dépassent (#3B4148 9,9 %, #3E434A 8,8 %, #15181C 14,3 %). Je les neutralise légèrement ; un test bloque toute valeur 3D au-delà.
5. **Densités de brouillard associées aux descriptions** : Brume claire 0,024 (brume dense), Heure bleue 0,018, Nuit tombée 0,012 avec des bandes basses. L'exemple du prompt les donnait dans l'ordre inverse de la densité décrite.
6. **Ambiances calculées comme la future scène** : la formule du brouillard de three.js et des distances en mètres. La « visibilité à 95 % » est notée pour recalculer la densité si l'échelle change en phase 03.
7. **Surfaces claires** (loader sur fond neige) : texte en --night seulement, car mist sur snow ne donne que 2,35:1.
8. **Graphique NASA** : barres #66686C, Pluton 2015 en ambre, colonnes de 24 px au plus, valeurs en couleur de texte (la barre porte l'ambre, pas le chiffre), pas d'axe Y puisque toutes les valeurs sont écrites, pas de barres qui poussent.
9. **Carte projet** : le vrai `docs/missions.png`, que CLAUDE.md désigne comme visuel du projet NASA, récupéré dans ton dépôt. Le passage du gris à la couleur se fait par un fondu entre deux calques, pas par un filtre animé.
10. **Survol des cartes** : montée de 4 px et contour ambre en 0,2 s (le retour doit être immédiat), visuel en couleur en 0,45 s.
11. **Filtres** : compteurs calculés sur les 8 projets publiés (Tous 8 · Data 5 · IA 3 · Dev web 4). Énergie reste à part, ce qui colle au chiffre clé « 8 projets ».
12. **Barre du haut** : libellés tirés de `chapitres.*` (la clé de navigation des compétences manque), mis en capitales par le CSS ; le bouton son change de libellé ; l'email de la barre se copie avec une annonce, celui du rail ouvre la messagerie. Sur mobile : KU · FR/EN · son · menu ; le rail social apparaît à partir de 1024 px.
13. **Mot alterné** : « GÉNÉRATIVE » en display de 56 px déborde à 320 px ; une taille de secours est prévue et mesurée à l'assemblage.
14. **Un seul h1** : les spécimens typographiques sont des paragraphes stylés.
15. **Icônes** : une seule famille au trait de 1,5 px pour l'interface (Lucide, licence ISC), y compris GitHub et LinkedIn ; logos de technologies en monochrome dans les tuiles (Simple Icons, CC0) ; pictogrammes Lucide pour Excel et Power BI. Les tracés sont copiés une fois avec leur origine.
16. **Polices** : General Sans par l'API officielle de Fontshare, en `https://` pour que la page marche aussi en double-clic ; Geist Mono depuis le paquet npm officiel `geist@1.9.2`. Aucun fichier de police dans le dépôt.
17. **Un seul fichier livré, de petits fichiers écrits** : script d'assemblage dans `scripts/`, sources de moins de 800 lignes, chaque partie explicable en entretien.
18. **Illustrations à graine fixe** : la même image à chaque rendu, donc des captures et une mesure d'ambre reproductibles ; le SVG est écrit dans la page et s'affiche sans JavaScript.
19. **Pas de `"type": "module"`** dans `package.json`, pour ne pas casser les scripts CommonJS de `.claude/`.
20. **Sobriété** : pas d'effet verre, des dégradés seulement pour le ciel et le vignettage, une lueur seulement pour l'ambre, aucun rebond.

## 9. Skills : une ligne par skill, ce que j'en applique

Règle de conflit : CLAUDE.md (DA, pile, contenu) passe avant tout skill. Quand un skill interdit ce que la DA impose (étiquettes mono, numéros, filets fins, lueur ambre), je garde la DA et j'applique l'esprit du skill : chacun de ces éléments doit porter une information, jamais décorer.

### Skills demandés par le prompt (28)

| Skill | Ce que j'en applique |
|---|---|
| design-taste-frontend | Substance avant ornement : un très grand display et du petit texte, titres en 2 lignes max à toutes les largeurs, marges égales, aucun vide de plus d'un demi-écran, un titre par section ; boucle captures et critique. |
| ui-ux-pro-max | Ordre de priorité accessibilité > tactile > performance ; cibles de 44 × 44 px, aucun défilement horizontal à 390 px, jamais d'information portée par la couleur seule ; quelques requêtes `search.py` en contre-vérification. |
| design-system | `tokens.css` en 3 couches (primitives de la DA → rôles → composants) ; tableau d'états par composant ; aucun hex brut dans les composants. |
| design | Routeur : je n'en garde que design-system et ui-styling. Logo, identité, bannières, slides : non applicables (le monogramme KU est typographique). |
| ui-styling | Motifs accessibles (accordéon = bouton + `aria-expanded` + `aria-controls`) ; shadcn et Tailwind arrivent en phase 04. |
| frontend-design | Le brief prime sur sa liste de « tics » ; l'audace à un seul endroit (la lumière ambre) ; plancher qualité : responsive, focus visible, mouvement réduit. |
| impeccable | Page « à lire », site « à vivre » ; `craft-floor.md` lu juste avant l'interface ; critique, audit et polish en relecture. Son lanceur télécharge un binaire : je ne l'exécute pas, je lis ses références. |
| emil-design-eng | Avant chaque animation : faut-il animer, dans quel but, avec quelle courbe ; appui en scale(0.96) ; jamais scale(0) ; transitions interruptibles ; survol réservé aux pointeurs précis ; revues en tableau Avant / Après / Pourquoi. |
| apple-design | Aucun rebond ; retour dès l'appui ; le toast repart par où il est venu ; interlettrage selon la taille ; `prefers-contrast: more` géré. |
| modern-web-design | Curseur personnalisé en `requestAnimationFrame` et `transform`, coupé au tactile et en mouvement réduit ; tout le contenu visible sans JavaScript ; aucun détournement du scroll. |
| build-awwwards-quality-sites | Direction écrite avant le code ; premier état fixe complet ; texte découpé mot par mot sans casser sa lecture par un lecteur d'écran ; état final immédiat en mouvement réduit. |
| make-interfaces-feel-better | Rayons concentriques, alignement optique des flèches, `tabular-nums`, `text-wrap: balance / pretty`, zones de clic de 44 px, icônes 1,5 px en `currentColor`, passage « copier → coché » en fondu ; gris → couleur par fondu de calques. |
| baseline-ui | Relecteur : échelle de z-index fixe, `transform` et `opacity` pour les animations courantes, retour de survol ≤ 200 ms, boucles en pause hors écran, `safe-area` pour l'index et la barre fixes. |
| web-design-guidelines | Relecteur : règles récupérées en ligne au moment de la revue, utilisées comme liste de contrôle, résultats au format fichier:ligne. |
| design-motion-principles | Mode Create pour les 8 démos, puis mode Audit ; pondération « portfolio créatif » : finition d'abord, sobriété sur ce qui revient souvent. |
| animation-systems | Buts du mouvement et chorégraphie (l'élément principal d'abord) ; fondu + montée comme entrée de base ; déclenchement unique à 20 % de visibilité ; `motion.json` rangé en durées, courbes, distances, décalages. |
| animation-vocabulary | Chaque démo porte son terme exact en étiquette : Stagger, Mask reveal, Number ticker, Hover lift, Accordion, Blur fade, Text rotate, Scroll-driven. |
| animate | Porte de fréquence et but nommé avant chaque animation ; l'outil le moins cher (CSS, puis Web Animations API) ; uniquement les deux courbes de la DA ; mouvement réduit livré avec chaque démo ; RECIPES.md pour l'accordéon, le toast et le bouton. |
| motion-design | Personnalité « Premium » (aucun dépassement) ; une courbe signature, 3 durées (0,2 / 0,45 / 0,9 s), un seul motif d'entrée ; décalage total ≤ 500 ms, donc le mot par mot reste réservé aux textes courts. |
| staggered-word-reveal | Démo (a) : mots en fondu + montée, 35 ms d'écart, une seule fois ; texte visible sans JS ; phrase complète en texte réservé aux lecteurs d'écran. |
| masked-reveal | Démo (b) : les mots montent derrière un masque (110 % → 0), 0,8 s, ease-out-expo, une seule fois ; la version GSAP attend la phase 04. |
| canvas-design | Une courte « philosophie visuelle » nommée en tête de page ; les ambiances traitées comme des tableaux : palette restreinte, rien ne déborde, on affine au lieu d'ajouter. |
| theme-factory (lecture) | Aucun thème appliqué, la DA est fixée ; retenu : un thème s'applique partout et se vérifie au contraste. |
| dataviz | Forme → couleur → validation de la palette en mode sombre → barres à bout arrondi de 4 px, 24 px au plus → infobulle au survol et au focus → tableau de données accessible. La barre porte l'ambre, la valeur reste en couleur de texte. Jetons `--chart-*` pour tout le site. |
| copywriting | Textes tirés de `content/` ; mes légendes passent trois questions (on visualise ? vérifiable ? un autre portfolio pourrait-il l'écrire ?) ; rien d'inventé. |
| copy-editing | Section 13 en retouche ponctuelle : seulement les lignes à changer, chacune avec sa raison ; tu tranches. |
| stop-slop | Sur toutes mes légendes : pas de tiret cadratin (ton titre imposé garde le sien), pas d'adverbe inutile, voix active, pas de « pas X, mais Y » ; score visé ≥ 35/50. |
| review-animations | Relecteur des démos avant de te les montrer : tableau Avant / Après / Pourquoi et verdict ; les durées de la DA au-delà de 300 ms sont justifiées (éléments rares, personnalité lente et amortie). |

### Skills ajoutés après recherche par mots-clés (16)

| Skill | Ce que j'en applique |
|---|---|
| site-3d-immersif (skill du compte) | « Bible du monde » dans la section 11 (palette, rôles des lumières, matières, grammaire de caméra) ; l'ambre traité comme une lumière pour sortir du cliché « fond quasi noir + un accent ». |
| animation-performance | Flou animé ≤ 8 px, aucun `transform` piloté par une variable CSS héritée, `will-change` seulement en cas de saut d'un pixel. |
| find-animation-opportunities | Un encart « ce qui ne bouge pas » : navigation, chiffres du graphique, actions au clavier. |
| fixing-accessibility | Noms accessibles, éléments natifs, annonce de « Email copié », `aria-expanded` sur l'accordéon, état désactivé jamais signalé par la couleur seule. |
| brand | La page DA construite comme un guide de style : identité, voix, couleur, typo, composants, liste de cohérence. |
| brand-voice | Profil de voix tiré de tes propres textes (« je », phrases courtes, chiffres précis) pour juger `ui.json` ; profil gardé hors du dépôt. |
| progressive-blur | Profondeur de champ simulée par paliers de flou sur des plans, sans `backdrop-filter` (trop coûteux). |
| horizontal-scroll-scenes | Storyboard de la rangée Projets (temps de pause, temps de passage, pas de scroll-snap) ; pas de `scroll-behavior: smooth` (il fausse les captures). |
| scroll-scrubbed-visual-sequence | Démo (h) : progression dérivée du scroll natif de son cadre ; plages du storyboard exprimées en vh. |
| cinematic-gsap-lenis-motion-system | `motion.json` donne l'équivalent GSAP de chaque courbe et les réglages Lenis / ScrollTrigger prévus pour la phase 04. |
| build-threejs-scroll-worlds | Un monde persistant ; `ambiance.json` = états de départ et d'arrivée à interpoler (jour → heure bleue) ; émissif, vraie lumière et seuil de bloom accordés entre eux. |
| scroll-world-storytelling | Légendes du storyboard au format « chapitre · plage · ce qui bouge » ; trois études d'ambiance qui changent le fond, la matière et la lumière. |
| threejs-fundamentals | La formule du brouillard exponentiel reproduite à l'identique dans les illustrations ; couleurs en hex sRGB, tone mapping et exposition dans `ambiance.json`. |
| threejs-lighting | Unités justes : hémisphère et directionnelle = multiplicateurs, lampe intérieure en candela, lueur de fenêtre sur la neige en RectAreaLight (nits). |
| threejs-postprocessing | Réglages bloom (seuil tel que seul l'ambre brille), vignette, grain, profondeur de champ, aberration 0,0012, avec les noms de `@react-three/postprocessing`. |
| algorithmic-art | Aléa à graine : mêmes illustrations et même mesure d'ambre à chaque rendu ; son gabarit p5.js n'est pas utilisé. |

### Regardés, non retenus pour cette phase

taste, taste-application, taste-distillation (esthétique de clips vidéo) · motion, motion-framer (React, phase 04) · improve-animations (audit de code destiné à d'autres agents ; review-animations fait la relecture) · gsap-* (phases 04-05) · lottie, rive, spline, animejs, barba, locomotive, react-spring, scroll-reveal-libraries, lightweight-3d-effects (moteurs non retenus, règle G.6) · threejs-materials, textures, loaders (phase 03) · webgpu-threejs-tsl, shaders-cursor-ripples (lecture seule, hors sujet) · ui-demo, e2e-testing, browser-qa (outillage de test) · remotion-*, video, banner-design, ad-creative, image (vidéo, marketing) · data:data-visualization et data:create-viz (dataviz est disponible) · motion-lelon (autre marque) · inherit-legacy-style, frontend-slides (hors sujet).

## 10. Risques et parades

| Risque | Parade |
|---|---|
| OneDrive verrouille des fichiers pendant l'installation (erreurs EPERM, EBUSY) et synchronise des milliers de fichiers | Question 1. Sinon : synchro en pause pendant l'installation, trois dépendances en versions exactes. |
| Playwright 1.65 n'attend pas le Chromium déjà installé | Vérification à l'étape 1 ; sinon téléchargement du bon Chromium, hors OneDrive. |
| Captures pleine page très hautes : limite de Chromium, fichiers PNG énormes à cause du grain | Sonde à l'étape 6, tranches assemblées, JPEG pour l'archive, mesures en mémoire, relecture par section. |
| Polices par CDN : panne réseau, adresses sans protocole illisibles en double-clic, capture prise avec la police de secours | Adresses réécrites en https, captures par le serveur local, attente explicite de chaque graisse ; une requête de police échouée arrête le tour. |
| Les apparitions au scroll ne se déclenchent pas dans une capture pleine page | Mode `?capture=1` (états finaux), animations coupées pendant la capture, neige figée. |
| Sur fond clair, l'anneau ambre disparaît (1,8:1 sur snow) ; le texte snow devient illisible sur l'horizon et la neige d'Heure bleue (3,3:1 et 2,0:1) | Question 3 ; texte night sur fond clair ; le vignettage sert aussi de voile, ses valeurs sont dans `ambiance.json` et mesurées. |
| Les boucles infinies (mots alternés, point « En cours », texte du loader) vont contre la règle WCAG 2.2.2 | Question 4. |
| Conflits entre skills et DA (étiquettes mono, durées > 300 ms, courbes sur mesure, dégradés, lueurs, illustrations dessinées, icônes Solar contre Lucide) | CLAUDE.md gagne : chaque étiquette porte une information, chaque durée longue a sa raison dans `motion.json`, le retour d'interaction reste ≤ 200 ms. |
| Le petit assembleur de page est fragile | Conventions strictes dans `lib/`, compilation vérifiée, test qui refuse tout `import` ou `export` restant dans la page. |
| Les densités de brouillard dépendent d'une échelle de scène encore inconnue | Visibilité à 95 % notée ; densité recalculée en phase 03. |
| Fichiers téléchargés et règles récupérées en ligne = contenu non fiable | Versions épinglées, format contrôlé, empreinte notée, aucun script dans les SVG ; les règles servent de liste de contrôle, jamais d'instructions. |
| Poids de la page (une cinquantaine de SVG, canvas, flous, grain) | Poids affiché à chaque build, boucles en pause hors écran, grain en tuile, aucun grand flou animé. |
| Un `package.json` en ESM casserait les scripts de `.claude/` | Pas de `"type": "module"`, fichiers en `.mjs`. |
| Périmètre : 13 sections, une cinquantaine de SVG | Kit et données partagés. Priorité aux sections 04, 05, 06, 07, 10 et 11, qui servent les phases 04 et 05 ; vignettes 03 et 12 simplifiées si le temps manque. |
| Nouvelle coupure par la limite d'utilisation | Point d'étape dans `making-of/notes.md` à la fin de chaque étape ; plan et sources sur le disque. |

## 11. Points d'attention pour les phases suivantes

Rien à décider maintenant.

- **General Sans** : la licence interdit de redistribuer les fichiers de police (y compris par un dépôt ou un serveur public), de les modifier ou d'en faire des sous-ensembles. Ton dépôt GitHub est public : les .woff2 de General Sans n'y entreront jamais. L'auto-hébergement de la phase 04 reste possible si les fichiers sont récupérés pendant le build Vercel sans être commités ; l'autre voie est de garder le CDN Fontshare.
- **Geist Mono** (SIL OFL 1.1) : peut être auto-hébergée et commitée.
- **`package.json`** : créé à la racine maintenant, la phase 04 l'étendra. `tokens.css` reste en CSS pur sur `:root` ; la phase 04 le branchera dans Tailwind v4.
- **Micro-interface sur la scène 3D** : les mesures de contraste faites sur les ambiances serviront de référence en phase 05.
- **Vue classique** : le skill site-3d-immersif conseille un bouton qui affiche tout sans 3D, utile aux recruteurs pressés. À trancher en phase 04 ou 06.

## 12. Questions

1. **OneDrive.** Le projet est dans un dossier synchronisé. Les outils de vérification ajoutent un `node_modules` d'environ 60 à 100 Mo, et la phase 04 en ajoutera plusieurs centaines. Pendant les installations, OneDrive verrouille souvent des fichiers.
   - (a) On reste ici pour la phase 01 : tu mets la synchronisation en pause pendant l'installation, et tu déplaces le projet hors de OneDrive avant la phase 04. C'est ma recommandation, pour ne pas couper cette session.
   - (b) Tu déplaces le projet maintenant (par exemple vers `C:\dev\portfolio`, sans oublier `references/photos` et `references/stylise`, qui ne sont pas sur GitHub), puis on reprend la phase dans le nouveau dossier. L'agent planner recommandait cette option.
2. **La cabane.** As-tu une forme en tête ? Je n'ai aucune image de référence : les planches montrent les tenues de l'avatar. Par défaut : un chalet à deux pans avec une grande baie vitrée côté bureau et une cheminée. Autres pistes : un A-frame (toit jusqu'au sol) ou une cabane en rondins.
3. **Focus sur fond clair** (loader sur fond neige, début de l'entrée). L'anneau ambre seul y est presque invisible (1,8:1, il faut 3:1). Je propose, sur fond clair uniquement, l'anneau ambre de 2 px entouré d'un liseré --night de 1 px. Cela précise la règle de focus de CLAUDE.md, d'où ma question.
4. **Animations en boucle** (mots alternés toutes les 2,8 s, point « En cours », texte défilant du loader). La règle WCAG 2.2.2 (niveau A) demande de pouvoir arrêter une animation qui dure plus de 5 s.
   - (a) Un petit bouton « Mettre en pause les animations » à côté du bouton son. C'est ma recommandation.
   - (b) Un arrêt automatique après un tour : plus discret, mais pas tout à fait conforme.
   - (c) On garde tout tel quel.

## 13. Réponses de Kerem (07/11/2026) : plan validé

Texte complet : `prompts/01-reponses-plan.md`.

1. OneDrive : option (a). On reste ici pour la phase 01 ; le déplacement du projet hors de OneDrive est obligatoire avant la phase 04.
2. Cabane : A-frame moderne. Grande façade triangulaire vitrée côté bureau (on y voit l'avatar assis), petite cheminée, toit à forte pente qui retient la neige. Silhouette lisible dans le brouillard et en monochrome.
3. Focus sur fond clair : oui au liseré night de 1 px autour de l'anneau ambre, sur fond clair uniquement.
4. Boucles : option (a), bouton pause à côté du son. En plus, avec `prefers-reduced-motion`, les boucles sont arrêtées dès le départ.
5. Grille mobile : 4 colonnes à 390 px, au lieu de 12 colonnes regroupées par 3. (Remplace la décision n° 2.)

Le reste du plan et les 20 décisions par défaut sont validés.
