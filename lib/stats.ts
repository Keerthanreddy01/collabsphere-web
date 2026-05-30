/**
 * stats.ts
 * Centralized service for fetching live platform statistics from Firebase Firestore.
 * All metrics are fetched from the database — no hardcoded values.
 */

import { db } from './firebase'
import {
  collection,
  getCountFromServer,
  query,
  where,
  getDocs,
} from 'firebase/firestore'

export interface PlatformStats {
  activeBuilders: number
  projectsLaunched: number
  openCollabRequests: number
  teamsFormed: number
  discussionsCreated: number
  countriesRepresented: number
}

/**
 * Sanitizes a raw count from Firestore aggregate queries.
 * getCountFromServer() returns -1 as a sentinel value when Firestore
 * security rules block unauthenticated access without throwing an error.
 * We always clamp to >= 0 to avoid displaying negative numbers in the UI.
 */
function safeCount(raw: number | null | undefined): number {
  if (typeof raw !== 'number' || !isFinite(raw) || raw < 0) return 0
  return Math.floor(raw)
}

/**
 * Fetches the count of unique country/location entries from builder_profiles.
 * The `location` field is a free-form string (e.g. "San Francisco, CA" or "India").
 * We treat each unique non-empty location string as a distinct region.
 * For a better "countries" count we extract the last comma-separated segment
 * which typically represents the country or state.
 */
async function fetchCountriesRepresented(): Promise<number> {
  try {
    const snapshot = await getDocs(collection(db, 'builder_profiles'))
    const locationSet = new Set<string>()
    snapshot.forEach((doc) => {
      const data = doc.data()
      const rawLocation: string = (data.location ?? '').trim()
      if (!rawLocation) return
      // Extract last segment after the last comma — usually the country/region
      const parts = rawLocation.split(',')
      const country = parts[parts.length - 1].trim().toLowerCase()
      if (country) locationSet.add(country)
    })
    return locationSet.size
  } catch {
    return 0
  }
}

/**
 * Fetches all six platform metrics in parallel, minimising round-trips.
 * Uses `getCountFromServer` for collections that only need a count (O(1) reads).
 * All returned values are sanitized — negative / -1 sentinel values become 0.
 */
export async function fetchPlatformStats(): Promise<PlatformStats> {
  // Guard: if Firebase is not initialised (missing env vars), return zeros
  if (!db) {
    return {
      activeBuilders: 0,
      projectsLaunched: 0,
      openCollabRequests: 0,
      teamsFormed: 0,
      discussionsCreated: 0,
      countriesRepresented: 0,
    }
  }

  try {
    const collabQuery = query(
      collection(db, 'posts'),
      where('post_type', '==', 'looking_for')
    )

    const [
      buildersSnap,
      projectsSnap,
      collabSnap,
      teamsSnap,
      discussionsSnap,
      countriesCount,
    ] = await Promise.all([
      getCountFromServer(collection(db, 'builder_profiles')),
      getCountFromServer(collection(db, 'projects')),
      getCountFromServer(collabQuery),
      getCountFromServer(collection(db, 'spaces')),
      getCountFromServer(collection(db, 'posts')),
      fetchCountriesRepresented(),
    ])

    return {
      activeBuilders:       safeCount(buildersSnap.data().count),
      projectsLaunched:     safeCount(projectsSnap.data().count),
      openCollabRequests:   safeCount(collabSnap.data().count),
      teamsFormed:          safeCount(teamsSnap.data().count),
      discussionsCreated:   safeCount(discussionsSnap.data().count),
      countriesRepresented: safeCount(countriesCount),
    }
  } catch (error) {
    console.error('[CollabSphere] Failed to fetch platform stats:', error)
    return {
      activeBuilders: 0,
      projectsLaunched: 0,
      openCollabRequests: 0,
      teamsFormed: 0,
      discussionsCreated: 0,
      countriesRepresented: 0,
    }
  }
}
