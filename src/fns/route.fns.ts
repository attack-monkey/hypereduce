
/**
 * A group of functions responsible for managing route-changes and integrating them into
 * application state.
 *
 */

import { dispatch } from './state.fns'

export const goto = path => {
  history.pushState(undefined, '', path)
  dispatch({ ...returnRouteObject(), type: 'ROUTE_CHANGE' })
  window.scrollTo(0, 0)
}

export const manageRoutes = () => {
  // dispatch the current route
  dispatch({ type: 'ROUTE_CHANGE', ...returnRouteObject() })
  try {
    if (window) {
      // on pop state
      window.onpopstate = () => {
        dispatch({ ...returnRouteObject(), type: 'ROUTE_CHANGE'})
        window.scrollTo(0, 0)
      }
      // on hash change
      window.onhashchange = () => {
        dispatch({ ...returnRouteObject(), type: 'ROUTE_CHANGE'})
        window.scrollTo(0, 0)
      }
    }
  } catch (e) { /* no window */ }
}

const getSearchFromHash = hash => {
  const hashMatchArray = hash.match(/\?[^]*/)
  return hashMatchArray && Array.isArray(hashMatchArray) ? hashMatchArray[0] : undefined
}

const extractQueryString = (input: string) => {
  try {
    return (
      input
        .match(/(&|\?)[^&]*|(&|\?)[^\n]/g)
          || []
      )
      .map(qs => qs.replace(/\?|&/g, ''))
      .reduce(
        (ac, qs) =>
          Object.assign({}, ac, { [qs.split('=')[0]]: qs.split('=')[1] }),
        {}
      )
  } catch (e) {
    return undefined
  }
}

const extractQueryStringFromSearch = () => (() => {
  try { return extractQueryString(window.location.search) } catch (e) { return ''}
})()
const extractQueryStringFromHash = () => (() => {
  try { return extractQueryString(getSearchFromHash(window.location.hash))} catch (e) { return '' }
})()
const queryString = () => extractQueryStringFromSearch() || extractQueryStringFromHash()

export const returnRouteObject = () => {
  const pathArrayStep1 = (() => { try { return window.location.pathname.split('/') } catch (e) { return [] }})()
  const lastKey = pathArrayStep1.length - 1
  // if last path array item is '' then remove it
  const pathArrayStep2 = pathArrayStep1[lastKey] === '' ? pathArrayStep1.slice(0, lastKey) : pathArrayStep1

  const hashArrayStep1 = (() => { try { return window.location.hash } catch (e) { return ''} })()
    .replace(/\?[^]*/, '')
    .replace('#/', '')
    .split('/')
  const hashArrayStep2 =
    hashArrayStep1.length === 1 && hashArrayStep1[0] === ''
      ? []
      : hashArrayStep1
  const segments = pathArrayStep2.concat(hashArrayStep2)
  return {
    segments,
    queryString: queryString()
  }
}
