// Petit journal pour les scripts : on écrit sur la sortie standard sans console.log (règle ECC).

/** Écrit une ligne d'information. */
export function journal(...parties) {
  process.stdout.write(`${parties.join(' ')}\n`)
}

/** Écrit une ligne d'erreur. */
export function erreur(...parties) {
  process.stderr.write(`${parties.join(' ')}\n`)
}
