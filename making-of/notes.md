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

**Chiffres**
- Skills : 282 · agents : 71 · commandes : 98 (conformes aux comptes attendus).
- Poids de `.claude/` : environ 51 Mo (le plus gros fichier : une vidéo de démo de 3,8 Mo dans le skill scroll-world-storytelling).
- Tours de boucle visuelle : 0 (aucun rendu dans cette phase).
