// Section 11 · neige qui tombe sur les ambiances, et vue d'export (?export=<id>) pour les PNG en 1200 × 675.
{
  const aExporter = params.get('export')
  if (aExporter) {
    racineHtml.classList.add('export')
    if (params.get('ui') === '0') racineHtml.classList.add('export-sans-ui')
    $(`#ambiance-${CSS.escape(aExporter)}`)?.classList.add('ambiance--export')
  }

  // Une toile par image. Les flocons viennent d'un aléa à graine : en capture, l'image fixe est toujours la même.
  for (const toile of $$('.ambiance__neige')) {
    const alea = mulberry32(Number(toile.dataset.graine) || 1)
    const flocons = Array.from({ length: 80 }, () => ({
      x: alea(), y: alea(), r: 0.5 + alea() * 1.4, vitesse: 0.02 + alea() * 0.035, phase: alea() * Math.PI * 2, alpha: 0.35 + alea() * 0.5,
    }))
    const dessin = toile.getContext('2d')
    let largeur = 0
    let hauteur = 0
    let instant = 0 // secondes de chute écoulées
    let depart = 0
    let requete = 0

    const dimensionner = () => {
      const cadre = toile.getBoundingClientRect()
      const densite = Math.min(2, window.devicePixelRatio || 1)
      largeur = cadre.width
      hauteur = cadre.height
      toile.width = Math.round(largeur * densite)
      toile.height = Math.round(hauteur * densite)
      dessin.setTransform(densite, 0, 0, densite, 0, 0)
    }
    const peindre = (t) => {
      dessin.clearRect(0, 0, largeur, hauteur)
      dessin.fillStyle = toile.dataset.couleur
      const echelle = largeur / 1200 // les flocons suivent l'échelle de l'image
      for (const f of flocons) {
        const y = ((f.y + f.vitesse * t) % 1) * (hauteur + 8) - 4
        const x = (f.x + 0.008 * Math.sin(f.phase + t * 0.6)) * largeur
        dessin.globalAlpha = f.alpha
        dessin.beginPath()
        dessin.arc(x, y, Math.max(0.5, f.r * echelle * 1.4), 0, Math.PI * 2)
        dessin.fill()
      }
      dessin.globalAlpha = 1
    }
    const image = (maintenant) => {
      instant = (maintenant - depart) / 1000
      peindre(instant)
      requete = requestAnimationFrame(image)
    }

    dimensionner()
    peindre(instant)
    if ('ResizeObserver' in window) new ResizeObserver(() => { dimensionner(); peindre(instant) }).observe(toile)
    if (!etat.capture) {
      enregistrerBoucle({
        element: toile,
        demarrer: () => { depart = performance.now() - instant * 1000; requete = requestAnimationFrame(image) },
        arreter: () => cancelAnimationFrame(requete),
      })
    }
  }
}
