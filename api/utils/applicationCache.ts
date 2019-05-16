import applicationEntity from "../../entities/application"
import { applicationCacheEntry } from "../../types/cache"
import { getRepository } from "typeorm"

const applicationCache: {[key: number]: applicationCacheEntry} = {}

export const getById = async (id: number): Promise<applicationEntity | null> => {
  // Check first if there's a valid cache entry still
  const cachedApp = applicationCache[id]
  if (cachedApp && cachedApp.expiresAt.getTime() > Date.now()) {
    return cachedApp.data
  }

  // Fetch it from the database if no entry or is expired
  const applicationRepo = getRepository(applicationEntity)
  const application     = await applicationRepo.findOne({
    id
  })

  if (application) {
    applicationCache[id] = {
      expiresAt: new Date(Date.now() + (1000 * 60 * 15)),
      data: application
    }

    return application
  }

  return null
}