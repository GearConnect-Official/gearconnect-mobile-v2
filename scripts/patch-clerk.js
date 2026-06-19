/**
 * Patch idempotent de @clerk/expo pour Expo Go.
 *
 * @clerk/expo@3.4.x embarque des modules natifs (ClerkExpo, ClerkGoogleSignIn).
 * Sur Android, les specs font `requireNativeModule(...)` qui **throw** quand le
 * natif est absent (cas d'Expo Go) → crash de toute l'app au démarrage.
 * On entoure ces appels d'un try/catch : Clerk retombe alors proprement en mode
 * JS pur (l'auth/getToken fonctionnent, ils sont réseau). Sans effet sur un dev
 * build (le natif existe, le try réussit).
 *
 * Lancé en postinstall pour survivre aux `bun install`.
 */
const fs = require('node:fs');
const path = require('node:path');

const SPECS_DIR = path.join(
  __dirname,
  '..',
  'node_modules',
  '@clerk',
  'expo',
  'dist',
  'specs',
);

/** Specs Android à rendre non-fatals : fichier + nom du module natif requis. */
const TARGETS = [
  { file: 'NativeClerkModule.android.js', name: 'ClerkExpo', varName: 'NativeClerkModule_android_default' },
  { file: 'NativeClerkGoogleSignIn.android.js', name: 'ClerkGoogleSignIn', varName: 'NativeClerkGoogleSignIn_android_default' },
];

function patchFile({ file, name, varName }) {
  const filePath = path.join(SPECS_DIR, file);
  if (!fs.existsSync(filePath)) return;

  const original = `var ${varName} = (0, expo.requireNativeModule)("${name}");`;
  const patched = `var ${varName} = {};\ntry {\n\t${varName} = (0, expo.requireNativeModule)("${name}");\n} catch (e) {}`;

  const content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes(original)) return; // déjà patché (ou format changé) : on ne touche pas
  fs.writeFileSync(filePath, content.replace(original, patched));
  console.log(`[patch-clerk] ${file} : requireNativeModule("${name}") rendu non-fatal`);
}

try {
  for (const target of TARGETS) {
    patchFile(target);
  }
} catch (e) {
  // Ne jamais faire échouer l'install pour ce patch.
  console.warn('[patch-clerk] patch ignoré :', e instanceof Error ? e.message : e);
}
