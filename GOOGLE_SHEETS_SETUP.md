# Google Sheets Integration Setup

A form beküldések most nem érkeznek be a Google Sheets-be. Itt van a lépésenkénti útmutató a probléma megoldásához:

## 1. Új Google Sheets létrehozása

1. Menj a [sheets.google.com](https://sheets.google.com) oldalra
2. Hozz létre egy új táblázatot
3. Nevezd el: "FindMate Waitlist"
4. Az első sorba írd be ezeket a fejléceket:
   - A1: `Timestamp`
   - B1: `Name`
   - C1: `Email`
   - D1: `Source`
   - E1: `UTM Source`
   - F1: `UTM Medium`
   - G1: `UTM Campaign`
   - H1: `UTM Term`
   - I1: `UTM Content`
   - J1: `User Agent`

## 2. Google Apps Script beállítása

1. Menj a [script.google.com](https://script.google.com) oldalra
2. Kattints az "Új projekt" gombra
3. Töröld a meglévő kódot
4. Másold be a `google-apps-script.js` fájl tartalmát
5. A script tetején cseréld le `'YOUR_SHEET_ID_HERE'`-t a Sheet ID-ddel:
   - A Google Sheets URL-ben találod: `https://docs.google.com/spreadsheets/d/SHEET_ID_ITT/edit`
6. Mentsd el a projektet "FindMate Waitlist" néven

## 3. Script telepítése

1. A script szerkesztőben kattints a "Telepítés" gombra (Deploy)
2. Válaszd a "Új telepítés" opciót
3. Típusnál válaszd a "Webalkalmazás" lehetőséget
4. Beállítások:
   - Futtatás mint: "Én"
   - Hozzáférés: "Bárki"
5. Kattints a "Telepítés" gombra
6. Engedélyezd a szükséges jogosultságokat
7. Másold ki a kapott Web App URL-t

## 4. Frissítsd a landing page-et

1. Nyisd meg a `script.js` fájlt
2. Keresd meg ezt a sort (körülbelül a 122. sor):
   ```javascript
   const response = await fetch('https://script.google.com/macros/s/AKfycbz...', {
   ```
3. Cseréld le a URL-t az új Web App URL-re

## 5. Tesztelés

1. Töltsd fel a frissített fájlokat
2. Próbálj ki egy teszt beküldést a weboldalon
3. Ellenőrizd, hogy megjelent-e az adat a Google Sheets-ben

## 6. Hibaelhárítás

Ha még mindig nem működik:

1. **Ellenőrizd a böngésző konzolt** hibák után (F12 > Console)
2. **Debug funkciók használata:**
   - Konzolban írd be: `findmateDebug.checkStoredSubmissions()`
   - Ez megmutatja a helyileg tárolt beküldéseket
3. **Exportálás helyileg tárolt adatokból:**
   - Konzolban írd be: `findmateDebug.exportStoredData()`
   - Ez letölti a tárolt adatokat CSV formátumban

## Jelenlegi fallback rendszer

A form most háromféle módszert próbál:
1. **FormData** beküldés a Google Apps Script-hez
2. **URL-encoded** beküldés alternatívként
3. **Helyi tárolás** ha minden más sikertelen

A felhasználók mindig kapnak visszajelzést, és az adatok nem vesznek el.

## Alternatív megoldások

Ha a Google Sheets továbbra sem működik:

1. **Netlify Forms** - automatikus form kezelés
2. **Formspree** - egyszerű form backend
3. **EmailJS** - közvetlen email küldés
4. **Firebase** - valós idejű adatbázis

Szükség esetén implementálhatjuk ezeket a megoldásokat.