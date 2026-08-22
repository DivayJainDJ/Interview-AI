import fs from "fs";
import { PDFParse } from "pdf-parse";

const extractText = async (filePath) => {
    const buffer = fs.readFileSync(filePath);
    const parser = new PDFParse({ data: buffer });

    try {
        const result = await parser.getText();
        return result.text;
    } finally {
        await parser.destroy();
    }
};

export default extractText;



