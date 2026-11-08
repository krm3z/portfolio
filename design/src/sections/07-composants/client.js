// Section 07 · comportements des composants vivants (bloc isolé : ses noms ne débordent pas).
{
  /* ----- Toast et copie de l'email ----- */
  const toast = $('#toast')
  let minuteurToast
  const afficherToast = (texte) => {
    if (!toast) return
    $('.toast__texte', toast).textContent = texte
    toast.classList.add('est-visible')
    clearTimeout(minuteurToast)
    minuteurToast = setTimeout(() => toast.classList.remove('est-visible'), 2400)
    annoncer(texte)
  }

  for (const bouton of $$('[data-demo="copier"]')) {
    bouton.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(bouton.dataset.email)
        bouton.classList.add('est-copie')
        afficherToast(bouton.dataset.message)
        clearTimeout(bouton.minuteurCopie) // deux copies rapprochées : la coche reste 2 s après la dernière
        bouton.minuteurCopie = setTimeout(() => bouton.classList.remove('est-copie'), 2000)
      } catch {
        // Copie refusée par le navigateur : on sélectionne l'adresse pour une copie à la main.
        const plage = document.createRange()
        plage.selectNodeContents($('.barre__adresse', bouton))
        getSelection().removeAllRanges()
        getSelection().addRange(plage)
        afficherToast(bouton.dataset.echec)
      }
    })
  }

  /* ----- FR / EN (démonstration) ----- */
  for (const bouton of $$('[data-demo="langue"]')) {
    bouton.addEventListener('click', () => {
      const [fr, en] = $$('span', bouton)
      const versEn = fr.classList.contains('est-courante')
      fr.classList.toggle('est-courante', !versEn)
      en.classList.toggle('est-courante', versEn)
      bouton.setAttribute('aria-label', versEn ? bouton.dataset.libelleEn : bouton.dataset.libelleFr)
    })
  }

  /* ----- Son : l'égaliseur ne s'anime que si le son est actif, visible et sans pause ----- */
  for (const bouton of $$('[data-demo="son"]')) {
    const boucle = enregistrerBoucle({
      element: bouton,
      demarrer: () => bouton.classList.toggle('en-boucle', bouton.classList.contains('est-allume')),
      arreter: () => bouton.classList.remove('en-boucle'),
    })
    bouton.addEventListener('click', () => {
      const allume = bouton.classList.toggle('est-allume')
      bouton.setAttribute('aria-label', allume ? bouton.dataset.couper : bouton.dataset.activer)
      bouton.classList.toggle('en-boucle', allume && boucle.active)
    })
  }

  /* ----- Pause des animations : le même réglage que celui de la page ----- */
  const majBoutonsPause = () => $$('[data-demo="pause"]').forEach((b) => b.setAttribute('aria-pressed', String(etat.pause)))
  for (const bouton of $$('[data-demo="pause"]')) {
    bouton.addEventListener('click', () => {
      etat.pause = !etat.pause
      memoire.ecrire('pause', etat.pause ? '1' : '0')
      appliquerReglages()
    })
  }
  document.addEventListener('da:reglages', majBoutonsPause)
  majBoutonsPause()

  /* ----- Accordéon de compétence ----- */
  for (const bouton of $$('[data-demo="accordeon"]')) {
    bouton.addEventListener('click', () => {
      const ouvert = bouton.getAttribute('aria-expanded') !== 'true'
      bouton.setAttribute('aria-expanded', String(ouvert))
      bouton.closest('.carte-competence').classList.toggle('est-ouvert', ouvert)
    })
  }

  /* ----- Filtres : « Tous » est exclusif ; sans filtre actif, « Tous » revient ----- */
  const filtresDemo = $$('[data-demo="filtre"]')
  for (const filtre of filtresDemo) {
    filtre.addEventListener('click', () => {
      const tous = filtresDemo.find((f) => f.dataset.cle === 'tous')
      if (filtre === tous) {
        filtresDemo.forEach((f) => f.setAttribute('aria-pressed', String(f === tous)))
        return
      }
      filtre.setAttribute('aria-pressed', String(filtre.getAttribute('aria-pressed') !== 'true'))
      const aucun = filtresDemo.every((f) => f === tous || f.getAttribute('aria-pressed') !== 'true')
      tous.setAttribute('aria-pressed', String(aucun))
    })
  }

  /* ----- Statuts : le point « En cours » pulse seulement s'il est visible et sans pause ----- */
  const statuts = $('.statuts')
  if (statuts) enregistrerBoucle({ element: statuts, demarrer: () => statuts.classList.add('en-boucle'), arreter: () => statuts.classList.remove('en-boucle') })

  /* ----- Loader : texte qui défile, pilule qui compte puis devient « Entrer » ----- */
  const loader = $('[data-demo="loader"]')
  if (loader) {
    enregistrerBoucle({ element: loader, demarrer: () => loader.classList.add('en-boucle'), arreter: () => loader.classList.remove('en-boucle') })
    const pilule = $('.pilule-chargement', loader)
    const pourcentage = $('.pilule-chargement__pct', loader)
    const entrer = $('.pilule-entrer', loader)
    let image = 0 // une seule boucle de comptage à la fois : un nouveau clic annule la précédente
    $('[data-demo="rejouer-loader"]', loader)?.addEventListener('click', () => {
      cancelAnimationFrame(image)
      entrer.hidden = true
      pilule.hidden = false
      const debut = performance.now()
      const duree = etat.reduit ? 0 : 2400
      const pas = (t) => {
        const p = duree ? Math.min(1, (t - debut) / duree) : 1
        pourcentage.textContent = `${Math.round(p * 100)} %`
        if (p < 1) { image = requestAnimationFrame(pas); return }
        pilule.hidden = true
        entrer.hidden = false
        entrer.focus({ preventScroll: true })
      }
      image = requestAnimationFrame(pas)
    })
  }
}
