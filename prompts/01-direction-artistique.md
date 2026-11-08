PHASE 01 — DIRECTION ARTISTIQUE
Relis CLAUDE.md, surtout les sections C (références) et D (direction artistique). Pas de 3D temps réel dans cette phase. Enregistre ce prompt mot pour mot dans prompts/01-direction-artistique.md.

=====================================================================
1. OBJECTIF
=====================================================================
Produire la référence visuelle de tout le site, que je valide avant la moindre 3D :
- design/direction-artistique.html : une page autonome (un seul fichier, CSS et JS inclus) qui montre tout le système visuel. Elle doit déjà donner une impression premium : c'est la première preuve du niveau visé.
- design/tokens.css : toutes les variables (couleurs, typographie, espacements, rayons, bordures, lueurs, z-index, durées, courbes).
- design/motion.json : durées, courbes, écarts entre mots, et la version « mouvement réduit » de chaque animation.
- design/ambiance.json : les valeurs exactes de la lumière de la scène (état « jour » du début et état « heure bleue » choisi).
En phase 04, ces fichiers seront branchés dans l'application.

=====================================================================
2. SKILLS À LIRE EN ENTIER AVANT DE COMMENCER
=====================================================================
design-taste-frontend, ui-ux-pro-max, design-system, design, ui-styling, frontend-design, impeccable, emil-design-eng, apple-design, modern-web-design, build-awwwards-quality-sites, make-interfaces-feel-better, baseline-ui, web-design-guidelines, design-motion-principles, animation-systems, animation-vocabulary, animate, motion-design, staggered-word-reveal, masked-reveal, canvas-design, theme-factory (lecture), dataviz (ou data:data-visualization et data:create-viz si dataviz n'est pas disponible), copywriting, copy-editing, stop-slop.
Puis cherche dans .claude/skills tout autre skill lié au design, à la typographie, à la couleur ou au mouvement, et ajoute-le. Agent à utiliser : planner pour le plan.
Dans ton plan : une ligne par skill avec ce que tu en appliques.

=====================================================================
3. CONTENU DE LA PAGE, SECTION PAR SECTION
=====================================================================
La page a un index latéral fixe (numéros 01 à 12 en Geist Mono) et s'affiche sur le fond --night avec le grain.

01. En-tête
« Direction artistique — Portfolio Kerem Uysal », la phrase « Tout est froid et gris, sauf une lumière chaude. », la date et le numéro de version.

02. Principes
Deux colonnes de 6 règles : « À faire » et « À ne pas faire », chacune avec une mini-illustration en SVG. Exemples : l'ambre seulement sur la lumière et les chiffres clés / jamais d'ambre décoratif ; du mouvement lent et amorti / jamais de rebond ; une interface minuscule autour d'une grande image / jamais de bloc de texte qui couvre la scène.

03. Références traduites
Tu n'as pas d'images des références : dessine. Pour chaque moment clé des références A et B (section C de CLAUDE.md), une vignette schématique en SVG (16:9, monochrome + ambre) avec deux lignes : ce que fait la référence, et ce que devient ce moment chez nous. Par exemple : A2, le treillis de segments autour de l'igloo, devient le nuage de points de données reliés autour de la cabane ; B4, l'écran rose, devient le dashboard NASA à la lueur ambre.

04. Palette
Les 8 couleurs de la section D en grands échantillons : nom, hexadécimal, rôle. Calcule et affiche les ratios de contraste réels (snow, mist et amber sur night et night-2 ; night sur amber pour les boutons), avec un badge AA ou AAA. Ajoute une barre de proportions : night environ 70 %, night-2 15 %, snow 8 %, mist 5 %, amber 2 à 5 %.

05. Typographie
Spécimens de General Sans et Geist Mono avec de vrais textes tirés de content/fr/ : mon nom en display, le pitch en h1, un titre de projet en h2, un paragraphe de l'à propos, des étiquettes en mono. Le tableau de l'échelle (taille, interligne, interlettrage, graisse, usage) en version ordinateur et mobile. Un bloc de chiffres en tabular-nums : 11 246, 2025, 25 h, 0 → 100. Longueur de ligne maximale du texte courant : 65 caractères.

06. Grille et espacements
La grille de 12 colonnes superposée sur un exemple de mise en page, à 1440 px et à 390 px. L'échelle d'espacement : 4, 8, 12, 16, 24, 32, 48, 64, 96, 128. Les rayons : 6 px (petit), 12 px (tuiles), 999 px (pilules). Les bordures : 1 px --line. Les coins en équerre (12 px, trait de 1 px) hérités de la référence B4.

07. Composants, avec tous leurs états (repos, survol, focus clavier, actif, désactivé)
- Bouton principal : pilule ambre, texte --night en Geist Mono 12 px majuscules, 12 × 20 px de marge interne ; au survol, la flèche glisse de 4 px.
- Bouton secondaire : pilule à contour --line, texte --snow ; au survol, contour ambre.
- Lien : soulignement qui se dessine de gauche à droite en 0.45 s, flèche ↗.
- Barre du haut de 64 px : monogramme « KU » à gauche, email au centre (clic = copie), navigation à droite (À PROPOS · COMPÉTENCES · PROJETS · CONTACT), bouton FR/EN, bouton son.
- Rail social vertical en bas à gauche : GitHub, LinkedIn, email.
- Étiquettes de statut : Terminé (contour mist) ; En cours (point ambre qui pulse toutes les 2 s) ; En ligne (point ambre fixe) ; Prochainement (contour en pointillés).
- Carte de projet (version de la section Projets) : numéro, nom, question, chiffre clé en ambre, outils, visuel en niveaux de gris qui reprend ses couleurs au survol.
- Carte de compétence : accordéon à coins en équerre, fermé et ouvert, avec les pastilles « Prouvé dans : NASA · Pollution ».
- Indicateur de niveau : 3 barres de 14 × 4 px espacées de 3 px, remplies en ambre, vides en mist à 25 %.
- Tuile de stack : 72 × 72 px, logo de 28 px, nom en dessous.
- Filtre façon Power BI : libellé, compteur et mini-barre proportionnelle ; actif = fond --amber-soft et barre ambre.
- Pilule de chargement du loader, toast « Email copié », curseur personnalisé (point ambre de 10 px qui devient un anneau de 36 px sur les liens), bouton son (égaliseur de 4 barres, animé quand le son est actif, immobile quand il est coupé), ligne de timeline avec son point ambre lumineux.
- Annotation technique (héritée de A7) : une ligne de rappel fine et une étiquette mono. Usage rare : entrée et pages projets.

08. Dataviz
Un graphique en barres avec de vraies données du README du projet NASA (nombre de titres APOD lors de chaque grand événement) : Spirit 2004 = 8, Hubble 2009 = 12, Pluton 2015 = 20, Hubble 2020 = 12, Webb 2022 = 10, Webb 2025 = 11. Barres grises, Pluton 2015 en ambre, valeurs écrites sur les barres en Geist Mono, une seule ligne de base, aucune grille. Le titre dit le résultat : « Le survol de Pluton est le plus grand pic : 20 titres en 2015. » Applique le skill dataviz. Ce style s'appliquera à tous les graphiques du site.

09. Matière et lumière
Des panneaux de démonstration : grain activé ou désactivé, vignettage, simulation de profondeur de champ (calques flous), lueur ambre (simulation du bloom), aberration chromatique (réservée aux transitions).

10. Mouvement
Le tableau des tokens, puis une démo animée de chacun, avec un bouton « Rejouer » et un interrupteur « mouvement réduit » qui montre la version de secours :
(a) texte mot par mot ; (b) titre révélé par un masque ; (c) compteur de 0 à 11 246 en 1.2 s, ease-out-expo, chiffres fixes ; (d) survol d'une carte : montée de 4 px, contour ambre, visuel du gris à la couleur en 0.45 s ; (e) accordéon de compétence ; (f) transition de section : fondu et flou de 8 px à 0 ; (g) mots alternés de l'accueil : masque vertical de 0.6 s, toutes les 2.8 s ; (h) point de timeline qui descend avec le scroll de la démo.
Aucun rebond. Passe le skill review-animations sur ces démos avant de me les montrer.

11. Trois ambiances pour la scène (à choisir)
Trois illustrations 2D en SVG ou canvas (16:9, 1200 px de large) : plans de montagnes successifs, bandes de brume, la cabane en silhouette avec sa fenêtre ambre, de la neige qui tombe.
- Ambiance 1 « Brume claire » : la plus lumineuse, proche de la référence A. Ciel d'environ #B9BCBE en haut à #8E9296 à l'horizon, brume dense et claire, fenêtre ambre douce.
- Ambiance 2 « Heure bleue » : équilibrée. Ciel d'environ #3B4148 à #7C8288, brume moyenne, neige vers #A7ABAF, fenêtre ambre franche. C'est ma préférée a priori.
- Ambiance 3 « Nuit tombée » : la plus sombre. Ciel d'environ #15181C à #3E434A, brume basse, neige vers #6F7377, fenêtre ambre intense, contraste fort.
Affine ces valeurs pour qu'elles soient belles : ce sont des points de départ. Pour chaque ambiance, affiche les valeurs dont la phase 05 aura besoin : ciel (haut, horizon), couleur et densité du brouillard (exponentiel, par exemple 0.012, 0.018, 0.024), albédo de la neige et de la roche, intensité de la lumière ambiante, intensité émissive de la fenêtre, exposition. Montre aussi l'état « jour » commun aux trois, celui du début de l'entrée (brume très claire, presque blanche, comme A1).

12. Storyboard du site
16 vignettes schématiques en SVG (16:9), dans l'ordre : loader ; entrée en 7 temps (nuage de points, treillis qui dessine la cabane, cabane qui devient matière, montagne et tombée du jour, arrivée de l'avatar dans la neige, passage par la fenêtre, avatar qui s'assoit) ; accueil ; à propos ; compétences ; parcours ; projets ; stack ; contact ; page Tous les projets. Sous chaque vignette : le chapitre, la plage de scroll prévue et une phrase sur ce qui bouge.

13. Textes d'interface
Les textes de ui.json en français et en anglais : navigation, boutons, statuts, toasts, messages d'erreur. Passe stop-slop et copy-editing, et propose-moi les corrections sous forme de liste (ne modifie pas ui.json sans mon accord).

Polices : charge General Sans et Geist Mono depuis leur source officielle pour cette page. Elles seront auto-hébergées en phase 04.

=====================================================================
4. VÉRIFICATION AVANT DE ME MONTRER
=====================================================================
- Captures pleine page à 1440 et 390 px de large avec Playwright, dans making-of/phase-01/.
- Mesure la part d'ambre : un petit script compte les pixels proches de #F2A33A sur chaque capture et donne le pourcentage. Objectif : 5 % maximum hors section palette.
- Vérifie tous les contrastes (AA minimum) et le focus clavier sur chaque composant.
- Passe les skills web-design-guidelines, baseline-ui et review-animations comme relecteurs, et corrige ce qu'ils trouvent.
- Boucle : jusqu'à 5 tours de correction si quelque chose ne respecte pas la section D.

=====================================================================
5. LIVRAISON
=====================================================================
Montre-moi : les captures, le pourcentage d'ambre, la liste des skills avec ce que tu en as appliqué, et ta recommandation d'ambiance argumentée en 3 lignes. Puis attends ma validation et mon choix (1, 2, 3 ou un mélange). Écris ensuite le choix dans design/ambiance.json et dans CLAUDE.md (section D), écris l'entrée de la phase dans making-of/notes.md, et fais le commit « phase 01 : direction artistique ».
