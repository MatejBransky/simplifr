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

```js
import { simplify } from 'simplifr';
```       
Transform the json data
          
```js
// our source data
const json = {*some json data*}

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

## API Reference


## Test

    npm test

## Licence
MIT