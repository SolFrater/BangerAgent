
// Import GoogleGenAI and Type from @google/genai as required by guidelines
import { GoogleGenAI, Type } from "@google/genai";
import { OptimizationResult, ReplyResult, ProfileAuditResult, NicheAnalysisResult, IdeaGenerationResult } from "../types";

// Initialize the GoogleGenAI client with the API key from environment variables
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const FOXY_FRAMEWORKS = `
FoxyhitsW Content Philosophies (2024-2025):
1. The Paradox Hook: Start with a contradiction. (e.g., "I worked 80 hours a week and made $0. I worked 2 hours and made $10k.")
2. Information Gaps: Create a "vacuum" in the first line that the reader feels physical discomfort not filling.
3. Velocity Control: Use short, punchy lines with deliberate white space to pull the reader down the page (Dwell Time maximization).
4. Specificity over Slop: Avoid "Millions" or "A lot". Use "$4,218.12" or "17.4 minutes". Specificity builds trust.
5. Identity Bridging: The reader must feel like the "protagonist" of the tweet. Reposts happen when the tweet reflects how they want to be perceived.
6. The Failure Reversal: Lead with a massive L (Loss), then reveal the hidden W (Win) found inside it.
`;

const ALGO_CORE_LOGIC = `
Algorithmic Nuances (The "Fluid" Ranking):
1. Negative Signal Asymmetry: Avoid bot-like triggers (excessive dashes, emojis, hashtags).
2. The Last 128 Engagements: Focus on "Costly Actions" (Profile Clicks, Bookmarks) over "Cheap Actions" (Likes).
3. Risk Management: Do not use AI slop language ("Unlock", "Skyrocket", "Game-changer").
${FOXY_FRAMEWORKS}
`;

const OPTIMIZE_SYSTEM_INSTRUCTION = `You are NicheLens, a premium X optimization agent. ${ALGO_CORE_LOGIC}

Task: Transform a raw idea into high-dwell, FoxyhitsW-style viral assets.
Framework:
- Version 1: Hook-focused. Paradoxes and information gaps.
- Version 2: Reply-maximizing. Polarizing takes on safe topics.
- Version 3: Identity-bridging. Quotes that make the sharer look like an alpha.

Style: No emojis in the first 2 lines. Minimal punctuation. Punchy tempo.
You MUST return JSON.`;

const REPLY_SYSTEM_INSTRUCTION = `You are the NicheLens Reply Engine. ${ALGO_CORE_LOGIC}
Goal: Craft responses that force the OP to reply or the audience to click your profile.
Tactics: 
- Recontextualization (Explain the OP's tweet in a better way).
- The "Insight Gap" (Add the one thing they missed).
- Witty Contradiction (Respectfully disagree with logic).

You MUST return JSON.`;

const AUDIT_SYSTEM_INSTRUCTION = `You are the NicheLens Algorithmic Auditor. ${ALGO_CORE_LOGIC}
Goal: Analyze a user's recent tweets to identify algorithmic performance bottlenecks and provide a roadmap for recovery.
Focus on: Hook degradation, bot-patterns, and shadow-signals.
You MUST return JSON.`;

const NICHE_SYSTEM_INSTRUCTION = `You are the NicheLens Niche Architect. ${ALGO_CORE_LOGIC}
Goal: Map out a user's content niche, identify expansion opportunities, and provide a strategic engagement plan.
Focus on: Authority building, cross-niche overlap, and creator benchmarks.
You MUST return JSON.`;

const IDEA_SYSTEM_INSTRUCTION = `You are the NicheLens Content Architect. ${ALGO_CORE_LOGIC}
Goal: Take a topic or niche description and generate a high-level content strategy.
Generate:
1. A detailed Blog/Article Outline with a magnetic title and sections.
2. A viral X Thread structure (Hook + 5-7 tweets + CTA).
3. Three engaging Poll ideas to drive engagement.

Style: Expert, authoritative, yet edgy and minimalist. No corporate fluff. 
Focus on: Information density and curiosity gaps.
You MUST return JSON.`;

// Fix: Helper to ensure the response text is valid JSON by removing markdown code blocks
const cleanJson = (text: string) => {
  return text.replace(/```json\n?|```/g, "").trim();
};

// Fix: Implement optimizeTweet to transform raw tweet ideas into optimized versions using gemini-3-pro-preview
export async function optimizeTweet(input: string): Promise<OptimizationResult> {
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Optimize this tweet: "${input}"`,
    config: {
      systemInstruction: OPTIMIZE_SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          original: { type: Type.STRING },
          analysis: {
            type: Type.OBJECT,
            properties: {
              drivers: { type: Type.STRING },
              friction: { type: Type.STRING },
              emotionalRegister: { type: Type.STRING },
              missingElements: { type: Type.STRING },
              socialRisk: { type: Type.STRING },
              costlyActionPotential: { type: Type.STRING },
            },
            required: ["drivers", "friction", "emotionalRegister", "missingElements", "socialRisk", "costlyActionPotential"],
          },
          optimizedVersions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING },
                tweet: { type: Type.STRING },
                bulletPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
                whyItWorks: { type: Type.STRING },
              },
              required: ["label", "tweet", "bulletPoints", "whyItWorks"],
            },
          },
          replyTargets: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                handle: { type: Type.STRING },
                name: { type: Type.STRING },
                category: { type: Type.STRING },
                whyReply: { type: Type.STRING },
              },
              required: ["handle", "name", "category", "whyReply"],
            },
          },
          recommended: {
            type: Type.OBJECT,
            properties: {
              versionLabel: { type: Type.STRING },
              hybridSuggestions: { type: Type.STRING },
            },
            required: ["versionLabel", "hybridSuggestions"],
          },
          postingStrategy: {
            type: Type.OBJECT,
            properties: {
              timeFraming: { type: Type.STRING },
              threadPotential: { type: Type.STRING },
              mediaRecommendation: { type: Type.STRING },
              followUpPlays: { type: Type.STRING },
            },
            required: ["timeFraming", "threadPotential", "mediaRecommendation", "followUpPlays"],
          },
        },
        required: ["original", "analysis", "optimizedVersions", "replyTargets", "recommended", "postingStrategy"],
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("Empty response from AI");
  return JSON.parse(cleanJson(text));
}

// Fix: Implement craftReply to generate strategic replies using gemini-3-pro-preview
export async function craftReply(input: string): Promise<ReplyResult> {
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Craft a reply for this source tweet: "${input}"`,
    config: {
      systemInstruction: REPLY_SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          sourceTweet: { type: Type.STRING },
          variations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING },
                reply: { type: Type.STRING },
                bulletPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
                strategy: { type: Type.STRING },
              },
              required: ["label", "reply", "bulletPoints", "strategy"],
            },
          },
          analysis: {
            type: Type.OBJECT,
            properties: {
              intent: { type: Type.STRING },
              hookOpportunity: { type: Type.STRING },
              socialRisk: { type: Type.STRING },
            },
            required: ["intent", "hookOpportunity", "socialRisk"],
          },
        },
        required: ["sourceTweet", "variations", "analysis"],
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("Empty response from AI");
  return JSON.parse(cleanJson(text));
}

// Fix: Implement auditProfile to critique recent user activity using gemini-3-pro-preview
export async function auditProfile(tweets: string[], handle: string): Promise<ProfileAuditResult> {
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Analyze these tweets from @${handle}:\n${tweets.join("\n---\n")}`,
    config: {
      systemInstruction: AUDIT_SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          handle: { type: Type.STRING },
          overallScore: { type: Type.NUMBER },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
          improvementPlan: { type: Type.ARRAY, items: { type: Type.STRING } },
          tweetAnalyses: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                original: { type: Type.STRING },
                critique: { type: Type.STRING },
                revisedHook: { type: Type.STRING },
              },
              required: ["original", "critique", "revisedHook"],
            },
          },
        },
        required: ["handle", "overallScore", "strengths", "weaknesses", "improvementPlan", "tweetAnalyses"],
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("Empty response from AI");
  return JSON.parse(cleanJson(text));
}

// Fix: Implement analyzeNiche to map content pillars using gemini-3-pro-preview
export async function analyzeNiche(tweets: string[], handle: string): Promise<NicheAnalysisResult> {
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Analyze the content niche of @${handle} based on these tweets:\n${tweets.join("\n---\n")}`,
    config: {
      systemInstruction: NICHE_SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          niche: { type: Type.STRING },
          description: { type: Type.STRING },
          score: { type: Type.NUMBER },
          voice: { type: Type.ARRAY, items: { type: Type.STRING } },
          pillars: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                icon: { type: Type.STRING },
                text: { type: Type.STRING },
                why: { type: Type.STRING },
              },
              required: ["icon", "text", "why"],
            },
          },
          crossNiche: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                percentage: { type: Type.NUMBER },
                opportunity: { type: Type.STRING },
              },
              required: ["name", "percentage", "opportunity"],
            },
          },
          contentIdeas: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING },
                idea: { type: Type.STRING },
                advice: { type: Type.STRING },
              },
              required: ["type", "idea", "advice"],
            },
          },
          creators: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                handle: { type: Type.STRING },
                followers: { type: Type.STRING },
                type: { type: Type.STRING },
                reason: { type: Type.STRING },
              },
              required: ["handle", "followers", "type", "reason"],
            },
          },
          hooks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                text: { type: Type.STRING },
                teaching: { type: Type.STRING },
              },
              required: ["category", "text", "teaching"],
            },
          },
          engagementTargets: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                handle: { type: Type.STRING },
                postType: { type: Type.STRING },
                advice: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["handle", "postType", "advice"],
            },
          },
        },
        required: [
          "niche", "description", "score", "voice", "pillars", "crossNiche", 
          "contentIdeas", "creators", "hooks", "engagementTargets"
        ],
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("Empty response from AI");
  return JSON.parse(cleanJson(text));
}

// Fix: Implement generateTweetImage using gemini-2.5-flash-image to generate visual assets
export async function generateTweetImage(prompt: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          text: `Create a high-impact, minimalist visual asset for a tweet about: ${prompt}. Style: Cyberpunk aesthetic, clean lines, professional CT (Crypto Twitter) vibe. No text in image.`,
        },
      ],
    },
  });

  if (response.candidates && response.candidates[0]?.content?.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
  }

  throw new Error("No image data found in response");
}

export async function generateContentIdeas(input: string): Promise<IdeaGenerationResult> {
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Generate a content strategy for this topic/niche: "${input}"`,
    config: {
      systemInstruction: IDEA_SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          topic: { type: Type.STRING },
          articleOutline: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              introHook: { type: Type.STRING },
              sections: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    heading: { type: Type.STRING },
                    keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
                  },
                  required: ["heading", "keyPoints"],
                },
              },
            },
            required: ["title", "introHook", "sections"],
          },
          threadStructure: {
            type: Type.OBJECT,
            properties: {
              hook: { type: Type.STRING },
              tweets: { type: Type.ARRAY, items: { type: Type.STRING } },
              cta: { type: Type.STRING },
            },
            required: ["hook", "tweets", "cta"],
          },
          pollIdeas: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                strategy: { type: Type.STRING },
              },
              required: ["question", "options", "strategy"],
            },
          },
        },
        required: ["topic", "articleOutline", "threadStructure", "pollIdeas"],
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("Empty response from AI");
  return JSON.parse(cleanJson(text));
}
