import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are Dr. Lena, a compassionate, highly experienced Registered Dietitian and IBS specialist who follows the latest Monash University Low FODMAP diet research (2025). Your goal is to empower people with IBS to eat joyfully while minimizing symptoms.

Given the image(s) or video frame:
- Identify the food(s) accurately.
- For packaged items (barcode or label visible), read ingredients/nutrition.
- Return ONLY valid JSON matching this schema:
{
  "foodName": "string",
  "confidence": number (0-100),
  "safetyRating": "Green" | "Yellow" | "Red",
  "ratingExplanation": "short clear sentence",
  "fodmapBreakdown": ["list of high/medium items"],
  "safePortion": "e.g. 80g or ½ small banana",
  "preparationTips": ["array of practical tips"],
  "bestTimingAndHow": "string",
  "personalizedNote": "takes user IBS type and triggers into account",
  "saferAlternatives": ["3-4 tasty options"],
  "encouragingClosing": "warm positive message"
}
Be conservative with ratings. Always suggest how to reduce risk (pairing, cooking method, etc.).
Return ONLY the JSON object, no markdown fences, no explanatory text.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageDataUrl, ibsType, triggers, description } = body as {
      imageDataUrl: string;
      ibsType?: string;
      triggers?: string[];
      description?: string;
      barcode?: string;
    };

    if (!imageDataUrl) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    // Build user context
    let userContext = "";
    if (ibsType) {
      userContext += `User's IBS type: ${ibsType}. `;
    }
    if (triggers && triggers.length > 0) {
      userContext += `Known personal triggers: ${triggers.join(", ")}. `;
    }
    if (description) {
      userContext += `Additional context: ${description}. `;
    }

    const userMessage = userContext
      ? `${userContext}\n\nPlease analyze this food image and provide your assessment.`
      : "Please analyze this food image and provide your assessment.";

    // Extract base64 data and media type
    const matches = imageDataUrl.match(
      /^data:(image\/[a-zA-Z+]+);base64,(.+)$/
    );

    let imageContent: { type: "image"; image: string; mimeType?: string };

    if (matches) {
      imageContent = {
        type: "image" as const,
        image: matches[2],
        mimeType: matches[1],
      };
    } else {
      // Fallback: pass the whole data URL
      imageContent = {
        type: "image" as const,
        image: imageDataUrl,
      };
    }

    const result = await generateText({
      model: openai("gpt-4o"),
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: [
            imageContent,
            {
              type: "text" as const,
              text: userMessage,
            },
          ],
        },
      ],
      maxTokens: 1500,
      temperature: 0.3,
    });

    // Parse the JSON response
    let analysisText = result.text.trim();

    // Remove potential markdown code fences
    if (analysisText.startsWith("```")) {
      analysisText = analysisText
        .replace(/^```(?:json)?\s*\n?/, "")
        .replace(/\n?```\s*$/, "");
    }

    const analysis = JSON.parse(analysisText);

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error("Analysis error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Analysis failed";

    return NextResponse.json(
      {
        error: errorMessage,
        details:
          "Please ensure your OpenAI API key is set and the image is valid.",
      },
      { status: 500 }
    );
  }
}
