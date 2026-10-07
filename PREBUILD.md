# Guide de build iOS — GearConnect Mobile

## Lancer l'app

### Quotidien (sans toucher au natif)

#### Sur votre téléphone
```bash
bunx expo run:ios --device
```

#### Sur simulateur
```bash
bunx expo run:ios
```

### Après un changement de dépendances natives ou de `app.json`
```bash
bun i
bunx expo prebuild --clean
# Remettre ios.deploymentTarget à 17.0 dans ios/Podfile.properties.json
bunx expo run:ios --device
```

---

## Rappels importants

- Toujours utiliser `bunx` (pas `npx`) — le projet utilise bun
- Après chaque `prebuild --clean`, remettre dans `ios/Podfile.properties.json` :
  ```json
  "ios.deploymentTarget": "17.0"
  ```
- Expo Go n'est pas compatible (expo-maps et @clerk/expo requièrent du code natif)

---

## Erreurs fréquentes

### `Cannot find module 'expo-router/internal/routing'`
**Cause :** Version d'expo-router incompatible avec la version d'expo installée.  
**Fix :** Mettre à jour expo-router dans `package.json` pour correspondre à la version SDK d'expo, puis `bun i`.

---

### `TurboModuleRegistry: 'PlatformConstants' could not be found`
**Cause :** Le binaire natif est désynchronisé avec le bundle JS (cache Metro ou version changée).  
**Fix :**
```bash
bunx expo run:ios --device   # reconstruit le natif
# ou pour le simulateur :
bunx expo run:ios --clear
```

---

### `pod install` — `undefined method 'package_product_dependencies' for nil`
**Cause :** `@clerk/expo` n'est pas linké car le deployment target iOS est inférieur à 17.0 (requis par Clerk).  
**Fix :** Vérifier que `ios/Podfile.properties.json` contient `"ios.deploymentTarget": "17.0"` et que `ios/gearconnectmobilev2.xcodeproj/project.pbxproj` a `IPHONEOS_DEPLOYMENT_TARGET = 17.0`.

---

### `[Reanimated] React Native X.X.X is not compatible with Reanimated Y.Y.Y`
**Cause :** La version de `react-native-reanimated` dans `package.json` ne supporte pas la version de `react-native` installée.  
**Matrice de compatibilité :**
- reanimated `4.5.x` → react-native `0.83 – 0.86`
- reanimated `4.1.x` → react-native `0.78 – 0.82`

**Fix :** Mettre à jour `react-native-reanimated` dans `package.json`, puis `bun i`.

---

### `compiling for iOS 16.4, but module 'ClerkExpo' has a minimum deployment target of iOS 17.0`
**Cause :** Le target principal du projet Xcode est encore à iOS 16.4.  
**Fix :**
```bash
sed -i '' 's/IPHONEOS_DEPLOYMENT_TARGET = 16.4;/IPHONEOS_DEPLOYMENT_TARGET = 17.0;/g' \
  ios/gearconnectmobilev2.xcodeproj/project.pbxproj
```

---

### `Unable to launch ... invalid code signature`
**Cause :** Le profil de développeur Apple n'est pas approuvé sur l'iPhone.  
**Fix :** iPhone → Paramètres → Général → VPN et gestion des appareils → Faire confiance.

---

### `Device said that the user denied the trust dialog`
**Cause :** L'iPhone n'a pas approuvé la connexion avec le Mac.  
**Fix :**
1. Activer le mode développeur : Paramètres → Confidentialité et sécurité → Mode développeur
2. Débrancher/rebrancher le câble
3. Accepter "Faire confiance" sur l'iPhone
4. `idevicepair pair`

---

### Serveur API inaccessible depuis l'iPhone (device réel)
**Cause :** `localhost` ne fonctionne pas depuis un vrai appareil, seulement depuis le simulateur.  
**Fix :** Mettre l'IP locale du Mac dans `.env` :
EXPO_PUBLIC_API_URL=http://<ton-ip>:3001/api
```
