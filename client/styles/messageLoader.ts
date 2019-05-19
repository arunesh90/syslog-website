import { SerializedStyles, css } from "@emotion/core"

export const recentLoaderOverride = css(`
  justify-content: center;
  position       : absolute;
  top            : 50%;
  left           : 50%;
  transform      : translate(-50%, -50%);
`) as (SerializedStyles & string)

export const olderLoaderOverride = css(`
  justify-content: center;
  position       : relative;
  top            : 1rem;
  left           : 50%;
  transform      : translate(-50%, -50%);
  text-align     : center;
`) as (SerializedStyles & string)
