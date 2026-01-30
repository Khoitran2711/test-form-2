
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

export const suggestReply = async (feedbackContent: string, department: string): Promise<string> => {
  try {
    // Always initialize GoogleGenAI with the API key from process.env.API_KEY directly.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Use ai.models.generateContent directly. Using gemini-3-flash-preview for text tasks.
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Khoa: ${department}. Nội dung phản ánh của bệnh nhân: "${feedbackContent}"`,
      config: {
        // Move professional persona and instructions to systemInstruction.
        systemInstruction: "Bạn là quản lý chất lượng chuyên nghiệp tại Bệnh viện Đa khoa Ninh Thuận. Hãy soạn một văn bản phản hồi cho bệnh nhân. Yêu cầu: Lịch sự, thấu cảm, cam kết kiểm tra và chấn chỉnh. Trả lời bằng tiếng Việt văn minh và chuyên nghiệp.",
        temperature: 0.7,
      }
    });

    // Access the .text property directly.
    return response.text || "Chúng tôi đã tiếp nhận phản ánh của quý khách và đang xử lý.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Bệnh viện Đa khoa Ninh Thuận chân thành cảm ơn ý kiến của quý khách. Chúng tôi sẽ làm việc với khoa " + department + " để nâng cao chất lượng dịch vụ.";
  }
};
