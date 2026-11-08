# Phase 01 · Bilan des skills

Une ligne par skill : appliqué (et où), ou non applicable (et pourquoi). Règle de conflit : CLAUDE.md passe avant tout skill.

## Demandés par le prompt (28)

| Skill | Bilan |
|---|---|
| design-taste-frontend | Appliqué : un display très grand face à du petit texte, un titre par section, aucune grille de cartes uniforme sans hiérarchie, boucle captures → critique sur 3 tours. |
| ui-ux-pro-max | Appliqué : accessibilité avant tout, cibles de 44 px au doigt, aucun défilement horizontal à 390 px (vérifié), aucune information portée par la couleur seule (niveaux et contrastes écrits). |
| design-system | Appliqué : `tokens.css` en 3 couches, matrice des 5 états par composant (section 07), aucun hex brut dans les composants. |
| design | Appliqué comme routeur vers design-system et ui-styling ; logo, bannières, slides : non applicables. |
| ui-styling | Appliqué : accordéon en bouton + `aria-expanded` + `aria-controls`, filtres en `aria-pressed`. shadcn et Tailwind : phase 04. |
| frontend-design | Appliqué : l'audace à un seul endroit (la lumière ambre), plancher qualité (responsive, focus visible, mouvement réduit). |
| impeccable | Appliqué : audit (contraste, clavier, sémantique, cibles tactiles, débordements, `will-change`), recommandations corrigées. Son binaire n'a pas été exécuté. |
| emil-design-eng | Appliqué : porte de fréquence avant chaque animation, appui en scale(0.96), jamais scale(0), transitions interruptibles, survol réservé aux pointeurs précis. |
| apple-design | Appliqué : aucun rebond, retour dès l'appui, toast qui repart par où il est venu, `prefers-contrast: more`. |
| modern-web-design | Appliqué : curseur en `requestAnimationFrame` coupé au tactile et en mouvement réduit, contenu complet sans JavaScript, aucun détournement du scroll. |
| build-awwwards-quality-sites | Appliqué : direction écrite avant le code, premier état fixe complet, mots découpés sans gêner les lecteurs d'écran. |
| make-interfaces-feel-better | Appliqué : `tabular-nums`, `text-wrap: balance / pretty`, icônes 1,5 px en `currentColor`, icône « copié » depuis scale(0.8) avec flou, cibles agrandies au doigt. |
| baseline-ui | Appliqué en relecture : échelle de z-index fixe, `transform` et `opacity`, retours de survol ≤ 200 ms, boucles en pause hors écran, `safe-area`. Tailwind, `cn` et Base UI : phase 04. |
| web-design-guidelines | Appliqué : règles récupérées en ligne le jour de la revue ; ajoutés : `touch-action`, `text-wrap: pretty`, insécables nombre-unité, `translate="no"`, lectures puis écritures groupées dans la démo h. |
| design-motion-principles | Appliqué : mode Create pour les 8 démos (cookbook, gotchas, accessibilité), mode Audit en fin de phase. |
| animation-systems | Appliqué : chorégraphie (l'élément principal d'abord), fondu + montée comme entrée de base, déclenchement unique, `motion.json` rangé par durées, courbes, distances, écarts. |
| animation-vocabulary | Appliqué : chaque démo porte son terme exact (Stagger, Mask reveal, Number ticker, Hover lift, Accordion, Blur fade, Text rotate, Scroll-driven). |
| animate | Appliqué : but nommé et fréquence avant chaque animation, l'outil le moins cher (CSS puis Web Animations API), version réduite livrée avec chaque démo. |
| motion-design | Appliqué : personnalité « Premium », une courbe signature, 3 durées, décalage total ≤ 500 ms. |
| staggered-word-reveal | Appliqué : démo a, 35 ms d'écart, une seule fois, texte lisible sans JavaScript. |
| masked-reveal | Appliqué : démo b, mots qui montent derrière un masque ; version GSAP en phase 04. |
| canvas-design | Appliqué : philosophie visuelle nommée en tête (« La fenêtre allumée ») ; ambiances traitées comme des tableaux, palette restreinte. |
| theme-factory | Lu : aucun thème appliqué, la DA est fixée. |
| dataviz | Appliqué : section 08, barres fines à bout arrondi, ambre pour le fait, valeurs écrites, infobulle au survol et au clavier, tableau de données. |
| copywriting | Appliqué : textes tirés de `content/`, rien d'inventé ; légendes passées aux trois questions. |
| copy-editing | Appliqué : section 13, propositions ligne par ligne avec leur raison ; `content/` inchangé. |
| stop-slop | Appliqué sur mes légendes : pas de tiret cadratin (sauf ton titre), voix active, pas d'adverbes creux. |
| review-animations | Appliqué : corrigés : l'icône copiée partait de scale(0.25), un `will-change` permanent, la raison manquante du toast. Gardés car demandés par le brief : le soulignement en 0,45 s, le point qui pulse. Verdict après corrections : Approve. |

## Ajoutés après recherche (16)

| Skill | Bilan |
|---|---|
| site-3d-immersif | Appliqué : « bible du monde » en section 11 ; l'ambre traité comme une lumière. |
| animation-performance | Appliqué : flou animé ≤ 8 px, aucun `will-change` au repos, lectures de mise en page groupées. |
| find-animation-opportunities | Appliqué : encart « ce qui ne bouge pas » (section 10). |
| fixing-accessibility | Appliqué : noms accessibles, éléments natifs, annonce « Email copié », contenu fermé masqué au clavier. |
| brand | Appliqué : la page construite comme un guide de style. |
| brand-voice | Appliqué : propositions de la section 13 jugées sur ta voix (phrases courtes, chiffres précis). |
| progressive-blur | Appliqué : profondeur de champ par paliers de flou fixes (1, 4, 8 px), sans `backdrop-filter`. |
| horizontal-scroll-scenes | Appliqué au storyboard (vignette 13 : rangée de projets à l'horizontale) ; le détail est en phase 09. |
| scroll-scrubbed-visual-sequence | Appliqué : démo h pilotée par le défilement natif de son cadre ; plages en vh dans le storyboard. |
| cinematic-gsap-lenis-motion-system | Appliqué : équivalents GSAP et réglages Lenis / ScrollTrigger dans `motion.json`. |
| build-threejs-scroll-worlds | Appliqué : `ambiance.json` = états de départ et d'arrivée à interpoler (jour → ambiance choisie). |
| scroll-world-storytelling | Appliqué : légendes « chapitre · plage · ce qui bouge » ; trois études d'ambiance. |
| threejs-fundamentals | Appliqué : formule du brouillard reproduite à l'identique, testée. |
| threejs-lighting | Appliqué : unités des lumières (multiplicateurs, candela, nits) dans `ambiance.json`. |
| threejs-postprocessing | Appliqué : bloom, vignette (formule de postprocessing portée et testée), grain, profondeur de champ, aberration 0,0012. |
| algorithmic-art | Appliqué : aléa à graine partout, mêmes images à chaque rendu. |

## Regardés, non retenus

taste, taste-application, taste-distillation (esthétique vidéo) · motion, motion-framer (React, phase 04) · improve-animations (review-animations a fait la relecture) · gsap-* (phases 04-05) · lottie, rive, spline, animejs, barba, locomotive, react-spring, scroll-reveal-libraries, lightweight-3d-effects (moteurs non retenus, règle G.6) · threejs-materials, textures, loaders (phase 03) · webgpu-threejs-tsl, shaders-cursor-ripples (lecture seule) · ui-demo, e2e-testing, browser-qa (outillage maison) · remotion-*, video, banner-design, ad-creative, image (hors sujet) · data:data-visualization, data:create-viz (dataviz couvre le besoin) · motion-lelon (autre marque) · inherit-legacy-style, frontend-slides (hors sujet).
