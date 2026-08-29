import fs from "fs";
import * as pdfParseModule from "pdf-parse";

const pdfParse = pdfParseModule.default ?? pdfParseModule;

const extractText = async (filePath) => {
    const buffer = fs.readFileSync(filePath);

    try {
        const result = await pdfParse(buffer);
        return result.text || "";
    } catch (error) {
        throw new Error(`Failed to read PDF: ${error.message}`);
    }
};

export default extractText;



