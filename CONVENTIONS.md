# Conventions de code — GearConnect Mobile v2

Règles à suivre par **tout le monde**, sur **tout le code**, pas seulement
sur une feature en particulier. Objectif : que deux personnes qui n'ont
jamais discuté écrivent du code qui se ressemble.

Ce document complète [ARCHITECTURE.md](ARCHITECTURE.md) (structure des
dossiers, routing, stack). Si une règle d'ici contredit l'archi, c'est
l'archi qui gagne — et il faut alors mettre à jour ce fichier, pas l'inverse.

---

## 1. Avant d'écrire du code : respecter l'arborescence existante

- **Ne jamais créer un nouveau dossier sous `src/components/` sans vérifier**
  qu'une feature existante (`feed/`, `events/`, `profile/`...) ne convient
  pas déjà.
- Si une nouvelle feature nécessite un nouveau dossier, **mettre à jour
  [ARCHITECTURE.md](ARCHITECTURE.md)** dans le même PR (l'arbre + la table
  des conventions si besoin).
- Les écrans dans `app/` restent des **wrappers légers** :

  ```typescript
  // app/(app)/eventDetail.tsx
  import { EventDetailScreen } from "@/components/events";

  export default function EventDetail() {
    return <EventDetailScreen />;
  }
  ```

  Toute logique (state, effets, appels API) vit dans `src/components/<feature>/`.
  Si un écran de `app/` contient autre chose qu'un `return <XxxScreen />`
  (ou `<XxxForm />`), c'est un signal qu'il faut extraire.

  ```typescript
  // ❌ app/(app)/publication.tsx — logique dans l'écran
  export default function Publication() {
    const [media, setMedia] = useState([]);
    const publish = async () => { /* appel API */ };
    return ( /* JSX complet */ );
  }

  // ✅ app/(app)/publication.tsx — wrapper léger
  import { PublicationForm } from '@/components/publication';

  export default function Publication() {
    return <PublicationForm />;
  }
  ```

- Pas de route group `()` supplémentaire sans layout partagé, pas de nesting
  de plus de 2 niveaux dans `app/` (cf. ARCHITECTURE.md, principes).

  ```
  ❌ app/(app)/(profile)/(settings)/notifications.tsx   (3 niveaux de groupes)
  ✅ app/(app)/notificationSettings.tsx                  (écran partagé, top-level)
  ```

- Avant de créer `src/components/<nouvelle-feature>/`, vérifie qu'une feature
  existante ne convient pas :

  ```
  ❌ src/components/postCreation/  (alors que src/components/publication/ existe déjà)
  ✅ ajouter le composant dans src/components/publication/
  ```

---

## 2. Nommage des fichiers (rappel + extension d'ARCHITECTURE.md)

| Type | Convention | Exemple |
|---|---|---|
| Ecrans (`app/`) | camelCase | `eventDetail.tsx` |
| Composants (`src/components/`) | PascalCase | `PostItem.tsx` |
| Hooks | camelCase avec `use` | `useLoginForm.ts` |
| Services | camelCase avec `Service` | `eventService.ts` |
| Types | camelCase avec `.types` | `event.types.ts` |
| Styles | camelCase avec `.styles`, dans `src/styles/` | `header.styles.ts` |
| Validation | camelCase avec `.validation`, dans le dossier de la feature | `auth.validation.ts` |
| Tests | même nom que le fichier testé + `.test.ts` | `useLoginForm.test.ts` |

```
❌ EventDetail.tsx              (écran dans app/, devrait être camelCase)
❌ post-item.tsx                (composant src/, devrait être PascalCase + .tsx sans tiret)
❌ LoginForm.hook.ts            (hook, devrait être useLoginForm.ts)
❌ Auth.styles.ts               (devrait être auth.styles.ts, dans src/styles/)

✅ eventDetail.tsx               (app/)
✅ PostItem.tsx                  (src/components/feed/)
✅ useLoginForm.ts               (src/components/auth/)
✅ auth.styles.ts                (src/styles/)
```

---

## 3. Formatage (en attendant Prettier/ESLint)

Pas encore d'outil automatique configuré → ces règles sont à appliquer "à la
main" et à vérifier en review.

- **Indentation : 2 espaces.** Jamais de tabulations, jamais 4 espaces.

  ```typescript
  // ❌ 4 espaces
  export function useLoginForm(){
      const [email, setEmail] = useState('');
  }

  // ✅ 2 espaces
  export function useLoginForm() {
    const [email, setEmail] = useState('');
  }
  ```

- **Point-virgule obligatoire** en fin d'instruction, y compris dans les
  `index.ts` (`export { default as X } from './X';`) et les exports d'une
  ligne.

  ```typescript
  // ❌
  export { default as LoginScreen } from './LoginScreen'
  export default function Login() { return <LoginScreen /> }

  // ✅
  export { default as LoginScreen } from './LoginScreen';
  export default function Login() {
    return <LoginScreen />;
  }
  ```

- **Guillemets simples** (`'react-native'`) sauf dans le JSX (`placeholder="Email"`,
  convention standard) ou si la chaîne contient une apostrophe
  (`"S'inscrire"`).

  ```typescript
  // ❌
  import { View } from "react-native";
  setError("Email invalide");

  // ✅
  import { View } from 'react-native';
  setError('Email invalide');
  ```

- **Espacement standard** :
  - `if (condition) {` / `} else if (...) {` / `} else {` — espaces autour
    des mots-clés, jamais `if(x){` ou `}else{`.
  - Pas d'espace autour de `=` dans les attributs JSX :
    `style={styles.row}`, jamais `style = {styles.row}`.

  ```typescript
  // ❌
  if(!email){
      setError("Email invalide")
  }else{
      setError(undefined)
  }
  return <View style = {styles.row} />;

  // ✅
  if (!email) {
    setError('Email invalide');
  } else {
    setError(undefined);
  }
  return <View style={styles.row} />;
  ```

- **Early return** plutôt que `if / else if / else` en cascade pour des
  validations successives :

  ```typescript
  // ❌
  if (!isValidEmail(email)) {
    setError('Email invalide');
  } else if (!isValidPassword(password)) {
    setError('Mot de passe trop court');
  } else {
    setError(undefined);
    // ... suite, imbriquée dans le else
  }

  // ✅
  if (!isValidEmail(email)) {
    setError('Email invalide');
    return;
  }
  if (!isValidPassword(password)) {
    setError('Mot de passe trop court');
    return;
  }
  setError(undefined);
  // ... suite, au même niveau d'indentation
  ```

> Dès qu'ESLint/Prettier seront configurés, ce sont eux qui font foi —
> ce chapitre disparaîtra au profit de `npm run lint`.

---

## 4. Composants React

- **Toujours typer les props avec `interface Props`** dès qu'un composant en
  reçoit :

  ```typescript
  interface Props {
    value: string;
    onChange: (text: string) => void;
  }

  export default function CaptionInput({ value, onChange }: Props) { ... }
  ```

- **Un commentaire JSDoc d'une ligne, en français**, au-dessus de chaque
  composant/fonction exportée par défaut, qui décrit son **rôle** (pas son
  fonctionnement interne) :

  ```typescript
  /** Étape 2 : saisie de la description du post. */
  export default function CaptionInput({ value, onChange }: Props) { ... }
  ```

- **Pas de logique métier dans le composant.** Si un composant fait plus que
  de l'affichage (state + appels API + effets de bord + soumission),
  extraire cette logique dans un hook dédié `use<Nom>.ts`, colocalisé avec le
  composant (`src/components/<feature>/use<Nom>.ts`). Ça rend la logique
  testable indépendamment du rendu.

- **Fonctions utilitaires pures hors du composant** : si une transformation
  de données ne dépend pas du state (mapping, formatage...), la sortir en
  fonction top-level du fichier — évite de la recréer à chaque render et la
  rend testable isolément.

  ```typescript
  function toMediaType(assetType?: string | null): MediaType {
    return assetType === 'video' ? 'VIDEO' : 'IMAGE';
  }
  ```

---

## 5. Styles

- Tous les styles vont dans `src/styles/<NomDuComposant>.styles.ts`, exporté
  en `export const styles = StyleSheet.create({ ... })` (jamais colocalisés
  dans `src/components/<feature>/`).

  ```
  ❌ src/components/auth/auth.styles.ts
  ✅ src/styles/auth.styles.ts
  ```

- **Design tokens obligatoires** : utiliser `palette` (`src/styles/colors.ts`),
  `typography` (`typography.ts`) et `spacing` (`spacing.ts`) plutôt que des
  valeurs en dur (`'#2f95dc'`, `16`, `'600'`...). Si la couleur/taille dont tu
  as besoin n'existe pas encore dans les tokens, l'ajouter au token plutôt que
  de la dupliquer en dur.

  ```typescript
  // ❌ src/styles/header.styles.ts
  export const styles = StyleSheet.create({
    bar: { paddingHorizontal: 16, backgroundColor: '#fff' },
    right: { color: '#2f95dc', fontSize: 16 },
  });

  // ✅
  import { palette } from './colors';
  import { spacing } from './spacing';
  import { typography } from './typography';

  export const styles = StyleSheet.create({
    bar: { paddingHorizontal: spacing.md, backgroundColor: palette.white },
    right: { color: palette.primary, fontSize: typography.body.fontSize },
  });
  ```

---

## 6. Validation

- Créer un fichier `<feature>.validation.ts` avec des fonctions pures
  (`isValidX(...): boolean`) **uniquement** pour des règles métier non
  triviales et réutilisables (regex, longueur, format) — typiquement
  email/mot de passe/code.

  ```typescript
  // ✅ src/components/auth/auth.validation.ts
  export function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  export function isValidPassword(password: string): boolean {
    return password.length >= 8;
  }
  ```

- Pour de simples conditions d'état UI (`media.length === 0`,
  `description.trim().length === 0`), les laisser **inline** : ne pas
  sur-ingénierer un fichier de validation pour ça.

  ```typescript
  // ❌ src/components/publication/publication.validation.ts
  export function hasNoMedia(media: SelectedMedia[]): boolean {
    return media.length === 0;
  }
  // utilisé une seule fois : <Header rightDisabled={hasNoMedia(media)} />

  // ✅ inline, directement où c'est utilisé
  <Header rightDisabled={media.length === 0} />
  ```

---

## 7. Gestion des erreurs

- **Formulaires** (saisie utilisateur, validation avant soumission) : afficher
  l'erreur **inline**, sous forme de `<Text style={styles.errorText}>`.

  ```typescript
  // ✅ LoginScreen.tsx
  {errorMessage ? <Text style={authStyles.errorText}>{errorMessage}</Text> : null}
  ```

- **Actions ponctuelles** (publication, suppression, action réseau qui peut
  échouer après coup) : utiliser `Alert.alert('Titre', message)`.

  ```typescript
  // ✅ PublicationForm.tsx
  try {
    await createPost({ body: description.trim(), userId, media }, token);
  } catch (e) {
    Alert.alert('Échec', e instanceof Error ? e.message : 'Impossible de publier.');
  }
  ```

- Ne pas mélanger les deux pour un même type d'écran : si un écran a déjà une
  convention (inline ou Alert), la garder cohérente sur tout l'écran.

  ```typescript
  // ❌ même formulaire : une erreur en <Text>, l'autre en Alert
  {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
  if (apiError) Alert.alert('Erreur', apiError);

  // ✅ les deux erreurs affichées de la même façon
  {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
  {apiError ? <Text style={styles.errorText}>{apiError}</Text> : null}
  ```

---

## 8. Imports

- `@/*` pointe vers `src/*`. On importe `@/components/...`, `@/services/...`,
  `@/styles/...`, `@/types/...`, `@/utils/...` — jamais `@/src/...`.

  ```typescript
  // ❌
  import { PostItem } from '@/src/components/feed/PostItem';

  // ✅
  import { PostItem } from '@/components/feed';
  ```

- Chaque dossier de `src/components/<feature>/` a un `index.ts` qui ré-exporte
  ses composants publics :

  ```typescript
  export { default as PublicationForm } from './PublicationForm';
  export { default as MediaSection } from './MediaSection';
  ```

- Importer depuis le barrel (`@/components/feed`), pas depuis le fichier
  direct (`@/components/feed/PostItem`), sauf import interne entre fichiers
  du même dossier.

  ```typescript
  // ❌ depuis un autre dossier (src/components/publication/PublicationForm.tsx)
  import { PostItem } from '@/components/feed/PostItem';

  // ✅
  import { PostItem } from '@/components/feed';

  // ✅ import interne, entre fichiers du même dossier publication/
  import MediaSection from './MediaSection';
  ```

---

## 9. Tests

- Tout `use<Nom>.ts` (hook de logique) ou `<feature>.validation.ts` **doit**
  avoir un fichier `.test.ts` associé, colocalisé.

  ```
  src/components/auth/
    useLoginForm.ts
    useLoginForm.test.ts       ✅ colocalisé, même nom + .test
    auth.validation.ts
    auth.validation.test.ts    ✅
  ```

- Hooks : `renderHook` + `act`.
- Mocker `@clerk/expo`, `expo-router`, `fetch`/services API selon ce que le
  hook utilise.

  ```typescript
  // ✅ useLoginForm.test.ts (extrait simplifié)
  jest.mock('@clerk/expo', () => ({
    useSignIn: () => ({ signIn: mockSignIn, errors: {}, fetchStatus: 'idle' }),
  }));
  jest.mock('expo-router', () => ({ useRouter: () => ({ replace: jest.fn() }) }));

  test('rejette un email invalide sans appeler signIn.create', async () => {
    const { result } = renderHook(() => useLoginForm());
    act(() => result.current.setEmail('pas-un-email'));
    await act(() => result.current.onSignInPress());
    expect(result.current.errorMessage).toBe('Email invalide');
    expect(mockSignIn.create).not.toHaveBeenCalled();
  });
  ```

- Un composant purement visuel (pas de hook extrait) n'a pas besoin de test
  dédié — c'est justement l'intérêt d'extraire la logique dans un hook
  testable.

  ```
  ❌ CaptionInput.test.tsx   (composant visuel pur, pas de logique à tester)
  ✅ useLoginForm.test.ts    (logique testée via le hook, le composant reste simple)
  ```

---

## 10. Avant d'ouvrir une PR

- [ ] Le nouveau code respecte l'arborescence d'[ARCHITECTURE.md](ARCHITECTURE.md)
      (pas de dossier sauvage, pas de logique dans `app/`).
- [ ] Indentation 2 espaces, points-virgules, guillemets simples.
- [ ] Composants : `interface Props` + commentaire JSDoc d'une ligne.
- [ ] Styles dans `src/styles/`, valeurs via les design tokens.
- [ ] Logique métier extraite dans un hook si le composant fait plus que de
      l'affichage.
- [ ] Hooks/validators ont leurs tests.
- [ ] Si une nouvelle convention est introduite (nouveau pattern, nouveau
      dossier...), ce fichier est mis à jour dans la même PR — pas de
      convention "tacite" qui vit seulement dans la tête de son auteur.