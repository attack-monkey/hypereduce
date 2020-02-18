# hypeReduce 2.0

**hypeReduce is a Simple yet Powerful State-management & Data-flow Library for the Browser & Node**

----

## The Concept

In hypeReduce everything is managed by dispatching either **flows** or **actions**, 
both of which are just pure data objects that look like

    {
      type: 'MY_FLOW',
      payload: 'Do cool stuff'
    }

**Actions** are responsible for updating application state **using pure functions**.

**Flows** are responsible for managing any async and impure complexity such as fetching data.

## Install

```

npm i hypereduce

```

hypeReduce is written in typescript - but can be used in js or ts 
Can be required or imported.

hypeReduce is broken into api's and standalone functions.

To access the api's...

```javascript

// API's

import { d, dispatch, manageState } from 'hypereduce/fns/state.api'     // For state management
import { goto, manageRoutes } from 'hypereduce/fns/route.api'           // For route-handling
import { registerFlowHandlers, sequence } from 'hypereduce/fns/flow.api'// For async and impure complexity

// Stand alone utils

import { pipe } from 'hypereduce/fns/pipe.fn'
import { display } from 'hypereduce/fns/display.fn'

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

## $ Wildcards

If you want a node to respond to any action that it recieves - use the `$` wildcard.

```javascript

const INC = state => state + 1

manageState({
  counter: d({
    connections: ['counter'],
    init: 1,
    $: INC
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

## Purity

HypReduce applications are built from:
1. Pure Functions and
2. Reactive Functions

**Pure functions** can only utilise the inputs provided to the function, along with 
any other pure functions.

- Given the same set of inputs Pure functions must always return the same result.
- They can't return a void.
- They cannot mutate anything, including the inputs.

The simplest pure function is one that takes no arguments and always produces the same result.

`const a = () => 3`
These are basically constants, and for that reason we can also use constants in a pure function.

We can also use pseudo-pure functions in place of pure functions to handle impurity. 
The most common example is the `display` function in hypeReduce. It takes an input and 
simply returns the input as a response. It satisfies all the requirements of being pure as far as 
a function using it is concerned. However under the hood, it is actually logging to the console 
which is an impure operation. We use `display` instead of `console.log` directly because `console.log`
is definitely impure. For a start it doesn’t return a response - just a void. Secondly it reaches 
outside of our function and into the console to print something. `display` adds an abstraction around that.

Anything outside of this is handled using Reactive Functions.

**Reactive Functions** allow values to be emitted into pure functions, therefore allowing pure functions 
to do the heavy lifting. We've already seen the `connect` function that listens for a change in state 
at a given node. Notice that it _emits_ values into a function. This is known as 'reactive' as it
reacts to changes.

Most other Reactive Functions in hypeReduce are used in the flow api, which is used to manage 
impure and asynchronous functionality.

## Flows for Async and Impure Data Management

To manage asynchronous and impure activity - use flows.

Register a flow...

```javascript

registerFlowHandlers({ MY_FLOW })

```

Dispatch a flow...

```javascript

dispatchFlow({ type: 'MY_FLOW' })

```

Connect Flows to sequences...

```javascript

const seq1 = sequence({
  fromRandom,                         // generate a random number and map it to the payload of the flow object
  map: map(v => Math.floor(v * 10)),  // Turn it into an int between 0 - 10
  updateType: updateType('INC'),      // Change the type of the flow object to INC
  wait: wait('2000'),                 // Wait for 2 seconds
  dispatchAsAction                    // dispatch the flow object as an action
})

const MY_FLOW = seq1

// Now when we dispatch a flow of MY_FLOW, the flow object will be passed through to the
// above sequence.

```

## Sequences

Sequences are like an asynchronous pipe function. 
Each function or step in the sequence takes the previous flow object.
The flow doesn't move on until the step is complete.
