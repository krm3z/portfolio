// Comportements communs de la page (réglages, index, curseur, boucles).
// Ce fichier et les client.js des sections sont réunis dans une seule fonction : ils partagent ces outils.

const $ = (sel, racine = document) => racine.querySelector(sel)
const $$ = (sel, racine = document) => [...racine.querySelectorAll(sel)]
const params = new URLSearchParams(location.search)
const racineHtml = document.documentElement
const systemeReduit = matchMedia('(prefers-reduced-motion: reduce)')

/** Mémoire locale facultative : la page marche aussi sans (navigation privée, aperçu). */
const memoire = {
  lire(cle) { try { return localStorage.getItem(`da:${cle}`) } catch { return null } },
  ecrire(cle, valeur) { try { localStorage.setItem(`da:${cle}`, valeur) } catch { /* rien à faire */ } },
}

/** État partagé par toutes les sections. */
const etat = {
  capture: params.has('capture'),
  reduit: params.get('mouvement') === 'reduit' || (params.get('mouvement') !== 'normal' && systemeReduit.matches),
  pause: false,
}
// Choix validé : en mouvement réduit, les boucles sont arrêtées dès le départ.
etat.pause = etat.capture || etat.reduit || memoire.lire('pause') === '1'

if (etat.capture) racineHtml.classList.add('capture')
if (params.get('fixes') === '0') racineHtml.classList.add('sans-fixes')

/** Annonce un message aux lecteurs d'écran (zone aria-live). */
function annoncer(texte) {
  const zone = $('#annonces')
  if (!zone) return
  zone.textContent = ''
  setTimeout(() => { zone.textContent = texte }, 30)
}

/** Lance une fonction quand l'élément devient visible (une seule fois par défaut). */
function quandVisible(element, rappel, { seuil = 0.2, uneFois = true } = {}) {
  if (!element) return
  if (etat.capture || !('IntersectionObserver' in window)) { rappel(element); return }
  const observateur = new IntersectionObserver((entrees) => {
    for (const entree of entrees) {
      if (!entree.isIntersecting) continue
      rappel(entree.target)
      if (uneFois) observateur.unobserve(entree.target)
    }
  }, { threshold: seuil, rootMargin: '0px 0px -10% 0px' })
  observateur.observe(element)
}

/* ----- Boucles : elles tournent seulement si elles sont visibles, si l'onglet est actif et sans pause ----- */
const boucles = []
function enregistrerBoucle({ element, demarrer, arreter }) {
  const boucle = { element, demarrer, arreter, visible: false, active: false }
  boucles.push(boucle)
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entree]) => { boucle.visible = entree.isIntersecting; majBoucles() }).observe(element)
  } else {
    boucle.visible = true
  }
  majBoucles()
  return boucle
}
function majBoucles() {
  for (const b of boucles) {
    // Voulu : en mouvement réduit, les boucles partent en pause (etat.pause = true) ; si le visiteur appuie
    // lui-même sur « reprendre », son choix explicite l'emporte (choix validé : « arrêtées dès le départ »).
    const doitTourner = b.visible && !etat.pause && !document.hidden
    if (doitTourner && !b.active) { b.active = true; b.demarrer() }
    if (!doitTourner && b.active) { b.active = false; b.arreter() }
  }
}
document.addEventListener('visibilitychange', majBoucles)

/* ----- Réglages de la page ----- */
function appliquerReglages() {
  racineHtml.dataset.mouvement = etat.reduit ? 'reduit' : 'normal'
  racineHtml.classList.toggle('boucles-en-pause', etat.pause)
  for (const bouton of $$('[data-outil]')) {
    const nom = bouton.dataset.outil
    const actif = {
      grain: !racineHtml.classList.contains('sans-grain'),
      grille: racineHtml.classList.contains('avec-grille'),
      mouvement: etat.reduit,
      pause: etat.pause,
    }[nom]
    bouton.setAttribute('aria-pressed', String(Boolean(actif)))
  }
  majBoucles()
  document.dispatchEvent(new CustomEvent('da:reglages'))
}

function brancherReglages() {
  if (memoire.lire('grain') === '0') racineHtml.classList.add('sans-grain')
  for (const bouton of $$('[data-outil]')) {
    bouton.addEventListener('click', () => {
      const nom = bouton.dataset.outil
      if (nom === 'grain') memoire.ecrire('grain', racineHtml.classList.toggle('sans-grain') ? '0' : '1')
      if (nom === 'grille') racineHtml.classList.toggle('avec-grille')
      if (nom === 'mouvement') { etat.reduit = !etat.reduit; if (etat.reduit) etat.pause = true }
      if (nom === 'pause') { etat.pause = !etat.pause; memoire.ecrire('pause', etat.pause ? '1' : '0') }
      appliquerReglages()
    })
  }
  systemeReduit.addEventListener('change', (e) => { etat.reduit = e.matches; if (e.matches) etat.pause = true; appliquerReglages() })
  appliquerReglages()
}

/* ----- Index : section courante, sommaire mobile ----- */
function brancherIndex() {
  const menu = $('.index__menu')
  const etroit = matchMedia('(max-width: 1023px)')
  if (menu && etroit.matches) menu.open = false
  const courant = $('.index__courant')
  const liens = new Map($$('[data-index]').map((a) => [a.dataset.index, a]))
  const sections = $$('.section')
  const total = String(sections.length).padStart(2, '0')
  const marquer = (id) => {
    for (const [cle, lien] of liens) lien.setAttribute('aria-current', String(cle === id))
    const lien = liens.get(id)
    if (courant && lien) courant.textContent = `${lien.querySelector('.index__num').textContent} / ${total} · ${lien.querySelector('.index__nom').textContent}`
  }
  if ('IntersectionObserver' in window) {
    const observateur = new IntersectionObserver((entrees) => {
      const visibles = entrees.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
      if (visibles[0]) marquer(visibles[0].target.id)
    }, { rootMargin: '-35% 0px -60% 0px' })
    sections.forEach((s) => observateur.observe(s))
  }
  marquer(sections[0]?.id)
  for (const lien of liens.values()) lien.addEventListener('click', () => { if (menu && etroit.matches) menu.open = false })
}

/* ----- Curseur personnalisé (souris seulement, jamais en mouvement réduit) ----- */
function brancherCurseur() {
  const curseur = $('.curseur')
  const precis = matchMedia('(hover: hover) and (pointer: fine)')
  if (!curseur || !precis.matches || etat.capture) return
  let cible = { x: -100, y: -100 }
  let position = { x: -100, y: -100 }
  let anime = false
  const lissage = 0.22 // part de l'écart rattrapée à chaque image (motion.json : curseur.suivi)
  const pas = () => {
    position.x += (cible.x - position.x) * lissage
    position.y += (cible.y - position.y) * lissage
    curseur.style.transform = `translate3d(${position.x}px, ${position.y}px, 0)`
    anime = Math.hypot(cible.x - position.x, cible.y - position.y) > 0.3
    if (anime) requestAnimationFrame(pas)
  }
  addEventListener('pointermove', (e) => {
    const actif = !etat.reduit && e.pointerType === 'mouse'
    racineHtml.classList.toggle('curseur-actif', actif)
    if (!actif) return
    cible = { x: e.clientX, y: e.clientY }
    if (!anime) { anime = true; requestAnimationFrame(pas) }
  }, { passive: true })
  document.addEventListener('pointerover', (e) => {
    curseur.classList.toggle('sur-lien', Boolean(e.target.closest('a, button, summary, [data-curseur]')))
  })
  // La souris quitte la fenêtre : mouseleave sur <html> (pointerleave ne remonte pas jusqu'au document).
  racineHtml.addEventListener('mouseleave', () => racineHtml.classList.remove('curseur-actif'))
  document.addEventListener('da:reglages', () => { if (etat.reduit) racineHtml.classList.remove('curseur-actif') })
}

brancherReglages()
brancherIndex()
brancherCurseur()
