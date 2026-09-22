import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { z } from "zod";
import cookieParser from "cookie-parser";

// Security & Auth Middlewares
import { 
  globalLimiter, 
  aiGenerationLimiter, 
  securityHeaders, 
  corsOptions, 
  validateRequest 
} from "./server/security";
import { verifyFirebaseToken } from "./server/auth_middleware";

dotenv.config();

const app = express();
const PORT = 3000;

// Apply Global Security Middlewares
app.use(securityHeaders);
app.use(corsOptions);
app.use(cookieParser());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use("/api/", globalLimiter);

// Schemas for Validation
const GenerateSocialPostSchema = z.object({
  body: z.object({
    topic: z.string().min(1).max(2000),
    platform: z.enum(['facebook', 'instagram', 'twitter', 'tiktok', 'youtube', 'linkedin', 'threads']).default('instagram'),
    targetAudience: z.string().max(500).optional(),
  })
});

// Helper to initialize Gemini Client
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set in environment.");
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// 1. Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 2. AI Content Generation Endpoint
app.post(
  "/api/social/generate-post",
  verifyFirebaseToken,
  aiGenerationLimiter,
  validateRequest(GenerateSocialPostSchema),
  async (req, res) => {
    try {
      const { topic, platform, targetAudience } = req.body;

      const ai = getGeminiClient();
      if (!ai) {
        return res.status(500).json({
          error: "مفتاح API الخاص بـ Gemini غير متوفر.",
        });
      }

      const systemPrompt = `أنت خبير محترف في صناعة المحتوى الرقمي وإدارة منصات التواصل الاجتماعي (Social Media Manager & AI Content Creator). 
مهمتك: توليد منشورات إبداعية، جذابة، ومناسبة لكل منصة على حدة، مع مراعاة لهجة الجمهور المستهدف (الخليجية، الشامية، أو الفصحى) بما يتناسب مع السياق.
يجب أن يكون المنشور مصمماً لزيادة التفاعل (Engagement) والوصول (Reach).
يجب تقديم الإجابة بصيغة JSON مطابقة تماماً للمخطط المحدد.`;

      const prompt = `قم بتوليد منشور لمنصة ${platform} حول الموضوع التالي:
الموضوع: ${topic}
الجمهور المستهدف: ${targetAudience || "عام / مهتم بالتقنية والابتكار"}

المتطلبات:
1. نص المنشور باللغة العربية (جذاب وإبداعي).
2. قائمة بالوسوم (Hashtags) المناسبة.
3. وصف دقيق للصورة (Image Prompt) يمكن استخدامه في محركات توليد الصور بالذكاء الاصطناعي لوصف مشهد احترافي يعبر عن المنشور.`;

      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: prompt,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              content: {
                type: Type.STRING,
                description: "نص المنشور الكامل مع الرموز التعبيرية المناسبة",
              },
              hashtags: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "قائمة الهاشتاجات المقترحة",
              },
              imagePrompt: {
                type: Type.STRING,
                description: "وصف الصورة بالإنجليزية لاستخدامه في Midjourney أو DALL-E",
              },
            },
            required: ["content", "hashtags", "imagePrompt"],
          },
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json(parsed);
    } catch (error: any) {
      console.error("Error in generate-social-post:", error);
      return res.status(500).json({
        error: "حدث خطأ أثناء توليد المحتوى الرقمي",
        details: error.message || String(error),
      });
    }
  }
);

// Start the server with Vite Integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
