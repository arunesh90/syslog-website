import { SerializedStyles, css } from "@emotion/core"

export const recentLoaderOveride = css(`
  justify-content: center;
  position       : absolute;
  top            : 50%;
  left           : 50%;
  transform      : translate(-50%, -50%);
`) as (SerializedStyles & string)

export const olderLoaderOveride = css(`
  justify-content: center;
  position       : relative;
  top            : 1rem;
  left           : 50%;
  transform      : translate(-50%, -50%);
  text-align     : center;
`) as (SerializedStyles & string)
