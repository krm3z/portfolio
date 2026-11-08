// Ouvre la page DA dans un serveur local : http://127.0.0.1:4310/
// Usage : npm run da:serveur   (Ctrl+C pour arrêter)
import { join } from 'node:path'
import { journal } from './lib/journal.mjs'
import { demarrerServeur } from './lib/serveur.mjs'

const { url } = await demarrerServeur(join(process.cwd(), 'design'))
journal(`Page de direction artistique : ${url}`)
