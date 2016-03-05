# simplifr [![NPM Version](http://img.shields.io/npm/v/simplifr.svg?style=flat)](https://www.npmjs.org/package/simplifr)
Simplifies arbitrary JSON data into a flat single-level (path -> description) structure.
It's designed for React/Redux/Flux apps. Inspired by [Normalizr](https://github.com/gaearon/normalizr).

## Install

    npm install --save simplifr
    
## Example App
   
[redux-json-tree](https://github.com/krispo/redux-json-tree) - React/Redux app.   

## How it works

Suppose we have an arbitrary (complex, nested) JSON object
```js
{
  level1: {
    level2: {
      ...
         levelN: {
            key: 'value'
         }
    }    
  }
}
```
We can say that the query `path` to the `levelN` node is `root -> level1 -> level2 -> ... -> levelN`.
Let's encode this `path` into a string with `dilimiter='.'`
```js
'root.level1.level2. ... .levelN'
```
Also we know that `levelN` node is an object with a single child node `key`. 
Let's define this as `description` object
```js
{
  type: 'object',
  childs: ['key'],
  props: 'maybe some props'
}
```
Notice, that `path` contains all necessary meta information about parent nodes, while `description` contains all necessary meta information about child nodes.
  
Based on this meaning, we can express an abitrary JSON data in terms of `(path, description)` pairs:
```js
{
  path0: description0,
  path1: description1,
  path2: description2,
  ...
}
```
It's a flat single-level structure, that help us to easily get/set the value of any node.
The only thing we need is to know a `path` of the node. 

Simplifr transform an abitrary JSON into such flat single-level structure.

For example,
```js
{
  foo: {
    bar: 'buz'
  },
  qux: [ 1, 2, 3 ]
}
```

will be simplified to
```js
{
  'root': { type: 'object', childs: ['foo', 'qux'] },
  'root.foo': { type: 'object', childs: ['bar'] },
  'root.foo.bar': 'buz',
  'root.qux': { type: 'array', childs: [0, 1, 2] },
  'root.qux.0': 1,
  'root.qux.1': 2,
  'root.qux.2': 3
}
```
> Currently, the leaf nodes have a simple value instead of `description` object. 

## When it is used

* You work with an arbitrary (complex, nested) JSON data
* You don't know a schema of your data, or node ID's
* You want to create an `editable` React components with Flux/Redux/... .
* You want to save some extra states (or props) for any data node.

Is it [Normalizr](https://github.com/gaearon/normalizr)? No. Normalizr requires schemas, object ID's and works primarily with collections of objects.

Simplifr is schema agnostic and works with arbitrary JSON.

## Usage with React/Redux

Let's create an `editable` react component with JSON data from example above.

`Component1` will edit `bar: 'buz'` node.
`Component2` will edit the first element in `qux` node.
`Component3` will edit the last element in `qux` node.

### Main
```js
import { simplify } from 'simplifr';
```       
Transform the json data
          
```js
// our source data
const json = {
  foo: {
    bar: 'buz'
  },
  qux: [ 1, 2, 3 ]
}

// define simplified data
const simplifiedData = simplify(json)    
```

Then, use it in Redux app as a store data 
```js
const store = configureStore(simplifiedData)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
```

### Components
Suppose, main `App` component has 3 child components: `Component1`, `Component2`, `Component3`. 
```js
class App extends Component {
  ...
  render(){
    return (
      <div>
        <Component1 path="root.foo.bar" />
        <Component2 path="root.qux.0" />
        <Component3 path="root.qux.2" />
      </div>
    )
  }
}
```

Let's show how the common Component, Action, Reducer can look like.

```js
class Component1 extends Component {
  ...
  onChange(e){
      const { updateAction, path } = this.props
      updateAction(path, e.target.value)
    }
  render(){     
    const { data } = this.props
    return <input value={data} onChange={this.onChange}></input>
  }
}
function mapStateToProps(state, props) { 
  return {
    data: state[props.path]    
  }
}
export default connect(mapStateToProps, actions)(Component1)

```

### Actions
```js
function updateAction(path, value){
  return {
    type: 'UPDATE',
    path,
    value
  }
}
```

### Reducers
```js
// import update
import {update} from 'simplifr'

function reducer(state = {}, action){
  const { path, value } = action
  switch (action.type) {
    case 'UPDATE':
      // use simplifr `update` function
      // in general, `value` can take any JSON
      return update(Object.assign({}, state), path, value) 
    default:
      return state
  }
}
```  

### Result
In the result, 3 input fields will be created. Each of them will change the corresponding node value in our simplified JSON.

## API Reference


## Test

    npm test

## Licence
MIT