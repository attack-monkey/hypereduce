import { apply } from './apply.fn'
import { keys } from './keys.fn'

export interface Action { type: string, [key: string]: any }

const subs = {}
let store
let reducer

export const getStore = () => store

export const connect = (key: string, fn) => { subs[key] = fn }

export const dispatch = (action: Action) => {
  store =
    hypeReduceCore(store, action)(reducer)
}

export const goto = path => {
  history.pushState(undefined, '', path)
  dispatch({ ...returnRouteObject(), type: 'ROUTE_CHANGE' })
  window.scrollTo(0, 0)
}

export const hypeReduce = (init: any, reduceObject: any) => {
  manageRoutes()
  store = init
  reducer = reduceObject
  dispatch({ type: 'ROUTE_CHANGE', ...returnRouteObject() })
}

export const hypeReduceCore = <S, A extends Action>
  (state: S, action: A, pKey: string | undefined = undefined) =>
    (mirror: Record<string, any>) =>
      isObject(mirror)
        ? mainReducer(state, action, pKey)(mirror)
        : die(
          `Each level of the reducer pattern must be an object. Instead ${pKey || 'root reducer'} recieved ${pretty(mirror)}.\nThis can occur: \n- when a reducer has not been assigned an object`
        )

const mainReducer = <S, A extends Action>
  (state: S, action: A, pKey: string | undefined = undefined) =>
  (mirror: Record<string, any>) =>
    apply(
      keys(mirror).reduce((ac, key) =>
        apply(itemIs(state, key, mirror, action), itemType =>
          ac.instruction === 'stop'
            ? ac
            : itemType === 'connector'
              ? { newState: ac.newState, instruction: 'keep-going' }
              : itemType === 'passiveConnector'
                ? { newState: ac.newState, instruction: 'stop' }
                : itemType === 'dormant-action'
                  ? { newState: ac.newState, instruction: 'keep-going' }
                  : itemType === 'active-action'
                    ? { newState: routeOnItem(itemType)(state, key, mirror, action, pKey), instruction: 'stop' }
                    : {
                      newState: Object.assign(
                        {},
                        ac.newState,
                        routeOnItem(itemType)(state, key, mirror, action, pKey)
                      ),
                      instruction: 'keep-going'
                    }
        )
        , { newState: state, instruction: 'keep-going' }
      )
      , res => {
        const connector = mirror.connect || mirror.passiveConnect
        if (res.instruction === 'stop' && connector && subs[connector]) {
          setTimeout(
            () => subs[connector](res.newState),
            0
          )
        }
        return res.newState
      }
      )

const itemIs =
  <S, A extends Action>(state: S, key: string, mirror: any, action: A) =>
    apply(
      key === 'connect'
        ? 'connector'
        : key === 'passiveConnect'
          ? 'passiveConnector'
          : key === '$'
            ? 'active-action'
            : state[key] !== undefined
              ? 'reducer'
              : key === '_'
                ? 'passThrough'
                : typeof mirror[key] === 'function' && key === action.type
                  ? 'active-action'
                  : typeof mirror[key] === 'function'
                    ? 'dormant-action'
                    : 'other'
      , (itemType: ItemType) =>
        itemType
    )

type ItemType = 'reducer' | 'passThrough' | 'connector' | 'passiveConnector' | 'active-action' | 'dormant-action' | 'other'
const routeOnItem = (itemType: ItemType) =>
  <S, M, A extends Action>(state: S, key: string, mirror: M, action: A, pKey: string | undefined) =>
    itemType === 'reducer'
      ? { [key]: hypeReduceCore(state[key], action, key)(mirror[key]) }
      : itemType === 'passThrough'
        ? hypeReduceCore(state, action, pKey)(mirror[key])
        : itemType === 'active-action'
          ? handleAction(action, state, key, mirror[key])
          : isObject(state) && keys(state as any).length > 0
            ? die(`${key} must either be bound to an action-function or be one of the following: ${keys(state as any).join(', ')}`)
            : die(`${key} must be bound to an action-function`)

const handleAction =
  <A extends Action, S>(action: A, state: S, key: string | undefined, fn: any) => fn(state, action)

const manageRoutes = () => {
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

const returnRouteObject = () => {
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

const die = (input: string) => { throw new Error('hypeReduce ERROR:\n' + input) }

const pretty = input => JSON.stringify(input, null, 2)

const isObject = (input: any) => typeof input === 'object' && !Array.isArray(input)
