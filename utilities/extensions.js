import { capitalise } from './string.js'

export function getTitle() {
  let paths = this.$route.path.split('/').filter(x => x.length).map(x => capitalise(x))
  let title = ''

  if (paths.length) {
    title += ` ${paths.join(" - ")}`
  }
  return title
}