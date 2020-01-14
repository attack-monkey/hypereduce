# hypeReduce

Simple Functional State Management

```
npm i hypereduce
```

```
import { hypeReduce } from 'hypereduce'
```

------------------------------------------------------------

We believe that managing application state should be simple - yet powerful - and with all the safety features of functional reducer based state management.

That's why we built hypeReduce.

hypeReduce takes the initial state of an application along with a *dynamic state object* for managing state changes.

Under the hood, hypeReduce is built on the same reducer based structure inspired by Redux and Elm.

```javascript

import { dispatch, getStore, hypeReduce } from 'hypereduce'

// Set up your initial state
const initialState = {
  count: 0
}

// Add some basic reducer functions
const INC = state => state + 1
const DEC = state => state - 1

// Make state dynamic
const dynamicState = {
  count: {
    INC,
    DEC
  }
}

// Run hypeReduce
hypeReduce(initialState, dynamicState)

// Here's the initial state of count
console.log(getStore().count) // 0

dispatch({ type: 'INC' })

// After dispatching the INC action, it's now 1
console.log(getStore().count) // 1

dispatch({ type: 'DEC' })

// And now 0
console.log(getStore().count) // 0

```

## Making Reducers reusable

```javascript

const dynamicState = {
  count1: {
    INC_COUNT_1: INC,
    DEC_COUNT_1: DEC
  },
  count2: {
    INC_COUNT_2: INC,
    DEC_COUNT_2: DEC
  }
}

```


## $ Wildcards

Need to respond to any action at a given node? - use $ and pass into a Reusable Reducer

```javascript
...
field1: {
  text: {
    $: MY_REDUCER
  }
}
...

```

Now any actions that make their way to the node with a $ will automatically trigger the corresponding reducer.

## Passdowns

When a Reducer isn't triggered at a higher node, use _ to pass the action down into child nodes.

```javascript

field1: {
  DISABLE_FIELD,
  ENABLE_FIELD,
  _: {
    text: {
      CHANGE_TEXT,
      REVERSE_TEXT
    }
  }
}

```

## Connect

We can emit changes at a given node with the 'connect annotation'.

```javascript

const reducer = {
  field1: {
    text: {
      connect: 'field1Text',
      CHANGE_TEXT
    }
  }
}

// ... somewhere else in your app

import { connect } from 'hypereduce'

connect('field1Text', emittedValue => {
  console.log(emittedValue)
})

```

Now when an action is triggered on the above 'text' node, this will emit the new state to the `connect` listener.

Unlike 'subscribe' in other frameworks, `connect` can only be registered once on a given node. 

This is to reduce the panalty that exists in other frameworks when forgetting to unsubscribe from a subscribe (Such as memory leaks and multi-firing of functions).

In saying that we provide an `disconnect` function still for unregistering a connect.

```javascript
disconnect('field1Text')
```

## getConnectionsStore vs getStore

hypeReduce stores data in two ways:

1. As one state object that you can always get using `getStore()`

2. As a key / val map of connect annotations and the corresponding state at the given node. You can get this map with `getConnectionsStore()`

For example:

```javascript

const initialState = {
  allCounts: {
    count1: 22,
    count2: 42
  }
}

const dynamicState = ...
hypeReduce(initialState, dynamicState)

console.log(getStore().allCounts.count1) // 22

// And since we've annotated count1, we can just reference the 'count1' key using getConnectionsStore()
console.log(getConnectionsStore().count1) // 22

```

## React

Using with React ? We hope so...  
Take advantage of `useConnect` - a hypeReduce/react hook for managing connections

First add a 'connect' annotation at a given node

```javascript

field1: {
  text: {
    connect: 'field1Text',
    CHANGE_TEXT
  }
}

```

Then in the corresponding component, `useConnect` to listen for actions on that node

```jsx

import { useConnect } from 'hypereduce-useconnect'
import { getStore, dispatch } from 'hypereduce'

const Text = () => {
  const text = useConnect('field1Text')
  return (
    <div>
      <h1>{ text }</h1>
      <button onClick={ ev => dispatch(
        {
          type: 'CHANGE_TEXT',
          payload: 'New text'
        }
      )}>push</button>
    </div>
  )
}

```

> Note that `useConnect` is a separate package - that you can get with `npm i hypereduce-useconnect`
> And import with `import { useConnect } from 'hypereduce-useconnect'`

To wire up React + hypeReduce...

```javascript

import { initialState } from '...'
import { dynamicState } from '...'
import { hypeReduce } from 'hypereduce'
import ReactDOM from 'react-dom'

const mount = document.getElementById('app')

hypeReduce(initialState, dynamicState)

ReactDOM.render(
  Entry(),
  mount
)

```

## urlState

The state of the url is not forgotten in hypeReduce.

Upon initial load, the urlState is dispatched in a ROUTE_CHANGE action.

Whenever urlState changes, it also triggers a ROUTE_CHANGE action.

If the url was somesite.com/cats/123?filter=on&show=cute-cats then the action will look like...

```javascript

{
  type: 'ROUTE_CHANGE',
  segments: [
    '',
    'cats',
    '123'
  ],
  queryString: {
    filter: 'on',
    show: 'cute-cats'
  }
}

```

The url is spit into segments and any queryString parameters are exposed as a key / value map.

# goto

hypeReduce also provides the goto util which allows you to trigger a route change from a component.

```javascript

onClick={ () => goto('/cats') }

```

To create a link component, something like this should do the trick...

```javascript

const Link = ({ link, children }) =>
  <button onCick={ () => goto(link) }>{children}</button>

```

## Routing

Routing in hypeReduce is straight forward.

Lets say we have two views set up, and an initial state...

```javascript

  const view1 = 'Hi Im view 1'
  const view2 = 'Hi Im view 2'

  initialState = {
    view: {
      view1
    }
  }

```

We can create a simple Router Reducer that just changes the state to the new view.

```javascript

  const CHANGE_VIEW = (state, action) => {
    return (
      action.view === 'view2'
        ? { view2 }
        : { view1 }
    )
  }

```

The Dynamic State Object contains the CHANGE_VIEW Reducer that we created above.
Then in the passdown, we cater for both view1 and view2.

```javascript

  dynamicState = {
    view: {
      CHANGE_VIEW,
      _: {
        view1: {
          ...
        },
        view2: {
          ...
        }
      }
    }
  }

```

And to change views...

```javascript

dispatch({ type: 'CHANGE_VIEW', view: 'view2' })

```

If we wanted to based our routing on the ROUTE_CHANGE action we can modify to...

```javascript

  dynamicState = {
    view: {
      ROUTE_CHANGE: CHANGE_VIEW,
      _: {
        view1: {
          ...
        },
        view2: {
          ...
        }
      }
    }
  }

```

Now it calls CHANGE_VIEW whenever the ROUTE_CHANGE action is dispatched.

We can update our CHANGE_VIEW Reducer to use the urlState that is passed through on ROUTE_CHANGE.
For example...

```javascript

  const CHANGE_VIEW = (state, action) => {
    return (
      action.segments[1] === 'view2'
          ? { view2 }
          : { view1 }
    )
  }

```

## Reusability

hypeReduce is big on reusability.
By thinking of various parts of state as data-structures, we can often use the same Reducer Functions.
We provide a bunch of functions out-of-the-box to get you started.

```javascript
...
field1: {
  text: {
    // REPLACE
    REPLACE_FIELD1: REPLACE
  }
}
...
```

```javascript

// Replace text at field1
dispatch({
  type: 'REPLACE_FIELD1',
  payload: 'new text'
})

```

How about a collection of cats...

```javascript

const initialState = 
  cats: {
    byId: {
      cat1: {
        name: 'kitty'
      }
    },
    allIds: ['cat1']
  }

const dynamicState = {
  cats: {
    SET_CAT: SET,
    UPDATE_CAT: UPDATE,
    DELETE_CAT: DELETE
  }
}

// SET can be used to add new cats, or replace existing cats
dispatch({
  type: 'SET_CAT',
  id: 'cat2',
  payload: { name: 'garfield' }
})

// UPDATE allows you to specify a particular key of the collection item to update

dispatch({
  type: 'UPDATE_CAT',
  id: 'cat2',
  key: 'name',
  payload: 'garfield'
})

// DELETE allows you to well ... delete items

dispatch({
  type: 'DELETE_CAT',
  id: 'cat2'
})

```

## Dispatching multiple actions

Multiple Actions can be dispatched at once...

```javascript

dispatch(
  { type: 'ACTION1' },
  { type: 'ACTION2'}
)

```

All the actions will run in order before any state changes are emitted to `connect` listeners. 

## Asynchronous Actions

In hypeReduce - there should be NO asynchronous actions.
Reducers should be pure functions that return a response synchronously.

Asynchronous operations should be handled outside of hypeReduce.

A common way to do this is to call a sequence that dispatches actions at intervals in an async operation...

```javascript

const sequence = () => {
  dispatch({ type: 'START_ASYNC_OP' })
  setTimeout(() => dispatch({ type: 'MIDDLE_ASYNC_OP' }), 1000)
  setTimeout(() => dispatch({ type: 'FINISH_ASYNC_OP' }), 2000)
}

```

It is also common to use `connect` to listen to a state change, that then triggers a dispatch...

```javascript

connect(
  'some-node',
  newValue => {
    dispatch({ type: 'UPDATE_STATUS', status: 'done', value: newValue })
  }
)

```
