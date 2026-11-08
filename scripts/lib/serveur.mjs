// Petit serveur de fichiers local (127.0.0.1) pour ouvrir la page DA en http,
// comme un vrai site : les captures se font par ce serveur.
import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, isAbsolute, join, relative, resolve } from 'node:path'

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
}

/** Démarre le serveur sur un dossier ; renvoie { url, fermer }. */
export function demarrerServeur(dossier, port = 4310) {
  const racine = resolve(dossier)
  const repondre = (reponse, code, texte) => {
    reponse.writeHead(code, { 'Content-Type': 'text/plain; charset=utf-8' })
    reponse.end(texte)
  }
  const serveur = createServer((requete, reponse) => {
    let chemin
    try {
      chemin = decodeURIComponent(new URL(requete.url, 'http://local').pathname)
    } catch {
      repondre(reponse, 400, 'Adresse mal formée') // %E0%A4%A ferait sinon planter le serveur
      return
    }
    const fichier = resolve(join(racine, chemin === '/' ? 'direction-artistique.html' : chemin))
    // Refuse toute sortie du dossier servi (../) : le chemin relatif ne doit ni remonter ni changer de disque.
    const rel = relative(racine, fichier)
    if (!rel || rel.startsWith('..') || isAbsolute(rel) || !existsSync(fichier) || !statSync(fichier).isFile()) {
      repondre(reponse, 404, 'Introuvable')
      return
    }
    reponse.writeHead(200, { 'Content-Type': TYPES[extname(fichier)] ?? 'application/octet-stream', 'Cache-Control': 'no-store' })
    createReadStream(fichier).pipe(reponse)
  })
  return new Promise((resoudre, rejeter) => {
    serveur.once('error', rejeter)
    serveur.listen(port, '127.0.0.1', () =>
      resoudre({ url: `http://127.0.0.1:${port}/`, fermer: () => new Promise((r) => serveur.close(r)) }),
    )
  })
}
