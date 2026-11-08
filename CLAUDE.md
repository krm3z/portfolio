# CLAUDE.md · Portfolio de Kerem Uysal

Fichier de référence du projet. À relire au début de chaque session (règle de travail n° 1).
Les sections B à G ci-dessous sont recopiées intégralement depuis `prompts/00-mise-en-place.md` : elles ne se résument pas et ne se modifient pas sans mon accord.

## Sommaire

1. [Phases et statuts](#phases-et-statuts)
2. [Décisions validées en phase 00](#décisions-validées-en-phase-00)
3. [Décisions validées en phase 01](#décisions-validées-en-phase-01)
4. [Repères du dépôt](#repères-du-dépôt)
5. [B. Le projet](#b-le-projet)
6. [C. Les deux références, décrites plan par plan](#c-les-deux-références-décrites-plan-par-plan)
7. [D. Direction artistique (obligatoire)](#d-direction-artistique-obligatoire)
8. [E. Plan du site et chapitres (ordre réel d'affichage)](#e-plan-du-site-et-chapitres-ordre-réel-daffichage)
9. [F. Contenu (source unique)](#f-contenu-source-unique)
10. [G. Technique, conventions, budgets, skills et règles de travail](#g-technique-conventions-budgets-skills-et-règles-de-travail)

## Phases et statuts

Statuts possibles : à faire · en cours · validée. Mis à jour à la fin de chaque phase.

| Phase | Intitulé | Statut | Prompt |
|---|---|---|---|
| 00 | Mise en place du projet | validée (07/11/2026) | prompts/00-mise-en-place.md · prompts/00-reponses-validation.md |
| 01 | Direction artistique | validée (08/11/2026) | prompts/01-direction-artistique.md · prompts/01-reponses-plan.md · prompts/01-reponses-validation.md |
| 02 | Avatar | à faire | |
| 03 | Scènes 3D Blender | à faire | |
| 04 | Base du site et loader | à faire | |
| 05 | Entrée cinématique | à faire | |
| 06 | Accueil et À propos | à faire | |
| 07 | Compétences au bureau | à faire | |
| 08 | Parcours | à faire | |
| 09 | Projets | à faire | |
| 10 | Stack, contact, making-of | à faire | |
| 11 | Finitions et mise en ligne | à faire | |
| 12 | Revue finale | à faire | |

## Décisions validées en phase 00

- Photos : `references/photos/` et `references/stylise/` restent hors du dépôt public (`.gitignore`). On les utilise en local seulement.
- Textes d'interface (déjà dans `content/*/ui.json`) : « Bonjour, je suis » avant le nom ; au-dessus du mot qui alterne : « En recherche d'alternance · sept. 2027 » ; loader : « DATA ANALYST • KEREM UYSAL • IA & DATA • » ; bouton du contact : « Me contacter → » (la flèche est une icône, pas du texte) ; micro-texte de l'intro : « // Portfolio © 2026 », « Kerem Uysal », « Data Analyst · alternance sept. 2027 ».
- Anglais : « Pollution & Weather », « Energy » ; B1, B2, B3 = « 1st, 2nd, 3rd year of Bachelor's ».
- Power4 : le bot a 4 niveaux de difficulté, dont 2 avec minimax (ajouté aux résultats).
- Correspondances compétences → projets et stack → projets : validées telles quelles (Excel sans preuve ; « Organisation » reliée aux lignes b2-ynov, carrefour, lelon-fondateur du parcours).
- HiraStream : le dépôt n'est pas encore public. Réserve maintenue : pas de lien tant qu'il est privé.
- Règles ECC conservées : common, typescript, react, web, python. Les autres langages ont été retirés.

## Décisions validées en phase 01

- Ambiance retenue : 3 · Nuit tombée, sans emprunt (`design/ambiance.json` → `choisi`). Pendant l'entrée, la nuit tombe : jour → heure bleue (étape intermédiaire) → nuit tombée ; les valeurs s'interpolent d'un état à l'autre (phases 03 et 05). Les trois candidates restent en archive dans `ambiance.json`.
- Cabane : A-frame moderne, grande façade triangulaire vitrée côté bureau (on y voit l'avatar assis), petite cheminée, toit à forte pente qui retient la neige.
- État « jour » : des points ordonnés convergent vers la silhouette de l'A-frame (coquilles en forme d'A et rayons vers la cabane), compacts ; la cabane reste lisible.
- Micro-texte posé sur la 3D : Geist Mono 500, 12 px, une couleur par zone (haut sur le ciel, bas sur la neige). Nuit tombée : snow partout. Au passage par l'heure bleue : un voile bas de 0,4 sous « Faites défiler ». Le contraste se mesure deux fois : couleur prévue (méthode WCAG) et pixels réellement dessinés (`scripts/da-ambiances.mjs`).
- Focus : anneau ambre de 2 px décalé de 3 px ; sur fond clair seulement, liseré night de 1 px autour. Un cadre qui défile porte son anneau sur son parent.
- Boucles : bouton pause à côté du son ; avec `prefers-reduced-motion`, elles sont arrêtées dès le départ (le visiteur peut les relancer lui-même).
- Grille mobile : 4 colonnes à 390 px (12 dès 768 px).
- Gardés tels que demandés dans le brief : soulignement de lien en 0,45 s, point « En cours » qui pulse toutes les 2 s.
- Typographie française (apostrophe ’, espaces insécables avant « : ; ! ? » et entre un nombre et son unité) posée à l'affichage par une seule fonction testée ; les fichiers de `content/` gardent l'apostrophe droite.
- Textes : les corrections de la section 13 sont appliquées dans `content/fr` et `content/en` (pluriel ICU, bouton « FR / EN », nouvelles clés, crédit honnête). En anglais, « Background » reste pour le parcours ; « Context » sert seulement au contexte d'un projet.
- General Sans (licence ITF) : pas de fichier de police dans le dépôt ; chargement par Fontshare. Geist Mono : paquet `geist` (SIL OFL 1.1).
- Le projet doit quitter OneDrive avant la phase 04.

## Repères du dépôt

- `content/fr/` et `content/en/` : six fichiers JSON (identite, projets, parcours, competences, stack, ui). Seule source des textes du site. Même structure dans les deux langues.
- `types/content.ts` : schéma TypeScript de ces fichiers. Les preuves (`Preuve`) relient compétences et outils aux slugs de projets, à `/making-of` ou à une ligne du parcours.
- `prompts/` : chaque prompt de phase, mot pour mot.
- `making-of/phase-XX/` : captures avant, intermédiaires, après. `making-of/notes.md` : une entrée par phase.
- `design/` : sources de vérité de la DA (`tokens.css`, `motion.json`, `ambiance.json`) et la page de référence `direction-artistique.html`, assemblée depuis `design/src/` par `npm run da:build`.
- `scripts/da-*.mjs` : assemblage et vérifications de la page DA (captures, ambre, focus, axe, ambiances, mouvement, archive). Tests : `npm test` (Vitest).
- `references/photos/` : photos de Kerem. Ne jamais modifier. `references/stylise/` : planches stylisées déposées par Kerem (avatar, extérieur, intérieur, manteau). Ne jamais modifier.
- `.claude/` : skills, agents, commandes, règles ECC copiés depuis github.com/krm3z/Lelon (282 skills, 71 agents, 98 commandes au 07/11/2026). Règles ECC : `.claude/rules/ecc/` garde common, python, react, typescript, web. Skills du compte : site-3d-immersif, mentor-data, dataviz, deep-research, etc.
- Environnement : Windows 11, PowerShell. Node 26, npm 11, git 2.56, gh 2.103 connecté au compte krm3z.

---

## B. Le projet
<!-- B. LE PROJET -->

Qui je suis : Kerem Uysal, étudiant en B2 IA & Data à Ynov Lyon Campus. Je cherche une alternance Data Analyst pour ma B3, dès septembre 2027, au rythme de 3 semaines en entreprise et 1 semaine à l'école. Je suis mobile partout en France.

But du site : décrocher des entretiens. Public : recruteurs, RH et managers data. Ils regardent environ 30 secondes, le plus souvent sur un ordinateur portable, parfois sur mobile depuis LinkedIn.

Message : je transforme le bruit des données en décisions claires. Je suis solide en data, à l'aise avec l'IA, et j'ai l'esprit d'entreprendre.

Règle d'or : la 3D sert le contenu, elle ne le cache jamais. Mon nom, mon métier et ma recherche doivent être lisibles en moins de 5 secondes, même pendant l'intro (barre du haut et micro-texte). Un bouton « Passer l'intro » reste toujours visible pendant l'intro.

Le concept, en une histoire : au début, des points flottent dans une brume claire et se relient en réseau, comme des données brutes. Ce réseau dessine une cabane en fil de fer, qui devient matière. La montagne enneigée apparaît autour. Le jour tombe jusqu'à l'heure bleue et la fenêtre s'allume en ambre : c'est la seule couleur du site. Mon avatar arrive dans la neige, entre, et s'assoit à son bureau devant ses dashboards. Le message implicite : dans le bruit des données, quelqu'un les éclaire.

## C. Les deux références, décrites plan par plan
<!-- C. LES DEUX RÉFÉRENCES, DÉCRITES PLAN PAR PLAN -->

Tu ne verras pas ces vidéos. Ces descriptions sont la référence : à chaque capture, compare ton rendu point par point avec elles.

RÉFÉRENCE A — « L'igloo » : le niveau de rendu visé pour l'entrée
C'est un site 3D monochrome piloté par le scroll, filmé sur un écran d'ordinateur portable.
A1. Fond gris très clair, presque blanc, légèrement plus sombre sur les bords. Au centre apparaît un tout petit dôme en fil de fer : des lignes blanches très fines, lumineuses, qui occupent environ 5 % de la largeur.
A2. Le dôme grandit et devient un igloo en fil de fer : chaque bloc est dessiné, chaque joint est lumineux, avec un point de lumière blanche intense au sommet. Tout autour flotte un treillis 3D de segments blancs reliés entre eux, comme une constellation ou un échafaudage de données, à plusieurs profondeurs. Les segments les plus proches sont flous.
A3. L'igloo devient solide, blanc et gris, ses joints restent lumineux. Sous lui naît une butte de neige, comme une île aux bords doux et vaporeux. Le treillis flotte encore puis s'efface.
A4. Le terrain s'étend : un sommet rocheux enneigé très réaliste (rochers, neige poudreuse, détails fins). La caméra recule et monte doucement.
A5. Plan large : des chaînes de montagnes dans la brume, un ciel couvert. Tout est désaturé, presque noir et blanc, avec un grain fin. L'interface apparaît, minuscule : en haut à gauche un logo en lettres blanches épaisses, dessous trois lignes de micro-texte monospace (une ligne de copyright, le nom de la société, « tous droits réservés »), à droite une colonne de micro-texte monospace, en bas à gauche une invitation à faire défiler, en monospace. Rien d'autre : l'image prend toute la place.
A6. Les blocs de l'igloo se soulèvent et s'écartent lentement, comme une explosion contrôlée. De la lumière blanche s'échappe des joints. Des franges de couleur (aberration chromatique) apparaissent sur les bords de l'image.
A7. Transition dans la brume : un objet unique (un bloc de roche ou de glace sombre aux arêtes vives, avec un symbole en relief) flotte au centre d'un vide gris lumineux et tourne lentement. De fines lignes de rappel partent de l'objet vers des étiquettes monospace minuscules, comme une annotation technique. Profondeur de champ forte. Au scroll, l'objet suivant sort de la brume.
A8. Un anneau épais, segmenté, en métal ou en glace, tourne avec un emblème en son centre. Un grand halo de lumière circulaire remplit l'écran. La caméra traverse l'anneau, vers un nuage de particules brillantes.
A9. Une plateforme circulaire réfléchissante, avec des anneaux lumineux concentriques. Une petite figurine se forme à partir de milliers de particules granuleuses et brillantes, comme du sable ou de la neige compactée. En bas, des liens minuscules entre crochets, du type [ LinkedIn ]. C'est la fin et le contact.
A10. Boucle : retour à la montagne, les blocs de l'igloo tombent du ciel et s'assemblent un par un, puis retour au dôme en fil de fer du début.
Ce qu'on retient : la genèse en fil de fer qui devient matière ; le treillis de points comme image des données ; la brume et la profondeur ; le monochrome ; la micro-interface monospace ; la lumière qui s'échappe des joints ; l'assemblage par particules ; des transitions continues, sans coupure, entièrement pilotées par le scroll.
Ce qu'on ne reprend pas : l'igloo lui-même, leur logo, leurs objets, leurs textes.

RÉFÉRENCE B — « Le portfolio 3D » : la structure visée pour le reste du site
B1. Loader. Fond clair (lavande très pâle). En haut à gauche, le nom en micro-texte. En haut à droite, une petite icône d'égaliseur (le bouton son). Au centre, un texte noir géant en majuscules (environ 100 px) défile horizontalement en boucle, du type « MÉTIER • MÉTIER 2 • ». Une pilule noire le coupe au centre : « LOADING 6 % » en monospace avec un petit curseur blanc, qui monte jusqu'à « 100 % » puis devient un bouton « WELCOME ». Au clic : fondu au noir.
B2. Accueil. Fond noir légèrement violacé, avec une lueur violette sur le bord droit. Une barre fine en haut : monogramme à gauche, email au centre, « ABOUT · WORK · CONTACT » à droite, en micro-texte majuscule. En bas à gauche, une colonne verticale d'icônes sociales. Au centre, un avatar 3D en buste, style figurine : peau en argile grise mate, cheveux noirs, liseré de lumière rose-violet. Sa tête suit la souris avec un retard amorti. À gauche, « Hello! I'm » en petit puis le NOM en grand et en majuscules. À droite, « An » en petit puis un mot géant qui alterne (le métier en violet, puis un autre métier en blanc) avec un passage glissé. Un petit point violet suit la souris : c'est le curseur personnalisé.
B3. À propos. Au scroll, la caméra se rapproche : l'avatar glisse vers la gauche, plus grand, et se tourne vers la droite. À droite apparaissent « ABOUT ME » en petites capitales espacées et un paragraphe d'environ 6 lignes.
B4. Ce que je fais. La caméra recule et tourne : on voit l'avatar en entier, assis sur une chaise devant un bureau blanc, en train de taper au clavier face à un grand écran rose lumineux, vu de trois quarts arrière. Un titre géant « WHAT I DO », à gauche, chevauche la tête de l'avatar. À droite, un rectangle en pointillés avec des coins en équerre se dessine, puis se divise en 2 cartes. Chaque carte a un titre en majuscules, une description grise et une petite icône d'ouverture. Au clic, une carte s'ouvre en accordéon et montre des pastilles de technologies, l'autre se replie.
B5. Parcours. Un titre dont le dernier mot est en dégradé violet. Une timeline sur trois colonnes : à gauche le poste et l'entreprise en petit, au milieu l'année en grand (« NOW », « 2024 », « 2023 »), à droite la description. Une ligne verticale fine porte un point violet lumineux qui descend avec le scroll. Les lignes apparaissent au passage du point.
B6. Projets. Titre « My Work », avec « Work » en violet. Une rangée horizontale épinglée qui défile de gauche à droite quand on scrolle vers le bas. Les cartes sont en zigzag (01 en haut, 02 en bas, 03 en haut…), séparées par des lignes verticales fines. Chaque carte : un grand numéro, le nom du projet aligné à droite, une catégorie en petit, « Tools and features » et la liste des outils, un visuel (captures d'écran sur fond dégradé coloré). En fin de rangée : « Want to see more? », une phrase, et un bouton pilule violet « See All Works → ».
B7. Stack. Titre « TECH STACK » centré. Une grille de petites tuiles carrées sombres aux coins arrondis, chacune avec un logo et un nom minuscule dessous, en 3 ou 4 rangées centrées. Les tuiles tombent en cascade à l'apparition.
B8. Contact. La pilule email du haut devient un bouton violet « Hire Me → ». Le NOM en grand à gauche, des colonnes « Email », « Location », « Social » (liens soulignés avec une flèche ↗), et à droite « Designed and Developed by … © ».
B9. Page « All Works ». Une pilule « ← Back to Home » en haut au centre, un titre (dernier mot en violet), un sous-titre, puis une grille de 3 colonnes de cartes : visuel avec badge numéro, titre, catégorie en violet, description, outils. Apparition en cascade.
Ce qu'on retient : la structure, la chorégraphie entre la caméra et les sections, le curseur, les cartes en équerre, la timeline au point lumineux, le zigzag horizontal, la grille de la stack, les pilules.
Ce qu'on change : violet → ambre ; fond violacé → anthracite neutre ; l'avatar, c'est moi ; l'écran rose → mes vrais dashboards ; on ajoute des filtres façon Power BI, des niveaux honnêtes et des liens entre compétences et projets. On ne copie aucun texte, visuel ni modèle.



## D. Direction artistique (obligatoire)
<!-- D. DIRECTION ARTISTIQUE (OBLIGATOIRE) -->

Couleurs (variables CSS) :
  --night   #0E0F11  fond principal
  --night-2 #16171A  surfaces, cartes
  --night-3 #1E2024  survol des surfaces
  --line    rgba(237,237,234,0.10)  bordures et séparateurs
  --mist    #9A9C9F  texte secondaire, brume
  --snow    #EDEDEA  texte principal, neige
  --amber   #F2A33A  seul accent
  --amber-soft rgba(242,163,58,0.15)  fonds actifs
Règle de l'ambre : réservé à la lumière (fenêtre, écran, lampe, feu), aux chiffres clés, aux boutons principaux et aux éléments actifs. Jamais plus d'environ 5 % de la surface d'un écran.
Dans la 3D, les gris peuvent être très légèrement froids (saturation maximale 8 %) pour l'heure bleue. Les valeurs exactes seront fixées en phase 01 dans design/ambiance.json.
Ambiance retenue en phase 01 (choix de Kerem, 08/11/2026) : 3 · Nuit tombée, sans emprunt ; l'heure bleue sert d'étape intermédiaire pendant la tombée de la nuit dans l'entrée (phases 03 et 05). Valeurs clés (design/ambiance.json → choisi) : ciel #17181A → #3F4348 · brouillard #2F3236, densité 0,012 (caché à 95 % à 144 m) · neige #6F7377, roche #27292C, bois #57534E · fenêtre émissive #F2A33A × 5, lueur 12 nits, lampe intérieure 200 cd · exposition 0,85, tone mapping AgX · bloom 1,2 (seuil 0,9) · grain 0,04 · vignettage 0,3 / 0,55 · micro-texte snow, 8,7:1 au plus faible.

Typographie :
- General Sans (Fontshare), graisses 400, 500 et 600 : titres et textes. Vérifie et note la licence.
- Geist Mono (paquet npm « geist »), graisses 400 et 500 : chiffres, données, étiquettes, navigation. Chiffres en tabular-nums.
- Échelle : display clamp(56px, 7vw, 120px), interligne 0.95, interlettrage -0.03em · h1 clamp(40px, 4.4vw, 72px), -0.02em · h2 clamp(28px, 3vw, 44px) · h3 20 à 24 px · texte 16 à 18 px, interligne 1.6 · petit 14 px · étiquette mono 11 à 12 px, majuscules, interlettrage 0.08 à 0.3em.

Mise en page : grille de 12 colonnes ; marges latérales de 24 px sur mobile et 4vw sur ordinateur (minimum 32 px, maximum 80 px) ; gouttière 24 px ; barre du haut de 64 px.

Matière : grain en surimpression fixe (SVG feTurbulence, opacité 0.04, fusion overlay), vignettage doux, flou de profondeur dans la 3D.

Mouvement :
- Courbes : ease-out-expo cubic-bezier(0.16, 1, 0.3, 1) ; ease-in-out cubic-bezier(0.65, 0, 0.35, 1).
- Durées : micro 0.2 s (survol), interface 0.45 s, apparition 0.9 s ; les scènes 3D sont pilotées par le scroll.
- Texte : apparition mot par mot, 30 à 45 ms d'écart entre les mots.
- Interdits : rebond, dépassement, parallaxe agressive, animation qui retarde la lecture.

3D : monochrome ; matières mates (argile, neige, bois désaturé, pierre) ; une seule couleur, l'ambre des sources de lumière ; bloom uniquement sur l'ambre ; brouillard ; grain ; profondeur de champ légère ; aberration chromatique uniquement pendant les transitions (décalage maximal 0.0012).

Icônes : trait fin de 1.5 px (Lucide ou équivalent) ; logos de technologies en monochrome.

Textes : français simple, phrases courtes, aucun jargon creux, aucune formule typique d'IA. Passe les skills stop-slop et copy-editing sur tout texte visible.

## E. Plan du site et chapitres (ordre réel d'affichage)
<!-- E. PLAN DU SITE ET CHAPITRES (ORDRE RÉEL D'AFFICHAGE) -->

Identifiants de chapitres : loader, entree, accueil, apropos, competences, parcours, projets, stack, contact.
1. loader : référence B1 adaptée (fond neige, texte géant qui défile, pilule de chargement qui devient « Entrer »).
2. entree : référence A1 à A6 adaptée à la cabane (environ 600vh de scroll sur ordinateur, 450vh sur mobile).
3. accueil : référence B2 adaptée.
4. apropos : référence B3 adaptée.
5. competences : référence B4 adaptée.
6. parcours : référence B5 adaptée.
7. projets : référence B6 adaptée.
8. stack : référence B7 adaptée.
9. contact : référence B8 adaptée. Fin optionnelle inspirée de A9 et A10 : l'avatar se dissout en points et on revient au nuage du début.
Pages : /projets (référence B9 adaptée, avec filtres), /projets/[slug] (une page par projet), /making-of.

Fil conducteur 3D : une seule scène persistante, dans un canvas fixe derrière le DOM. L'extérieur pendant l'entrée, l'intérieur ensuite. Pendant parcours, projets et stack, la scène passe en arrière-plan (floue et assombrie), puis revient au premier plan pour le contact.
Avatar : assis sur une chaise pivotante. Tourné vers le visiteur pendant accueil, apropos et contact ; tourné vers son bureau, en train de taper, pendant competences.

## F. Contenu (source unique)
<!-- F. CONTENU (SOURCE UNIQUE) -->

Sources autorisées : cette section, plus les README et fichiers des dépôts listés ci-dessous pour enrichir les pages projets. Rien d'autre. S'il manque une information, pose la question.

IDENTITÉ
- Nom : Kerem Uysal
- Titre : Data Analyst · étudiant en B2 IA & Data
- École : Ynov Lyon Campus
- Localisation : Région lyonnaise · mobile partout en France
- Recherche : alternance Data Analyst pour la B3, dès septembre 2027 · 3 semaines en entreprise, 1 semaine à l'école
- Email : keremuysal19@icloud.com (affiché avec un bouton « Copier l'email »)
- LinkedIn : https://www.linkedin.com/in/kerem-uysal-0528823a9/
- GitHub : https://github.com/krm3z
- CV : pas encore de fichier ; le bouton reste masqué tant que public/cv-kerem-uysal.pdf n'existe pas
- Pitch (accueil) : « Dans le bruit des données, je cherche ce qui éclaire une décision. » (le mot « éclaire » en ambre)
- Mots qui alternent dans l'accueil : DATA ANALYST (ambre) · SQL · POWER BI · IA GÉNÉRATIVE
- À propos : « Étudiant en B2 IA & Data à Ynov Lyon. À côté des cours, je travaille 25 h par semaine chez Carrefour, j'ai lancé ma marque de sacs LELON en septembre 2026, et je construis des sites et des IA en pilotant des agents. Ce qui m'intéresse dans la data, c'est trouver dans les chiffres ce qui aide à décider. Je cherche une alternance Data Analyst pour ma B3, dès septembre 2027. »
- Chiffres clés : 11 246 publications NASA analysées · 8 projets data, web et IA · 25 h par semaine chez Carrefour, en parallèle des cours

PROJETS EN VEDETTE (dans cet ordre)
01 · slug nasa-data-pipeline · NASA Data Pipeline
- Question : les données ouvertes de la NASA permettent-elles de retracer l'exploration spatiale moderne ?
- Ma part : projet en binôme ; je tiens la partie Data Analyst : problématique, KPI, analyses SQL, dashboard Power BI, conclusions. Mon binôme tient la partie data engineering.
- Résultats : 11 246 publications APOD analysées, du 16/06/1995 au 04/04/2026 · Hubble est la seule mission présente chaque année · Pluton 2015 : 20 titres, dont 8 en juillet (survol de New Horizons) · Spirit 2004 : 8 titres, dont 5 en janvier · Webb devient en 2025 aussi présent que Hubble.
- Outils : Python, API NASA, SQLite, SQL, Power BI · Statut : terminé · Catégories : Data
- Lien : https://github.com/krm3z/nasa-data-pipeline · Visuel : docs/missions.png dans ce dépôt (le dashboard)
- Contexte (mes mots, à reprendre tels quels) : « Tout est parti d'Interstellar, que j'ai revu des dizaines de fois. J'ai proposé le sujet à Edvige, et j'ai découvert que la NASA publie une image par jour depuis 1995. »
- Ce que j'en retiens (mes mots, à reprendre tels quels) : « Je pensais que l'analyse de données, c'était lancer des requêtes sur une base où tout est déjà rangé. En réalité, le SQL m'a montré les pics, mais c'est l'enquête qui les a expliqués : chercher sur le web ce qui s'était passé, mois par mois. C'est la partie qui m'a le plus plu. C'était aussi mon premier projet sous Power BI. On prend vite ses repères quand on connaît Excel, et voir 30 ans de données prendre forme dans un graphique, j'ai trouvé ça vraiment beau. »
02 · slug pollution-meteo · Pollution & Météo Data Pipeline
- Question : comment relier pollution de l'air et météo pour mesurer un impact environnemental ?
- Ma part : challenge data de 48 h en groupe ; ce dépôt est ma version personnelle complète.
- Résultats : chaque station de pollution associée à la station météo la plus proche (jointure géospatiale) · fusion horaire · indice d'impact de 0 à 100 (NO2 30 %, O3 20 %, PM10 25 %, PM2,5 25 %, ajusté par le vent) · 4 niveaux (faible, modéré, élevé, critique) · API FastAPI de 5 routes.
- Outils : Python, pandas, FastAPI · Statut : terminé · Catégories : Data
- Lien : https://github.com/krm3z/pollution-meteo-data-pipeline · Visuel : à créer en phase 09 à partir de output/final_dataset.csv
- Contexte (mes mots, à reprendre tels quels) : « Pendant le challenge data de 48 h d'Ynov, les membres de la partie IA et data étaient absents. En B1, j'ai pris cette partie en charge. Le chef de projet a préféré refaire l'analyse de son côté, et il est arrivé aux mêmes résultats. J'ai donc décidé d'aller au bout dans mon propre dépôt, en respectant toute la consigne et en allant plus loin : jointure géospatiale, indice d'impact et API. »
- Ce que j'en retiens (mes mots, à reprendre tels quels) : « Quand on est le plus jeune de l'équipe, avoir raison ne suffit pas, il faut aussi savoir le montrer. Ce projet m'a appris à aller au bout de mon travail et à le défendre avec des preuves. »
03 · slug hirastream · HiraStream
- Question : comment reconnaître et classer un morceau de musique à partir du son ?
- Ma part : projet YDays de 400 h, équipe de 6 (2 développeurs de M1, 4 profils data) ; je développe la partie IA : un modèle de Machine Learning qui reconnaît et classe les morceaux à partir du son. J'ai aussi réalisé les maquettes de l'application.
- Contexte : plateforme musicale familiale auto-hébergée sur Raspberry Pi, budget 0 €, 100 % open source.
- Outils : Python, librosa, scikit-learn, FastAPI, Docker · Statut : en cours · Catégories : IA, Data
- Lien : https://github.com/Riantsoa11/hiraStream (le dépôt doit passer en public ; s'il est encore privé à la phase 09, pas de lien) · Visuel : schéma d'architecture à créer en phase 09, ma partie en ambre
- Contexte (mes mots, à reprendre tels quels) : « HiraStream est un projet YDays : les équipes mélangent les filières et les niveaux, du B1 au master. »
- Ce que j'en retiens, pour l'instant (mes mots, à reprendre tels quels ; le projet est en cours) : « L'an dernier, sur Héritage, j'étais en soutien. Cette année, j'ai pris l'initiative : j'ai fait les maquettes et j'ai poussé l'équipe à fixer les couleurs, les formes et la façon de coder avant d'écrire la première ligne. En parallèle, je développe la partie IA. J'ai beaucoup plus d'impact sur le projet. »
04 · slug lelon · LELON
- Question : peut-on lancer une marque et sa boutique en pilotant des agents IA ?
- Ma part : fondateur ; j'ai créé mon entreprise, fait mes premières déclarations URSSAF et configuré Shopify réglage par réglage (paiements compris). Le code du site a été écrit par Claude Code sous ma direction : on le dit clairement, la compétence montrée ici n'est pas le code.
- Résultat : marque de sacs à main lancée en septembre 2026, boutique en ligne.
- Outils : Shopify, agents IA · Statut : en ligne · Catégories : IA, Dev web
- Lien : https://lelon.fr · Visuel : capture de la page d'accueil de lelon.fr (phase 09)
- Contexte (mes mots, à reprendre tels quels) : « Tout est parti d'une envie : avoir ma propre marque. »
- Ma part (mes mots, à reprendre tels quels) : « J'ai créé mon entreprise et fait mes premières déclarations à l'URSSAF. J'ai configuré Shopify réglage par réglage, paiements compris. Le code du site, c'est Claude Code qui l'a écrit, sous ma direction. »
- Ce que j'en retiens (mes mots, à reprendre tels quels) : « Ce projet ne montre pas du code, il montre tout ce qu'il y a autour : créer une entreprise, gérer l'administratif, monter une boutique et diriger une IA. Mes compétences ne s'arrêtent pas à la fin des cours. »

AUTRES PROJETS (page « Tous les projets »)
05 · slug world-cup-winner · World Cup Winner · prédire le vainqueur de la Coupe du monde 2030 · équipe de 3 ; je m'occupe de l'analyse des données · Python, Machine Learning · en cours · Data, IA · https://github.com/HOUDAED/World_Cup_Winner
   Contexte (mes mots, à reprendre tels quels) : « Un projet en autonomie sur toute l'année, en équipe de trois, qui mêle data et IA. J'adore le foot, alors le sujet me parle. »
   Démarche (mes mots, à reprendre tels quels) : « Prédire le vainqueur de la Coupe du monde 2030 en lançant de nombreuses simulations, puis regarder quelle équipe ressort le plus souvent. »
   Ce que j'en retiens, pour l'instant (mes mots, à reprendre tels quels ; projet en cours) : « Le foot ne suit jamais les prédictions. C'est ce qui rend le projet intéressant : en 2030, on pourra comparer nos simulations avec le vrai résultat. »
06 · slug heritage · Héritage (YDays) · application sociale de partage d'histoires familiales · en soutien des M2 data et dev web : participation au front, PWA (application installable) codée par moi, idées pour la base de données, le menu et l'accueil · Next.js, Spring Boot, PostgreSQL, Docker · terminé · Data, Dev web · https://github.com/STimour/Heritage_ydays
   Contexte (mes mots, à reprendre tels quels) : « Mon premier vrai projet professionnel, en B1, en soutien d'étudiants de M2 data et développement web. »
   Ma part (mes mots, à reprendre tels quels) : « J'ai participé au front et codé moi-même la PWA, qui rend l'application installable. J'ai aussi proposé des idées pour la base de données, le menu et l'accueil. »
   Ce que j'en retiens (mes mots, à reprendre tels quels) : « Je pensais qu'un projet, c'était arriver et coder. J'ai découvert qu'avant la première ligne, on réfléchit à chaque détail : la couleur, l'aspect commercial, l'image, la communication. J'ai aussi compris comment un site se construit, entre le front, le back et la base de données. C'est ce projet qui m'a donné les réflexes que j'applique cette année sur HiraStream. »
07 · slug groupie-tracker · Groupie Tracker « REK » · jeu multijoueur de blind test et de petit bac dans le navigateur · équipe de 3 ; j'ai développé les salles de jeu, le blind test avec l'API Spotify et le README · Go, API Spotify, SQLite · terminé · Dev web · https://github.com/Lyon-Ynov-Campus/groupie-tracker-rek
   Contexte (mes mots, à reprendre tels quels) : « Un projet de B1 en groupe de trois : coder un site de blind test et de petit bac. »
   Ma part (mes mots, à reprendre tels quels) : « J'ai intégré l'API Spotify et codé le front du blind test, ainsi que les salles de jeu. »
   Ce que j'en retiens (mes mots, à reprendre tels quels) : « C'était la première fois que je récupérais et intégrais une API. L'une des deux API prévues ne fonctionnait pas : j'ai dû m'adapter et passer par Spotify. »
08 · slug power4 · Power4 · Puissance 4 jouable à deux ou contre un bot · seul, projet de B1 · Go, HTML, CSS · terminé · Dev web · https://github.com/krm3z/Power4
   Contexte (mes mots, à reprendre tels quels) : « Mon premier projet de B1, en début d'année. Jusque-là, nos jeux tournaient dans le terminal. »
   Ma part (mes mots, à reprendre tels quels) : « Seul, j'ai codé le jeu en Go, avec son interface web et un bot à plusieurs niveaux de difficulté. »
   Ce que j'en retiens (mes mots, à reprendre tels quels) : « C'était la première fois que mon code devenait un vrai site. Le Puissance 4, tout le monde connaît : j'ai soigné les couleurs et respecté toute la consigne. Ce n'est pas mon projet le plus important, mais c'est celui où j'ai vu mon code prendre forme. »
09 · slug energie · Énergie · projet data sur le secteur de l'énergie · prochainement · Data · pas de lien (carte « Prochainement » sans page)

PARCOURS (afficher dans l'ordre chronologique, du plus ancien au plus récent)
- 2025 · Bac STI2D, spécialité SIN, mention Assez Bien · Formation
- 2025 – 2026 · B1 Informatique, Ynov Lyon Campus · Formation
- Depuis sept. 2026 · Caissier chez Carrefour, 25 h par semaine en parallèle des études · Expérience
- Depuis sept. 2026 · Fondateur de LELON, marque de sacs à main · Expérience
- 2026 – 2027 · B2 IA & Data, Ynov Lyon Campus · Formation
- Sept. 2027 · Objectif : alternance Data Analyst (B3) · Objectif (en ambre)

COMPÉTENCES (groupe · compétence → slugs des projets qui la prouvent)
Analyse de données
- Transformer une question business en problématique d'analyse → nasa-data-pipeline, pollution-meteo, world-cup-winner
- Collecter, nettoyer et préparer les données (pipelines ETL) → nasa-data-pipeline, pollution-meteo
- Analyser en SQL : jointures, agrégations, tendances → nasa-data-pipeline, heritage
- Construire des dashboards et raconter ce que disent les chiffres → nasa-data-pipeline
IA
- Piloter des agents IA : cadrer, découper, écrire les prompts, vérifier, corriger → lelon, et ce site (lien vers /making-of)
- Créer des modèles de Machine Learning (reconnaissance audio, prédiction) → hirastream, world-cup-winner
Technique
- Travailler sous Linux et en ligne de commande → hirastream
- Collaborer avec Git en équipe (issues, pull requests) → heritage, groupie-tracker, hirastream
Savoir-être
- Organisation : études, 25 h par semaine chez Carrefour et une marque en parallèle → parcours
- Esprit entrepreneur → lelon
- Relation client → parcours (Carrefour)
- Travail en équipe, jusqu'à 6 personnes → hirastream, heritage

STACK (niveau · outil → projets ; correspondance à me faire valider)
Maîtrisé (3 segments) : SQL (PostgreSQL, SQLite, MySQL) → nasa-data-pipeline, heritage, groupie-tracker · Excel → aucun projet listé (pas d'infobulle) · Git et GitHub → heritage, groupie-tracker, hirastream, nasa-data-pipeline · Linux (Debian, ligne de commande) → hirastream · Pilotage d'agents IA → lelon, making-of
En progression (2 segments) : Power BI (appris sur le projet NASA) → nasa-data-pipeline · Python → nasa-data-pipeline, pollution-meteo, hirastream, world-cup-winner · pandas → pollution-meteo · APIs REST et JSON → nasa-data-pipeline, groupie-tracker, pollution-meteo · Pipelines ETL → nasa-data-pipeline, pollution-meteo · Machine Learning audio (librosa, scikit-learn) → hirastream
Bases (1 segment) : HTML/CSS → power4, groupie-tracker · JavaScript/TypeScript → heritage · React/Next.js → heritage · Go → power4, groupie-tracker · FastAPI → pollution-meteo, hirastream · Docker → heritage, hirastream

## G. Technique, conventions, budgets, skills et règles de travail
<!-- G. TECHNIQUE, CONVENTIONS, BUDGETS, SKILLS ET RÈGLES DE TRAVAIL -->

Pile technique (vérifie les versions stables actuelles avec npm view avant d'installer ; n'invente aucune API) :
- Next.js (App Router, TypeScript strict), Tailwind CSS relié aux variables de la section D.
- three, @react-three/fiber, @react-three/drei, @react-three/postprocessing, avec des versions compatibles entre elles.
- motion (import depuis « motion/react ») pour les animations d'interface.
- gsap et ScrollTrigger pour les timelines pilotées par le scroll (vérifie et note la licence actuelle).
- lenis pour le scroll fluide : un seul moteur de scroll.
- zustand pour l'état partagé entre la 3D et le DOM.
- next-intl pour le français (par défaut, URL sans préfixe) et l'anglais (/en).
- Outils 3D : @gltf-transform/cli (optimisation), décodeurs meshopt et Draco, transcodeur KTX2 dans public/basis/.
- Tests : Playwright (captures et parcours), Vitest (fonctions pures).
- Rendu : WebGLRenderer, pas de WebGPU en production (compatibilité Safari et iOS).
- Hébergement : Vercel. Mon PC est sous Windows : commandes compatibles PowerShell, chemins avec des barres obliques, pas de script réservé à bash.

Conventions :
- Composants en PascalCase ; fichiers 3D en kebab-case (exterior.glb, interior.glb, avatar.glb, avatar-coat.glb).
- Ancres Blender : ANCHOR_* (ANCHOR_SEAT, ANCHOR_DOOR, ANCHOR_COAT, ANCHOR_WINDOW...). Matériaux : MAT_*. Matériaux émissifs : EMI_*.
- Clips d'animation : walk, idle, wave, standToSit, sitIdle, typing.
- Chapitres : les identifiants de la section E, partout (DOM, store, caméra, sons, captures).

Budgets :
- Loader visible en moins de 1 s ; LCP inférieur à 2.5 s.
- JavaScript initial hors three.js inférieur à 250 Ko gzip ; three.js chargé après l'affichage du loader.
- Modèles : avatar 3 Mo maximum, chaque scène 3 Mo maximum, 8 Mo au total pour tout ce qui est affiché avant l'accueil.
- Moins de 150 draw calls ; mémoire des textures inférieure à 150 Mo.
- 60 images par seconde sur un ordinateur portable récent ; au moins 30 sur un mobile de milieu de gamme.

Accessibilité et secours :
- Tout le contenu existe aussi en texte dans le DOM : sans WebGL, le site reste complet, avec des images fixes rendues dans Blender.
- prefers-reduced-motion : pas de scroll pilotant la caméra, l'intro est remplacée par une image fixe, uniquement des fondus.
- Lien d'évitement « Aller au contenu », navigation complète au clavier, focus visible (anneau ambre de 2 px, décalé de 3 px), contraste AA, textes alternatifs, annonce aria-live quand l'email est copié.

Skills (obligatoire à chaque phase) :
1. Au début de la phase, prends les skills nommés dans le prompt, puis cherche dans .claude/skills (et ~/.claude/skills) tous les autres skills qui touchent la phase, avec des mots-clés.
2. Lis le SKILL.md de chacun en entier, ainsi que ses fichiers de référence quand il y renvoie.
3. Dans ton plan, écris une ligne par skill : ce que tu en appliques concrètement.
4. À la fin de la phase, écris une ligne par skill : appliqué, ou non applicable et pourquoi.
5. Ordre de priorité en cas de conflit entre skills : ECC (règles, agents, commandes) → design-taste-frontend → ui-ux-pro-max, design-system, ui-styling, design → design-motion-principles → skills 3D et motion (motion-framer, threejs-*, react-three-fiber, web3d-integration-patterns, blender-web-pipeline, substance-3d-texturing...) → motion, improve, fix → skills marketing (copywriting, copy-editing...) → stop-slop → remotion-* → context engineering → tous les autres. Mais les décisions de ce CLAUDE.md (direction artistique, pile technique, contenu) passent avant tous les skills.
6. Un seul moteur par usage : 3D = three.js via React Three Fiber ; scroll = Lenis avec GSAP ScrollTrigger ; animations d'interface = Motion. Les skills babylonjs-engine, playcanvas-engine, aframe-webxr, pixijs-2d, spline-interactive, rive-interactive, lottie-animations, animejs, barba-js, locomotive-scroll, react-spring-physics, scroll-reveal-libraries et lightweight-3d-effects se lisent pour leurs principes, sans installer leurs bibliothèques. webgpu-threejs-tsl et shaders-cursor-ripples : lecture seulement, pas de WebGPU en production.
7. Agents ECC à utiliser : planner (plan de chaque phase), architect (phase 04), code-reviewer, typescript-reviewer et react-reviewer (fin de chaque phase de code), performance-optimizer (phases 05 et 11), a11y-architect (phases 06 à 11), seo-specialist (phase 11), e2e-runner (captures et parcours), security-reviewer (avant la mise en ligne), build-error-resolver et react-build-resolver si le build casse.
8. Règles ECC : elles s'appliquent, sauf l'objectif de 80 % de couverture de tests. Ici, des tests ciblés : fonctions pures avec Vitest, parcours clés avec Playwright.

Règles de travail :
1. Une phase par session. Relis CLAUDE.md au début. Enregistre le prompt de la phase dans prompts/.
2. Plan d'abord : étapes, fichiers touchés, skills, risques. Attends mon accord avant d'exécuter.
3. Boucle visuelle obligatoire : après chaque changement visible, captures à 1440×900 et 390×844 (et une vidéo pour les animations) avec le script de captures créé en phase 04. Compare-les aux descriptions de la section C et aux critères de la phase. Écris la liste des écarts, corrige, recommence. Au bout de 5 tours, montre-moi où tu en es.
4. Making-of : garde les captures avant, intermédiaires et après dans making-of/phase-XX/. Dans making-of/notes.md, une entrée par phase : ce qui a été demandé, ce qui a été refait et pourquoi, les chiffres (tours, durée, poids, images par seconde).
5. Zéro invention : le contenu vient uniquement de content/ et des sources de la section F. S'il manque une information, pose la question.
6. Projets d'équipe : écris uniquement ma part réelle.
7. Code lisible, commenté en français aux endroits clés, sans sur-ingénierie : je dois pouvoir l'expliquer en entretien.
8. Ne casse jamais une phase validée. Si une phase doit en modifier une autre, préviens-moi avant.
9. À la fin d'une phase validée : mets à jour le statut dans CLAUDE.md, commit en français (« phase 05 : entrée cinématique »), push.
10. Performance et accessibilité vérifiées à chaque phase, pas seulement à la fin.
11. Pose tes questions regroupées en une seule liste, pas une par une.
