# hypeReduce 2.0

**hypeReduce is a Simple yet powerful State & Data-flow Management Library for the Browser & Node**

----

## The Concept
In hypeReduce everything is managed by dispatching either **flows** or **actions**, 
both of which are just pure data objects that look like

    {
      type: 'MY_FLOW',
      payload: 'Do cool stuff'
    }

**Actions** are responsible for safely updating application state.

**Flows** are responsible for managing any async and impure complexity such as fetching data.

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

To get the state of the counter out into our app somewhere, we first annotate it with **connections**...

```javascript

const INC = (state, action) => state + (action.payload || 1)

manageState({
  counter: d({
    connections: ['counter'],
    init: 1,
    actions: {
      INC
    }
  })
})

```

And then register corresponding connections to it from within the app...

```javascript

const INC = (state, action) => state + (action.payload || 1)

manageState({
  counter: d({
    connections: ['counter'],
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
    connections: ['counter'],
    init: 1,
    actions: {
      INC
    }
  })
})

connect('counter', _ => console.log(`Got a new value ${_}`))

dispatch({ type: 'INC' }) // Got a new value 2
dispatch({ type: 'INC', payload: 2 }) // Got a new value 4

```

## An intro to Flows

TODO

