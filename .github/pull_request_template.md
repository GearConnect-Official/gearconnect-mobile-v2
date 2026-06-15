## Description

<!-- Décris brièvement ce que fait cette PR et pourquoi. -->

## Issue liée

<!-- Référence l'issue concernée, ex. : Closes #123 -->

## Type de changement

- [ ] 🐛 Correction de bug
- [ ] ✨ Nouvelle fonctionnalité
- [ ] ♻️ Refactor (pas de changement de comportement)
- [ ] 📝 Documentation
- [ ] 🎨 Style / UI

## Checklist (cf. [CONVENTIONS.md](../CONVENTIONS.md) §10)

- [ ] Le nouveau code respecte l'arborescence d'[ARCHITECTURE.md](../ARCHITECTURE.md) (pas de dossier sauvage, pas de logique dans `app/`).
- [ ] `npm run format` et `npm run lint` passent sans erreur.
- [ ] Composants : `interface Props` + commentaire JSDoc d'une ligne.
- [ ] Styles dans `src/styles/`, valeurs via les design tokens.
- [ ] Logique métier extraite dans un hook si le composant fait plus que de l'affichage.
- [ ] Hooks/validators ont leurs tests.
- [ ] Si une nouvelle convention est introduite (nouveau pattern, nouveau dossier...), ce fichier est mis à jour dans la même PR — pas de convention "tacite" qui vit seulement dans la tête de son auteur.

## Revue

<!-- @mentionne la ou les personnes responsables de la revue. -->
