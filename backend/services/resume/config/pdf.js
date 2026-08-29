import fs from "fs";
import PDFParser from "pdf2json";

const extractText = (filePath) =>
    new Promise((resolve, reject) => {
        const buffer = fs.readFileSync(filePath);
        const parser = new PDFParser(null, 1);

        parser.on("pdfParser_dataReady", (data) => {
            try {
                const text = data.Pages
                    .flatMap((page) => page.Texts)
                    .map((t) => decodeURIComponent(t.R.map((r) => r.T).join("")))
                    .join(" ")
                    .trim();

                if (!text) {
                    return reject(new Error("Failed to read PDF: no text extracted"));
                }

                resolve(text);
            } catch (err) {
                reject(new Error(`Failed to read PDF: ${err.message}`));
            }
        });

        parser.on("pdfParser_dataError", (err) => {
            reject(new Error(`Failed to read PDF: ${err.parserError || err}`));
        });

        parser.parseBuffer(buffer);
    });

export default extractText;
