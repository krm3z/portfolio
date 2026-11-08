// Section 10 · démos de mouvement (a à h). Les valeurs viennent de motion.json, injecté dans la page.
// Chaque démo a « Rejouer » et un interrupteur « Mouvement réduit » qui part du réglage du système.
// Les animations passent par l'API Web Animations : on peut les rejouer, les mettre en pause et les rembobiner.
// En mode capture, rien ne bouge : les démos restent sur leur état final.
{
  const source = $('#donnees-motion')
  const motion = source ? JSON.parse(source.textContent) : null
  const demos = new Map()

  if (motion) {
    const A = motion.animations
    const courbe = (nom) => motion.courbes[nom].css
    const anime = (el, images, options) => el.animate(images, { fill: 'both', ...options })
    const estReduit = (racine) => racine.classList.contains('demo--reduit')

    /** Branche une démo : boutons, état réduit, première lecture quand elle devient visible. */
    function brancher(lettre, { jouer, auto = false, pourFiger, figer }) {
      const racine = $(`[data-anim="${lettre}"]`)
      if (!racine) return
      const bascule = $('.demo__bascule', racine)
      const majBascule = (reduit) => {
        bascule.setAttribute('aria-pressed', String(reduit))
        racine.classList.toggle('demo--reduit', reduit)
      }
      const lancer = () => {
        for (const a of racine.getAnimations({ subtree: true })) a.cancel()
        jouer({ racine, reduit: estReduit(racine) })
        racine.classList.remove('demo--attente') // après : les animations tiennent déjà leur première image
      }
      majBascule(etat.reduit)
      $('.demo__rejouer', racine).addEventListener('click', lancer)
      bascule.addEventListener('click', () => { majBascule(!estReduit(racine)); lancer() })
      // Le réglage « Mouvement réduit » de la page s'applique aussi aux démos.
      document.addEventListener('da:reglages', () => { if (estReduit(racine) !== etat.reduit) majBascule(etat.reduit) })
      if (auto && !etat.capture) {
        racine.classList.add('demo--attente')
        quandVisible(racine, lancer, { seuil: 0.5 })
      }
      demos.set(lettre, { racine, lancer, pourFiger, figer })
    }

    // a · texte mot par mot
    brancher('a', {
      auto: true,
      jouer: ({ racine, reduit }) => {
        const s = A.texteMotParMot
        $$('.demo-mots__mot', racine).forEach((mot, i) => anime(mot,
          reduit ? [{ opacity: 0 }, { opacity: 1 }] : [{ opacity: s.de.opacity, transform: `translateY(${s.de.y}px)` }, { opacity: 1, transform: 'none' }],
          { duration: reduit ? s.reduit.duree : s.duree, delay: i * (reduit ? s.reduit.ecart : s.ecart), easing: courbe(s.courbe) }))
      },
    })

    // b · titre révélé par un masque (le mot monte dans sa ligne, rognée par son parent)
    brancher('b', {
      auto: true,
      jouer: ({ racine, reduit }) => {
        const s = A.titreMasque
        $$('.demo-masque__mot', racine).forEach((mot, i) => anime(mot,
          reduit ? [{ opacity: 0 }, { opacity: 1 }] : [{ transform: `translateY(${s.de.y})` }, { transform: 'none' }],
          { duration: reduit ? s.reduit.duree : s.duree, delay: i * (reduit ? s.reduit.ecart : s.ecart), easing: courbe(s.courbe) }))
      },
    })

    // c · compteur : une animation « vide » donne la progression (courbe comprise), le texte la suit
    brancher('c', {
      auto: true,
      jouer: ({ racine, reduit }) => {
        const s = A.compteur
        const sortie = $('.demo-compteur__anime', racine)
        const final = sortie.dataset.final
        if (reduit) { sortie.textContent = final; return }
        const format = new Intl.NumberFormat('fr-FR')
        const minuteur = anime(sortie, [{ opacity: 1 }, { opacity: 1 }], { duration: s.duree, easing: courbe(s.courbe) })
        racine.compteurCourant = minuteur
        const maj = () => {
          // Une lecture précédente (annulée par « Rejouer ») s'arrête sans rien écrire.
          if (racine.compteurCourant !== minuteur) return
          const p = minuteur.effect.getComputedTiming().progress
          sortie.textContent = p === null || p >= 1 ? final : format.format(Math.round(p * s.vers))
          if (minuteur.playState === 'running') requestAnimationFrame(maj)
        }
        racine.majCompteur = maj
        maj()
        requestAnimationFrame(maj)
      },
    })

    // d · survol d'une carte : transitions CSS (interruptibles) ; « Rejouer » simule le survol
    brancher('d', {
      jouer: ({ racine }) => {
        const carte = $('.carte-projet', racine)
        carte.classList.add('est-survol')
        clearTimeout(carte.minuteurSurvol)
        carte.minuteurSurvol = setTimeout(() => carte.classList.remove('est-survol'), 1600)
      },
      // Pour les captures : le survol commence sans minuteur de fin (il retirerait l'état au milieu des images).
      pourFiger: () => {
        const carte = $('[data-anim="d"] .carte-projet')
        clearTimeout(carte.minuteurSurvol)
        carte.classList.remove('est-survol')
        void carte.offsetHeight
        carte.classList.add('est-survol')
      },
    })

    // e · accordéon : on referme sans transition, puis on rouvre
    brancher('e', {
      jouer: ({ racine }) => {
        const carte = $('.carte-competence', racine)
        const bouton = $('.carte-competence__bouton', racine)
        carte.classList.add('sans-transition')
        carte.classList.remove('est-ouvert')
        bouton.setAttribute('aria-expanded', 'false')
        void carte.offsetHeight // applique l'état fermé avant de rouvrir
        carte.classList.remove('sans-transition')
        carte.classList.add('est-ouvert')
        bouton.setAttribute('aria-expanded', 'true')
      },
    })

    // f · changement de chapitre : fondu depuis un flou de 8 px
    brancher('f', {
      auto: true,
      jouer: ({ racine, reduit }) => {
        const s = A.transitionSection
        anime($('.demo-flou__bloc', racine),
          reduit ? [{ opacity: 0 }, { opacity: 1 }] : [{ opacity: 0, filter: `blur(${s.de.blur}px)` }, { opacity: 1, filter: 'blur(0px)' }],
          { duration: reduit ? s.reduit.duree : s.duree, easing: courbe(s.courbe) })
      },
    })

    // g · mots qui alternent : une boucle, arrêtée par la pause, hors écran et en mouvement réduit
    {
      const racine = $('[data-anim="g"]')
      const mots = racine ? $$('.demo-alternes__mot', racine) : []
      const s = A.motsAlternes
      let courant = 0
      let minuteur = 0
      let active = false
      const placer = () => mots.forEach((m, i) => {
        m.getAnimations().forEach((a) => a.cancel())
        m.style.transform = i === courant ? 'none' : 'translateY(100%)'
      })
      const planifier = () => {
        clearTimeout(minuteur)
        if (active && !estReduit(racine)) minuteur = setTimeout(suivant, s.cycle)
      }
      function suivant() {
        const sortant = mots[courant]
        courant = (courant + 1) % mots.length
        const entrant = mots[courant]
        const options = { duration: s.duree, easing: courbe(s.courbe), fill: 'forwards' }
        const sortie = sortant.animate([{ transform: 'none' }, { transform: 'translateY(-100%)' }], options)
        const entree = entrant.animate([{ transform: 'translateY(100%)' }, { transform: 'none' }], options)
        // finished est rejetée (AbortError) quand placer() annule une transition en cours : c'est voulu, on l'ignore.
        // Toute autre erreur remonte.
        const siPasAnnule = (e) => { if (e.name !== 'AbortError') throw e }
        sortie.finished.then(() => { sortant.style.transform = 'translateY(100%)'; sortie.cancel() }).catch(siPasAnnule)
        entree.finished.then(() => { entrant.style.transform = 'none'; entree.cancel() }).catch(siPasAnnule)
        planifier()
      }
      if (racine) {
        brancher('g', {
          jouer: () => { courant = 0; placer(); planifier() },
          // Pour les captures : on repart du premier mot et on lance une seule transition, sans planifier la suivante.
          pourFiger: () => { courant = 0; placer(); suivant(); clearTimeout(minuteur) },
        })
        if (!etat.capture) {
          enregistrerBoucle({ element: racine, demarrer: () => { active = true; planifier() }, arreter: () => { active = false; clearTimeout(minuteur) } })
        }
      }
    }

    // h · point de la timeline, piloté par le défilement de son propre cadre
    {
      const racine = $('[data-anim="h"]')
      if (racine) {
        const zone = $('.demo-timeline__defilement', racine)
        const liste = $('.demo-timeline__liste', racine)
        const rail = $('.demo-timeline__rail', racine)
        const point = $('.demo-timeline__point', racine)
        const lignes = $$('.demo-timeline__ligne', racine)
        const actuelle = $('.demo-timeline__ligne--actuelle', racine) ?? lignes[0]
        let defilementAuto = 0
        const maj = () => {
          if (!actuelle?.offsetParent) return // démo masquée (display: none) : rien à mesurer
          const debut = rail.offsetTop
          const longueur = rail.offsetHeight
          if (estReduit(racine)) {
            // Réduit : point fixe sur la ligne actuelle, toutes les lignes visibles, aucun lien au défilement.
            point.style.transform = `translateY(${actuelle.offsetTop + actuelle.offsetParent.offsetTop - debut + 8}px)`
            return
          }
          const y = Math.max(0, Math.min(longueur, zone.scrollTop + zone.clientHeight / 2 - debut))
          point.style.transform = `translateY(${y}px)`
          // Toutes les lectures de mise en page d'abord, puis les écritures : pas de recalcul forcé à chaque ligne.
          const positions = lignes.map((l) => l.offsetTop + l.offsetParent.offsetTop - debut + 8)
          lignes.forEach((l, i) => l.classList.toggle('est-passee', positions[i] <= y))
        }
        const arreterAuto = () => cancelAnimationFrame(defilementAuto)
        const versFraction = (p) => { zone.scrollTop = p * (zone.scrollHeight - zone.clientHeight); maj() }
        zone.addEventListener('scroll', () => requestAnimationFrame(maj), { passive: true })
        for (const evt of ['wheel', 'touchstart', 'keydown', 'pointerdown']) zone.addEventListener(evt, arreterAuto, { passive: true })
        brancher('h', {
          jouer: ({ reduit }) => {
            arreterAuto()
            zone.scrollTop = 0
            maj()
            if (reduit) return
            // Démonstration : le cadre défile seul, de haut en bas, en 3 s (linéaire : c'est le scroll qui pilote).
            const depart = performance.now()
            const pas = (t) => {
              const p = Math.min(1, (t - depart) / 3000)
              versFraction(p)
              if (p < 1) defilementAuto = requestAnimationFrame(pas)
            }
            defilementAuto = requestAnimationFrame(pas)
          },
          figer: (p) => { arreterAuto(); versFraction(p) },
        })
        if ('ResizeObserver' in window) new ResizeObserver(maj).observe(zone)
        // En capture, le cadre est arrêté à 45 % : on voit le mécanisme (lignes passées et à venir), pas une fin figée.
        if (etat.capture) versFraction(0.45)
        else maj()
      }
    }
  }

  // Accès pour le script de captures (planches de 5 instants) : fige une démo à une fraction de sa durée.
  window.daMouvement = {
    ids: () => [...demos.keys()],
    figer(lettre, fraction) {
      const d = demos.get(lettre)
      if (!d) return false
      if (d.figer) { d.figer(fraction); return true }
      for (const a of d.racine.getAnimations({ subtree: true })) a.cancel()
      d.racine.classList.remove('demo--attente')
      ;(d.pourFiger ?? d.lancer)()
      const animations = d.racine.getAnimations({ subtree: true })
      const fin = Math.max(0, ...animations.map((a) => a.effect.getComputedTiming().endTime))
      for (const a of animations) { a.pause(); a.currentTime = fraction * fin }
      d.racine.majCompteur?.()
      return true
    },
  }
}
