import { Profile } from "passport-github"

export default interface userSession {
  isAuthenticated: boolean,
  user           : {
    id            : number,
    githubId      : string,
    githubUsername: string,
    profile       : Profile,
    github        : {
      login     : string,
      id        : number,
      avatar_url: string,
      name      : string,
      location  : string,
      email     : string
    }
  } | null
}
