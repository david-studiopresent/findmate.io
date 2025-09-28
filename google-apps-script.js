/**
 * Google Apps Script for FindMate Waitlist Form
 *
 * COMPLETE SETUP INSTRUCTIONS:
 * 1. Go to script.google.com
 * 2. Create a new project
 * 3. Replace the default code with this entire script
 * 4. Save and name the project "FindMate Waitlist Handler"
 * 5. Run the testScript function once to authorize permissions
 * 6. Deploy as Web App:
 *    - Click "Deploy" > "New deployment"
 *    - Choose type: "Web app"
 *    - Description: "FindMate Waitlist Form Handler"
 *    - Execute as: "Me (your email)"
 *    - Who has access: "Anyone"
 *    - Click "Deploy"
 * 7. Copy the Web App URL and replace the URL in script.js
 * 8. Test by running testScript function
 *
 * TROUBLESHOOTING:
 * - Make sure you have edit access to the Google Sheet
 * - Check the Apps Script execution log for errors
 * - Verify the Sheet ID and sheet name are correct
 */

function doPost(e) {
  try {
    console.log('📨 Form submission received');
    console.log('📋 Request data:', JSON.stringify(e));

    // Get the Google Sheet by ID
    const SHEET_ID = '1Vn2qGy5C8K63FPmGGJsoP9HvFuss3EbEQW2Qu877C9M';
    const SHEET_NAME = 'WaitList';

    console.log('🔍 Opening spreadsheet:', SHEET_ID);
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);

    // If sheet doesn't exist, create it with headers
    if (!sheet) {
      console.log('📝 Creating new sheet:', SHEET_NAME);
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      sheet.getRange(1, 1, 1, 14).setValues([[
        'Timestamp', 'Name', 'Email', 'Social Link', 'Why Choose', 'Source', 'UTM Source', 'UTM Medium',
        'UTM Campaign', 'UTM Term', 'UTM Content', 'User Agent', 'Referrer', 'Page URL'
      ]]);
      sheet.getRange(1, 1, 1, 14).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    // Get form data - handle both FormData and URL parameters
    let formData = {};

    if (e.parameter) {
      formData = e.parameter;
      console.log('📊 Using URL parameters:', formData);
    } else if (e.postData) {
      // Try to parse JSON if available
      try {
        formData = JSON.parse(e.postData.contents);
        console.log('📊 Using JSON data:', formData);
      } catch (jsonError) {
        console.log('❌ JSON parse failed, using raw data');
        formData = e.postData;
      }
    }

    // Validate required fields
    if (!formData.name || !formData.email) {
      console.log('❌ Missing required fields:', { name: formData.name, email: formData.email });
      return ContentService
        .createTextOutput(JSON.stringify({
          status: 'error',
          message: 'Name and email are required'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Prepare row data
    const rowData = [
      new Date().toISOString(),
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

    console.log('💾 Saving row data:', rowData);

    // Add row to sheet
    sheet.appendRow(rowData);

    console.log('✅ Data successfully saved to sheet');

    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Data saved successfully',
        timestamp: new Date().toISOString(),
        email: formData.email
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    console.error('💥 Error in doPost:', error);
    console.error('📋 Error details:', error.toString());
    console.error('📍 Stack trace:', error.stack);

    // Return detailed error response
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString(),
        details: error.stack,
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  // Handle GET requests (for testing)
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'success',
      message: 'FindMate Waitlist Script is running'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Test function to verify the script works
function testScript() {
  console.log('🧪 Starting test script...');

  const testData = {
    parameter: {
      name: 'Test User',
      email: 'test@findmate.io',
      source: 'test_script',
      utm_source: 'test',
      utm_medium: 'script',
      utm_campaign: 'testing',
      user_agent: 'Google Apps Script Test',
      referrer: 'script.google.com',
      page_url: 'https://findmate.io/test'
    }
  };

  try {
    console.log('📝 Sending test data:', testData);
    const result = doPost(testData);
    const responseText = result.getContent();
    console.log('✅ Test result:', responseText);

    const response = JSON.parse(responseText);
    if (response.status === 'success') {
      console.log('🎉 Test PASSED - Data successfully saved to sheet');
      return true;
    } else {
      console.log('❌ Test FAILED:', response);
      return false;
    }
  } catch (error) {
    console.error('💥 Test ERROR:', error);
    return false;
  }
}

// Function to check sheet access and permissions
function checkSheetAccess() {
  try {
    console.log('🔍 Checking sheet access...');

    const SHEET_ID = '1Vn2qGy5C8K63FPmGGJsoP9HvFuss3EbEQW2Qu877C9M';
    const SHEET_NAME = 'WaitList';

    // Try to open the spreadsheet
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    console.log('✅ Spreadsheet opened successfully');
    console.log('📄 Spreadsheet name:', spreadsheet.getName());

    // Try to access the sheet
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);

    if (!sheet) {
      console.log('📝 Sheet "WaitList" does not exist, creating it...');
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      sheet.getRange(1, 1, 1, 14).setValues([[
        'Timestamp', 'Name', 'Email', 'Social Link', 'Why Choose', 'Source', 'UTM Source', 'UTM Medium',
        'UTM Campaign', 'UTM Term', 'UTM Content', 'User Agent', 'Referrer', 'Page URL'
      ]]);
      sheet.getRange(1, 1, 1, 14).setFontWeight('bold');
      sheet.setFrozenRows(1);
      console.log('✅ Sheet created successfully');
    } else {
      console.log('✅ Sheet "WaitList" exists');
    }

    // Check existing data
    const lastRow = sheet.getLastRow();
    console.log('📊 Current rows in sheet:', lastRow);

    if (lastRow > 1) {
      const lastData = sheet.getRange(lastRow, 1, 1, 12).getValues()[0];
      console.log('📝 Last entry:', lastData);
    }

    return {
      success: true,
      message: 'Sheet access verified',
      sheetName: spreadsheet.getName(),
      rows: lastRow
    };

  } catch (error) {
    console.error('❌ Sheet access failed:', error);
    return {
      success: false,
      error: error.toString(),
      message: 'Failed to access sheet - check permissions and Sheet ID'
    };
  }
}

// Function to manually add a test entry
function addTestEntry() {
  try {
    const testEntry = {
      parameter: {
        name: 'Manual Test User',
        email: 'manual-test@findmate.io',
        source: 'manual_test',
        utm_source: 'manual',
        utm_medium: 'test',
        utm_campaign: 'verification',
        user_agent: 'Manual Entry',
        referrer: 'direct',
        page_url: 'https://findmate.io/manual-test'
      }
    };

    const result = doPost(testEntry);
    console.log('Manual test result:', result.getContent());
    return result;

  } catch (error) {
    console.error('Manual test failed:', error);
    return error;
  }
}