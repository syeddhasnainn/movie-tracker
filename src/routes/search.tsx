import { Button } from '@/components/ui/button'
import { createFileRoute, Link } from '@tanstack/react-router'

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
    const resp = await fetch(
      `https://api.themoviedb.org/3/search/multi?query=${query}&include_adult=false&language=en-US&page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_TMDB_API}`,
        },
      },
    )

    const data = await resp.json()
    return data
  },
})

function RouteComponent() {
  const searchResults = Route.useLoaderData()

  console.log(searchResults)
  return (
    <div className="text-ring">
      <ul className="flex gap-4 flex-col pb-4">
        {searchResults.results.map((result) => (
          <Link to={'/movie/$id'} params={{ id: result.id }}>
            <li key={result.id}>
              <div className="flex gap-2">
                <img
                  className="w-1/3 rounded-md"
                  src={`https://image.tmdb.org/t/p/w500${result.poster_path}`}
                  alt=""
                />

                <div>
                  <div className="pb-2">
                    <h2 className="font-semibold">{result.title}</h2>
                    <p className="text-xs">{result.release_date}</p>
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
