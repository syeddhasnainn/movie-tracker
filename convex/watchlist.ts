import { v } from 'convex/values'
import { mutation, query } from './_generated/server'
import { getAuthUserId } from '@convex-dev/auth/server'

export const getWatchList = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) {
      throw new Error('User not authenticated')
    }

    return await ctx.db
      .query('watchlist')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect()
  },
})

export const isInWatchList = query({
  args: {
    tmdbId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) {
      return null
    }

    const isAdded = ctx.db
      .query('watchlist')
      .filter((q) => q.eq(q.field('tmdbId'), args.tmdbId))
      .first()

    return isAdded
  },
})

export const add = mutation({
  args: {
    tmdbId: v.string(),
    rating: v.number(),
    title: v.string(),
    posterPath: v.string(),
    overview: v.string(),
    releaseDate: v.string(),
    genres: v.array(v.object({ name: v.string(), id: v.number() })),
    runtime: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)

    if (!userId) {
      throw new Error('User not authenticated')
    }

    return await ctx.db.insert('watchlist', {
      userId,
      tmdbId: args.tmdbId,
      rating: args.rating,
      title: args.title,
      posterPath: args.posterPath,
      overview: args.overview,
      releaseDate: args.releaseDate,
      genres: args.genres,
      runtime: args.runtime,
    })
  },
})
