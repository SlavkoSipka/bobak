import { GoogleSpreadsheet } from 'google-spreadsheet';

const SPREADSHEET_ID = '1njuK0qbrdrXJRBRLYoeBCUSknRYqDW6y1q-6Nz1ntPU';
const SHEET_ID = '1431850372'; // ID Barbara Bobak sheet-a (gid=1431850372)
const SHEET_TITLE = 'Barbara Bobak'; // Naziv lista
const CACHE_DURATION = 5000; // Bilo je 30000

let doc: GoogleSpreadsheet | null = null;
let lastFetch: number = 0;
let cachedStatuses: boolean[] | null = null;
let isInitializing = false;
let initializationPromise: Promise<void> | null = null;

export async function initializeGoogleSheets(apiKey: string) {
  try {
    if (doc) return;

    if (isInitializing && initializationPromise) {
      await initializationPromise;
      return;
    }

    isInitializing = true;
    initializationPromise = (async () => {
      doc = new GoogleSpreadsheet(SPREADSHEET_ID, { apiKey });
      await doc.loadInfo(); // Učitavanje informacija o dokumentu

      // Provera po ID-u
      if (!doc.sheetsById[SHEET_ID]) {
        throw new Error(`Sheet with ID ${SHEET_ID} not found`);
      }
      // Provera po nazivu (opcionalno)
      if (!doc.sheetsByTitle[SHEET_TITLE]) {
        console.warn(`Sheet with title ${SHEET_TITLE} not found, using ID instead`);
      }
    })();

    await initializationPromise;
  } catch (error) {
    doc = null;
    console.error('Failed to initialize Google Sheets:', error);
    throw error;
  } finally {
    isInitializing = false;
    initializationPromise = null;
  }
}

export async function getTableStatuses(): Promise<boolean[]> {
  try {
    // Provera keša
    if (cachedStatuses && Date.now() - lastFetch < CACHE_DURATION) {
      console.log('Returning cached table statuses');
      return cachedStatuses;
    }

    if (!doc) {
      throw new Error('Google Sheets not properly initialized');
    }

    // Učitavanje metapodataka
    await doc.loadInfo();

    const sheet = doc.sheetsById[SHEET_ID];
    if (!sheet) {
      throw new Error(`Sheet with ID ${SHEET_ID} not found`);
    }

    const statuses: boolean[] = Array(300).fill(false); // Niz za statuse stolova

    // Učitavanje samo neophodnih opsega
    await Promise.all([
      sheet.loadCells('B2:B148'), // Regularni stolovi (1-147)
      sheet.loadCells('F1:F10'),  // VIP stolovi (148-156) + table 10
      sheet.loadCells('L2:L21'),  // Levi uzdignuti deo (175-194)
      sheet.loadCells('I2:I10'),  // Desni uzdignuti deo (195-203)
      sheet.loadCells('O2:O41'),  // Stolovi 226-265
    ]);

    // Regularni stolovi (1-147) iz kolone B
    for (let i = 1; i <= 147; i++) {
      const statusCell = sheet.getCell(i, 1); // Kolona B
      statuses[i - 1] = statusCell.value !== null && String(statusCell.value).trim() !== '';
    }

    // VIP stolovi (148-156) iz kolone F
    for (let i = 0; i < 9; i++) {
      const vipStatusCell = sheet.getCell(i, 5); // Kolona F, počev od F1
      statuses[147 + i] = vipStatusCell.value !== null && String(vipStatusCell.value).trim() !== '';
    }

    // Table 10 from F10 (internal ID 266, index 265)
    const table10StatusCell = sheet.getCell(9, 5); // F10 (row 10, column F)
    statuses[265] = table10StatusCell.value !== null && String(table10StatusCell.value).trim() !== '';

    // Levi uzdignuti deo (175-194) iz kolone L
    for (let i = 1; i <= 20; i++) {
      const leftStatusCell = sheet.getCell(i, 11); // Kolona L
      statuses[174 + i] = leftStatusCell.value !== null && String(leftStatusCell.value).trim() !== '';
    }

    // Desni uzdignuti deo (195-203) iz kolone I
    for (let i = 1; i <= 9; i++) {
      const elevatedStatusCell = sheet.getCell(i, 8); // Kolona I
      statuses[194 + i] = elevatedStatusCell.value !== null && String(elevatedStatusCell.value).trim() !== '';
    }

    // Stolovi 226-265 iz kolone O (O2:O41)
    for (let i = 0; i < 40; i++) {
      const statusCell = sheet.getCell(i + 1, 14); // Kolona O, počev od reda 2
      const tableIndex = 226 + i; // Počinje od 226
      const cellValue = statusCell.value;
      const isReserved = cellValue !== null && String(cellValue).trim() !== '';
      statuses[tableIndex - 1] = isReserved;
      console.log(
        `Table ${tableIndex}: Row O${i + 2} = ${cellValue} (type: ${typeof cellValue}), Status: ${isReserved}, Cell(${i + 1},14)`
      );
    }

    // Logovanje statusa za stolove 256-265 radi debagovanja
    console.log('Statuses for tables 256-265:', statuses.slice(255, 265));

    cachedStatuses = statuses;
    lastFetch = Date.now();

    return statuses;
  } catch (error) {
    console.error('Failed to fetch table statuses:', error);
    if (cachedStatuses) return cachedStatuses;
    throw error;
  }
}