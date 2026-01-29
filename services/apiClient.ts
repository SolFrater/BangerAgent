
import {
  OptimizationResult,
  ReplyResult,
  ProfileAuditResult,
  NicheAnalysisResult,
  IdeaGenerationResult
} from '../types';

/**
 * BangerAgent API Client
 * Handles communication with backend API for production deployments.
 * Automatically detects backend URL from environment or defaults to localhost.
 */

// Get the backend URL from environment or use defaults
function getBackendUrl(): string {
  // Priority: VITE_BACKEND_URL → VITE_API_URL → localhost
  const url = import.meta.env.VITE_BACKEND_URL ||
              import.meta.env.VITE_API_URL ||
              'http://localhost:5000';
  return url.replace(/\/$/, ''); // Remove trailing slash
}

// Helper to make backend API calls
async function callBackendAPI(
  endpoint: string,
  payload: any
): Promise<any> {
  const backendUrl = getBackendUrl();
  const url = `${backendUrl}/api/analysis${endpoint}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Backend error (${response.status}): ${error}`);
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || 'Backend request failed');
  }

  return data.data;
}

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
        return await callBackendAPI('/optimize', { input });
      case 'reply':
        return await callBackendAPI('/reply', { input });
      case 'audit':
        return await callBackendAPI('/audit', {
          tweets: tweetArray.length > 0 ? tweetArray : [input],
          handle
        });
      case 'niche':
        return await callBackendAPI('/niche', {
          tweets: tweetArray.length > 0 ? tweetArray : [input],
          handle
        });
      case 'ideate':
        return await callBackendAPI('/ideate', { input });
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
    throw new Error('Image generation is not available. Use a dedicated image service.');
  } catch (error) {
    console.error('[API Client Error] Image generation failure:', error);
    throw new Error('Failed to forge visual asset.');
  }
}

export async function checkStatus(): Promise<boolean> {
  try {
    const backendUrl = getBackendUrl();
    const response = await fetch(`${backendUrl}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000) // 5 second timeout
    });
    return response.ok;
  } catch (error) {
    console.warn('[API Client] Backend health check failed:', error);
    return false;
  }
}
