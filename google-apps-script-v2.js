/**
 * COMPLETE GOOGLE APPS SCRIPT FOR FINDMATE WAITLIST
 *
 * STEP-BY-STEP SETUP INSTRUCTIONS:
 *
 * 1. Go to https://script.google.com
 * 2. Click "New Project"
 * 3. Replace ALL the default code with this entire script
 * 4. Save (Ctrl+S) and name it "FindMate Waitlist Handler v2"
 * 5. Run the "setupSheet" function once (click ▶ button next to it)
 * 6. Authorize permissions when prompted
 * 7. Deploy as Web App:
 *    - Click "Deploy" → "New deployment"
 *    - Click gear icon ⚙ → Choose "Web app"
 *    - Description: "FindMate Form Handler"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone"
 *    - Click "Deploy"
 * 8. COPY THE WEB APP URL and replace in script.js
 * 9. Test by running "testFormSubmission" function
 */

// Configuration - VERIFY THESE SETTINGS
const CONFIG = {
  SHEET_ID: '1Vn2qGy5C8K63FPmGGJsoP9HvFuss3EbEQW2Qu877C9M',
  SHEET_NAME: 'WaitList'
};

/**
 * Main function to handle POST requests from the form
 */
function doPost(e) {
  console.log('=== FORM SUBMISSION RECEIVED ===');
  console.log('Raw event object:', JSON.stringify(e, null, 2));

  try {
    // Log the request details
    if (e.postData) {
      console.log('POST data type:', e.postData.type);
      console.log('POST data contents:', e.postData.contents);
    }

    if (e.parameter) {
      console.log('URL parameters:', JSON.stringify(e.parameter, null, 2));
    }

    // Extract form data from different possible sources
    let formData = {};

    // Method 1: URL parameters (most common with fetch)
    if (e.parameter && Object.keys(e.parameter).length > 0) {
      formData = e.parameter;
      console.log('✅ Using URL parameters as data source');
    }
    // Method 2: JSON in POST body
    else if (e.postData && e.postData.contents) {
      try {
        formData = JSON.parse(e.postData.contents);
        console.log('✅ Using JSON POST data as source');
      } catch (jsonError) {
        console.log('❌ Failed to parse JSON, trying form data...');
        // Method 3: Form data parsing
        if (e.postData.type === 'application/x-www-form-urlencoded') {
          const params = new URLSearchParams(e.postData.contents);
          for (const [key, value] of params) {
            formData[key] = value;
          }
          console.log('✅ Using form-encoded data as source');
        }
      }
    }

    console.log('📋 Extracted form data:', JSON.stringify(formData, null, 2));

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

    // Open the spreadsheet and sheet
    console.log('📂 Opening spreadsheet:', CONFIG.SHEET_ID);
    const spreadsheet = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    console.log('📄 Spreadsheet name:', spreadsheet.getName());

    let sheet = spreadsheet.getSheetByName(CONFIG.SHEET_NAME);

    // Create sheet if it doesn't exist
    if (!sheet) {
      console.log('📝 Creating new sheet:', CONFIG.SHEET_NAME);
      sheet = spreadsheet.insertSheet(CONFIG.SHEET_NAME);
      setupSheetHeaders(sheet);
    } else {
      console.log('✅ Found existing sheet:', CONFIG.SHEET_NAME);
    }

    // Prepare the row data
    const timestamp = new Date();
    const rowData = [
      timestamp.toISOString(),                    // A: Timestamp
      formData.name || '',                        // B: Name
      formData.email || '',                       // C: Email
      formData.social_link || '',                 // D: Social Link
      formData.why_choose || '',                  // E: Why Choose
      formData.source || 'landing_page',          // F: Source
      formData.utm_source || '',                  // G: UTM Source
      formData.utm_medium || '',                  // H: UTM Medium
      formData.utm_campaign || '',                // I: UTM Campaign
      formData.utm_term || '',                    // J: UTM Term
      formData.utm_content || '',                 // K: UTM Content
      formData.user_agent || '',                  // L: User Agent
      formData.referrer || '',                    // M: Referrer
      formData.page_url || ''                     // N: Page URL
    ];

    console.log('💾 Prepared row data:', rowData);

    // Add the row to the sheet
    const lastRow = sheet.getLastRow();
    console.log('📊 Current last row:', lastRow);

    sheet.appendRow(rowData);
    const newLastRow = sheet.getLastRow();
    console.log('✅ New last row after append:', newLastRow);

    // Verify the data was written
    if (newLastRow > lastRow) {
      console.log('✅ SUCCESS: Data successfully written to sheet');
      const writtenData = sheet.getRange(newLastRow, 1, 1, rowData.length).getValues()[0];
      console.log('📝 Written data verification:', writtenData);

      return createResponse({
        status: 'success',
        message: 'Data saved successfully',
        timestamp: timestamp.toISOString(),
        row_number: newLastRow,
        data_written: {
          name: formData.name,
          email: formData.email,
          social_link: formData.social_link || 'none',
          why_choose: formData.why_choose || 'none'
        }
      });
    } else {
      throw new Error('Row was not added to sheet - appendRow failed');
    }

  } catch (error) {
    console.error('💥 ERROR in doPost:', error);
    console.error('📍 Error stack:', error.stack);

    return createResponse({
      status: 'error',
      message: error.toString(),
      error_details: error.stack,
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * Handle GET requests (for testing)
 */
function doGet(e) {
  console.log('GET request received:', JSON.stringify(e, null, 2));

  return createResponse({
    status: 'success',
    message: 'FindMate Waitlist API is running',
    timestamp: new Date().toISOString(),
    version: '2.0',
    sheet_id: CONFIG.SHEET_ID,
    sheet_name: CONFIG.SHEET_NAME
  });
}

/**
 * Setup function to create and configure the sheet
 */
function setupSheet() {
  console.log('🔧 Setting up sheet...');

  try {
    const spreadsheet = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    console.log('📂 Opened spreadsheet:', spreadsheet.getName());

    let sheet = spreadsheet.getSheetByName(CONFIG.SHEET_NAME);

    if (sheet) {
      console.log('⚠️  Sheet already exists. Checking headers...');
      const headers = sheet.getRange(1, 1, 1, 14).getValues()[0];
      console.log('📋 Current headers:', headers);
    } else {
      console.log('📝 Creating new sheet...');
      sheet = spreadsheet.insertSheet(CONFIG.SHEET_NAME);
      setupSheetHeaders(sheet);
    }

    console.log('✅ Sheet setup complete');
    return { success: true, message: 'Sheet setup successful' };

  } catch (error) {
    console.error('❌ Setup failed:', error);
    throw error;
  }
}

/**
 * Configure sheet headers and formatting
 */
function setupSheetHeaders(sheet) {
  const headers = [
    'Timestamp', 'Name', 'Email', 'Social Link', 'Why Choose', 'Source',
    'UTM Source', 'UTM Medium', 'UTM Campaign', 'UTM Term', 'UTM Content',
    'User Agent', 'Referrer', 'Page URL'
  ];

  // Set headers
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  // Format headers
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#4285f4');
  headerRange.setFontColor('#ffffff');

  // Set column widths
  sheet.setColumnWidth(1, 180); // Timestamp
  sheet.setColumnWidth(2, 150); // Name
  sheet.setColumnWidth(3, 200); // Email
  sheet.setColumnWidth(4, 200); // Social Link
  sheet.setColumnWidth(5, 300); // Why Choose

  // Freeze header row
  sheet.setFrozenRows(1);

  console.log('✅ Headers configured:', headers);
}

/**
 * Create standardized response
 */
function createResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data, null, 2))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Test function to verify everything works
 */
function testFormSubmission() {
  console.log('🧪 Testing form submission...');

  const testEvent = {
    parameter: {
      name: 'Test User',
      email: 'test@findmate.io',
      social_link: '@testuser',
      why_choose: 'I love testing new gadgets!',
      source: 'test_function',
      utm_source: 'manual_test',
      user_agent: 'Google Apps Script Test'
    }
  };

  try {
    const result = doPost(testEvent);
    const response = JSON.parse(result.getContent());

    console.log('🎯 Test result:', JSON.stringify(response, null, 2));

    if (response.status === 'success') {
      console.log('✅ TEST PASSED: Form submission working correctly');
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
 * Check current sheet data
 */
function checkSheetData() {
  try {
    const spreadsheet = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    const sheet = spreadsheet.getSheetByName(CONFIG.SHEET_NAME);

    if (!sheet) {
      console.log('❌ Sheet not found');
      return;
    }

    const lastRow = sheet.getLastRow();
    console.log('📊 Total rows:', lastRow);

    if (lastRow > 1) {
      const data = sheet.getRange(2, 1, lastRow - 1, 14).getValues();
      console.log('📋 Recent entries:');
      data.slice(-5).forEach((row, index) => {
        console.log(`Row ${lastRow - 4 + index}:`, {
          timestamp: row[0],
          name: row[1],
          email: row[2],
          social_link: row[3],
          why_choose: row[4]
        });
      });
    } else {
      console.log('📝 No data entries found (only headers)');
    }

  } catch (error) {
    console.error('❌ Error checking sheet:', error);
  }
}