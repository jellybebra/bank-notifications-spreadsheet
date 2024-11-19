const startLine = 7;  // строка, с которой начинаются записи
const tableID = "1mTFBGK0KsDTp0lqYOeiKGcIkHAWm8lDyc6cUfJVhzyI"; // ID таблицы
const sheet = SpreadsheetApp.openById(tableID).getSheets()[0];

const isDebugged = false;
const debugTableID = "1XxN3BbUFL9hlPMD1J4BlUbjVUF93lFh1IOj8k9Wp1f4";
const debugSheet = SpreadsheetApp.openById(debugTableID).getSheets()[0];

function parseJsonWithoutControlChars(stream, encoding = 'UTF-8') {
  // ОТП ПРИСЫЛАЕТ ГАВНО НЕ СРЕЛИЗАУЙСЯ, УБИРАЕМ
  const decodedStream = Utilities.newBlob(stream, 'application/json', encoding).getDataAsString();
  const cleanedStream = decodedStream.replace(/[\u0000-\u001F\u007F-\u009F]/g, '').replaceAll("\r\n", "");

  try {
    return JSON.parse(cleanedStream);
  } catch (exc) {
    throw new Error('JSON parse error - ' + exc);
  }
}

function doPost(e) {
  // Prevent concurrent writes to the table
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  debug(e.postData.contents);

  const {sender, text, acc, card, type} = parseJsonWithoutControlChars(e.postData.contents);

  const messageData = parseAccountAndAmount(text, acc, card, type);
  if (!messageData) {
    lock.releaseLock();
    console.log("Account and amount were not found.");
    return ContentService.createTextOutput("Account and amount were not found.").setMimeType(
      ContentService.MimeType.TEXT
    );
  }
  const {account, amount} = messageData;

  debug(`account: ${account}, amount: ${amount}`);

  if (!validateSender(sender)) {
    lock.releaseLock();
    return ContentService.createTextOutput("Wrong sender!").setMimeType(
      ContentService.MimeType.TEXT
    );
  }

  const accountsRow = sheet
    .getRange(1, 1, 1, sheet.getLastColumn())
    .getValues()[0]; // поменял 4 на 1 для новой таблицы

  for (let i = 0; i < accountsRow.length; i++) {
    const cellAccounts = accountsRow[i].toString().match(/(?<=_)\d+/g);

    if (cellAccounts && cellAccounts.includes(account)) {
      const rowIndex = findFirstEmptyCell(sheet, i + 1, startLine);

      sheet.getRange(rowIndex, i + 1).setValue(amount);

      lock.releaseLock();
      return ContentService.createTextOutput("Success").setMimeType(
        ContentService.MimeType.TEXT
      );
    }
  }

  lock.releaseLock();
  return ContentService.createTextOutput("Given account was not found").setMimeType(
    ContentService.MimeType.TEXT
  );
}

function debug(message) {
  if (!isDebugged) return;

  // Находим последнюю заполненную строку в первом столбце
  const lastRow = debugSheet.getLastRow();

  // Записываем данные из запроса в следующую строку
  debugSheet.getRange(lastRow + 1, 1).setValue(message);
}

function parseAccountAndAmount(text, acc, card, type) {
  if (type === "sms") {
    const {account, amount} = unpackSMS(text, acc, card);
    return { account, amount };
  }

  if (type === "push") {
    return { account: acc, amount: unpackPush(text) };
  }
}

function findFirstEmptyCell(sheet, columnIndex, startRow) {
  let i;
  const numOfRows = sheet.getLastRow() - startRow + 1;
  const columnData =
    numOfRows > 0
      ? sheet.getRange(startRow, columnIndex, numOfRows + 1, 1).getValues()
      : sheet.getRange(startRow, columnIndex, 1, 1).getValues();
  for (i = 0; i < columnData.length; i++) {
    if (columnData[i][0] === "") {
      return startRow + i;
    }
  }
  return startRow + i + 1;
}

function validateSender(sender) {
  /** Check whether message sender is in the white list. */
  return [
    "900(Нет имени контакта)",
    "Raiffeisen",
    "900",
    "Raiffeisen(Нет имени контакта)",
    "СберБанк",
    "Tinkoff",
    "Тинькофф",
    "УБРиР",
    "UBRR",
    "ОТП Банк Онлайн",
    "ОТП Банк",
    "OTP_Bank",
    "Raiffeisen",
    "Альфа-Банк",
    "УБРиР",
    "Sovcombank",
    "Синара Банк",
    "Яндекс Пэй",
    "Халва-Совкомбанк",
  ].includes(sender);
}

function clearAmount(match) {
  let amount = match.groups.sum.replace(/\s/g, "").replace(",", ".");
  return parseFloat(amount);
}

function unpackSMS(text, accountNumber, cardNumber) {
  const regexArray = [
    /(?i:УЭК|СЧЁТ|МИР|MIR|VISA|ECMC|ПЛАТ\.СЧЕТ|Сбер\.счёт)\s?(|\-|\*)(?<req>\d{4}).*?/i,
    /(?i:перевод|зачисление|перевел|перевёл).*?(?<sum>\d+\s?\d*(?:[.,]?\d*)?).?[рР₽Rr]/i,
    /(\+(?<sum>\d+\s?\d*(?:[.,]?\d*)?).?[рР₽Rr])[^a-zA-Z0-9_]+(?i:MIR|СЧЁТ|МИР|ECMC|VISA|УЭК)(?:|\-)(?<req>\d{4})/i,
    /(?:На карту \*)(?<req>\d{4}).*?(?i:переведено)\s(?<sum>\d+\s?\d+(?:[,.])?\d+)/i,
    /Карта\s\*(?<req>\d{4}).*?\sзачисление\s(?<sum>\d+\s?\d*(?:[.,]?\d*)?).?[рР₽Rr]/i,
    /Зачисление.*?\:\s(?<sum>\d+\s?\d*(?:[.,]?\d*)?).?[рР₽Rr]/i,
    /Счет\s\*(?<req>\d{4})\.\s?Зачислено через.*?(?<sum>\d+\s?\d*(?:[.,]?\d*)?).?[рР₽Rr]/i,
    /\*(?<req>\d{4})\s(?i:пополнение).*?(?<sum>\d+\s?\d*(?:[.,]?\d*)?).?[рР₽Rr]\.\sот/i,
  ];

  let match = null;
  text = text.replace(/[ \s\xa0     　]+/g, " ");

  for (const regex of regexArray) {
    match = text.match(regex);

    if (match) {
      const account = match.groups.req;

      if ([accountNumber.slice(-4), cardNumber.slice(-4)].includes(account)) {
        return {account, amount: clearAmount(match)};
      }
    }
  }

  return null;
}

function unpackPush(text) {
  const regexArray = [
    /(?i:Поступление)\s(?i:Перевод).*?(?<sum>\d+\s?\d*(?:[.,]?\d*)?).?[рР₽Rr]/i,
    /\+\s(?<sum>\d+\s?\d*(?:[.,]?\d*)?).?[рР₽Rr]\sот.*?Теперь\sна\sсчете\s(?:\d+\s?\d*(?:[.,]?\d*)?).?[рР₽Rr]/i,
    /Счет\s\*\d{4}\.\s?Зачислено через.*?(?<sum>\d+\s?\d*(?:[.,]?\d*)?).?[рР₽Rr]/i,
    /Перевод на сумму (?<sum>\d+\s?\d*(?:[.,]?\d*)?).?[рР₽Rr]/i,
    /\+(?<sum>\d+\s?\d*(?:[.,]?\d*)?).?[рР₽Rr]\.\sПоступление/i,
    /(?i:Зачисление).*?(?<sum>\d+\s?\d*(?:[.,]?\d*)?).?[рР₽Rr].*?от/i,
    /(?i:Поступление)\s(?i:Перевод).*?(?<sum>\d+\s?\d*(?:[.,]?\d*)?).?[рР₽Rr]/i,
    /Карта\s\*(?<req>\d{4}).*?\sзачисление\sна\sсумму\s(?<sum>\d+\s?\d*(?:[.,]?\d*)?).?[рР₽Rr]/i,
    /Счет\s\d{4}\s?зачислено\s(?<sum>\d+\s?\d*(?:[.,]?\d*)?).?[рР₽Rr]/i,
    /Пополнение\sна\s(?<sum>\d+\s?\d*(?:[.,]?\d*)?).?[рР₽Rr]/i,
    /\*(?:\d{4})\s(?i:пополнение).*?(?<sum>\d+\s?\d*(?:[.,]?\d*)?).?[рР₽Rr]\.\sот/i,
  ];

  text = text.replace(/[ \s\xa0     　]+/g, " ");

  for (const regex of regexArray) {
    const match = text.match(regex);

    if (match) {
      return clearAmount(match);
    }
  }
  return null;
}
