# simplifr [![Build Status](https://travis-ci.org/krispo/simplifr.svg?branch=master)](https://travis-ci.org/krispo/simplifr) [![NPM Version](http://img.shields.io/npm/v/simplifr.svg?style=flat)](https://www.npmjs.org/package/simplifr)
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

Simplifr also has `reducers` implementation for `simplified data` as well as for `raw data`. Check Api Reference below.

## Usage with React/Redux

Let's create an `editable` react component with JSON data from example above.

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

### App
Suppose, main `App` component has 3 child components: `Component`.
 
The first will edit `bar: 'buz'` node. The second will edit the first element in `qux` node. And the last will edit the last element in `qux` node.
 
```js
class App extends Component {
  ...
  render(){
    return (
      <div>
        <Component path="root.foo.bar" />
        <Component path="root.qux.0" />
        <Component path="root.qux.2" />
      </div>
    )
  }
}
```

Next, let's show how the common Component, Action, Reducer can look like.

### Component

```js
class Component extends React.Component {
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
export default connect(mapStateToProps, actions)(Component)

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

Let's assume that `raw data` is a standard JSON data, eg
```js
{
  foo: 'bar'    
}
```
and `simplified data` is a flat `path-description` data, eg
```js
{
  'root': { type: 'object', childs: ['foo'] },
  'root.foo': 'bar' 
}
```

`Path` string is a string of the following form

```js
'root.path.to.json.node'
```
 or equivalent form with omitting `root`
 
 ```js
 'path.to.json.node'
 ```

### Simplified data

#### `simplify(obj, [dilimiter, root])`
Returns simplified data object.
* *obj* - raw json data to be simplified
* *dilimiter* - path dilimiter, default `'.'`
* *root* - root path string, default `'root'`.

Example
```js
let obj = {
  foo: {
    bar: 'buz'
  }
}

let data = simplify(obj)
/* 
data = {
  'root': { type: 'object', childs: ['foo'] },
  'root.foo': { type: 'object', childs: ['bar'] },
  'root.foo.bar': 'buz'
}
*/
```

#### `add(data, path, obj, [dilimiter])`
Returns simplified data object with updated node
* *data* - simplified data
* *path* - a path string to find a node in `data`
* *obj* - json obj to be simplified and added to `path` node in `data`
* *dilimiter* - path dilimiter, default `'.'`

Example
```js
let data = {
  'root': { type: 'object', childs: ['foo'] },
  'root.foo': { type: 'object', childs: ['bar'] },
  'root.foo.bar': 'buz'
}

add(data, 'root.foo', { array: [1, 2, 3] })
/* 
data = {
  'root': { type: 'object', childs: ['foo'] },
  'root.foo': { type: 'object', childs: ['bar', 'array'] },
  'root.foo.bar': 'buz',
  'root.foo.array': { type: 'array', childs: [0, 1, 2] },
  'root.foo.array.0': 1,
  'root.foo.array.1': 2,
  'root.foo.array.2': 3  
}
*/
```

#### `update(data, path, obj, [dilimiter])`
Returns simplified data object with updated node
* *data* - simplified data
* *path* - a path string to find a node in `data`
* *obj* - json obj to be simplified and updated with `path` node in `data`
* *dilimiter* - path dilimiter, default `'.'`

Example
```js
let data = {
  'root': { type: 'object', childs: ['foo'] },
  'root.foo': { type: 'object', childs: ['bar'] },
  'root.foo.bar': 'buz'
}

update(data, 'root.foo', { array: [1, 2, 3] })
/* 
data = {
  'root': { type: 'object', childs: ['foo'] },
  'root.foo': { type: 'object', childs: ['array'] },  
  'root.foo.array': { type: 'array', childs: [0, 1, 2] },
  'root.foo.array.0': 1,
  'root.foo.array.1': 2,
  'root.foo.array.2': 3  
}
*/
```

#### `remove(data, path, [dilimiter])`
Returns simplified data object with removed node
* *data* - simplified data
* *path* - a path string that refer to a node to be removed from `data`
* *dilimiter* - path dilimiter, default `'.'`

Example
```js
let data = {
  'root': { type: 'object', childs: ['foo'] },
  'root.foo': { type: 'object', childs: ['bar', 'array'] },
  'root.foo.bar': 'buz',
  'root.foo.array': { type: 'array', childs: [0, 1, 2] },
  'root.foo.array.0': 1,
  'root.foo.array.1': 2,
  'root.foo.array.2': 3  
}

remove(data, 'root.foo.array')
/* 
data = {
  'root': { type: 'object', childs: ['foo'] },
  'root.foo': { type: 'object', childs: ['bar'] },
  'root.foo.bar': 'buz'
}
*/
```

#### `reset(data, path, [dilimiter])`
Returns simplified data object with updated node
* *data* - simplified data
* *path* - a path string that refer to a node to be reset in `data`
* *dilimiter* - path dilimiter, default `'.'`

Example
```js
let data = {
  'root': { type: 'object', childs: ['foo'] },
  'root.foo': { type: 'object', childs: ['bar', 'array'] },
  'root.foo.bar': 'buz',
  'root.foo.array': { type: 'array', childs: [0, 1, 2] },
  'root.foo.array.0': 1,
  'root.foo.array.1': 2,
  'root.foo.array.2': 3  
}

reset(data, 'root.foo.array')
/* 
data = {
  'root': { type: 'object', childs: ['foo'] },
  'root.foo': { type: 'object', childs: ['bar', 'array'] },
  'root.foo.bar': 'buz',
  'root.foo.array': { type: 'array', childs: [] }
}
*/
```

#### `desimplify(data, [path, dilimiter])`
Returns raw json data object.
* *data* - simplified data
* *path* - a path string that refer to a node to be desimplified into raw data, default `'root'`.
* *dilimiter* - path dilimiter, default `'.'`

Example
```js
let data = {
  'root': { type: 'object', childs: ['foo'] },
  'root.foo': { type: 'object', childs: ['bar', 'array'] },
  'root.foo.bar': 'buz',
  'root.foo.array': { type: 'array', childs: [0, 1, 2] },
  'root.foo.array.0': 1,
  'root.foo.array.1': 2,
  'root.foo.array.2': 3  
}

let json1 = desimplify(data)
/* 
json1 = {
  foo: {
    bar: 'buz',
    array: [1, 2, 3]
  }
}
*/

let json2 = desimplify(data, 'root.foo.array')
/* 
json2 = [1, 2, 3]
*/
```

#### `join(args)`
Returns `path` string with default `'.'` dilimiter.
* *args* - sequence of paths to be joined

Example
```js
const path = join('root', 'path.to', 'component', '', 'data')
// path = 'root.path.to.component.data'
```

## Test

    npm test

## Licence
MIT