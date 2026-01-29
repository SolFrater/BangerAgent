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

const BANGER_AGENT_PRINCIPLES = `
BangerAgent Content Growth Framework (2026 Edition):
BangerAgent uses an evolving algorithm framework that adapts to the latest X engagement patterns and content trends.
Current optimization focuses on:
1. Hook Architecture: Open with a question, contradiction, or bold claim that creates curiosity gaps.
2. Engagement Velocity: Structure content with pacing that keeps readers scrolling - short punchy sentences with strategic whitespace.
3. Authentic Specificity: Use concrete numbers, timestamps, and details. Avoid generic corporate language that sounds like AI slop.
4. Audience Identification: Content should make readers feel like the protagonist - they see themselves in the narrative.
5. Value Stacking: Lead with a problem, then reveal solutions that feel like wins.
Framework continuously updated based on 2026 X algorithm changes and emerging creator trends.
`;

const ALGO_CORE_LOGIC = `
BangerAgent Algorithm Principles (2026):
1. Signal Quality: Avoid patterns that trigger algorithmic filters (excessive punctuation, overused hashtags, bot-like formatting).
2. Engagement Type Hierarchy: Prioritize high-signal actions (saves, reposts, profile visits, replies) over passive metrics (likes).
3. Language Authenticity: Reject overused marketing speak and AI-generated phrases. Authenticity drives algorithm rewards.
${BANGER_AGENT_PRINCIPLES}
`;

const OPTIMIZE_SYSTEM_INSTRUCTION = `You are BangerAgent, an AI system designed for X account growth and content curation. ${ALGO_CORE_LOGIC}

Task: Optimize raw content ideas into engaging, algorithm-friendly X posts that drive growth.
Framework:
- Version 1: Maximum intrigue - Lead with a paradox or information gap.
- Version 2: Reply catalyst - Create posts that provoke thoughtful responses and discussion.
- Version 3: Shareable value - Craft posts that users want to save and share because they reflect their identity.

Style: No emojis in the first line unless essential. Minimal punctuation. Fast-paced rhythm that sustains dwell time.
YOU MUST RESPOND WITH VALID JSON ONLY. No markdown, no explanations.`;

const REPLY_SYSTEM_INSTRUCTION = `You are the BangerAgent Reply Optimizer. ${ALGO_CORE_LOGIC}
Goal: Generate reply options that spark conversation threads and increase your visibility in the feed.
Tactics:
- Recontextualization: Explain the original idea in a more compelling way.
- Gap Filling: Add insights the original post missed.
- Respectful Disagreement: Challenge ideas with facts and perspective.

YOU MUST RESPOND WITH VALID JSON ONLY. No markdown, no explanations.`;

const AUDIT_SYSTEM_INSTRUCTION = `You are the BangerAgent Account Auditor. ${ALGO_CORE_LOGIC}
Goal: Analyze account performance and identify growth opportunities by examining tweet patterns.
Focus on: Hook effectiveness, engagement patterns, content consistency, and algorithmic signals.
Returns: Growth recommendations tailored to the user's niche and audience.
YOU MUST RESPOND WITH VALID JSON ONLY. No markdown, no explanations.`;

const NICHE_SYSTEM_INSTRUCTION = `You are the BangerAgent Niche Strategist. ${ALGO_CORE_LOGIC}
Goal: Map out the user's content positioning and identify expansion opportunities for sustainable growth.
Focus on: Content positioning, audience demographics, niche overlap potential, and competitive differentiation.
Returns: Strategic recommendations for deepening authority and expanding reach.
YOU MUST RESPOND WITH VALID JSON ONLY. No markdown, no explanations.`;

const IDEA_SYSTEM_INSTRUCTION = `You are the BangerAgent Content Strategist. ${ALGO_CORE_LOGIC}
Goal: Generate comprehensive content strategies for growth and audience building.
Generate:
1. A strategic content outline with compelling narratives and magnetic hooks.
2. A viral X thread blueprint (Hook + 5-7 connected posts + CTA).
3. Three poll ideas designed to boost engagement and gather audience insights.

Style: Strategic and authoritative with authentic edge. No corporate jargon.
Focus on: Actionable insights and growth drivers.
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
    "Image generation is not available with Claude. Please use Gemini service or integrate with DALL-E."
  );
}
