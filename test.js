const hypeReduce = require('./lib/index').hypeReduce
const REPLACE = require('./lib/index').REPLACE
const dispatch = require('./lib/index').dispatch
const getStore = require('./lib/index').getStore

let initialState, reducer

console.log('TEST 1 - Basic State Change using REPLACE')
console.log('=========================================')

initialState = {
  greeting: 'hello'
}

reducer = {
  greeting: {
    REPLACE: REPLACE('greeting')
  }
}

hypeReduce(initialState, reducer)

console.log('Attempting state change...')

dispatch({
  type: 'REPLACE',
  location: 'greeting',
  payload: 'Yo sup'
})

console.log(JSON.stringify(getStore(), null, 2))

// -----

console.log('\n\n\n')
console.log('TEST 2 - State Changes in 2 nodes at once')
console.log('=========================================')
console.log('\n')
console.log('This test shows that where a node has multiple children,')
console.log('The dispatched action will flow into each child node.')
console.log('This allows nodes that represent the same piece of data to be updated simultaneously.')
console.log('\n')

initialState = {
  app: {
    header: {
      greeting: 'hello'
    },
    body: {
      greeting: 'hello'
    }
  }
}

reducer = {
  app: {
    header: {
      greeting: {
        REPLACE: REPLACE('greeting')
      }
    },
    body: {
      greeting: {
        REPLACE: REPLACE('greeting')
      }
    }
  }
}

hypeReduce(initialState, reducer)

console.log('Attempting state change...')

dispatch({
  type: 'REPLACE',
  location: 'greeting',
  payload: 'Yo sup'
})

console.log(JSON.stringify(getStore(), null, 2))