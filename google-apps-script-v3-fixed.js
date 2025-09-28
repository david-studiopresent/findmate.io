/**
 * JAVÍTOTT GOOGLE APPS SCRIPT FOR FINDMATE WAITLIST - V3
 *
 * Ez a verzió javítja a "Cannot read properties of undefined" hibát
 */

// FONTOS: Ellenőrizd ezt a Sheet ID-t!
const CONFIG = {
  SHEET_ID: '1Vn2qGy5C8K63FPmGGJsoP9HvFuss3EbEQW2Qu877C9M',
  SHEET_NAME: 'WaitList'
};

/**
 * ELSŐ LÉPÉS: Futtasd ezt a funkciót a setup előtt!
 */
function checkSheetAccess() {
  console.log('🔍 Checking sheet access...');

  try {
    // 1. Próbáljuk megnyitni a spreadsheet-et
    console.log('📂 Trying to open spreadsheet with ID:', CONFIG.SHEET_ID);

    const spreadsheet = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    console.log('✅ Spreadsheet opened successfully');
    console.log('📄 Spreadsheet name:', spreadsheet.getName());

    // 2. Listázzuk az összes sheet-et
    const sheets = spreadsheet.getSheets();
    console.log('📋 Available sheets:');
    sheets.forEach((sheet, index) => {
      console.log(`  ${index + 1}. ${sheet.getName()}`);
    });

    // 3. Próbáljuk megtalálni a target sheet-et
    let targetSheet = spreadsheet.getSheetByName(CONFIG.SHEET_NAME);

    if (targetSheet) {
      console.log('✅ Target sheet found:', CONFIG.SHEET_NAME);
      const lastRow = targetSheet.getLastRow();
      console.log('📊 Current rows in sheet:', lastRow);
    } else {
      console.log('⚠️  Target sheet NOT found:', CONFIG.SHEET_NAME);
      console.log('🔧 Will need to create it');
    }

    return {
      success: true,
      spreadsheetName: spreadsheet.getName(),
      sheetExists: !!targetSheet,
      availableSheets: sheets.map(s => s.getName())
    };

  } catch (error) {
    console.error('❌ Error accessing spreadsheet:', error.toString());

    if (error.toString().includes('does not exist')) {
      console.error('💡 SOLUTION: Check the SHEET_ID in CONFIG. Make sure you have access to this spreadsheet.');
    } else if (error.toString().includes('permission')) {
      console.error('💡 SOLUTION: Make sure you have edit access to the spreadsheet.');
    }

    return {
      success: false,
      error: error.toString(),
      suggestion: 'Check SHEET_ID and permissions'
    };
  }
}

/**
 * MÁSODIK LÉPÉS: Futtasd ezt a sheet setup-hoz
 */
function setupSheetSafely() {
  console.log('🔧 Safe sheet setup starting...');

  try {
    // Először ellenőrizzük a hozzáférést
    const accessCheck = checkSheetAccess();

    if (!accessCheck.success) {
      throw new Error('Cannot access spreadsheet: ' + accessCheck.error);
    }

    console.log('📂 Opening spreadsheet...');
    const spreadsheet = SpreadsheetApp.openById(CONFIG.SHEET_ID);

    let sheet = spreadsheet.getSheetByName(CONFIG.SHEET_NAME);

    if (!sheet) {
      console.log('📝 Creating new sheet:', CONFIG.SHEET_NAME);

      // Biztonságos sheet létrehozás
      sheet = spreadsheet.insertSheet();
      sheet.setName(CONFIG.SHEET_NAME);

      console.log('✅ Sheet created successfully');
    } else {
      console.log('✅ Using existing sheet:', CONFIG.SHEET_NAME);
    }

    // Ellenőrizzük, hogy van-e header
    const lastRow = sheet.getLastRow();
    console.log('📊 Current last row:', lastRow);

    if (lastRow === 0) {
      console.log('📋 Setting up headers...');
      setupSheetHeadersSafely(sheet);
    } else {
      console.log('📋 Headers already exist, checking...');
      const firstRowValues = sheet.getRange(1, 1, 1, 5).getValues()[0];
      console.log('📄 Current headers:', firstRowValues);

      if (!firstRowValues[0] || firstRowValues[0] !== 'Timestamp') {
        console.log('🔄 Headers seem incorrect, updating...');
        setupSheetHeadersSafely(sheet);
      }
    }

    console.log('✅ Sheet setup completed successfully');
    return { success: true, sheetName: sheet.getName() };

  } catch (error) {
    console.error('💥 Error in setupSheetSafely:', error);
    return { success: false, error: error.toString() };
  }
}

/**
 * Biztonságos header setup
 */
function setupSheetHeadersSafely(sheet) {
  if (!sheet) {
    throw new Error('Sheet object is null or undefined');
  }

  console.log('📋 Setting up headers for sheet:', sheet.getName());

  const headers = [
    'Timestamp',
    'Name',
    'Email',
    'Social Link',
    'Why Choose',
    'Source',
    'UTM Source',
    'UTM Medium',
    'UTM Campaign',
    'UTM Term',
    'UTM Content',
    'User Agent',
    'Referrer',
    'Page URL'
  ];

  try {
    // Headers beállítása
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setValues([headers]);

    // Formázás
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#4285f4');
    headerRange.setFontColor('#ffffff');

    // Oszlopszélességek
    sheet.setColumnWidth(1, 180); // Timestamp
    sheet.setColumnWidth(2, 150); // Name
    sheet.setColumnWidth(3, 200); // Email
    sheet.setColumnWidth(4, 200); // Social Link
    sheet.setColumnWidth(5, 300); // Why Choose

    // Header row befagyasztása
    sheet.setFrozenRows(1);

    console.log('✅ Headers set successfully:', headers.length, 'columns');

  } catch (error) {
    console.error('❌ Error setting headers:', error);
    throw error;
  }
}

/**
 * Fő POST handler
 */
function doPost(e) {
  console.log('=== FORM SUBMISSION RECEIVED ===');

  try {
    // Log request details
    console.log('📨 Event object keys:', Object.keys(e));
    if (e.parameter) {
      console.log('📋 Parameters received:', JSON.stringify(e.parameter, null, 2));
    }

    // Extract form data
    let formData = {};

    if (e.parameter && Object.keys(e.parameter).length > 0) {
      formData = e.parameter;
      console.log('✅ Using URL parameters');
    } else if (e.postData) {
      console.log('📤 POST data type:', e.postData.type);

      if (e.postData.type === 'application/x-www-form-urlencoded') {
        const params = new URLSearchParams(e.postData.contents);
        for (const [key, value] of params) {
          formData[key] = value;
        }
        console.log('✅ Using form-encoded data');
      }
    }

    console.log('📊 Final form data:', JSON.stringify(formData, null, 2));

    // Validate required fields
    if (!formData.name || !formData.email) {
      const error = `Missing required fields. Name: "${formData.name}", Email: "${formData.email}"`;
      console.log('❌ Validation failed:', error);
      return createResponse({
        status: 'error',
        message: error,
        received_data: formData
      });
    }

    // Safely access the spreadsheet
    console.log('🔍 Accessing spreadsheet...');
    const spreadsheet = SpreadsheetApp.openById(CONFIG.SHEET_ID);

    if (!spreadsheet) {
      throw new Error('Could not open spreadsheet with ID: ' + CONFIG.SHEET_ID);
    }

    console.log('✅ Spreadsheet opened:', spreadsheet.getName());

    let sheet = spreadsheet.getSheetByName(CONFIG.SHEET_NAME);

    // Create sheet if it doesn't exist
    if (!sheet) {
      console.log('📝 Creating sheet:', CONFIG.SHEET_NAME);
      sheet = spreadsheet.insertSheet();
      sheet.setName(CONFIG.SHEET_NAME);
      setupSheetHeadersSafely(sheet);
    }

    console.log('✅ Using sheet:', sheet.getName());

    // Prepare data
    const timestamp = new Date();
    const rowData = [
      timestamp.toISOString(),
      formData.name || '',
      formData.email || '',
      formData.social_link || '',
      formData.why_choose || '',
      formData.source || 'landing_page',
      formData.utm_source || '',
      formData.utm_medium || '',
      formData.utm_campaign || '',
      formData.utm_term || '',
      formData.utm_content || '',
      formData.user_agent || '',
      formData.referrer || '',
      formData.page_url || ''
    ];

    console.log('💾 Appending row data:', rowData);

    // Add the row
    const beforeRows = sheet.getLastRow();
    sheet.appendRow(rowData);
    const afterRows = sheet.getLastRow();

    console.log('📊 Rows before:', beforeRows, 'after:', afterRows);

    if (afterRows > beforeRows) {
      console.log('✅ SUCCESS: Data written to sheet');

      return createResponse({
        status: 'success',
        message: 'Data saved successfully',
        timestamp: timestamp.toISOString(),
        row_number: afterRows,
        data: {
          name: formData.name,
          email: formData.email
        }
      });
    } else {
      throw new Error('Row was not added - appendRow failed');
    }

  } catch (error) {
    console.error('💥 ERROR in doPost:', error);
    console.error('📍 Error stack:', error.stack);

    return createResponse({
      status: 'error',
      message: error.toString(),
      timestamp: new Date().toISOString(),
      debug_info: {
        sheet_id: CONFIG.SHEET_ID,
        sheet_name: CONFIG.SHEET_NAME,
        error_stack: error.stack
      }
    });
  }
}

/**
 * GET handler for testing
 */
function doGet(e) {
  return createResponse({
    status: 'success',
    message: 'FindMate Waitlist API v3 is running',
    timestamp: new Date().toISOString(),
    config: CONFIG
  });
}

/**
 * Test function
 */
function testFormSubmissionSafe() {
  console.log('🧪 Testing form submission safely...');

  // Először ellenőrizzük a sheet hozzáférést
  const accessCheck = checkSheetAccess();
  console.log('🔍 Access check result:', accessCheck);

  if (!accessCheck.success) {
    console.error('❌ Cannot proceed with test - sheet access failed');
    return false;
  }

  // Ha OK, akkor teszteljük a form submission-t
  const testEvent = {
    parameter: {
      name: 'Test User Safe',
      email: 'test-safe@findmate.io',
      social_link: '@testsafe',
      why_choose: 'Testing the safe version!',
      source: 'test_safe_function'
    }
  };

  try {
    const result = doPost(testEvent);
    const response = JSON.parse(result.getContent());

    console.log('🎯 Test result:', JSON.stringify(response, null, 2));

    if (response.status === 'success') {
      console.log('✅ TEST PASSED: Safe form submission working');
      return true;
    } else {
      console.log('❌ TEST FAILED:', response.message);
      return false;
    }
  } catch (error) {
    console.error('💥 TEST ERROR:', error);
    return false;
  }
}

/**
 * Response helper
 */
function createResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data, null, 2))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Manual sheet creation function
 */
function createSheetManually() {
  console.log('🔧 Creating sheet manually...');

  try {
    const spreadsheet = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    console.log('📂 Spreadsheet:', spreadsheet.getName());

    // Delete existing sheet if exists
    const existingSheet = spreadsheet.getSheetByName(CONFIG.SHEET_NAME);
    if (existingSheet) {
      console.log('🗑️  Deleting existing sheet');
      spreadsheet.deleteSheet(existingSheet);
    }

    // Create new sheet
    const newSheet = spreadsheet.insertSheet();
    newSheet.setName(CONFIG.SHEET_NAME);

    console.log('📝 New sheet created:', newSheet.getName());

    // Setup headers
    setupSheetHeadersSafely(newSheet);

    console.log('✅ Manual sheet creation completed');
    return { success: true, sheetName: newSheet.getName() };

  } catch (error) {
    console.error('❌ Manual creation failed:', error);
    return { success: false, error: error.toString() };
  }
}