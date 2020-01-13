const hypeReduce = require('./lib/index').hypeReduce
const REPLACE = require('./lib/index').REPLACE
const SET = require('./lib/index').SET
const UPDATE = require('./lib/index').UPDATE
const DELETE = require('./lib/index').DELETE
const dispatch = require('./lib/index').dispatch
const getStore = require('./lib/index').getStore
const connect = require('./lib/index').connect
const disconnect = require('./lib/index').disconnect
const getReducer = require('./lib/index').getReducer
const getConnectionsStore = require('./lib/index').getConnectionsStore
const hash = require('object-hash')

const CONSTANT = state => state

const tick = (fn) => setTimeout(fn, 0)
const testSubs = {}
const on = (key, fn) => testSubs[key] = fn
const next = key => testSubs[key]()
const start = key => tick(() => next(key))

let initialState, reducer, syncFn, asyncFn

start('test3')

on('test1', () => {

  console.log('TEST 1 - Basic State Change using REPLACE')
  console.log('=========================================')

  initialState = {
    greeting: 'hello',
    anotherThing: 'I\'m a thing'
  }

  reducer = {
    greeting: {
      REPLACE_GREETING: REPLACE
    },
    anotherThing: {
      REPLACE_THING: REPLACE
    }
  }

  hypeReduce(initialState, reducer)

  console.log('Attempting state change...')

  dispatch({
    type: 'REPLACE_GREETING',
    payload: 'Yo sup'
  })

  console.log(JSON.stringify(getStore(), null, 2))

  start('test2')
})

// -----

on('test2', () => {

  console.log('TEST 2 - Data node + Satellite nodes, using baked in action-functions')
  console.log('=========================================')

  initialState = {
    data: {
      cats: {
        byId: {
          cat1: {
            name: 'kitty'
          }
        },
        allIds: ['cat1']
      },
      selectedCat: 'cat1'
    },
    view: {
      cats: true
    }
  }

  reducer = {
    data: {
      cats: {
        SET_CAT: SET,
        UPDATE_CAT: UPDATE,
        DELETE_CAT: DELETE,
      },
      selectedCat: {
        SELECT_CAT: REPLACE
      }
    },
    view: {
      cats: {
        connect: 'cat_sat1',
        SET_CAT: CONSTANT,
        UPDATE_CAT: CONSTANT,
        DELETE_CAT: CONSTANT
      }
    }
  }

  hypeReduce(initialState, reducer)

  connect('cat_sat1', () => {
    const selectedCatId = getStore().data.selectedCat
    const selectedCat = getStore().data.cats.byId[selectedCatId]
    console.log(selectedCat)
  })

  setTimeout(() => dispatch({
    type: 'SET_CAT',
    id: 'cat2',
    payload: {
      name: 'garfield'
    }
  }), 10)

  setTimeout(() => dispatch({
    type: 'UPDATE_CAT',
    id: 'cat2',
    key: 'name',
    payload: 'odie'
  }), 1000)

  setTimeout(() => {
    dispatch(
      {
        type: 'DELETE_CAT',
        id: 'cat1'
      },
      {
        type: 'SELECT_CAT', payload: 'cat2'
      }
    )
  } , 2000)

  setTimeout(() => start('test3'), 3000)

})

// -----

on('test3', () => {
  console.log('TEST 3 - Using Connect to get current value')
  console.log('=========================================')

  initialState = {
    greeting: 'hello'
  }

  reducer = {
    greeting: {
      connect: 'greeting',
      REPLACE_GREETING: REPLACE
    }
  }

  hypeReduce(initialState, reducer)

  // Instead of using getStore() with long dot notation we can just use getConnectionsStore with the name of the connection
  const greeting = () => getConnectionsStore().greeting

  // Should say hello
  console.log(greeting())

  // Should connect up to changes and log on change
  connect('greeting', newValue => console.log(newValue))

  // This should trigger the change
  dispatch({ type: 'REPLACE_GREETING', payload: 'sup' })

  // This should log the updated value too
  console.log(greeting())

})