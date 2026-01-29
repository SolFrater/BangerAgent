
import { 
  optimizeTweet, 
  craftReply, 
  auditProfile, 
  analyzeNiche, 
  generateContentIdeas,
  generateTweetImage 
} from './geminiService';
import { 
  OptimizationResult, 
  ReplyResult, 
  ProfileAuditResult, 
  NicheAnalysisResult, 
  IdeaGenerationResult 
} from '../types';

/**
 * NicheLens API Client
 * This service acts as the orchestration layer between the React UI 
 * and the generative AI backend protocols.
 */

export async function analyzeContent(
  mode: 'post' | 'reply' | 'audit' | 'niche' | 'ideate', 
  input: string,
  handle: string = 'user'
): Promise<any> {
  // Parsing logic for multi-tweet inputs as seen in BangerAgent
  const tweetArray = input
    .split(/\n{2,}|\n---\n/)
    .map(t => t.trim())
    .filter(t => t.length > 0);

  try {
    switch (mode) {
      case 'post':
        return await optimizeTweet(input);
      case 'reply':
        return await craftReply(input);
      case 'audit':
        return await auditProfile(tweetArray.length > 0 ? tweetArray : [input], handle);
      case 'niche':
        return await analyzeNiche(tweetArray.length > 0 ? tweetArray : [input], handle);
      case 'ideate':
        return await generateContentIdeas(input);
      default:
        throw new Error(`Unsupported protocol mode: ${mode}`);
    }
  } catch (error: any) {
    console.error(`[API Client Error] ${mode.toUpperCase()} failure:`, error);
    throw new Error(error.message || 'Transmission failed. AI context lost.');
  }
}

export async function generateAsset(prompt: string): Promise<string> {
  try {
    return await generateTweetImage(prompt);
  } catch (error) {
    console.error('[API Client Error] Image generation failure:', error);
    throw new Error('Failed to forge visual asset.');
  }
}

export async function checkStatus(): Promise<boolean> {
  // Simplified health check for the GenAI connection
  return !!process.env.API_KEY;
}
