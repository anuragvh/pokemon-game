/**
 * Route 01: records visitor answers into this Google Sheet.
 *
 * Setup (once):
 *   1. Create a Google Sheet, then Extensions > Apps Script.
 *   2. Replace everything in Code.gs with this file and save.
 *   3. Deploy > New deployment > type "Web app":
 *        Execute as: Me      Who has access: Anyone
 *   4. Authorise it, copy the Web app URL, and paste it into
 *      ANSWERS_ENDPOINT in index.html.
 *
 * Each answer becomes one row on the "Answers" tab.
 */
const SHEET_NAME = "Answers";
const HEADERS = ["Received", "Visitor", "Name", "Topic", "Question", "Answer", "Answered at"];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const book = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = book.getSheetByName(SHEET_NAME) || book.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    }
    const d = JSON.parse(e.postData.contents);
    sheet.appendRow([
      new Date(), clean(d.visitor), clean(d.name), clean(d.topic),
      clean(d.question), clean(d.answer), clean(d.at),
    ]);
    return ContentService.createTextOutput("ok");
  } catch (err) {
    return ContentService.createTextOutput("error");
  } finally {
    lock.releaseLock();
  }
}

// Keeps rows tidy and stops typed text from being treated as a spreadsheet formula.
function clean(value) {
  const text = String(value == null ? "" : value).slice(0, 2000);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}
