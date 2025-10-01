import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'
import { authTables } from '@convex-dev/auth/server'

export default defineSchema({
  ...authTables,

  watchlist: defineTable({
    userId: v.id('users'),
    tmdbId: v.string(),
    rating: v.number(),
    title: v.string(),
    posterPath: v.string(),
    overview: v.string(),
    releaseDate: v.string(),
    genres: v.array(v.object({ name: v.string(), id: v.number() })),
    runtime: v.number(),
  }).index('by_user', ['userId']),
})
