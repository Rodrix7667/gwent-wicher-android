# Gwent Wicher - Android

Versión móvil del clásico Gwent de The Witcher 3: Wild Hunt.

## Créditos
- Juego original: [asundr/gwent-classic](https://github.com/asundr/gwent-classic)
- Traducción al español + adaptación Android: OpenCode

## Compilar
```bash
npm install
npx cap sync
npx cap copy
cd android
./gradlew.bat assembleDebug
```

La APK se genera en: `android/app/build/outputs/apk/debug/app-debug.apk`

## Requisitos
- Node.js 18+
- JDK 17+
- Android SDK 34+
