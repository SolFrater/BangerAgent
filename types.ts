
export type APIMode = 'post' | 'reply' | 'audit' | 'niche' | 'ideate';
export type AppMode = APIMode | 'guide';

export interface ReplyTarget {
  handle: string;
  name: string;
  category: 'Small' | 'Mid' | 'Big';
  whyReply: string;
}

export interface OptimizedVersion {
  label: string;
  tweet: string;
  bulletPoints: string[];
  whyItWorks: string;
}

export interface ReplyVariation {
  label: string;
  reply: string;
  bulletPoints: string[];
  strategy: string;
}

export interface ReplyResult {
  sourceTweet: string;
  variations: ReplyVariation[];
  analysis: {
    intent: string;
    hookOpportunity: string;
    socialRisk: string;
  };
}

export interface OptimizationResult {
  original: string;
  analysis: {
    drivers: string;
    friction: string;
    emotionalRegister: string;
    missingElements: string;
    socialRisk: string;
    costlyActionPotential: string;
  };
  optimizedVersions: OptimizedVersion[];
  replyTargets: ReplyTarget[];
  recommended: {
    versionLabel: string;
    hybridSuggestions: string;
  };
  postingStrategy: {
    timeFraming: string;
    threadPotential: string;
    mediaRecommendation: string;
    followUpPlays: string;
  };
}

export interface ProfileAuditResult {
  handle: string;
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  improvementPlan: string[];
  tweetAnalyses: {
    original: string;
    critique: string;
    revisedHook: string;
  }[];
}

export interface NicheAnalysisResult {
  niche: string;
  description: string;
  score: number;
  voice: string[];
  pillars: { icon: string; text: string; why: string }[];
  crossNiche: { name: string; percentage: number; opportunity: string }[];
  contentIdeas: { type: string; idea: string; advice: string }[];
  creators: { handle: string; followers: string; type: string; reason: string }[];
  hooks: { category: string; text: string; teaching: string }[];
  engagementTargets: { handle: string; postType: string; advice: string[] }[];
}

export interface IdeaGenerationResult {
  topic: string;
  articleOutline: {
    title: string;
    introHook: string;
    sections: { heading: string; keyPoints: string[] }[];
  };
  threadStructure: {
    hook: string;
    tweets: string[];
    cta: string;
  };
  pollIdeas: {
    question: string;
    options: string[];
    strategy: string;
  }[];
}

export interface HistoryItem {
  id: string;
  user_id?: string;
  timestamp: number;
  // History items do not include the 'guide' UI mode
  type: 'post' | 'reply' | 'audit' | 'niche' | 'ideate';
  input: string;
  result: OptimizationResult | ReplyResult | ProfileAuditResult | NicheAnalysisResult | IdeaGenerationResult;
}

export interface OptimizationState {
  loading: boolean;
  generatingImage: boolean;
  generatedImage: string | null;
  result: OptimizationResult | null;
  replyResult: ReplyResult | null;
  auditResult: ProfileAuditResult | null;
  nicheResult: NicheAnalysisResult | null;
  ideaResult: IdeaGenerationResult | null;
  error: string | null;
}

export interface UserState {
  isLoggedIn: boolean;
  id?: string;
  handle?: string;
  name?: string;
  profileImage?: string;
}
