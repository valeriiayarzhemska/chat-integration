# Chat Integration - Full-Stack AI & State Management Demo

A comprehensive Next.js application demonstrating AI chat integrations and advanced state management patterns. Built as a learning project for PDP March 2026.

## 📋 Project Overview

This application showcases:

- 🤖 **Dual AI Chat Implementations**: OpenAI GPT-4o-mini and local GPT4All model
- 📝 **State Management Comparison**: Side-by-side SWR vs React Query implementations
- 🧪 **Production-Ready Testing**: Jest + MSW for comprehensive test coverage
- ⚡ **Modern React Patterns**: Next.js App Router, TypeScript, Server Components

## 🛠 Tech Stack

### Frontend

- **Framework**: Next.js 16.1.6 (App Router)
- **React**: 19.2.3
- **TypeScript**: 5.x
- **Styling**: TailwindCSS + PostCSS
- **State Management**:
  - SWR 2.4.1 (simple, lightweight)
  - React Query 5.90.21 (advanced features)

### Backend

- **API**: Next.js API Routes (serverless)
- **OpenAI Integration**: OpenAI SDK 6.25.0
- **Local LLM**: Python + GPT4All (qwen2-1.5b-instruct)
- **Data Storage**: In-memory store (demo purposes)

### Testing

- **Test Runner**: Jest 29.7.0
- **Testing Library**: React Testing Library 16.3.2
- **API Mocking**: MSW 2.12.10
- **Router Mocking**: next-router-mock

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- Python 3.x with virtual environment
- OpenAI API key (for OpenAI chat feature)

### Installation

1. **Clone and install dependencies**:

```bash
npm install
```

2. **Set up Python environment** (for GPT4All):

```bash
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install gpt4all
```

3. **Configure environment variables**:

```bash
# Create .env.local file
OPENAI_API_KEY=your_openai_api_key_here
```

4. **Download GPT4All model**:
   - Place `qwen2-1_5b-instruct-q4_0.gguf` in `server/models/` directory
   - Or use GPT4All's auto-download feature

### Running the Application

```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

### Running Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## 📁 Project Structure

```
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── page.tsx             # Home page with navigation
│   │   ├── api/                 # API Routes
│   │   │   ├── chat/            # OpenAI endpoint
│   │   │   ├── chat4all/        # GPT4All endpoint
│   │   │   └── todos/           # Todo CRUD API
│   │   ├── openai/              # OpenAI chat interface
│   │   ├── gpt4all/             # Local LLM chat interface
│   │   ├── todos-swr/           # Todo app using SWR
│   │   └── todos-react-query/   # Todo app using React Query
│   ├── components/
│   │   ├── Chat/                # Reusable chat component
│   │   └── todos/               # Todo UI components
│   ├── lib/
│   │   └── todoStore.ts         # In-memory data store
│   ├── mocks/
│   │   ├── handlers.ts          # MSW request handlers
│   │   └── server.ts            # MSW server setup
│   └── __tests__/               # Test files
└── server/
    ├── chat.py                  # Python GPT4All integration
    └── models/                  # Local LLM models
```

## ✨ Features

### 1. OpenAI Chat Integration (`/openai`)

Real-time chat interface powered by OpenAI's GPT-4o-mini model.

**Implementation Details**:

- Uses OpenAI official SDK for API calls
- Maintains full conversation history
- Temperature: 0.7 for balanced responses
- Error handling with proper HTTP status codes
- Client-side loading states

**API Endpoint**: `POST /api/chat`

```typescript
// Request
{
  "messages": [
    { "role": "user", "content": "Hello!" }
  ]
}

// Response
{
  "message": {
    "role": "assistant",
    "content": "Hi! How can I help you?"
  }
}
```

### 2. Local LLM Chat (`/gpt4all`)

Fully offline AI chat using a local quantized model.

**How It Works**:

1. Next.js API spawns Python subprocess
2. Sends user prompt via stdin (JSON)
3. Python loads GPT4All model and generates response
4. Returns response via stdout (JSON)
5. Frontend receives and displays message

**Technical Details**:

- Model: qwen2-1.5b-instruct (4-bit quantized)
- No external API calls - 100% local
- Python virtual environment integration
- Stream-based IPC (stdin/stdout)

**API Endpoint**: `POST /api/chat4all`

### 3. Todo Apps - SWR vs React Query

Two identical Todo applications demonstrating different state management approaches.

#### Shared Features:

- ✅ CRUD operations (Create, Read, Update, Delete)
- ✅ Pagination (configurable page size)
- ✅ Filtering (by completion status)
- ✅ Search functionality
- ✅ Simulated network delays (300-400ms)
- ✅ Error handling and retry logic

#### SWR Implementation (`/todos-swr`)

```typescript
// Simple hook-based API
const { todos, isLoading, isError, mutate } = useTodos(page, pageSize);

// Manual cache updates
mutate(); // Revalidate
```

**Features**:

- 2-second request deduplication
- Auto-revalidation on focus/reconnect
- Previous data persistence during fetch
- Custom cache key system

#### React Query Implementation (`/todos-react-query`)

```typescript
// Advanced query with configuration
const { data, isLoading, error } = useTodos(page, pageSize);

// Optimistic updates in mutations
useMutation({
  onMutate: async (newTodo) => {
    // Optimistically update cache
  },
});
```

**Features**:

- 30-second stale time
- 5-minute garbage collection
- Exponential backoff retry (3 attempts)
- `keepPreviousData` for smooth pagination
- Query key factory pattern

### 4. Todo API

RESTful API with advanced features for learning purposes.

**Endpoints**:

```
GET    /api/todos?page=1&pageSize=10&completed=true&search=term
POST   /api/todos
PATCH  /api/todos/[id]
DELETE /api/todos/[id]
```

**Example Response**:

```typescript
{
  "data": [...],
  "total": 50,
  "page": 1,
  "pageSize": 10,
  "totalPages": 5
}
```

**Testing Features**:

- `?forceError=true` - Simulate 500 error
- Configurable delays for testing loading states
- Validation errors (400 responses)

## 🧪 Testing Strategy

### Setup

- **Jest**: Test runner with jsdom environment
- **MSW**: Mock Service Worker for API mocking
- **React Testing Library**: Component testing
- **Snapshot Testing**: UI regression detection

### Mock Handlers (`src/mocks/handlers.ts`)

```typescript
// Example mock
http.post('/api/chat', async () => {
  return HttpResponse.json({
    message: {
      role: 'assistant',
      content: 'Mocked response',
    },
  });
});
```

### Test Coverage

- Component rendering and interaction
- API endpoint behavior
- Error scenarios (400, 500, network errors)
- User event simulations
- Snapshot comparisons

### Running Specific Tests

```bash
# Run tests for a specific file
npm test -- Chat.test.tsx

# Update snapshots
npm test -- -u

# Run in watch mode
npm run test:watch
```

## 🔑 Key Technical Decisions

### 1. App Router

Using Next.js App Router for:

- Server Components by default
- Improved data fetching patterns
- Nested layouts
- React 19 features

### 2. Two State Management Libraries

Intentional duplication for learning:

- **SWR**: Simpler API, less configuration
- **React Query**: More features, better DevTools

### 3. Python Subprocess for LLM

- Leverages Python ML ecosystem
- Avoids Node.js GGML binding complexity
- JSON-based IPC is simple and debuggable
- Alternative: ONNX Runtime, llama.cpp Node bindings

### 4. In-Memory Storage

- Perfect for demo/learning purposes
- Singleton pattern for consistency
- Production would use PostgreSQL/MongoDB

### 5. Reusable Components

```typescript
// Single Chat component for both implementations
<Chat url="/api/chat" />      // OpenAI
<Chat url="/api/chat4all" />  // GPT4All
```

## 📊 Performance Optimizations

### SWR Configuration

- 2-second deduplication interval
- Auto-revalidation strategies
- `keepPreviousData` for smooth transitions

### React Query Configuration

- 30-second stale time
- 5-minute garbage collection
- Exponential backoff (1s → 2s → 4s → ...)
- Optimistic updates for instant UI feedback

### API Optimizations

- Pagination to limit data transfer
- Simulated delays for realistic testing
- Error retry mechanisms

## 🔧 Environment Variables

Create `.env.local` file:

```env
# OpenAI Configuration
OPENAI_API_KEY=sk-...

# Optional: Custom configurations
NEXT_PUBLIC_PAGE_SIZE=10
```

## 🐛 Common Issues

### GPT4All Not Working

1. Ensure Python virtual environment is activated
2. Check model file path in `server/chat.py`
3. Verify GPT4All is installed: `pip list | grep gpt4all`

### OpenAI API Errors

1. Verify `OPENAI_API_KEY` in `.env.local`
2. Check API key has sufficient credits
3. Review error messages in browser console

### Tests Failing

1. Clear Jest cache: `npm test -- --clearCache`
2. Update snapshots if intentional changes: `npm test -- -u`
3. Check MSW handlers are properly configured

## 📚 Learning Resources

This project demonstrates concepts from:

- [Next.js Documentation](https://nextjs.org/docs)
- [SWR Documentation](https://swr.vercel.app)
- [React Query Documentation](https://tanstack.com/query/latest)
- [OpenAI API Reference](https://platform.openai.com/docs)
- [GPT4All Documentation](https://docs.gpt4all.io)
- [MSW Documentation](https://mswjs.io)

## 🚀 Production Considerations

To make this production-ready, consider:

- [ ] Replace in-memory storage with database (PostgreSQL, MongoDB)
- [ ] Add authentication/authorization (NextAuth.js, Clerk)
- [ ] Implement rate limiting on API routes
- [ ] Add error logging and monitoring (Sentry, LogRocket)
- [ ] Set up CI/CD pipeline (GitHub Actions, Vercel)
- [ ] Optimize bundle size and performance
- [ ] Add E2E tests (Playwright, Cypress)
- [ ] Implement proper error boundaries
- [ ] Add API documentation (Swagger/OpenAPI)

## 📝 License

This project is created for educational purposes as part of PDP March 2026.

## 🤝 Contributing

This is a personal learning project.

---

**Built with ❤️ using Next.js, React, and TypeScript**
