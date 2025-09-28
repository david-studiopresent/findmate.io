# Google Sheets Hiba Megoldása
## "Cannot read properties of undefined (reading 'getRange')"

## A probléma oka
A hiba azt jelenti, hogy a Google Apps Script nem tudja elérni a Google Sheets-et. Ez lehet:

1. **Hibás Sheet ID** - A megadott Google Sheets nem létezik
2. **Nincs jogosultság** - Nincs írási jog a sheets-hez
3. **Hibás sheet név** - A "WaitList" lap nem létezik

## 🚨 GYORS MEGOLDÁS

### 1. Ellenőrizd a Google Sheets ID-t

**Jelenlegi ID a kódban:**
```
1Vn2qGy5C8K63FPmGGJsoP9HvFuss3EbEQW2Qu877C9M
```

**Hogyan ellenőrizd:**
1. Menj a Google Sheets URL-re:
   `https://docs.google.com/spreadsheets/d/1Vn2qGy5C8K63FPmGGJsoP9HvFuss3EbEQW2Qu877C9M/edit`
2. Ha nem nyílik meg, vagy nincs jogod hozzá → **Ez a probléma!**

### 2. Használd a javított script-et

1. **Töröld ki az összes kódot** a Google Apps Script-ből
2. **Másold be a teljes kódot** a `google-apps-script-v3-fixed.js` fájlból
3. **Mentsd el**

### 3. Futtasd a diagnosztikai funkciókat

**ELSŐ:** Futtasd a `checkSheetAccess` funkciót:
- Legördülő menü → `checkSheetAccess`
- Kattints ▶ (Run)
- Nézd meg a logokat (View → Logs)

**MÁSODIK:** Ha az első OK, futtasd `setupSheetSafely`:
- Legördülő menü → `setupSheetSafely`
- Kattints ▶ (Run)

**HARMADIK:** Teszteld `testFormSubmissionSafe`:
- Legördülő menü → `testFormSubmissionSafe`
- Kattints ▶ (Run)

## 🔧 Ha továbbra sem működik

### Opció A: Új Google Sheets létrehozása

1. **Hozz létre új Google Sheets-et**
2. **Másold ki az ID-t** az URL-ből:
   ```
   https://docs.google.com/spreadsheets/d/[EZ_AZ_ID]/edit
   ```
3. **Cseréld le a CONFIG-ban**:
   ```javascript
   const CONFIG = {
     SHEET_ID: 'ÚJ_SHEETS_ID_IDE',
     SHEET_NAME: 'WaitList'
   };
   ```

### Opció B: Jogosultságok rendezése

1. **Menj a Google Sheets-hez**
2. **Share gomb** → Add hozzá a saját email címedet **Editor** jogokkal
3. **Vagy:** Változtasd a sharing-et "Anyone with the link can edit"-re

### Opció C: Manuális sheet létrehozás

Ha minden más sikertelen:

1. **Futtasd a `createSheetManually` funkciót**
2. **Ez töröl mindent és újra létrehozza**

## 📊 Ellenőrzés

**Ha minden jól megy, a logokban ezt látod:**
```
✅ Spreadsheet opened successfully
✅ Target sheet found: WaitList
✅ Headers set successfully
✅ TEST PASSED: Safe form submission working
```

## 🆘 Ha még mindig nem megy

**1. Ellenőrizd a pontos hibát:**
- Google Apps Script → View → Logs
- Másold ki a teljes hibaüzenetet

**2. Leggyakoribb hibák:**
- `does not exist` → Hibás Sheet ID
- `permission denied` → Nincs jogosultság
- `sheet not found` → Hibás sheet név

**3. Utolsó megoldás:**
- Hozz létre teljesen új Google Sheets-et
- Adj neki Editor jogot
- Használd az új ID-t a script-ben

A javított script sokkal több hibakezelést tartalmaz és pontosan megmondja, mi a probléma!