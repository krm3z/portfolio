// Informations générales de la page de direction artistique.
export const META = {
  titre: 'Direction artistique — Portfolio Kerem Uysal', // titre imposé par Kerem, avec son tiret
  titreCourt: 'Direction artistique',
  sousTitre: 'Portfolio Kerem Uysal',
  phrase: 'Tout est froid et gris, sauf une lumière chaude.',
  version: '1.0',
  date: '8 novembre 2026',
  dateCourte: '08.11.2026',
  description:
    'Référence visuelle du portfolio de Kerem Uysal : couleurs, typographie, grille, composants, mouvement et lumière de la scène.',
  philosophie: {
    nom: 'La fenêtre allumée',
    texte:
      'Une scène d’hiver en gris froids. Une seule chose est chaude : la lumière. Celle d’une fenêtre, d’un écran, d’un chiffre clé ou de l’action principale.',
  },
}

// Les 13 sections, dans l'ordre de la page. Le numéro est une vraie séquence : c'est l'index du document.
export const SECTIONS = [
  { numero: '01', id: 'entete', nom: 'En-tête' },
  { numero: '02', id: 'principes', nom: 'Principes' },
  { numero: '03', id: 'references', nom: 'Références traduites' },
  { numero: '04', id: 'palette', nom: 'Palette' },
  { numero: '05', id: 'typographie', nom: 'Typographie' },
  { numero: '06', id: 'grille', nom: 'Grille et espacements' },
  { numero: '07', id: 'composants', nom: 'Composants' },
  { numero: '08', id: 'dataviz', nom: 'Dataviz' },
  { numero: '09', id: 'matiere', nom: 'Matière et lumière' },
  { numero: '10', id: 'mouvement', nom: 'Mouvement' },
  { numero: '11', id: 'ambiances', nom: 'Ambiances' },
  { numero: '12', id: 'storyboard', nom: 'Storyboard' },
  { numero: '13', id: 'textes', nom: 'Textes d’interface' },
]
