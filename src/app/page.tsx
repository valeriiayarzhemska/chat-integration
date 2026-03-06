import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-black-900 py-12 px-4">
      <main className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xl text-black-300">PDP - March 2026</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Link
            href="/todos-swr"
            className="group block p-8 bg-gray-900 rounded-xl shadow-md hover:shadow-xl transition-all border-2 border-transparent hover:border-blue-500"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-black-900 group-hover:text-blue-600 transition-colors">
                SWR Todos
              </h2>
            </div>
          </Link>

          <Link
            href="/todos-react-query"
            className="group block p-8 bg-gray-900 rounded-xl shadow-md hover:shadow-xl transition-all border-2 border-transparent hover:border-green-500"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-black-900 group-hover:text-green-600 transition-colors">
                React Query Todos
              </h2>
            </div>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Link
            href="/openai"
            className="group block p-8 bg-gray-900 rounded-xl shadow-md hover:shadow-xl transition-all border-2 border-transparent hover:border-purple-500"
          >
            <h2 className="text-2xl font-bold text-black-900 group-hover:text-purple-600 transition-colors mb-4">
              OpenAI Chat
            </h2>
            <p className="text-black-600 mb-4">
              Integration with OpenAI&apos;s GPT models
            </p>
          </Link>

          <Link
            href="/gpt4all"
            className="group block p-8 bg-gray-900 rounded-xl shadow-md hover:shadow-xl transition-all border-2 border-transparent hover:border-indigo-500"
          >
            <h2 className="text-2xl font-bold text-black-900 group-hover:text-indigo-600 transition-colors mb-4">
              GPT4All Chat
            </h2>
            <p className="text-black-600 mb-4">
              Local LLM integration with GPT4All
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}
