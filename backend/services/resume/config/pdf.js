import fs from "fs";
import { createRequire } from "module";

// pdf-parse is CJS-only; use createRequire to load it inside an ESM project
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

const extractText = async (filePath) => {
    try {
        const buffer = fs.readFileSync(filePath);
        const data = await pdfParse(buffer);
        return data.text.trim();
    } catch (error) {
        throw new Error(`Failed to read PDF: ${error.message}`);
    }
};

export default extractText;
