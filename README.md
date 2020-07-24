# hypeReduce 3.0

**hypeReduce is a simple yet powerful State-Management Library for JS / TS - Browser & Node**

----

## The Concept

In hypeReduce everything is managed by dispatching either **actions**, 
both of which are just pure data objects that look like

    {
      type: 'MY_FLOW',
      payload: 'Do cool stuff'
    }

**Actions** are responsible for updating application state **using pure functions**.

## Install

```

npm i hypereduce

```

hypeReduce is broken into 2 main apis; state and route.

The state.api manages state

The route api manages url routes and interacts with the state.api

```javascript

// API's

import { d, dispatch, manageState } from 'hypereduce/fns/state.api'     // For state management
import { goto, manageRoutes } from 'hypereduce/fns/route.api'           // For route-handling

...

```

## An intro to State Management

Let's say our application state looks like...

    {
      counter: 1
    }

In order for hypeReduce to manage it, we wrap it in the manageState function...

```javascript

manageState({
  counter: 1
})

```

hypeReduce lets you turn static state into dynamic state by swapping out values for dynamic-nodes. 
We'll swap the value of 1 for a dynamic-node...

```javascript

manageState({
  counter: d()
})

```

And give it an initial value of 1...

```javascript

manageState({
  counter: d({
    init: 1
  })
})

```

And tell it which actions to respond to in order to produce new state

```javascript

// The following increment function takes in state and action and returns
// either state + action.payload, or if action.payload isn't provided... state + 1
const INC = (state, action) => state + (action.payload || 1)

// We can register the INC function on a dynamic-node.
// Now the node is 'listening' for actions of type 'INC'.
manageState({
  counter: d({
    init: 1,
    actions: {
      INC
    }
  })
})

```

To get the state of the counter out into our app somewhere, we first annotate it with **connects**...

```javascript

const INC = (state, action) => state + (action.payload || 1)

manageState({
  counter: d({
    connects: ['counter'],
    init: 1,
    actions: {
      INC
    }
  })
})

```

And then register corresponding connects to it from within the app...

```javascript

const INC = (state, action) => state + (action.payload || 1)

manageState({
  counter: d({
    connects: ['counter'],
    init: 1,
    actions: {
      INC
    }
  })
})

connect('counter', _ => console.log(`Got a new value ${_}`))

```

Now we can dispatch actions and trigger the connection to fire with the updated value...

```javascript

const INC = (state, action) => state + (action.payload || 1)

manageState({
  counter: d({
    connects: ['counter'],
    init: 1,
    actions: {
      INC
    }
  })
})

connect('counter', _ => display(`Got a new value ${_}`)) // Got a new value 1
dispatch({ type: 'INC' }) // Got a new value 2
dispatch({ type: 'INC', payload: 2 }) // Got a new value 4

```

At the moment though, if we had two nodes listening for `INC` then both nodes would increment.
To make actions more targeted, use the node's name as an id that can be targeted...

```javascript

const INC =
  (id) =>
    (state, action) =>
      id === action.payload.id
        ? state + (action.payload.by || 1)
        : state

manageState({
  counter: d({
    connects: ['counter'],
    init: 1,
    actions: {
      INC: INC('counter')
    }
  })
})

connect('counter', _ => display(`Got a new value ${_}`)) // Got a new value 1
dispatch({ type: 'INC', payload: { id: 'counter' } }) // Got a new value 2
dispatch({ type: 'INC', payload: { id: 'counter', by: 2 } }) // Got a new value 4

```

## $ Wildcards

If you want a node to respond to ALL actions that it recieves - use the `$` wildcard.

```javascript

const INC = state => state + 1

manageState({
  counter: d({
    connections: ['counter'],
    init: 1,
    $: INC('counter')
  })
})

connect('counter', _ => display(`Got a new value ${_}`))
dispatch({ type: 'ANY_ACTION' }) // Got a new value 2
dispatch({ type: 'AND_ANOTHER' }) // Got a new value 3

```

## _ Passdowns

Let's say you have a dynamic-node that is an object. 
And let's say you want to be able to respond to actions at the full object level, 
but also at lower-down nodes...

No problem - use the `_` passdown.

```javascript


manageState({
  field1: d({
    connects: ['field1'],
    init: { text: 'hello', enabled: true },
    actions: {
      DISABLE_FIELD1,
      ENABLE_FIELD1
    },
    _: {
      text: d({
        actions: {
          SET_TEXT_FIELD_ONE
        }
      }),
      enabled: d({}) // we can just set this to an empty object to pass back the current state
    }
  })
})

```

## And Remember ... State is composable

```javascript

const field1 = d({
  connects: ['field1'],
  init: { text: 'hello', enabled: true },
  actions: {
    DISABLE_FIELD1,
    ENABLE_FIELD1
  },
  _: {
    text: d({
      actions: {
        SET_TEXT_FIELD_ONE
      }
    }),
    enabled: d({})
  }
})

const field2 = ...

manageState({
  view1: {
    field1,
    field2
  }
})

```

## Type-Safety with Typescript

Here we are explicitly stating that field 1 is an object with keys `text` and `enabled`.
`text` is either a string or a _dynamic-state-node_ of type string.
`enabled` is either a boolean or a _dynamic-state-node_ of type boolean.

We can also specify the type that we expect the `connect`ion to get within the app.

```typescript

  manageState({
    field1: d<{text: (string | DStateNode<string>), enabled: (boolean | DStateNode<boolean>) }>({
      connects: ['field1'],
      init: { text: 'hello', enabled: true },
      actions: {
        DISABLE_FIELD1,
        ENABLE_FIELD1
      },
      _: {
        text: d<string>({
          actions: {
            SET_TEXT_FIELD_ONE
          }
        }),
        enabled: d({}) // we can just set this to an empty object to pass back the current state,
      }
    })
  })

  connect<{text: string, enabled: boolean }>('field1', _ => display(`GOT VALUE OF ${pretty(_)}`))
  dispatch({ type: 'SET_FIELD1', payload: 'YO!' })
  dispatch({ type: 'DISABLE_FIELD1' })

```

## Connecting to React

In a state directory...

```typescript


import { d, manageState, getConnections, connect, disconnect } from 'hypereduce/lib/fns/state.api'
import { useState, useEffect } from 'react'

const INC =
  (id: string) =>
    (state: number, action: { type: string, payload: { id: string, by: number }}) =>
      id === action.payload.id
        ? state + (action.payload.by || 10)
        : state

// useConnect for REACT + HypeReduce

export const useConnect = (connectKey: string) => {
  const [state, setState] = useState(getConnections(connectKey))
  useEffect(() =>
    connect(connectKey, newValue => {
      setState(newValue)
      return disconnect(connectKey)
    })
  )
  return state
}

// HypeReduce State

export const hypeReduce = () => manageState({
  count: d<number>({
    init: 3,
    connects: [ 'count' ],
    actions: {
      INC: INC('count')
    }
  })
})

```

Consider wrapping dispatches into simple messages...

```typescript

import { dispatch } from "hypereduce/lib/fns/state.api";

export const INC_COUNT = () => dispatch({ type: 'INC', payload: { id: 'count' } })

```

Then in your components...

```typescript

import { hypeReduce, useConnect } from '../state'
import { INC_COUNT } from '../state/messages'

hypeReduce()

export default function Home() {
  const count = useConnect('count') // This syncs to the HypeReduce 'connect' labelled 'count'
  return <div id="app">
    <h1>Counter</h1>
    <h1>{count}</h1>
    <button onClick={INC_COUNT}>
      Click me
    </button>
  </div>
}


```