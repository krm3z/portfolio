# Making-of · journal des phases

Une entrée par phase : ce qui a été demandé, ce qui a été refait et pourquoi, les chiffres.

---

## Phase 00 · Mise en place du projet (07/11/2026)

**Demandé** : récupérer les skills de Lelon, créer l'arborescence, écrire les tables de contenu fr/en et leur schéma TypeScript, écrire CLAUDE.md, créer le dépôt GitHub public krm3z/portfolio.

**Fait**
- `.claude/` et `skills-lock.json` copiés depuis krm3z/Lelon (branche main). Le CLAUDE.md de Lelon n'a pas été copié.
- Contrôle avant publication : aucun secret réel dans `.claude/` (les clés de `mcp-configs/mcp-servers.json` sont des valeurs fictives du type `YOUR_..._HERE`).
- Six JSON par langue dans `content/`, schéma dans `types/content.ts`, contrôle automatique : JSON valides, mêmes clés en fr et en en, chaque slug et chaque ligne de parcours citée existe, `tsc --strict` sans erreur.
- CLAUDE.md : sections B à G extraites du prompt par script, puis vérifiées ligne à ligne (219 lignes sur 219).

**Refait et pourquoi**
- Les questions des projets 06, 07 et 08 : je les avais formulées moi-même. La section F ne les donne pas, donc je les ai vidées en attendant la réponse de Kerem (règle « zéro invention »).
- `references/photos/` et `references/stylise/` exclus du premier commit : le dépôt est public et ces dossiers contiennent le visage de Kerem. Publication seulement après son accord.

**Validation (même jour)** : Kerem a donné les questions des projets 06 à 08, choisi les textes d'interface (loader avec son nom, « Me contacter », micro-texte « // Portfolio © 2026 »), fixé la traduction des années (« 1st, 2nd, 3rd year of Bachelor's ») et les intitulés des 13 phases. J'ai retiré 17 jeux de règles ECC sans rapport avec le projet (ArkTS, Vue, PHP, Rust…). On garde common, python, react, typescript et web. Phase validée en un seul aller-retour.

**Chiffres**
- Skills : 282 · agents : 71 · commandes : 98 (conformes aux comptes attendus).
- Poids de `.claude/` : environ 51 Mo (le plus gros fichier : une vidéo de démo de 3,8 Mo dans le skill scroll-world-storytelling).
- Tours de boucle visuelle : 0 (aucun rendu dans cette phase).

---

## Phase 01 · Direction artistique (validée le 08/11/2026)

**Point d'étape (07/11/2026, avant validation du plan)**
- Prompt enregistré mot pour mot dans `prompts/01-direction-artistique.md`.
- Skills lus : les 28 demandés (SKILL.md en entier) et 16 autres trouvés par mots-clés (design, typo, couleur, mouvement, lumière 3D). Tableau « une ligne par skill » prêt.
- Vérifié : chiffres NASA du README (conformes au prompt), licences des polices (General Sans : ITF Free Font License, pas de redistribution ni de sous-ensemble ; Geist : SIL OFL 1.1), gris des barres du graphique (#66686C, contraste ≥ 3:1).
- Plan rédigé avec l'agent planner (une première tentative a été coupée par la limite d'utilisation, relancée à la reprise) et fusionné avec le tableau des skills : `making-of/phase-01/plan.md`.
- Plan validé par Kerem (réponses enregistrées dans `prompts/01-reponses-plan.md`) :
  - OneDrive : on reste dans le dossier synchronisé pour la phase 01. **Le déplacement du projet hors de OneDrive est obligatoire avant la phase 04.**
  - Cabane : A-frame moderne, grande façade triangulaire vitrée côté bureau (on y voit l'avatar assis), petite cheminée, toit à forte pente qui retient la neige, silhouette lisible dans le brouillard et en monochrome.
  - Focus sur fond clair : anneau ambre de 2 px entouré d'un liseré night de 1 px, sur fond clair uniquement.
  - Boucles : bouton pause à côté du son ; avec `prefers-reduced-motion`, les boucles sont arrêtées dès le départ.
  - Grille mobile : 4 colonnes à 390 px (au lieu de 12 colonnes regroupées par 3).
- Exécution en cours (voir les points d'étape ci-dessous).

**Point d'étape · exécution**
- Fait : outillage (Playwright 1.65 et son Chromium, pngjs, Vitest, axe), fonctions pures testées, `design/tokens.css`, `design/motion.json`, `design/ambiance.json` (valeurs de départ), fichiers tiers avec provenance, assemblage `scripts/da-build.mjs`, captures `scripts/da-captures.mjs`, mesure d'ambre `scripts/da-ambre.mjs` (étalonnée à 3,00 %), sections 04, 05, 06. 42 tests passent.
- Reste : sections 01, 02, 03, 07 à 13, script de focus, boucle de vérification, revues, livraison.

**Point d'étape · arrêt sur limite d'utilisation (07/11/2026, après-midi)**
- Fait depuis : sections 07 (composants), 08 (dataviz NASA), 09 (matière et lumière) et 11 (ambiances) construites et vérifiées en capture à 1440 px.
- Ambiances : rendu 2D calculé comme la future scène (`design/src/svg/paysage.mjs` : brouillard FogExp2 par plan, vignettage de postprocessing, relief, cabane A-frame, treillis de données). Export PNG 1200 × 675 et contraste mesuré sur les pixels : `node scripts/da-ambiances.mjs` → `making-of/phase-01/ambiances/` et `rapports/ambiances-contraste.json`.
- `ambiance.json` affiné : brouillard du jour plus dense (0,062, caché à 95 % à 27,9 m, seuls le treillis et la cabane se voient), bois désaturé `#57534E` ajouté, micro-texte en couleur par zone (`interface.texte.haut/bas`). L'heure bleue passe de 2,92:1 à 4,77:1 en bas à gauche avec un texte night sur la neige. `contrasteMin` reste à écrire avec les valeurs mesurées.
- Outils ajoutés : `scripts/da-zoom.mjs` (capture agrandie d'un élément), `lib/scene.mjs` (smoothstep, vignettage, couleur au loin) avec ses tests ; `typographier` pose les espaces insécables françaises. 48 tests passent.
- Reste, dans l'ordre : vérifier 09 et 11 à 390 px ; écrire `contrasteMin` ; recommandation d'ambiance en 3 lignes dans la section 11 ; sections 10 (mouvement), 02, 03, 12, 01 (moment orchestré), 13 (textes) ; alléger la page (740 Ko, à cause des 7 paysages de la section 09) ; script de focus ; boucle de vérification (ambre, contrastes, focus, revues) ; livraison.

**Livraison (07/11/2026, soir) · en attente du choix d'ambiance de Kerem**

*Demandé* : une page de direction artistique autonome en 13 sections, `tokens.css`, `motion.json` (avec la version réduite de chaque animation) et `ambiance.json` (l'état « jour » et trois ambiances candidates) ; captures à 1440 et 390 px, ambre ≤ 5 % hors palette, contrastes AA, focus clavier sur chaque composant, revues, 5 tours au plus.

*Fait*
- `design/direction-artistique.html` : 13 sections assemblées par `scripts/da-build.mjs` depuis `design/src/`. Toutes les valeurs affichées sont lues dans les trois fichiers de design ; tous les textes du site viennent de `content/`.
- Ambiances calculées comme la future scène (brouillard FogExp2 par plan, vignettage de postprocessing) ; contraste du micro-texte calculé, testé (`contrasteMin`) et vérifié sur les pixels.
- Huit démos de mouvement avec « Rejouer » et « Mouvement réduit », planches de 5 instants et vidéo (`making-of/phase-01/mouvement/`).
- Scripts de vérification : captures, ambre, focus clavier (planche de focus), axe, ambiances, planches de mouvement, archive.
- Archives commitées : `avant/` (tour 0, construction), `intermediaire/` (tour 1, avant les revues), `apres/` (tour 2), `ambiances/`, `mouvement/`, `rapports/`. Bilan des skills : `making-of/phase-01/skills-bilan.md`.

*Refait et pourquoi*
- Section 09 : dessins invisibles (le kit et le calque de vignettage partageaient la classe `.vignette`) ; grain et vignettage illisibles sur une scène sombre, refaits sur l'état « jour » ; teinte verte dans les flous (filtres en espace linéaire), passés en sRGB.
- Paysages : relief ajouté (flancs à l'ombre, couloirs rocheux, rochers) ; treillis refait en grille secouée sur deux profondeurs ; poids de la page ramené de 981 à 777 Ko.
- Heure bleue : « Faites défiler » illisible sur la neige (2,92:1) ; règle d'une couleur par zone (night sur la neige : 4,77:1).
- Focus : les liens d'un accordéon fermé étaient atteignables au clavier (masqués aussi au clavier maintenant) ; l'anneau du cadre qui défile (démo h) était recouvert par son contenu (porté par la scène).
- axe : lignes de timeline à 35 % d'opacité, illisibles avant le passage du point (elles restent en mist, 6,5:1, puis passent en snow) ; aperçus de contrastes en échec redessinés en SVG ; noms accessibles qui reprennent « KU » et « FR / EN ».
- Relectures de code (code-reviewer, typescript-reviewer) : serveur local protégé contre une adresse mal formée, erreurs volontairement ignorées limitées à l'annulation, compteur et loader sans boucles en double, dernière fenêtre d'écran comptée dans la mesure d'ambre.
- Gardés malgré la revue d'animation, car demandés dans le brief : soulignement de lien en 0,45 s, point « En cours » qui pulse.

*Chiffres*
- Tours de boucle visuelle : 3 (0 construction, 1 avant revues, 2 final) sur 5 autorisés.
- Ambre hors palette : 0,15 % à 390 px, 0,18 % à 1440 px ; pire écran : 3,34 % (en-tête, 390 px) et 2,84 % (composants, 1440 px).
- Focus clavier : 76/76 éléments à 1440 px, 55/55 à 390 px, ordre du DOM respecté, anneau conforme partout, contraste de l'anneau ≥ 7,9:1 ; 8 actions au clavier vérifiées.
- axe : 0 violation aux deux largeurs (contrastes sous les calques fixes vérifiés par la table des tokens).
- Micro-texte sur les ambiances : 13:1 (jour), 8,6:1 (brume claire), 4,5:1 (heure bleue), 8,7:1 (nuit tombée).
- Page : 777 Ko, 135 Ko compressé ; pleine page 1440 × 40 465 px. Tests : 53. Images par seconde : sans objet (pas de 3D dans cette phase).

**Validation (08/11/2026)**

*Décidé par Kerem* : ambiance 3 · Nuit tombée, sans emprunt ; l'heure bleue devient l'étape intermédiaire de la tombée de la nuit pendant l'entrée (phases 03 et 05). Les 11 propositions de textes sont validées, sauf « Path » : en anglais, « Background » reste pour le parcours, « Context » sert seulement au contexte d'un projet. Deux corrections demandées avant de finaliser.

*Refait et pourquoi*
- État « jour » : le treillis était un enchevêtrement aléatoire trop grand qui écrasait la cabane. Il est remplacé par des coquilles en forme d'A, ordonnées, qui convergent vers la silhouette de la cabane (rayons reliés point à point jusqu'à son contour), plus quelques points isolés dans la brume. Les points sont sombres sur le fond clair, la cabane plus marquée. Même treillis dans les vignettes A1 à A3 et dans la section 09.
- « FAITES DÉFILER » quasi invisible sur l'heure bleue alors que j'annonçais 4,6:1. Les exports venaient bien de la dernière version ; ma mesure regardait la bonne zone, mais elle comparait le fond à la couleur *prévue* du texte (méthode WCAG). Or un micro-texte de 9 px en graisse 400 a des traits plus fins qu'un pixel : son pixel le plus sombre n'atteignait qu'une luminance de 95 sur un fond à 135, soit 1,7:1 réel. Corrections : micro-texte posé sur la 3D en Geist Mono 500 et 12 px ; mesure double (prévue et rendue) dans `scripts/da-ambiances.mjs` ; sur l'heure bleue, texte du bas en snow et voile bas de 0,4 (`interface.voileBas`), d'où 5,2:1 prévu et 5,5:1 rendu. Leçon retenue : un chiffre de contraste se vérifie aussi sur les pixels dessinés, surtout pour du texte sombre et fin sur fond clair (il perd plus de la moitié de son contraste au rendu, alors que le texte clair sur fond sombre garde le sien).
- `ambiance.json` 1.0.0 : `choisi` = nuit tombée (valeurs identiques à la candidate, vérifiées par un test), progression jour → heure bleue → nuit tombée. Section 11 : bloc « Le choix », mention « Retenue » et « Étape de l'entrée ».
- Textes appliqués dans `content/fr` et `content/en` (pluriel ICU, « FR / EN », clés `navigation.competences`, `competences.prouveDans`, `contact.copieImpossible`, `boucles.pause` et `boucles.reprendre`, crédit honnête, « Context », espace fine insécable dans 11 246). La section 07 lit désormais ces libellés dans `ui.json` ; la section 13 devient le journal des corrections.
- Page en version 1.0.

*Chiffres finaux (tour 3)*
- Tours de boucle visuelle : 4 sur 5 (0 construction, 1 avant revues, 2 après revues, 3 version 1.0).
- Ambre hors palette : 0,15 % (390 px) et 0,18 % (1440 px) ; pire écran 3,34 % et 2,84 %.
- Focus clavier : 76/76 et 55/55, contraste de l'anneau ≥ 6,65:1 ; axe : 0 violation.
- Micro-texte de l'ambiance retenue (nuit tombée) : 14,1:1 prévu et 13,7:1 rendu en haut ; 8,6:1 prévu et 8,9:1 rendu en bas.
- Page : 769 Ko, 135 Ko compressé. Tests : 54. Durée de la phase : 7 et 8 novembre 2026.
