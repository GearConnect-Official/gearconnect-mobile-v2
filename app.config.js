module.exports = {
    expo: {
    name: "gearconnect-mobile-v2",
    slug: "gearconnect-mobile-v2",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "gearconnectmobilev2",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    splash: {
      image: "./assets/images/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.anonymous.gearconnectmobilev2",

        infoPlist: {
            NSAppTransportSecurity: {
                NSAllowsArbitraryLoads: true,
            },
        },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      permissions: [
        "android.permission.RECORD_AUDIO"
      ],
      package: "com.anonymous.gearconnectmobilev2",
      config: {
        googleMaps: {
          apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY
        }
      }
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      [
        "expo-image-picker",
        {
          "photosPermission": "Autoriser l'accès à tes photos pour publier.",
          "cameraPermission": "Autoriser l'appareil photo pour publier."
        }
      ],
      "expo-video",
      ["expo-maps",{
        "requestLocationPermission": true,
        "locationPermission": "Autoriser l'accès à la localisation pour afficher les lieux à proximité."
      }],
      ["expo-build-properties", { "ios": { "useModularHeaders": true } }],
      ["expo-secure-store"],
      ["expo-location", {
  "locationWhenInUsePermission": "Autoriser l'accès à la localisation pour afficher les événements à proximité."
}]
    ],
    "experiments": {
      "typedRoutes": true
    }
  }
}