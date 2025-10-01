import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { StarIcon } from '../lib/icons'

export const Route = createFileRoute('/watchlist')({
  component: RouteComponent,
})

function RouteComponent() {
  const data = useQuery(api.watchlist.getWatchList)

  if (!data) return <div>Loading...</div>

  console.log(data)

  return (
    <ul className="text-muted-foreground space-y-4">
      <div className='font-medium text-base'>{data.length} titles</div>
      {data.map((item) => (
        <li key={item._id}>
          <div className="flex gap-4">
            <div>
              <img
                src={`https://image.tmdb.org/t/p/w500${item.posterPath}`}
                alt={item.title}
                className="w-[100px] rounded-md"
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                <StarIcon width={16} height={16} />
                <div>{item.rating}</div>
              </div>

              <div className="text-lg font-bold text-white unbounded">
                {item.title}
              </div>

              <div className="text-ring text-sm font-semibold">
                <div className="flex gap-2">
                  <div>{item.releaseDate}</div>
                  <div>{item.runtime} mins</div>
                </div>
                <div className="flex flex-col">
                  <div>{item.genres.map((genre) => genre.name).join(', ')}</div>
                </div>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
