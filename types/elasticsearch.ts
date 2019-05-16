export interface searchResult {
  took     : number,
  timed_out: boolean,
  _shards: {
    total     : number,
    successful: number,
    skipped   : number,
    failed    : number
  },
  hits: {
    total: {
      value   : number,
      relation: string
    },
    max_score: number,
    hits: {
      _id   : string | number,
      _index: string,
      _score: number | null,
      _type : string,
      _source: {
        [key: string]: any
      }
    }[]
  }
}
