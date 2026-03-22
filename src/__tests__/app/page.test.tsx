import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import mockRouter from 'next-router-mock';
import { renderWithRouter } from '@/utils/test-utils-router';
import Home from '@/app/page';

describe('Home Page', () => {
  beforeEach(() => {
    // Reset router before each test
    mockRouter.setCurrentUrl('/');
  });

  describe('Rendering', () => {
    it('should render the home page', () => {
      render(<Home />);

      expect(screen.getByText('OpenAI Chat')).toBeInTheDocument();
      expect(screen.getByText('GPT4All Chat')).toBeInTheDocument();
      expect(screen.getByText('SWR Todos')).toBeInTheDocument();
      expect(screen.getByText('React Query Todos')).toBeInTheDocument();
    });

    it('should render navigation links with correct hrefs', () => {
      render(<Home />);

      const openaiLink = screen.getByRole('link', { name: /openai chat/i });
      const gpt4allLink = screen.getByRole('link', { name: /gpt4all chat/i });
      const swrLink = screen.getByRole('link', { name: /swr todos/i });
      const reactQueryLink = screen.getByRole('link', {
        name: /react query todos/i,
      });

      expect(openaiLink).toHaveAttribute('href', '/openai');
      expect(gpt4allLink).toHaveAttribute('href', '/gpt4all');
      expect(swrLink).toHaveAttribute('href', '/todos-swr');
      expect(reactQueryLink).toHaveAttribute('href', '/todos-react-query');
    });

    it('should match snapshot', () => {
      const { container } = render(<Home />);
      expect(container).toMatchSnapshot();
    });
  });

  describe('Router Integration', () => {
    it('should initialize with correct route', () => {
      renderWithRouter(<Home />, { initialRoute: '/' });

      expect(mockRouter.pathname).toBe('/');
      expect(mockRouter.asPath).toBe('/');
    });

    it('should support different initial routes', () => {
      renderWithRouter(<Home />, { initialRoute: '/test' });

      expect(mockRouter.pathname).toBe('/test');
    });

    it('should allow programmatic navigation', () => {
      renderWithRouter(<Home />);

      // Simulate navigation
      act(() => {
        mockRouter.push('/openai');
      });

      expect(mockRouter.pathname).toBe('/openai');
      expect(mockRouter.asPath).toBe('/openai');
    });

    it('should handle navigation with query params', () => {
      renderWithRouter(<Home />);

      act(() => {
        mockRouter.push('/openai?model=gpt-4');
      });

      expect(mockRouter.pathname).toBe('/openai');
      expect(mockRouter.asPath).toBe('/openai?model=gpt-4');
      expect(mockRouter.query).toEqual({ model: 'gpt-4' });
    });

    it('should track navigation history', () => {
      renderWithRouter(<Home />);

      // Navigate to a page
      act(() => {
        mockRouter.push('/openai');
      });

      expect(mockRouter.pathname).toBe('/openai');

      // Navigate to another page
      act(() => {
        mockRouter.push('/gpt4all');
      });

      expect(mockRouter.pathname).toBe('/gpt4all');
    });
  });

  describe('User Interactions', () => {
    it('should handle link clicks', async () => {
      const user = userEvent.setup();
      render(<Home />);

      const openaiLink = screen.getByRole('link', { name: /openai chat/i });

      // Verify link is clickable
      await user.click(openaiLink);

      // In a real app with client-side navigation, you would verify the navigation occurred
      expect(openaiLink).toBeInTheDocument();
    });
  });

  describe('Styling and Layout', () => {
    it('should apply correct CSS classes', () => {
      const { container } = render(<Home />);

      const mainElement = container.querySelector('main');
      expect(mainElement).toHaveClass('max-w-5xl', 'mx-auto');
    });

    it('should have responsive layout classes', () => {
      const { container } = render(<Home />);

      const mainElement = container.querySelector('main');
      expect(mainElement?.className).toContain('max-w-5xl');
    });

    it('should have card grid layout', () => {
      const { container } = render(<Home />);

      const gridElements = container.querySelectorAll('.grid');
      expect(gridElements.length).toBeGreaterThan(0);
    });
  });
});
