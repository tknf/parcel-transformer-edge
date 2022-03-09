# parcel-transformer-edge
Parcel v2 transformer plugin for Edge template.

## Installation
```sh
npm i -D parcel-transformer-edge
# or
yarn add -D parcel-transformer-edge
```

## Configuration
```json
{
  "extends": ["@parcel/config-default"],
  "transformers": {
    "*.edge": ["parcel-transformer-edge"]
  }
}
```

Reference [Parcel plugin configuration](https://v2.parceljs.org/configuration/plugin-configuration/)

## Customization
You can add custom options for Edge templating engine using a `.edgerc.js`, `edge.config.js` file.

### Set views directory

You can register a path to directory for finding the Edge templates.
Default: `views`

configuration:
```js
module.exports = {
  views: "src"
}
```

in template:
```html
<!-- src/partials/header.edge -->
<header></header>
```

in root:
```html
@include("partials/header")
```

### Register template state

configuration:
```js
module.exports = {
  state: {
    author: {
      name: "Bob",
      age: 24
    }
  }
};
```

in template:
```html
<h1>{{ author.name }}</h1>
```

Result:
```html
<h1>Bob</h1>
```


### Register template

configuration:
```js
module.exports = {
  templates: {
    button: {
      template: `
      <button {{ $props.serializeExcept(["title"]) }}>
        {{ title }}
      </button>
      `
    }
  }
};
```

in template:
```html
<div>
  @!component("button", {
    title: "Hello!",
    class: ["Button", "Button--primary"]
  })
</div>
```

Result:
```html
<div>
  <button class="Button Button--primary">
    Hello!
  </button>
</div>
```

## Edge documentation

For more information on Edge template, see [AdonisJS website](https://docs.adonisjs.com/guides/views/rendering).

## License
MIT