# simplifr
Simplify any JSON data into a flat single-level key-value structure.
It's designed for React/Redux apps. 

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
  root: ['root_key1', 'root_key2'],
  root_key1: 'val1',
  root_key2: ['root_key2_0', 'root_key2_1', 'root_key2_2'],
  root_key2_0: 1,
  root_key2_1: 2,
  root_key2_2: 3
}
```


## Licence
MIT