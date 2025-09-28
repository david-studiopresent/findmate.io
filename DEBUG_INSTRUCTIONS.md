# Form Debug Útmutató

A form beküldési problémáját diagnosztizálni kell. Kövesse ezeket a lépéseket:

## 1. Nyissa meg a Developer Tools-t

1. Töltse be a FindMate oldalt
2. Nyomja meg `F12` vagy `Ctrl+Shift+I` (Windows) / `Cmd+Opt+I` (Mac)
3. Menjen a **Console** fülre

## 2. Tesztelje a formot

### Automatikus teszt:
```javascript
findmateDebug.testFormSubmission()
```

### Vagy manuálisan:
1. Töltse ki a form mezőket
2. Kattintson a "Secure My Early Bird Access" gombra
3. Figyelje a konzol üzeneteket

## 3. Mit kell keresni a konzolban:

### ✅ Sikeres beküldés jelei:
```
🔄 Form submission started
📝 Submission data prepared: {name: "...", email: "..."}
🔄 Trying FormData method...
✅ FormData method successful
```

### ❌ Hiba jelei:
```
❌ FormData method failed: [hiba üzenet]
🔄 Using localStorage fallback...
💾 Data stored locally: [...]
```

## 4. Ellenőrizze a tárolt adatokat:

```javascript
findmateDebug.checkStoredSubmissions()
```

## 5. Exportálja a helyi adatokat:

```javascript
findmateDebug.exportStoredData()
```

## 6. Google Apps Script beállítása

Ha a FormData módszer sikertelen, telepítenie kell az új Google Apps Script-et:

1. Menjen a [script.google.com](https://script.google.com) oldalra
2. Hozzon létre új projektet
3. Másolja be a `google-apps-script.js` tartalmát
4. A SHEET_ID már be van állítva: `1Vn2qGy5C8K63FPmGGJsoP9HvFuss3EbEQW2Qu877C9M`
5. A SHEET_NAME már be van állítva: `WaitList`
6. Mentse és telepítse Web App-ként
7. Másolja az új URL-t a `script.js` fájlba

## 7. Jelenleg mi történik

- A form minden esetben válaszol a felhasználónak
- Ha a Google Sheets nem elérhető, helyi tárolást használ
- Semmi adat nem veszik el
- Debug funkciókkal mindent nyomon követhet

## 8. Gyakori problémák

1. **CORS hiba** - ezért használjuk a `no-cors` módot
2. **Script URL helytelen** - új Google Apps Script szükséges
3. **Sheet név nem egyezik** - `WaitList` névnek kell lennie
4. **Engedélyek hiánya** - a script telepítésekor engedélyezni kell

Kérem, futtassa a debug parancsokat és ossza meg a konzol kimenetét!