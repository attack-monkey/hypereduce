# hypereduce
State management without the boilerplate

------------------------------------------------------------

We believe that managing application state should be simple.
That's why we built hypeReduce.

consider:

Our application state looks like

```javaScript

const state = {
  view: {
    ui: {
      field1: {
        text: 'hello world'
      }
    }
  }
}

```

We now want to make 'hello world' updatable.

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

const CHANGE_TEXT = (textState, action) =>
  action.payload || textState

hypeReduce(state, reducer)

```

Now whenever we dispatch a CHANGE_TEXT action, the text will be updated.

```javaScript

dispatch({
  type: 'CHANGE_TEXT',
  payload: 'new text'
})

```

whaalaa...


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

hypeReduce follows the shape of your state.  
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

The corresponding action-function gets triggered when action.type is the same as the function name.

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

Using with React ? We hope so...  
Take advantage of Reactive Entry Points

First add a 'connect' annotation at a given node

```javascript

field1: {
  text: {
    connect: 'field1Text',
    REPLACE: REPLACE('field1')
  }
}

```

Then in the corresponding component, use connect to listen for actions on that node

```jsx

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
          type: 'REPLACE',
          location: 'field1',
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

urlState

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

