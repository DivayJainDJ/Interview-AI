import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

const extractText = async (filePath) => {
    try {
        const buffer = fs.readFileSync(filePath);
        const pdf = await pdfjsLib.getDocument({
            data: new Uint8Array(buffer),
            useWorkerFetch: false,
            isEvalSupported: false,
        }).promise;

        let text = "";

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
            const page = await pdf.getPage(pageNumber);
            const content = await page.getTextContent();
            const pageText = content.items
                .map((item) => item.str)
                .filter(Boolean)
                .join(" ");

            text += `${pageText}\n`;
        }

        await pdf.destroy();

        return text.trim();
    } catch (error) {
        throw new Error(`Failed to read PDF: ${error.message}`);
    }
};

export default extractText;
