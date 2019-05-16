import ioredis from 'ioredis'

const { REDIS_HOST } = process.env

export default new ioredis(process.env.REDIS_HOST)
export const pubsub = new ioredis(REDIS_HOST)
