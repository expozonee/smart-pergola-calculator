import * as XLSX from "xlsx";
import fs from "fs";
import path from "path";

export type TableData = {
  [height: string]: number;
  WIDTH: number;
};

const PERGOLA_TYPES = [
  "1300 STANDARD 2022",
  "1400 STANDARD 2022",
  "1400 CURVED 2022",
  "1400 FULL CURVED 2022",
  "1600 STANDARD 2022",
  "1600 CURVED 2022",
  "1600 FULL CURVED 2022",
  "GUILLOTINE 8M",
  "GUILLOTINE 20MM",
  "GLASS ROOF 2022 10MM",
  "GLASS ROOF 26MM",
  "SKYTEKS SOFT",
  "SKYTEKS SLIDE",
  "SKYTEKS ROLL",
  "ZIP BLIND",
  "ROOF ZIP BLIND 2022",
];

export function getPergolaTypes() {
  const filePath = path.join(process.cwd(), "price-list-main.xlsx");
  const fileBuffer = fs.readFileSync(filePath);
  const workbook = XLSX.read(fileBuffer, { type: "buffer" });
  const sheetNames = workbook.SheetNames;
  const filteredSheetNames = sheetNames.filter((sheetName) =>
    PERGOLA_TYPES.includes(sheetName)
  );
  return filteredSheetNames;
}

export function readExcelFile(type: string): TableData[] {
  const filePath = path.join(process.cwd(), "price-list-main.xlsx");
  const fileBuffer = fs.readFileSync(filePath);

  const workbook = XLSX.read(fileBuffer, { type: "buffer" });

  const worksheet = workbook.Sheets[type];
  const data = XLSX.utils.sheet_to_json(worksheet);

  return data as TableData[];
}
