# Google Sheets Integration Fix - Részletes Útmutató

## A probléma

A FindMate landing page űrlap nem menti az adatokat a Google Sheets-be. Ez azért van, mert:

1. **Régi Google Apps Script URL** - A jelenlegi URL valószínűleg nem létezik vagy nem működik
2. **Hibás konfiguráció** - A script nincs megfelelően beállítva
3. **Engedélyek hiánya** - A script nem fér hozzá a Google Sheets-hez

## Megoldás - Lépésről lépésre

### 1. Új Google Apps Script létrehozása

1. **Menj a https://script.google.com oldalra**
2. **Kattints a "Új projekt" gombra**
3. **Töröld az összes meglévő kódot**
4. **Másold be a teljes kódot** a `google-apps-script-v2.js` fájlból
5. **Mentsd el** (Ctrl+S) és add neki a nevet: "FindMate Waitlist Handler v2"

### 2. Script konfigurálása

1. **Ellenőrizd a CONFIG konstanst** a script tetején:
   ```javascript
   const CONFIG = {
     SHEET_ID: '1Vn2qGy5C8K63FPmGGJsoP9HvFuss3EbEQW2Qu877C9M',
     SHEET_NAME: 'WaitList'
   };
   ```

2. **Futtasd a setupSheet funkciót**:
   - Válaszd ki a `setupSheet` funkciót a legördülő menüből
   - Kattints a ▶ (Futtatás) gombra
   - **Engedélyezd a jogosultságokat** amikor kéri

### 3. Tesztelés

1. **Futtasd a testFormSubmission funkciót**:
   - Válaszd ki `testFormSubmission`-t
   - Kattints ▶ gombra
   - Nézd meg a logokat (View → Logs)

2. **Ellenőrizd a Google Sheets-et**:
   - Menj a Google Sheets-hez
   - Nézd meg, hogy létrejött-e a "WaitList" lap
   - Ellenőrizd, hogy van-e benne teszt adat

### 4. Web App telepítése

1. **Deploy gombra kattints** → "Új telepítés"
2. **Típus választás**: Kattints a fogaskerék ikonra → "Web app"
3. **Beállítások**:
   - Leírás: "FindMate Form Handler"
   - Végrehajtás mint: "Me (your@email.com)"
   - Hozzáférés: "Anyone"
4. **Deploy gombra kattints**
5. **MÁSOLD KI A WEB APP URL-t** - ez fog kelleni!

### 5. Landing page frissítése

1. **Nyisd meg a `script.js` fájlt**
2. **Keresd meg ezt a sort**:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_NEW_DEPLOYMENT_ID/exec';
   ```
3. **Cseréld le az URL-t** az új Web App URL-re:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzjasRC4CTD8rmJ8eOg81pHe1dXE4eb3KbttLA5mWbsFQ_dN1VYH_qLFn-osuhhLVeV/exec';
   ```

### 6. Tesztelés böngészőben

1. **Nyisd meg a `test-form.html` fájlt** böngészőben
2. **Illeszd be az új Google Apps Script URL-t**
3. **Töltsd ki a tesztelő űrlapot**
4. **Küldd el** és ellenőrizd a Google Sheets-et

### 7. Végleges teszt

1. **Nyisd meg a FindMate landing page-et**
2. **Töltsd ki az űrlapot** valódi adatokkal
3. **Küldd el**
4. **Ellenőrizd a Google Sheets-et** - meg kell jelennie az adatoknak

## Hibakeresés

### Ha nem működik:

1. **Google Apps Script Console**:
   - Apps Script-ben: View → Logs
   - Nézd meg a hibákat

2. **Böngésző Console**:
   - F12 → Console tab
   - Nézd meg a JavaScript hibákat

3. **Google Sheets jogosultságok**:
   - Ellenőrizd, hogy van-e írási jogod a sheet-hez
   - Próbáld meg manuálisan hozzáadni az email címedet a sheet-hez

### Gyakori problémák:

- **"Script function not found"** → Biztos, hogy a teljes kódot bemásoltad?
- **"Permission denied"** → Futtasd újra a setupSheet funkciót
- **"Sheet not found"** → Ellenőrizd a SHEET_ID-t a CONFIG-ban
- **"Deployment not found"** → Új telepítést kell csinálni

## Fontos mezők a Google Sheets-ben

Az új script ezeket a mezőket menti:

1. Timestamp - Küldés időpontja
2. Name - Név
3. Email - Email cím
4. Social Link - Social media link (Instagram/Facebook/TikTok)
5. Why Choose - Miért válasszuk ki őt
6. Source - Forrás (landing_page)
7. UTM mezők - Marketing tracking
8. User Agent - Böngésző info
9. Referrer - Honnan jött
10. Page URL - Oldal címe

## Kapcsolat

Ha még mindig nem működik:
- Nézd meg a Google Apps Script execution logokat
- Ellenőrizd a böngésző network tabban a kéréseket
- Győződj meg róla, hogy a Google Apps Script URL helyes

A probléma 99%-ban az URL cseréjével megoldódik!