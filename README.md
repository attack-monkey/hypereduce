# hypeReduce
State management without the boilerplate

```
npm i hypereduce
```

```
import { hypeReduce } from 'hypereduce'
```

------------------------------------------------------------

We believe that managing application state should be simple - yet powerful.
That's why we built hypeReduce.

hypeReduce takes the initial state of an application along with a reducer for managing state changes.

```javascript

hypeReduce(initialState, reducer)

```

consider:

Our application state looks like

```javaScript

const initialState = {
  view: {
    ui: {
      field1: {
        text: 'hello world'
      }
    }
  }
}

```

To make 'hello world' updatable, we create a reducer which follows the initial state pretty closely.  
The difference being that 'hello world' has been replaced with CHANGE_TEXT.

```javaScript

const reducer = {
  view: {
    ui: {
      field1: {
        text: {
          CHANGE_TEXT
        }
      }
    }
  }
}

```

CHANGE_TEXT is a reference to a thing called an action-function.  
Action-functions are functions that handle actions.  
They take the previous state at the given node - in this case 'hello world' along with an action-object (aka an action).

For example, here's our CHANGE_TEXT action function.

```javascript
const CHANGE_TEXT = (state, action) =>
  action.payload || state
```

You can see that if the action parameter has a field called 'payload' then action.payload will be returned.  
Otherwise the original state is returned instead.

Now when we dispatch a CHANGE_TEXT action...

```javaScript

dispatch({
  type: 'CHANGE_TEXT',
  payload: 'new text'
})

```

hypeReduce matches the action.type of 'CHANGE_TEXT' to the node in the reducer that references CHANGE_TEXT.  
Since there is a match, the state at the given node - 'hello world' is passed into the action-function's state parameter.  
The action itself is passed into the action-function's action parameter.  
The response from the action-function becomes the new state at the given node.

boom 💥


```javaScript

// new state

{
  view: {
    ui: {
      field1: {
        text: 'new text'
      }
    }
  }
}

```

**hypeReduce follows the shape of your state.**

When you want a state node to respond to actions, just list them under the node.

```
...
field1: {
  text: {
    CHANGE_TEXT,
    REVERSE_TEXT
  }
}
...

```

The corresponding action-function gets triggered when action.type is the same as the action-function's name.

**Once the match has been made - the state change is complete**

## $ Wildcards

Need to respond to all actions at a given node? - use $

```javascript
...
field1: {
  text: {
    $: (textState, action) => doSomething()
  }
}
...

```

Now any actions that make their way to the node with a $ will automatically trigger the corresponding action-function.

## Passdowns

When an action-function isn't triggered at a higher node, use _ to pass the action down into child nodes.

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

## Reactive entry-points

We can listen for changes at a given node with the 'connect annotation' in the reducer, along with the `connect` function in our app.
We call these **Reactive Entrypoints**.

```javascript

const reducer = {
  view: {
    ui: {
      field1: {
        text: {
          connect: 'field1Text',
          CHANGE_TEXT
        }
      }
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

Note - unlike a subscribe hook in other frameworks, `connect` can only be registered once on a given node.  
This means that you don't have to manage sunscribes and unsubscribes, which can lead to memory leaks in an application.  
The trick to bypassing this limitation is to match the application state to the components of the application.  
In other words, the application state matches the components and therefore should only have one connection.

If two (or more) components reference the same piece of data, then the best practice way to do this is to  
represent the data at two (or more) nodes in the reducer, and reference the same Action-functions.  
When you dispatch an action, all corresponding nodes will update accordingly.

The way that this works is that when a node in the reducer has multiple child nodes, a dispatched action will  
flow into each child node (unless it makes a match to an action-function before).

## React

Using with React ? We hope so...  
Take advantage of Reactive Entry Points

First add a 'connect' annotation at a given node

```javascript

field1: {
  text: {
    connect: 'field1Text',
    CHANGE_TEXT
  }
}

```

Then in the corresponding component, use connect to listen for actions on that node

```jsx

import { connect, getStore, dispatch } from 'hypereduce'

const Text = () => {
  // useState is a React hook that allows you to update a component when a given piece of state changes.
  // getStore is a hypeReduce util that gets you the current hypeReduce stored state
  const [state, set] = useState(getStore().field1.text)
  // connect allows you to listen for actions on the 'field1Text' node
  // When this fires we call `set` which updates the state of this component
  connect('field1Text', emittedValue =>
    set(emittedValue)
  )
  return (
    <div>
      <h1>{ state }</h1>
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

If you want to emit a node whenever state changes (and not only when an action is triggered on a node) then 
just annotate the state node with 'passiveConnect' instead of 'connect'. As long as the action makes it to the node in question, then the state of that node will be emitted.

Note the difference with passiveConnect vs $

- passiveConnect will emit the state of the given node whenever any action occurs.
- $ will run a corresponding action-function, whenever any action occurs.

To get started with React + hypeReduce

```javascript

const mount = document.getElementById('app')

hypeReduce(initState, reducer)

ReactDOM.render(
  firstComponent(),
  mount
)

```

## urlState

The state of the url is not forgotten in hypeReduce.

Upon initial load, the urlState is merged into your initial state.
If you were to log the state of your first-paint, it would have a key called `route` which would contain the urlState.

So a url of 'yoursite.com/cats/123?filter=on&show=cute-cats' would produce

Something like...

```javascript

{
  ...,
  route: {
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
}

```

Whenever urlState changes, it triggers a ROUTE_CHANGE action.
The action looks like the following...

```javascript

{
  type: 'ROUTE_CHANGE,
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

To ensure that your app always has knowledge of current urlState, we suggest adding a route key + ROUTE_CHANGE action-function to your hypeReduce reducer like so...

```javascript

{
  route: { ROUTE_CHANGE }
}

```

hypeReduce provides the ROUTE_CHANGE action-function out-of-the-box

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

TBA

## Reusability

hypeReduce is big on reusability.
By thinking of various parts of state as data-structures, we can often use the same functions.
We provide a bunch of functions out-of-the-box to get you started.

```javascript

field1: {
  text: {
    // REPLACE
    REPLACE: REPLACE('field1')
  }
}
// Replace text at field1
dispatch({
  type: 'REPLACE',
  location: 'field1',
  payload: 'new text'
})

```

How about a collection of cats...

```javascript

const state = 
  cats: {
    byId: {
      cat1: {
        name: 'kitty'
      }
    },
    allIds: [cat1]
  }

const reducer = {
  cats: {
    SET, UPDATE, DELETE
  }
}

// SET can be used to add new cats, or replace existing cats
dispatch({
  type: 'SET',
  collection: 'cats',
  id: 'cat2',
  payload: { name: 'garfield' }
})

// UPDATE allows you to specify a particular key of the collection item to update

dispatch({
  type: 'UPDATE',
  collection: 'cats',
  id: 'cat2',
  key: 'name',
  payload: 'garfield'
})

// DELETE allows you to well ... delete items

dispatch({
  type: 'DELETE',
  collection: 'cats',
  id: 'cat2'
})

```

## Dispatching multiple actions

TBA

## Async actions & Action chaining

## Dynamically modifying the Reducer and Action-functions
