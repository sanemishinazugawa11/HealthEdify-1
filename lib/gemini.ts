import { GoogleGenerativeAI } from "@google/generative-ai";

export const getDescription = async (prompt: string): Promise<string> => {
  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const result = await model.generateContent(prompt);
    const text = result.response.candidates?.[0]?.content?.parts?.[0]?.text;

    return text || "No description generated.";
  } catch (error: any) {
    console.error("[Gemini API Error]:", error.message);
    return "Failed to generate description.";
  }
};

export const generateQuiz = async (prompt: string): Promise<string> => {
  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const result = await model.generateContent(`
            Generate 5 multiple-choice questions about the topic ${prompt}. Provide the output in JSON format, with the questions stored in an array under the key 'questions' and the corresponding answer keys stored in an array under the key 'answerKeys'. Each question in the 'questions' array should include the question itself, followed by four answer options labeled a), b), c), and d). Each answer key in the 'answerKeys' array should include the letter of the correct answer choice followed by the answer itself. For example: 'a) The answer'."
            `);
    const text = result.response.candidates?.[0]?.content?.parts?.[0]?.text;
    // console.log(text);
    if (text) {
      const cleanJson = text.replace(/```json|```/g, "").trim();
      const neSt = JSON.parse(cleanJson);
      // console.log(neSt);
    return JSON.stringify(neSt);
    }

    return "could generate quiz please try again";
  } catch (error: any) {
    console.error("[Gemini API Error]:", error.message);
    return "error occured"
  }
};
