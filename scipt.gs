const ITEMCODE_INDEX = 4;
const QTYREAL_COL = 9;
const TIMESTAMP_COL = 10;

function readAllData() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  return [data.slice(1), sheet];
}

function getItem(itemCode) {
  const [data] = readAllData();
  const item = data.find((d) => d[ITEMCODE_INDEX] == itemCode);
  if (!item) return null;
  const [
    SITECODE,
    STORECODE,
    RACKCODE,
    STOCKGROUPCODE,
    ITEMCODE,
    ITEMDESCRIPTION,
    UOMCODE,
    QTYONHAND,
    QTYREAL,
    Timestamp,
  ] = item;
  return {
    SITECODE,
    STORECODE,
    RACKCODE,
    STOCKGROUPCODE,
    ITEMCODE,
    ITEMDESCRIPTION,
    UOMCODE,
    QTYONHAND,
    QTYREAL,
    Timestamp,
  };
}

function updateStock(itemCode, newStock) {
  const [data, sheet] = readAllData();

  for (var i = 1; i < data.length; i++) {
    if (data[i][ITEMCODE_INDEX] == itemCode) {
      sheet.getRange(i + 1, QTYREAL_COL).setValue(newStock);
      sheet.getRange(i + 1, TIMESTAMP_COL).setValue(new Date());
      return true;
    }
  }

  return false;
}

function sendResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON
  );
}

function doGet(e) {
  const action = e.parameter.action;
  const itemCode = e.parameter.itemCode;

  if (action === "getAll") {
    const [data] = readAllData();
    return sendResponse(data);
  }

  if (action === "get") {
    const item = getItem(itemCode);

    if (!itemCode) {
      return sendResponse({ error: "Item not found" });
    }

    return sendResponse(item);
  }

  if (action === "update") {
    const newStock = e.parameter.newStock;
    const result = updateStock(itemCode, newStock);
    return sendResponse(
      result ? { message: "Update success" } : { error: "Item not found" }
    );
  }

  return sendResponse({ error: "Invalid action" });
}
