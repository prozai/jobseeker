import { Profile, Job } from '../types';

interface N8nResponse {
  responseText: string;
  jobs?: Job[];
}

interface TestResponse {
    success: boolean;
    error?: string;
}

export const testN8nConnection = async (url: string): Promise<TestResponse> => {
    if (!url) {
        return { success: false, error: 'URL is empty.' };
    }
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ testConnection: true }),
        });

        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
        }
        
        // Check if the response seems valid, assuming n8n might return something.
        const data = await response.json();
        if (typeof data !== 'object') {
             throw new Error('Invalid response from server.');
        }

        return { success: true };

    } catch (error) {
        if (error instanceof TypeError) {
             return { success: false, error: 'Network error or invalid URL.' };
        }
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: 'An unknown error occurred.' };
    }
}

export const callN8nWebhook = async (
  url: string,
  profile: Profile,
  query: string
): Promise<N8nResponse> => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        profile,
        query,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Webhook returned an error: ${response.status} ${response.statusText}. Body: ${errorBody}`);
    }
    
    // n8n webhook responses might have a different structure.
    // We assume the final node in n8n is set to "Respond to Webhook" and returns a JSON object.
    const data = await response.json();

    // The response from n8n might be nested. A common pattern is that the result is in data.
    // We check for expected fields to provide a more robust parsing.
    if (typeof data.responseText !== 'string') {
        throw new Error('Invalid response format from webhook: "responseText" field is missing or not a string.');
    }

    return {
      responseText: data.responseText,
      jobs: data.jobs || []
    };

  } catch (error) {
    console.error('Error calling n8n webhook:', error);
    if (error instanceof Error) {
        throw error;
    }
    throw new Error('An unknown error occurred while contacting the webhook.');
  }
};