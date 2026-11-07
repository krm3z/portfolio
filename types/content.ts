/**
 * Schéma des fichiers de contenu (content/fr et content/en).
 *
 * Règle du projet : aucun texte en dur dans les composants.
 * Tout texte visible vient de ces six fichiers JSON, validés par ces types.
 * Les deux langues ont exactement la même structure ; seuls les textes changent.
 */

export type Locale = "fr" | "en";

/** Identifiants des chapitres, dans l'ordre réel d'affichage (CLAUDE.md, section E). */
export type ChapitreId =
  | "loader"
  | "entree"
  | "accueil"
  | "apropos"
  | "competences"
  | "parcours"
  | "projets"
  | "stack"
  | "contact";

/** Slugs des projets : ils servent de clés partout (URL, compétences, stack). */
export type ProjetSlug =
  | "nasa-data-pipeline"
  | "pollution-meteo"
  | "hirastream"
  | "lelon"
  | "world-cup-winner"
  | "heritage"
  | "groupie-tracker"
  | "power4"
  | "energie";

/**
 * Une preuve relie une compétence ou un outil à ce qui la démontre :
 * un projet, une page du site (ex. /making-of) ou une ligne du parcours.
 */
export type Preuve =
  | { type: "projet"; slug: ProjetSlug }
  | { type: "page"; href: "/making-of" }
  | { type: "parcours"; id: ParcoursId };

/* ------------------------------------------------------------------ */
/* identite.json                                                       */
/* ------------------------------------------------------------------ */

export interface Identite {
  nom: string;
  titre: string;
  ecole: string;
  localisation: string;
  recherche: {
    /** Phrase courte affichée dans la barre du haut et le micro-texte. */
    resume: string;
    poste: string;
    debut: string;
    rythme: string;
  };
  email: string;
  liens: {
    linkedin: string;
    github: string;
  };
  cv: {
    /** Chemin du PDF. Le bouton reste masqué tant que le fichier n'existe pas. */
    fichier: string;
    disponible: boolean;
  };
  pitch: {
    texte: string;
    /** Mot du pitch affiché en ambre. Doit apparaître tel quel dans `texte`. */
    motAmbre: string;
  };
  /** Mots qui alternent dans l'accueil (référence B2). */
  motsAlternes: { texte: string; ambre: boolean }[];
  apropos: string;
  chiffresCles: { valeur: string; libelle: string }[];
}

/* ------------------------------------------------------------------ */
/* projets.json                                                        */
/* ------------------------------------------------------------------ */

export type StatutProjet = "termine" | "en-cours" | "en-ligne" | "prochainement";
export type CategorieProjet = "data" | "ia" | "dev-web";

export interface Projet {
  slug: ProjetSlug;
  /** Numéro affiché sur la carte ("01", "02"...). */
  numero: string;
  titre: string;
  /** true : rangée horizontale de l'accueil. false : page « Tous les projets » seulement. */
  vedette: boolean;
  /** false : carte « Prochainement », sans page /projets/[slug]. */
  aUnePage: boolean;
  /** Question à laquelle le projet répond. */
  question: string;
  /** Description factuelle courte (cartes et métadonnées). */
  description: string;
  /** Équipe et rôle, en une phrase. Uniquement ma part réelle. */
  maPart: string;
  resultats: string[];
  outils: string[];
  statut: StatutProjet;
  categories: CategorieProjet[];
  lien: {
    url: string | null;
    /** Précision à vérifier avant publication (dépôt privé, etc.). */
    note?: string;
  };
  visuel: {
    /** Source prévue du visuel (fichier d'un dépôt, capture, schéma à créer). */
    source: string;
    /** Phase où le visuel sera produit ou récupéré. */
    phase: string;
  };
  /**
   * Textes écrits par Kerem, à reprendre tels quels (en français).
   * En anglais : traduction naturelle de ces mêmes textes.
   */
  recit: {
    contexte?: string;
    maPart?: string;
    demarche?: string;
    retenu?: string;
    /** true : projet en cours, « Ce que j'en retiens » est provisoire. */
    retenuProvisoire?: boolean;
  };
}

/* ------------------------------------------------------------------ */
/* parcours.json                                                       */
/* ------------------------------------------------------------------ */

export type ParcoursId =
  | "bac-sti2d"
  | "b1-ynov"
  | "carrefour"
  | "lelon-fondateur"
  | "b2-ynov"
  | "objectif-alternance";

export type TypeParcours = "formation" | "experience" | "objectif";

export interface EtapeParcours {
  id: ParcoursId;
  /** Libellé affiché ("2025", "Depuis sept. 2026"...). */
  periode: string;
  /** Date de début au format AAAA-MM, pour trier sans ambiguïté. */
  debut: string;
  titre: string;
  organisation?: string;
  detail?: string;
  type: TypeParcours;
  /** true uniquement pour l'objectif (affiché en ambre). */
  ambre: boolean;
}

/** Affiché dans l'ordre chronologique, du plus ancien au plus récent. */
export type Parcours = EtapeParcours[];

/* ------------------------------------------------------------------ */
/* competences.json                                                    */
/* ------------------------------------------------------------------ */

export interface Competence {
  id: string;
  libelle: string;
  preuves: Preuve[];
}

export interface GroupeCompetences {
  id: "analyse" | "ia" | "technique" | "savoir-etre";
  titre: string;
  competences: Competence[];
}

export type Competences = GroupeCompetences[];

/* ------------------------------------------------------------------ */
/* stack.json                                                          */
/* ------------------------------------------------------------------ */

export type NiveauId = "maitrise" | "progression" | "bases";

export interface Niveau {
  id: NiveauId;
  libelle: string;
  /** Nombre de segments allumés sur 3 (jauge honnête). */
  segments: 1 | 2 | 3;
}

export interface Outil {
  id: string;
  nom: string;
  /** Précision entre parenthèses (ex. « PostgreSQL, SQLite, MySQL »). */
  detail?: string;
  niveau: NiveauId;
  /** Vide : pas d'infobulle de preuves. */
  preuves: Preuve[];
}

export interface Stack {
  niveaux: Niveau[];
  outils: Outil[];
}

/* ------------------------------------------------------------------ */
/* ui.json                                                             */
/* ------------------------------------------------------------------ */

/**
 * Textes d'interface. Structure libre mais identique en fr et en en :
 * le test de cohérence (phase 04) vérifiera que les deux arbres de clés
 * sont les mêmes.
 */
export interface UiTextes {
  [cle: string]: string | UiTextes;
}

/* ------------------------------------------------------------------ */
/* Ensemble du contenu d'une langue                                    */
/* ------------------------------------------------------------------ */

export interface Contenu {
  identite: Identite;
  projets: Projet[];
  parcours: Parcours;
  competences: Competences;
  stack: Stack;
  ui: UiTextes;
}
