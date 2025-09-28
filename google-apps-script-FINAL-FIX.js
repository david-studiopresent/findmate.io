/**
 * FINAL FIX - Google Apps Script for FindMate
 * Fixes social_link and why_choose field processing
 */

const CONFIG = {
  SHEET_ID: '1Vn2qGy5C8K63FPmGGJsoP9HvFuss3EbEQW2Qu877C9M',
  SHEET_NAME: 'WaitList'
};

function doPost(e) {
  console.log('=== FORM SUBMISSION RECEIVED ===');

  try {
    // Log raw event data
    console.log('📨 Raw event parameter:', JSON.stringify(e.parameter, null, 2));
    console.log('📨 Raw postData:', e.postData ? JSON.stringify(e.postData, null, 2) : 'No postData');

    // Extract form data with multiple methods
    let formData = {};

    // Method 1: URL parameters (most common with our fetch)
    if (e.parameter && Object.keys(e.parameter).length > 0) {
      formData = e.parameter;
      console.log('✅ Using URL parameters as primary data source');
    }
    // Method 2: Parse POST body if available
    else if (e.postData && e.postData.contents) {
      console.log('📤 POST data type:', e.postData.type);

      if (e.postData.type === 'application/x-www-form-urlencoded') {
        try {
          const params = new URLSearchParams(e.postData.contents);
          for (const [key, value] of params) {
            formData[key] = value;
          }
          console.log('✅ Parsed form-encoded data');
        } catch (parseError) {
          console.error('❌ Failed to parse form data:', parseError);
        }
      }
    }

    // Log extracted data
    console.log('📋 EXTRACTED FORM DATA:');
    Object.keys(formData).forEach(key => {
      console.log(`  ${key}: "${formData[key]}"`);
    });

    // Validate required fields
    if (!formData.name || !formData.email) {
      const error = `Missing required fields. Name: "${formData.name}", Email: "${formData.email}"`;
      console.error('❌ Validation failed:', error);
      return createResponse({
        status: 'error',
        message: error,
        received_data: formData
      });
    }

    // Access spreadsheet
    console.log('📂 Opening spreadsheet:', CONFIG.SHEET_ID);
    const spreadsheet = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    let sheet = spreadsheet.getSheetByName(CONFIG.SHEET_NAME);

    if (!sheet) {
      console.log('📝 Creating new sheet:', CONFIG.SHEET_NAME);
      sheet = spreadsheet.insertSheet(CONFIG.SHEET_NAME);
      setupSheetHeaders(sheet);
    }

    // Prepare row data with explicit field mapping
    const timestamp = new Date().toISOString();

    // Extract each field explicitly
    const name = formData.name || '';
    const email = formData.email || '';
    const socialLink = formData.social_link || '';  // This should match the JavaScript field name
    const whyChoose = formData.why_choose || '';     // This should match the JavaScript field name
    const source = formData.source || 'landing_page';
    const utmSource = formData.utm_source || '';
    const utmMedium = formData.utm_medium || '';
    const utmCampaign = formData.utm_campaign || '';
    const utmTerm = formData.utm_term || '';
    const utmContent = formData.utm_content || '';
    const userAgent = formData.user_agent || '';
    const referrer = formData.referrer || '';
    const pageUrl = formData.page_url || '';

    const rowData = [
      timestamp,
      name,
      email,
      socialLink,    // Column D
      whyChoose,     // Column E
      source,
      utmSource,
      utmMedium,
      utmCampaign,
      utmTerm,
      utmContent,
      userAgent,
      referrer,
      pageUrl
    ];

    // Log the data that will be saved
    console.log('💾 ROW DATA TO SAVE:');
    console.log(`  A (Timestamp): "${rowData[0]}"`);
    console.log(`  B (Name): "${rowData[1]}"`);
    console.log(`  C (Email): "${rowData[2]}"`);
    console.log(`  D (Social Link): "${rowData[3]}"`);
    console.log(`  E (Why Choose): "${rowData[4]}"`);
    console.log(`  F (Source): "${rowData[5]}"`);

    // Save to sheet
    const beforeRows = sheet.getLastRow();
    sheet.appendRow(rowData);
    const afterRows = sheet.getLastRow();

    console.log(`📊 Rows before: ${beforeRows}, after: ${afterRows}`);

    if (afterRows > beforeRows) {
      console.log('✅ SUCCESS: Data written to sheet');

      // Verify what was actually written
      const writtenRow = sheet.getRange(afterRows, 1, 1, rowData.length).getValues()[0];
      console.log('📝 VERIFICATION - What was written:');
      console.log(`  D (Social Link): "${writtenRow[3]}"`);
      console.log(`  E (Why Choose): "${writtenRow[4]}"`);

      return createResponse({
        status: 'success',
        message: 'Data saved successfully',
        timestamp: timestamp,
        row_number: afterRows,
        data_saved: {
          name: name,
          email: email,
          social_link: socialLink,
          why_choose: whyChoose
        }
      });
    } else {
      throw new Error('Row was not added to sheet');
    }

  } catch (error) {
    console.error('💥 ERROR in doPost:', error);
    console.error('📍 Error stack:', error.stack);

    return createResponse({
      status: 'error',
      message: error.toString(),
      timestamp: new Date().toISOString()
    });
  }
}

function doGet(e) {
  return createResponse({
    status: 'success',
    message: 'FindMate Waitlist API FINAL is running',
    timestamp: new Date().toISOString(),
    config: CONFIG
  });
}

function setupSheetHeaders(sheet) {
  const headers = [
    'Timestamp', 'Name', 'Email', 'Social Link', 'Why Choose', 'Source',
    'UTM Source', 'UTM Medium', 'UTM Campaign', 'UTM Term', 'UTM Content',
    'User Agent', 'Referrer', 'Page URL'
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  sheet.getRange(1, 1, 1, headers.length).setBackground('#4285f4');
  sheet.getRange(1, 1, 1, headers.length).setFontColor('#ffffff');
  sheet.setFrozenRows(1);

  console.log('✅ Headers configured');
}

function createResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data, null, 2))
    .setMimeType(ContentService.MimeType.JSON);
}

function testFormSubmission() {
  console.log('🧪 Testing with social_link and why_choose...');

  const testEvent = {
    parameter: {
      name: 'Test User Final',
      email: 'test-final@findmate.io',
      social_link: '@test_instagram',
      why_choose: 'I love testing new gadgets and providing feedback!',
      source: 'test_final',
      timestamp: new Date().toISOString()
    }
  };

  try {
    const result = doPost(testEvent);
    const response = JSON.parse(result.getContent());

    console.log('🎯 Test result:', JSON.stringify(response, null, 2));

    if (response.status === 'success') {
      console.log('✅ TEST PASSED: social_link and why_choose should now work');
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