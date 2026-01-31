import Anthropic from "@anthropic-ai/sdk";
import {
  OptimizationResult,
  ReplyResult,
  ProfileAuditResult,
  NicheAnalysisResult,
  IdeaGenerationResult,
} from "../types";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const FOXY_FRAMEWORKS = `
BangerAgent Proprietary Content Frameworks (2024-2025):
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

const OPTIMIZE_SYSTEM_INSTRUCTION = `You are BangerAgent, a premium X optimization agent. ${ALGO_CORE_LOGIC}

Task: Transform a raw idea into high-dwell, proprietary-framework viral assets.
Framework:
- Version 1: Hook-focused. Paradoxes and information gaps.
- Version 2: Reply-maximizing. Polarizing takes on safe topics.
- Version 3: Identity-bridging. Quotes that make the sharer look like an alpha.

Style: No emojis in the first 2 lines. Minimal punctuation. Punchy tempo.
YOU MUST RESPOND WITH VALID JSON ONLY. No markdown, no explanations.`;

const REPLY_SYSTEM_INSTRUCTION = `You are the BangerAgent Reply Engine. ${ALGO_CORE_LOGIC}
Goal: Craft responses that force the OP to reply or the audience to click your profile.
Tactics:
- Recontextualization (Explain the OP's tweet in a better way).
- The "Insight Gap" (Add the one thing they missed).
- Witty Contradiction (Respectfully disagree with logic).

YOU MUST RESPOND WITH VALID JSON ONLY. No markdown, no explanations.`;

const AUDIT_SYSTEM_INSTRUCTION = `You are the BangerAgent Algorithmic Auditor. ${ALGO_CORE_LOGIC}
Goal: Analyze a user's recent tweets to identify algorithmic performance bottlenecks and provide a roadmap for recovery.
Focus on: Hook degradation, bot-patterns, and shadow-signals.
YOU MUST RESPOND WITH VALID JSON ONLY. No markdown, no explanations.`;

const NICHE_SYSTEM_INSTRUCTION = `You are the BangerAgent Niche Architect. ${ALGO_CORE_LOGIC}
Goal: Map out a user's content niche, identify expansion opportunities, and provide a strategic engagement plan.
Focus on: Authority building, cross-niche overlap, and creator benchmarks.
YOU MUST RESPOND WITH VALID JSON ONLY. No markdown, no explanations.`;

const IDEA_SYSTEM_INSTRUCTION = `You are the BangerAgent Content Architect. ${ALGO_CORE_LOGIC}
Goal: Take a topic or niche description and generate a high-level content strategy.
Generate:
1. A detailed Blog/Article Outline with a magnetic title and sections.
2. A viral X Thread structure (Hook + 5-7 tweets + CTA).
3. Three engaging Poll ideas to drive engagement.

Style: Expert, authoritative, yet edgy and minimalist. No corporate fluff.
Focus on: Information density and curiosity gaps.
YOU MUST RESPOND WITH VALID JSON ONLY. No markdown, no explanations.`;

const cleanJson = (text: string) => {
  return text.replace(/```json\n?|```/g, "").trim();
};

export async function optimizeTweet(input: string): Promise<OptimizationResult> {
  const response = await client.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 2000,
    system: OPTIMIZE_SYSTEM_INSTRUCTION,
    messages: [
      {
        role: "user",
        content: `Optimize this tweet: "${input}"`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";
  if (!text) throw new Error("Empty response from Claude");
  return JSON.parse(cleanJson(text));
}

export async function craftReply(input: string): Promise<ReplyResult> {
  const response = await client.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1500,
    system: REPLY_SYSTEM_INSTRUCTION,
    messages: [
      {
        role: "user",
        content: `Craft a reply for this source tweet: "${input}"`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";
  if (!text) throw new Error("Empty response from Claude");
  return JSON.parse(cleanJson(text));
}

export async function auditProfile(
  tweets: string[],
  handle: string
): Promise<ProfileAuditResult> {
  const response = await client.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 2000,
    system: AUDIT_SYSTEM_INSTRUCTION,
    messages: [
      {
        role: "user",
        content: `Analyze these tweets from @${handle}:\n${tweets.join("\n---\n")}`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";
  if (!text) throw new Error("Empty response from Claude");
  return JSON.parse(cleanJson(text));
}

export async function analyzeNiche(
  tweets: string[],
  handle: string
): Promise<NicheAnalysisResult> {
  const response = await client.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 2500,
    system: NICHE_SYSTEM_INSTRUCTION,
    messages: [
      {
        role: "user",
        content: `Analyze the content niche of @${handle} based on these tweets:\n${tweets.join("\n---\n")}`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";
  if (!text) throw new Error("Empty response from Claude");
  return JSON.parse(cleanJson(text));
}

export async function generateContentIdeas(
  input: string
): Promise<IdeaGenerationResult> {
  const response = await client.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 2500,
    system: IDEA_SYSTEM_INSTRUCTION,
    messages: [
      {
        role: "user",
        content: `Generate a content strategy for this topic/niche: "${input}"`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";
  if (!text) throw new Error("Empty response from Claude");
  return JSON.parse(cleanJson(text));
}

export async function generateTweetImage(prompt: string): Promise<string> {
  throw new Error(
    "Image generation is not available with this service."
  );
}
