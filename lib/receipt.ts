// Reads an order's real receipt off disk from content/<name>.txt.

import fs from "node:fs";
import path from "node:path";

export function readReceipt(receiptPath: string): string {
  return fs.readFileSync(path.join(process.cwd(), "content", receiptPath), "utf-8");
}
