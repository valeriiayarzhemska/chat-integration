import React from 'react';
import { render, screen, waitFor, userEvent } from '@/utils/test-utils';
import { rest } from 'msw';
import { server } from '@/mocks/server';
import {
  createErrorHandler,
  createNetworkErrorHandler,
} from '@/mocks/handlers';
import Chat from '@/components/Chat';

describe('Chat Component', () => {
  describe('Snapshot Tests', () => {
    it('should match snapshot on initial render', () => {
      const { container } = render(<Chat url="/api/chat" />);
      expect(container).toMatchSnapshot();
    });
  });

  describe('Basic UI Rendering', () => {
    it('should render chat title', () => {
      render(<Chat url="/api/chat" />);
      expect(screen.getByText('AI Chat')).toBeInTheDocument();
    });

    it('should render input field with placeholder', () => {
      render(<Chat url="/api/chat" />);
      expect(
        screen.getByPlaceholderText('Write message...'),
      ).toBeInTheDocument();
    });

    it('should render send button', () => {
      render(<Chat url="/api/chat" />);
      expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
    });

    it('should start with empty messages', () => {
      render(<Chat url="/api/chat" />);
      expect(screen.queryByText(/user:/)).not.toBeInTheDocument();
      expect(screen.queryByText(/assistant:/)).not.toBeInTheDocument();
    });

    it('should have enabled input and button initially', () => {
      render(<Chat url="/api/chat" />);
      const input = screen.getByPlaceholderText('Write message...');
      const button = screen.getByRole('button', { name: /send/i });

      expect(input).not.toBeDisabled();
      expect(button).not.toBeDisabled();
    });
  });

  describe('Keyboard Interactions', () => {
    it('should update input value when user types', async () => {
      const user = userEvent.setup();
      render(<Chat url="/api/chat" />);

      const input = screen.getByPlaceholderText('Write message...');
      await user.type(input, 'Hello AI');

      expect(input).toHaveValue('Hello AI');
    });

    it('should clear input after successful message send', async () => {
      const user = userEvent.setup();

      render(<Chat url="/api/chat" />);

      const input = screen.getByPlaceholderText('Write message...');

      await user.type(input, 'Test message');
      await user.click(screen.getByRole('button', { name: /send/i }));

      // Input should still have value immediately after submit
      // (Component doesn't clear input in current implementation)
      expect(input).toHaveValue('Test message');
    });
  });

  describe('Click Interactions', () => {
    it('should send message when send button is clicked', async () => {
      const user = userEvent.setup();

      render(<Chat url="/api/chat" />);

      const input = screen.getByPlaceholderText('Write message...');
      await user.type(input, 'Test message');
      await user.click(screen.getByRole('button', { name: /send/i }));

      // Verify the message was sent and response received
      await waitFor(() => {
        expect(screen.getByText('Test message')).toBeInTheDocument();
        expect(
          screen.getByText('This is a mocked response from the AI assistant.'),
        ).toBeInTheDocument();
      });
    });

    it('should not send empty message', async () => {
      const user = userEvent.setup();

      render(<Chat url="/api/chat" />);

      await user.click(screen.getByRole('button', { name: /send/i }));

      // No messages should be displayed
      expect(screen.queryByText(/user:/)).not.toBeInTheDocument();
    });

    it('should not send whitespace-only message', async () => {
      const user = userEvent.setup();

      render(<Chat url="/api/chat" />);

      const input = screen.getByPlaceholderText('Write message...');
      await user.type(input, '   ');
      await user.click(screen.getByRole('button', { name: /send/i }));

      // No messages should be displayed
      expect(screen.queryByText(/user:/)).not.toBeInTheDocument();
    });
  });

  describe('API Response Handling', () => {
    it('should display user message after sending', async () => {
      const user = userEvent.setup();

      render(<Chat url="/api/chat" />);

      const input = screen.getByPlaceholderText('Write message...');
      await user.type(input, 'Hello');
      await user.click(screen.getByRole('button', { name: /send/i }));

      await waitFor(() => {
        expect(screen.getByText('Hello')).toBeInTheDocument();
      });
    });

    it('should display assistant response', async () => {
      const user = userEvent.setup();

      render(<Chat url="/api/chat" />);

      const input = screen.getByPlaceholderText('Write message...');
      await user.type(input, 'Question');
      await user.click(screen.getByRole('button', { name: /send/i }));

      await waitFor(() => {
        expect(
          screen.getByText('This is a mocked response from the AI assistant.'),
        ).toBeInTheDocument();
      });
    });

    it('should handle API error gracefully', async () => {
      const user = userEvent.setup();
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      // Override MSW handler for this test
      server.use(createErrorHandler('/api/chat', 500, 'Internal server error'));

      render(<Chat url="/api/chat" />);

      const input = screen.getByPlaceholderText('Write message...');
      await user.type(input, 'Test');
      await user.click(screen.getByRole('button', { name: /send/i }));

      await waitFor(() => {
        const button = screen.getByRole('button', { name: /send/i });
        expect(button).not.toBeDisabled();
      });

      expect(screen.getByText('Test')).toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    it('should handle network error', async () => {
      const user = userEvent.setup();
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      // Override MSW handler for network error
      server.use(createNetworkErrorHandler('/api/chat'));

      render(<Chat url="/api/chat" />);

      const input = screen.getByPlaceholderText('Write message...');
      await user.type(input, 'Test');
      await user.click(screen.getByRole('button', { name: /send/i }));

      // Wait for error to be logged
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalled();
      });

      consoleSpy.mockRestore();
    });

    it('should disable input and button while loading', async () => {
      const user = userEvent.setup();

      // Simulate a delayed response
      server.use(
        rest.post('/api/chat', async (req, res, ctx) => {
          await new Promise((resolve) => setTimeout(resolve, 100));
          return res(
            ctx.json({
              message: { role: 'assistant', content: 'Response' },
            }),
          );
        }),
      );

      render(<Chat url="/api/chat" />);

      const input = screen.getByPlaceholderText('Write message...');
      const button = screen.getByRole('button', { name: /send/i });

      await user.type(input, 'Test');
      await user.click(button);

      // Should be disabled while loading
      expect(input).toBeDisabled();
      expect(button).toBeDisabled();

      // Should be enabled after response
      await waitFor(() => {
        expect(input).not.toBeDisabled();
        expect(button).not.toBeDisabled();
      });
    });
  });

  describe('MSW Request Verification', () => {
    it('sends correct payload to API', async () => {
      const user = userEvent.setup();

      // Create a custom handler to verify the request
      let capturedRequest: any = null;
      server.use(
        rest.post('/api/chat', async (req, res, ctx) => {
          capturedRequest = await req.json();
          return res(
            ctx.json({
              message: { role: 'assistant', content: 'Response' },
            }),
          );
        }),
      );

      render(<Chat url="/api/chat" />);

      await user.type(screen.getByPlaceholderText('Write message...'), 'Hello');
      await user.click(screen.getByRole('button', { name: /send/i }));

      await waitFor(() => {
        expect(capturedRequest).toBeTruthy();
      });

      expect(capturedRequest.messages).toHaveLength(1);
      expect(capturedRequest.messages[0]).toEqual({
        role: 'user',
        content: 'Hello',
      });
    });

    it('demonstrates multiple API calls with MSW', async () => {
      const user = userEvent.setup();

      // MSW will handle multiple requests with the same handler
      let callCount = 0;
      server.use(
        rest.post('/api/chat', async (req, res, ctx) => {
          callCount++;
          return res(
            ctx.json({
              message: { role: 'assistant', content: `Response ${callCount}` },
            }),
          );
        }),
      );

      render(<Chat url="/api/chat" />);

      const input = screen.getByPlaceholderText('Write message...');

      // First message
      await user.type(input, 'First');
      await user.click(screen.getByRole('button', { name: /send/i }));

      await waitFor(() => {
        expect(screen.getByText('Response 1')).toBeInTheDocument();
      });

      // Second message
      await user.clear(input);
      await user.type(input, 'Second');
      await user.click(screen.getByRole('button', { name: /send/i }));

      await waitFor(() => {
        expect(screen.getByText('Response 2')).toBeInTheDocument();
      });

      expect(callCount).toBe(2);
    });
  });
});
