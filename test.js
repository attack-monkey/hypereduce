const hypeReduce = require('./lib/index').hypeReduce
const REPLACE = require('./lib/index').REPLACE
const dispatch = require('./lib/index').dispatch
const getStore = require('./lib/index').getStore
const connect = require('./lib/index').connect
const hash = require('object-hash')

const tick = (fn) => setTimeout(fn, 0)
const testSubs = {}
const on = (key, fn) => testSubs[key] = fn
const next = key => testSubs[key]()

let initialState, reducer, syncFn, asyncFn

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

// -----

console.log('\n\n\n')
console.log('TEST 3 - State Change in master node - triggers hash update in slave nodes')
console.log('==========================================================================')
console.log('\n')
console.log('This test shows how you can have a single-source-of-truth node, ')
console.log('along with slave nodes that recieve a hash of the data.')
console.log('The changes in the hash are emitted and then dispatched to the slave nodes')
console.log('\n')


initialState = {
  app: {
    greeting: {
      tone: 'polite',
      words: 'hello world'
    }
  },
  view: {
    header: {
      greeting: 'init'
    },
    body: {
      greeting: 'init'
    }
  }
}

syncFn = (key, state, action) =>
  action.location === key
    ? REPLACE(key)(state, action)
    : state

asyncFn = () =>
  connect('greetingHashGen', newValue =>
    dispatch({
      type: 'REPLACE',
      location: 'greeting-hash',
      payload: hash(newValue)
    })
  )

let REPLACE_AND_EMIT_HASH = (key) => (state, action) => {
  asyncFn(key, state, action)
  return syncFn(key, state, action)
}

reducer = {
  app: {
    greeting: {
      connect: 'greetingHashGen',
      REPLACE_AND_EMIT_HASH: REPLACE_AND_EMIT_HASH('greeting')
    }
  },
  view: {
    header: {
      greeting: {
        REPLACE: REPLACE('greeting-hash')
      }
    },
    body: {
      greeting: {
        REPLACE: REPLACE('greeting-hash')
      }
    }
  }
}

hypeReduce(initialState, reducer)

console.log('Attempting state change...')

dispatch({
  type: 'REPLACE_AND_EMIT_HASH',
  location: 'greeting',
  payload: {
    tone: 'cool',
    words: 'yo sup'
  }
})

// Console log after completing the current event queue
setTimeout(() => {
  console.log(JSON.stringify(getStore(), null, 2))
  next('test4')
}, 0)

// -----

on('test4', () => {
  console.log('\n\n\n')
  console.log('TEST 4 - State Change in master node - triggers increment update in slave nodes')
  console.log('==========================================================================')
  console.log('\n')
  console.log('Similar to test above, however slave nodes just get an incremented version')
  console.log('that keeps them in sync')
  console.log('\n')
  
  
  initialState = {
    app: {
      greeting: {
        tone: 'polite',
        words: 'hello world',
        version: 1
      }
    },
    view: {
      header: {
        greeting: 1
      },
      body: {
        greeting: 1
      }
    }
  }
  
  syncFn = (key, state, action) =>
    action.location === key
      ? REPLACE(key)(state, action)
      : state
  
  asyncFn = () =>
    connect('greetingVersion', newValue =>
      dispatch({
        type: 'REPLACE',
        location: 'greeting-ref',
        payload: newValue.version
      })
    )
  
  let REPLACE_AND_EMIT_VERSION = (key) => (state, action) => {
    asyncFn(key, state, action)
    return syncFn(key, state, action)
  }
  
  reducer = {
    app: {
      greeting: {
        connect: 'greetingVersion',
        REPLACE_AND_EMIT_VERSION: REPLACE_AND_EMIT_VERSION('greeting')
      }
    },
    view: {
      header: {
        greeting: {
          REPLACE: REPLACE('greeting-ref')
        }
      },
      body: {
        greeting: {
          REPLACE: REPLACE('greeting-ref')
        }
      }
    }
  }
  
  hypeReduce(initialState, reducer)
  
  console.log('Attempting state change...')
  
  dispatch({
    type: 'REPLACE_AND_EMIT_VERSION',
    location: 'greeting',
    payload: {
      tone: 'cool',
      words: 'yo sup',
      version: getStore().app.greeting.version + 1
    }
  })
  
  // Console log after completing the current event queue
  setTimeout(() => {
    console.log(JSON.stringify(getStore(), null, 2))
    next('test5')
  }, 0)
})

on('test5', () => {
  console.log('TEST 5 - Multiple actions')
  console.log('=========================================')

  initialState = {
    greeting: 'hello'
  }

  reducer = {
    greeting: {
      connect: 'greetingTest5',
      REPLACE: REPLACE('greeting')
    }
  }

  hypeReduce(initialState, reducer)

  console.log('Attempting 2 state changes...')

  connect('greetingTest5', newValue => {
    console.log(JSON.stringify(newValue, null, 2))
  })

  dispatch({
    type: 'REPLACE',
    location: 'greeting',
    payload: 'Yo sup'
  }, {
    type: 'REPLACE',
    location: 'greeting',
    payload: 'Hola'
  })

  tick(() => next('test6'))

})

//-----

on('test6', () => {
  console.log('TEST 6 - Multiple actions')
  console.log('=========================================')

  initialState = {
    greeting: 'hello'
  }

  let ACTION1 = (state, action) => 'fetched'

  let ACTION1_ASYNC = (state, action) => {
    setTimeout(() => dispatch({ type: 'ACTION1' }), 200 )
    return 'fetching'
  }

  reducer = {
    greeting: {
      connect: 'asyncGreeting',
      ACTION1_ASYNC,
      ACTION1
    }
  }

  hypeReduce(initialState, reducer)

  console.log('Attempting async state changes...')

  connect('greetingTest6', newValue => {
    console.log(JSON.stringify(newValue, null, 2))
  })

  dispatch({
    type: 'ACTION1_ASYNC'
  })

})
