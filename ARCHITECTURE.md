# Architecture cible — GearConnect Mobile v2

## Principes

- **Flat over nested** : pas de route group `()` sans layout partagé
- **`src/` separé de `app/`** : le routing ne contient pas de logique métier
- **Ecrans partagés au top level** : `userProfile`, `postDetail` etc. sont accessibles depuis partout sans navigation cross-group
- **Nesting max 2 niveaux** dans `app/` pour rester navigable

---

## Arborescence complète

```
gearconnect-mobile-v2/
│
├── app/
│   ├── _layout.tsx                        # Root layout (providers, fonts, splash)
│   ├── index.tsx                          # Redirect vers (auth) ou (app)
│   ├── +html.tsx                          # Config HTML (web)
│   │
│   ├── (auth)/                            # --- Auth flow (layout sans tab bar) ---
│   │   ├── _layout.tsx                    # Auth layout (pas de nav, fond custom)
│   │   ├── welcome.tsx
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── forgotPassword.tsx
│   │
│   └── (app)/                             # --- App principale (auth guard) ---
│       ├── _layout.tsx                    # App layout (auth check, providers app)
│       │
│       ├── (tabs)/                        # --- Tab navigation ---
│       │   ├── _layout.tsx                # Tab bar config (home, events, publications)
│       │   ├── home.tsx
│       │   ├── events.tsx
│       │   └── publications.tsx
│       │
│       │   # --- Ecrans partagés (accessibles depuis n'importe quel tab) ---
│       ├── userProfile.tsx                # Profil utilisateur (accédé depuis 14+ endroits)
│       ├── postDetail.tsx                 # Détail d'un post
│       ├── userSearch.tsx                 # Recherche utilisateurs
│       ├── publication.tsx                # Création de publication
│       ├── verify.tsx                     # Vérification
│       │
│       │   # --- Messages & social ---
│       ├── messages.tsx                   # Liste des conversations
│       ├── conversation.tsx               # Conversation individuelle
│       ├── newConversation.tsx            # Nouvelle conversation
│       ├── groups.tsx                     # Liste des groupes
│       ├── groupDetail.tsx                # Détail d'un groupe
│       ├── groupChannel.tsx               # Channel dans un groupe
│       ├── eventGroups.tsx                # Groupes liés à un event
│       │
│       │   # --- Events ---
│       ├── createEvent.tsx                # Création d'événement
│       ├── selectOrganizers.tsx           # Sélection organisateurs
│       ├── myCreatedEvents.tsx            # Mes événements créés
│       ├── eventDetail.tsx                # Détail d'un événement
│       ├── editEvent.tsx                  # Modification d'un événement
│       ├── postEventInfo.tsx              # Infos post-event
│       ├── productList.tsx                # Produits liés à un event
│       ├── createEventReview.tsx          # Créer un avis event
│       ├── modifyEventReview.tsx          # Modifier un avis event
│       │
│       │   # --- Profil & paramètres ---
│       ├── editProfile.tsx                # Modifier son profil
│       ├── followList.tsx                 # Liste followers/following
│       ├── settings.tsx                   # Paramètres
│       ├── privacySettings.tsx            # Paramètres de confidentialité
│       ├── notificationSettings.tsx       # Paramètres de notifications
│       ├── permissions.tsx                # Permissions
│       ├── termsAndConditions.tsx         # CGU
│       ├── verificationRequest.tsx        # Demande de vérification
│       ├── verificationDashboard.tsx      # Dashboard vérification
│       ├── performances.tsx               # Performances
│       ├── addPerformance.tsx             # Ajouter une performance
│       └── selectEvent.tsx                # Sélectionner un event (pour performance)
│
├── src/
│   ├── components/
│   │   ├── ui/                            # Composants réutilisables génériques
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── media/                         # Composants médias (Cloudinary)
│   │   │   ├── CloudinaryImage.tsx
│   │   │   ├── CloudinaryImageUpload.tsx
│   │   │   ├── CloudinaryMedia.tsx
│   │   │   ├── CloudinaryVideo.tsx
│   │   │   ├── CloudinaryVideoUpload.tsx
│   │   │   ├── AspectBannerImage.tsx
│   │   │   ├── VerifiedAvatar.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── feed/                          # Composants du fil d'actualité
│   │   │   ├── PostItem.tsx
│   │   │   ├── PostHeader.tsx
│   │   │   ├── PostFooter.tsx
│   │   │   ├── PostActions.tsx
│   │   │   ├── PostOptionsMenu.tsx
│   │   │   ├── HierarchicalComment.tsx
│   │   │   ├── ShareModal.tsx
│   │   │   ├── ProfilePost.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── stories/                       # Composants stories
│   │   │   ├── StoryPreview.tsx
│   │   │   ├── StoryViewer.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── profile/                       # Composants profil
│   │   │   ├── ProfileAvatar.tsx
│   │   │   ├── ProfileMenu.tsx
│   │   │   ├── ProfilePictureUpload.tsx
│   │   │   ├── FollowButton.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── events/                        # Composants événements
│   │   │   ├── CreateEvent/
│   │   │   │   ├── ActionButtons.tsx
│   │   │   │   ├── AdditionalInfo.tsx
│   │   │   │   ├── BasicInfo.tsx
│   │   │   │   ├── ImageUpload.tsx
│   │   │   │   ├── InputField.tsx
│   │   │   │   ├── MediaInfo.tsx
│   │   │   │   ├── NavigationButtons.tsx
│   │   │   │   ├── ProductList.tsx
│   │   │   │   ├── StepIndicator.tsx
│   │   │   │   ├── TopBar.tsx
│   │   │   │   └── index.ts
│   │   │   ├── EventDetailReview.tsx
│   │   │   ├── EventTag.tsx
│   │   │   ├── EventItem.tsx
│   │   │   ├── RelatedProductsSection.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── messaging/                     # Composants messagerie
│   │   │   ├── MessageBubble.tsx
│   │   │   ├── ConversationItem.tsx
│   │   │   ├── GroupMemberItem.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── publication/                   # Composants création publication
│   │   │   ├── CaptionInput.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── ImageCropper.tsx
│   │   │   ├── ImageViewer.tsx
│   │   │   ├── MediaSection.tsx
│   │   │   ├── PublicationForm.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── modals/                        # Modales partagées
│   │       ├── CommentsModal.tsx
│   │       ├── HierarchicalCommentsModal.tsx
│   │       ├── StoryModal.tsx
│   │       └── index.ts
│   │
│   ├── providers/                         # Context providers
│   │   ├── AuthProvider.tsx
│   │   ├── ThemeProvider.tsx
│   │   ├── MessagingProvider.tsx
│   │   ├── AnalyticsProvider.tsx
│   │   ├── AppProviders.tsx               # Compose tous les providers
│   │   └── index.ts
│   │
│   ├── hooks/                             # Custom hooks
│   │   ├── useCloudinary.ts
│   │   ├── useConversation.ts
│   │   ├── useFeedback.ts
│   │   ├── useInfiniteScroll.ts
│   │   ├── useNetworkStatus.ts
│   │   ├── useOptimizedInteractions.ts
│   │   ├── usePostsCache.ts
│   │   ├── useScreenTracking.ts
│   │   ├── useVisibilityTracker.ts
│   │   └── index.ts
│   │
│   ├── services/                          # Appels API & services externes
│   │   ├── api/
│   │   │   ├── axiosConfig.ts             # Config Axios (interceptors, base URL)
│   │   │   ├── authService.ts
│   │   │   ├── chatService.ts
│   │   │   ├── commentService.ts
│   │   │   ├── eventService.ts
│   │   │   ├── favoritesService.ts
│   │   │   ├── followService.ts
│   │   │   ├── groupService.ts
│   │   │   ├── messageService.ts
│   │   │   ├── notificationService.ts
│   │   │   ├── performanceService.ts
│   │   │   ├── postService.ts
│   │   │   ├── privacySettingsService.ts
│   │   │   ├── relatedProductService.ts
│   │   │   ├── tagService.ts
│   │   │   ├── userService.ts
│   │   │   └── verificationService.ts
│   │   ├── cloudinary.service.ts          # Upload & gestion médias
│   │   ├── mixpanelService.ts             # Analytics
│   │   ├── sessionReplayService.ts        # Session replay
│   │   ├── keepAwakeService.ts            # Keep awake
│   │   └── websocketService.ts            # WebSocket temps réel
│   │
│   ├── types/                             # Types TypeScript
│   │   ├── api.types.ts
│   │   ├── event.types.ts
│   │   ├── follow.types.ts
│   │   ├── group.types.ts
│   │   ├── messages.types.ts
│   │   ├── performance.types.ts
│   │   ├── post.types.ts
│   │   ├── story.types.ts
│   │   └── user.types.ts
│   │
│   ├── utils/                             # Fonctions utilitaires
│   │   ├── calendarHelper.ts
│   │   ├── dateUtils.ts
│   │   ├── eventMissingInfo.ts
│   │   ├── eventSelection.ts
│   │   ├── fileSecurity.ts
│   │   ├── mediaUtils.ts
│   │   ├── messageUtils.ts
│   │   └── postFetchFactories.ts
│   │
│   ├── styles/                            # Styles partagés & thème
│   │   ├── theme.ts
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   └── spacing.ts
│   │
│   └── config/                            # Configuration app
│       ├── constants.ts
│       ├── defaultImage.ts
│       └── env.ts
│
├── assets/                                # Assets statiques
│   ├── fonts/
│   └── images/
│
├── __tests__/                             # Tests
│
├── docs/                                  # Documentation
│
├── app.config.js                          # Config Expo
├── tsconfig.json
├── package.json
├── .env.example
└── .gitignore
```

---

## Routing — Comment ça marche

Avec cette structure flat, la navigation est simple :

```typescript
// Depuis n'importe quel écran
router.push("/userProfile?id=123");
router.push("/postDetail?id=456");
router.push("/eventDetail?id=789");
router.push("/conversation?id=abc");
router.push("/settings");
```

Pas besoin de connaître le nesting. Chaque écran a une URL unique et directe.

---

## Stack technique

| Outil | Usage |
|---|---|
| **Expo ~54** | Framework React Native |
| **Expo Router** | Navigation file-based |
| **TypeScript** | Typage |
| **Clerk** | Authentification |
| **Axios** | Appels API |
| **Cloudinary** | Upload & gestion médias |
| **Mixpanel** | Analytics |
| **Reanimated** | Animations |
| **Gesture Handler** | Gestes tactiles |

---

## Conventions

### Nommage des fichiers

| Type | Convention | Exemple |
|---|---|---|
| Ecrans (app/) | camelCase | `eventDetail.tsx` |
| Composants (src/) | PascalCase | `PostItem.tsx` |
| Services | camelCase | `eventService.ts` |
| Hooks | camelCase avec `use` | `useCloudinary.ts` |
| Types | camelCase avec `.types` | `event.types.ts` |

### Imports

Chaque dossier dans `src/components/` et `src/` a un `index.ts` pour des imports propres :

```typescript
// Plutôt que
import { PostItem } from "@/src/components/feed/PostItem";

// On fait
import { PostItem } from "@/src/components/feed";
```

### Structure d'un écran

```typescript
// app/(app)/eventDetail.tsx
import { EventDetailScreen } from "@/src/components/events";

export default function EventDetail() {
  return <EventDetailScreen />;
}
```

Les écrans dans `app/` sont des **wrappers légers**. Toute la logique vit dans `src/`.
