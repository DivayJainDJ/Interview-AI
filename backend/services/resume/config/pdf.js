import fs from "fs";
import { PDFParse } from "pdf-parse";

const extractText = async (filePath) => {
    const buffer = fs.readFileSync(filePath);

    try {
        const parser = new PDFParse({ data: buffer });
        const result = await parser.getText();
        await parser.destroy();
        return result.text || "";
    } catch (error) {
        throw new Error(`Failed to read PDF: ${error.message}`);
    }
};

export default extractText;



