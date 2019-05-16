import applicationEntity from "../entities/application"

export interface applicationCacheEntry {
  expiresAt: Date,
  data     : applicationEntity
}
