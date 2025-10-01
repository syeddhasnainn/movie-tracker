import { Button } from '@/components/ui/button'
import { createFileRoute, Link, useLoaderData } from '@tanstack/react-router'
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useQuery } from '@tanstack/react-query'
import { useQuery as ConvexUseQuery } from 'convex/react'
import { toast } from 'sonner'

export const Route = createFileRoute('/movie/$id')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const movie = await fetch(
      `https://api.themoviedb.org/3/movie/${params.id}?language=en-US`,
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_TMDB_API}`,
        },
      },
    )
    return { movie: await movie.json() }
  },
})

function RouteComponent() {
  const { movie } = useLoaderData({ from: '/movie/$id' })

  const isAdded = ConvexUseQuery(api.watchlist.isInWatchList, {
    tmdbId: String(movie.id),
  })

  const isAuthenticated = ConvexUseQuery(api.auth.isAuthenticated)

  const { data: similar } = useQuery({
    queryKey: ['movie', movie.id],
    queryFn: async () => {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movie.id}/similar`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_API}`,
          },
        },
      )

      const similar = await response.json()

      return similar
    },
  })

  const addToWatchList = useMutation(api.watchlist.add)

  if (!movie) {
    return <div className="p-4 text-center">Movie not found</div>
  }

  return (
    <div>
      <div className="flex gap-3 py-4">
        <div className="space-y-2 overflow-hidden w-[240px] flex-shrink-0">
          <img
            className="rounded-md aspect-[2/3] w-full object-cover"
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
          />
        </div>
        <div>
          <div className="flex gap-1 items-center text-ring">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-star-icon lucide-star"
            >
              <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
            </svg>
            <div className="text-sm">{movie.vote_average.toFixed(1)}</div>
          </div>
          <div className="text-sm">{movie.runtime} mins</div>
          <h1 className="unbounded text-lg text-white">{movie.title}</h1>

          <div className="text-muted-foreground">
            <p className="pt-1 text-sm">{movie.overview}</p>
          </div>

          <div className="flex gap-2 text-sm py-2">
            {movie.genres.map((g: any) => (
              <div
                key={g.id}
                className="border py-1 px-2 rounded-md text-muted-foreground border-muted text-xs"
              >
                {g.name}
              </div>
            ))}
          </div>

          {!isAdded ? (
            <Button
              className="max-w-fit text-ring cursor-pointer border !border-muted"
              onClick={() => {
                if (!isAuthenticated) {
                  toast.error('Please log in to add titles to your watchlist')
                  return
                }

                addToWatchList({
                  tmdbId: String(movie.id),
                  rating: movie.vote_average,
                  title: movie.title,
                  posterPath: movie.poster_path,
                  overview: movie.overview,
                  releaseDate: movie.release_date,
                  genres: movie.genres,
                  runtime: movie.runtime,
                })
              }}
              variant="outline"
            >
              Add to watchlist
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-clock-icon lucide-clock"
              >
                <path d="M12 6v6l4 2" />
                <circle cx="12" cy="12" r="10" />
              </svg>
            </Button>
          ) : (
            <Button
              className="max-w-fit text-ring border !border-muted"
              variant="outline"
            >
              Added
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-check-icon lucide-check"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </Button>
          )}
        </div>
      </div>

      <section className="py-4 ">
        <h1 className="text-base font-bold unbounded">Similar Movies</h1>
        <div className="grid grid-cols-6 gap-3 py-4">
          {similar?.results.map((m: any) =>
            m.poster_path ? (
              <Link key={m.id} to={`/movie/$id`} params={{ id: String(m.id) }}>
                <div className="flex flex-col gap-2">
                  <img
                    className="object-cover aspect-[2/3] w-full rounded-md"
                    src={`https://image.tmdb.org/t/p/w500${m.poster_path}`}
                    alt={m.title}
                  />
                  <h1 className="text-xs">{m.title}</h1>
                </div>
              </Link>
            ) : null,
          )}
        </div>
      </section>
    </div>
  )
}
