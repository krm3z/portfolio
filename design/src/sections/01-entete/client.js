// Section 01 · le moment orchestré de l'en-tête (motion.json → ouvertureEntete).
// Les points apparaissent, les traits se dessinent, puis la vitre s'allume. Joué une fois au chargement ;
// le texte de l'en-tête est lisible dès la première image. En capture et en mouvement réduit : état final.
{
  const scene = $('.ouverture')
  const source = $('#donnees-motion')
  if (scene && source) {
    const motion = JSON.parse(source.textContent)
    const [points, traits, fenetre] = motion.animations.ouvertureEntete.sequence
    const courbe = (nom) => motion.courbes[nom].css
    const jouer = () => {
      for (const a of scene.getAnimations({ subtree: true })) a.cancel()
      const cercles = $$('circle', scene)
      cercles.forEach((c, i) => c.animate([{ opacity: 0 }, { opacity: 1 }], { duration: points.duree, delay: i * points.ecart, easing: courbe('outExpo'), fill: 'both' }))
      // Les traits partent quand la moitié des points est là : la séquence reste continue.
      const departTraits = (cercles.length * points.ecart) / 2
      $$('line', scene).forEach((l) => l.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: traits.duree, delay: departTraits, easing: courbe(traits.courbe), fill: 'both' }))
      $('.ouverture__lumiere', scene).animate([{ opacity: 0 }, { opacity: 1 }], { duration: fenetre.duree, delay: departTraits + traits.duree, easing: courbe(fenetre.courbe), fill: 'both' })
      scene.classList.remove('ouverture--attente') // les animations tiennent déjà leur première image
    }
    // Jouée quand l'illustration devient visible : sur téléphone, elle est sous le texte.
    if (!etat.capture && !etat.reduit) {
      scene.classList.add('ouverture--attente') // pas d'état final visible avant la lecture
      quandVisible(scene, jouer, { seuil: 0.4 })
    }
    $('.entete__rejouer')?.addEventListener('click', () => { if (!etat.reduit) jouer() })
  }
}
