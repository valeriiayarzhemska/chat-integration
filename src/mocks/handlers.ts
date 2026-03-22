import { rest } from 'msw';

// Mock handlers for API endpoints
export const handlers = [
  // Mock handler for chat API (OpenAI)
  rest.post('/api/chat', async (req, res, ctx) => {
    return res(
      ctx.json({
        message: {
          role: 'assistant',
          content: 'This is a mocked response from the AI assistant.',
        },
      }),
    );
  }),

  // Mock handler for GPT4All
  rest.post('/api/chat4all', async (req, res, ctx) => {
    return res(
      ctx.json({
        message: {
          role: 'assistant',
          content: 'This is a mocked response from GPT4All.',
        },
      }),
    );
  }),
];

// Reusable handler factories for testing different scenarios
export const createSuccessHandler = (url: string, content: string) => {
  return rest.post(url, async (req, res, ctx) => {
    return res(
      ctx.json({
        message: {
          role: 'assistant',
          content,
        },
      }),
    );
  });
};

export const createErrorHandler = (
  url: string,
  status: number,
  error: string,
) => {
  return rest.post(url, async (req, res, ctx) => {
    return res(ctx.status(status), ctx.json({ error }));
  });
};

export const createNetworkErrorHandler = (url: string) => {
  return rest.post(url, async (req, res, ctx) => {
    return res.networkError('Network error');
  });
};
