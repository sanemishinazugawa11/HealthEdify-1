import User from "@/db/db";
import { connect}  from "../db/db";
import { extractTextFromPDF } from "./extract";

export const saveExtractedText = async (userEmail: string, pdfPath: string) => {
    try {
        await connect();
        const extractedText = await extractTextFromPDF(pdfPath);

        if (!extractedText) {
            console.log("No text extracted.");
            return;
        }

        await User.findOneAndUpdate(
            { email: userEmail },
            { $set: { extractedText } },
            { upsert: true, new: true }
        );

        console.log(`✅ Extracted text saved for ${userEmail}`);
    } catch (error) {
        console.error("❌ Error saving extracted text:", error);
    }
};