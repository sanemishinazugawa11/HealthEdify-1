import pdf from "pdf-parse";
import fs from "fs/promises";

export const extractTextFromPDF = async (filePath: string): Promise<string | null> => {
    try {
        const dataBuffer = await fs.readFile(filePath);
        const data = await pdf(dataBuffer);
        return data.text.trim();
    } catch (error) {
        console.error("Error extracting text:", error);
        return null;
    }
};