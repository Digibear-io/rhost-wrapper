# @digibear/rhost-wrapper

A wrapper for the RHostMush HTTP API, and a curl operation to use it's Header only schema.

## License

`MIT`

## Install

`npm i @digibear/rhost-wrapper`

## Usage

```js
const { API } = require("@digibear/rhost-wrapper");

const api = new API({
  user: "#123",
  password: "xxxxxxxxxx",
  port: 2222,
  encode: true, // On by default to fix an stunnel bug.
});
```

## API

- `get(command: string [, options: curlOptions])` .get allows you to send commands to the game, and recieve feedback through the API connection.
- `post(command: string [, options: curlOptions])` .post allows you to affect the game by sending commands. Any command sent `@emit` for example, will be evaluated by the API object and issued to the game.

### Options

- GET
  - `Exec`
  - `Parse`
    - parse
    - noparse
    - ansiparse
    - ansinoparse
    - ansionly
  - `Encode`
    - yes
    - no
- PUT
  - `Exec`
  - `time`
    - number

`Traditional Promises`

```js
api
  .get("WHO")
  .then((res) => {
    if (res.ok) {
      console.log(res.data);
    } else {
      console.error(`API ERROR: ${res.message}`);
    }
  })
  .catch((err) => console.error(err));
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

### Todo List:

- ~API support for conditional get post headers.~
  For help setting up your Rhost API object, see `wizhelp api` and `wizhelp @api`.

Enjoy!
