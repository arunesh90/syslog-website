import { readdirSync } from "fs"
import { join, extname } from "path"

function loadDirScripts<scriptType> (dirname: string, pathName: string) {
  let scripts: {[key: string]: scriptType} = {}

  const joinedPath = join(dirname, pathName)
  readdirSync(joinedPath).forEach(scriptName => {
    if (['.js', '.ts'].includes(extname(scriptName))) {
      scripts[scriptName.replace(/\.[^/.]+$/, '')] = (require(join(joinedPath, scriptName))).default
    }
  })

  return scripts
}

export default loadDirScripts
