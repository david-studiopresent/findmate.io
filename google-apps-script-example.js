// Google Apps Script kód a Google Sheets-hez
// Ez a fájl csak referencia - a Google Apps Script editorban kell létrehozni

function doPost(e) {
  try {
    // A Google Sheets ID amit megadtál
    const SHEET_ID = '1Vn2qGy5C8K63FPmGGJsoP9HvFuss3EbEQW2Qu877C9M';

    // Megnyitjuk a spreadsheet-et
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();

    // Ha nincs header sor, hozzáadjuk
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp',
        'Name',
        'Email',
        'Source',
        'UTM Source',
        'UTM Medium',
        'UTM Campaign',
        'UTM Term',
        'UTM Content',
        'User Agent',
        'Referrer',
        'Page URL'
      ]);
    }

    // Az űrlap adatainak kinyerése
    const formData = e.parameter;

    // Új sor hozzáadása az adatokkal
    sheet.appendRow([
      formData.timestamp || new Date().toISOString(),
      formData.name || '',
      formData.email || '',
      formData.source || '',
      formData.utm_source || '',
      formData.utm_medium || '',
      formData.utm_campaign || '',
      formData.utm_term || '',
      formData.utm_content || '',
      formData.user_agent || '',
      formData.referrer || '',
      formData.page_url || ''
    ]);

    // Sikeres válasz visszaküldése
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Data saved successfully'
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Hiba esetén
    console.error('Error:', error);
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// GET kérések kezelése (teszteléshez)
function doGet(e) {
  return ContentService
    .createTextOutput('FindMate waitlist endpoint is working!')
    .setMimeType(ContentService.MimeType.TEXT);
}

/*
TELEPÍTÉSI LÉPÉSEK:

1. Menj a Google Apps Script-re: https://script.google.com
2. Új projekt létrehozása
3. Másold be ezt a kódot
4. Mentsd el a projektet
5. Deploy > New deployment
6. Type: Web app
7. Execute as: Me
8. Who has access: Anyone
9. Deploy gombra kattints
10. Másold ki a web app URL-t
11. Cseréld ki a script.js-ben a fetch URL-t erre az új URL-re

FONTOS:
- A Google Sheets-nek publikusnak kell lennie (vagy legalább szerkesztési joggal rendelkezned kell)
- A script futtatásához engedélyezned kell a Google fiókodban
*/