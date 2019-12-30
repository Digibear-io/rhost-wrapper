# @digibear/rhost-wrapper

A Cached wrapper for the RHostMush HTTP API.

## `Install`

`npm i @digibear/rhost-wrapper`

## `Usage`

```js
const API = require("@digibear/rhost-wrapper");
const api = new API({
  user: process.env.USER,
  password: process.env.PASSWORD
});
```

`Traditional Promises`

```js
api
  .get("WHO")
  .then(res => {
    if (res.ok) {
      console.log(res.data);
    } else {
      console.error(`API ERROR: ${res.message}`);
    }
  })
  .catch(err => console.error(err));
```

`Async/await`

```js
const async getWHO = () => {
    const res = await api.get('WHO');
    res.ok
        ? console.log(res.data)
        : console.log(`API ERROR: ${res.message}`);
}

// call the function and catch any errors.
getWHO().catch(err => console.error(err))

```

For help setting up your Rhost API object, see `wizhelp api` and `wizhelp @api`.

Enjoy!
