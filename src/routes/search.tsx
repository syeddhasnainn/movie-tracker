import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'

type TitleSearch = {
  query: string
  page: number
}

export const Route = createFileRoute('/search')({
  component: RouteComponent,
  validateSearch: (search: Record<string, any>): TitleSearch => {
    return {
      query: search.query,
      page: search.page,
    }
  },
  loaderDeps: ({ search: { query, page } }) => ({ query, page }),
  loader: async ({ deps: { query, page } }) => {
    try {
      const resp = await fetch(
        `https://api.themoviedb.org/3/search/multi?query=${query}&include_adult=false&language=en-US&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_API}`,
          },
        },
      )

      if (!resp.ok) {
        throw new Error('Failed to fetch search results')
      }

      const data = await resp.json()
      return data
    } catch (error) {
      console.error(error)
      throw error
    }
  },
})

function RouteComponent() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchResults = Route.useLoaderData({
    onStart: () => setLoading(true),
    onComplete: () => setLoading(false),
    onError: (err) => {
      setError('Failed to load search results. Please try again.')
      setLoading(false)
    },
  })

  if (loading) {
    return <div className="text-center py-4">Loading...</div>
  }

  if (error) {
    return <div className="text-center text-red-500 py-4">{error}</div>
  }

  if (!searchResults.results.length) {
    return <div className="text-center py-4">No results found for your search.</div>
  }

  return (
    <div className="text-ring">
      <ul className="flex gap-4 flex-col pb-4">
        {searchResults.results.map((result: any) => (
          <Link to={'/movie/$id'} params={{ id: result.id }} key={result.id}>
            <li>
              <div className="flex gap-2">
                <img
                  className="w-1/3 rounded-md"
                  src={`https://image.tmdb.org/t/p/w500${result.poster_path}`}
                  alt="movie poster"
                />

                <div>
                  <div className="pb-2">
                    <h2 className="font-semibold">{result.title || result.name}</h2>
                    <p className="text-xs">{result.release_date || result.first_air_date}</p>
                  </div>
                  <div className="text-sm line-clamp-4">{result.overview}</div>
                </div>
              </div>
            </li>
          </Link>
        ))}
      </ul>

      <div className="button flex gap-2">
        <Link
          from={Route.fullPath}
          search={(prev) => ({
            ...prev,
            page: prev.page - 1,
          })}
          className={`${searchResults.page === 1 ? `pointer-events-none cursor-not-allowed` : ''} bg-popover text-ring rounded-md px-2 py-1 text-sm `}
        >
          Previous
        </Link>

        <Link
          from={Route.fullPath}
          search={(prev) => ({
            ...prev,
            page: prev.page + 1,
          })}
          className={`${searchResults.page === searchResults.total_pages ? `pointer-events-none cursor-not-allowed` : ''} bg-popover text-ring rounded-md px-2 py-1 text-sm `}
        >
          Next
        </Link>
      </div>
    </div>
  )
}