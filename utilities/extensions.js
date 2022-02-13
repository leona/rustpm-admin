import { capitalise } from './string.js'

export function getTitle() {
  let paths = this.$route.path.split('/').filter(x => x.length).map(x => x.toUpperCase())
  let title = ''

  if (paths.length) {
    title += ` ${paths.join(" - ")}`
  }
  return title
}