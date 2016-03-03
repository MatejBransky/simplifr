# simplifr [![NPM Version](http://img.shields.io/npm/v/simplifr.svg?style=flat)](https://www.npmjs.org/package/simplifr)
Simplifies arbitrary JSON data into a flat single-level (path -> description) structure.
It's designed for React/Redux apps. 

## Install

    npm install --save simplifr

## Example
Suppose we have a json
```js
{
  key1: 'val1',
  key2: [ 1, 2, 3 ]
}
```

It will be simplified into
```js
{
  root: {
    type: 'object',
    childs: ['key1', 'key2']
  },
  'root.key1': 'val1',
  'root.key2': {
    type: 'array',
    childs: [0, 1, 2]
  },
  'root.key2.0': 1,
  'root.key2.1': 2,
  'root.key2.2': 3
}
```

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

## Test

    npm test

## Licence
MIT