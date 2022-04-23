# restify-fresh-validation

Up-to-date request validation middleware for [Restify](http://restify.com/)

This is a maintained fork of the long-abandoned, maintainer-unreachable original [node-restify-validation](https://github.com/z0mt3c/node-restify-validation) package.

## WIP

We're in the process of updating the package to address all pending issues, pull requests, vulns and outdated dependencies. Please bear with us for a little longer.

## Requirements

- Restify 2.6+, but compatible with Restify 7's router changes (2018).
- Node 12+

## Simple request validation with Restify

**WIP: this README will get updated as we work through issues.**

Goal of this little project is to have the validation rules / schema as close to the route itself as possible on one hand without messing up the logic with further LOCs on the other hand.

Example:

```javascript
var server = restify.createServer()
server.use(restify.queryParser())
server.use(
  restifyValidation.validationPlugin({
    // Shows errors as an array
    errorsAsArray: false,
    // Not exclude incoming variables not specified in validator rules
    forbidUndefinedVariables: false,
    errorHandler: restify.errors.InvalidArgumentError,
  })
)

server.get(
  {
    url: '/test/:name',
    validation: {
      resources: {
        name: { isRequired: true, isIn: ['foo', 'bar'] },
      },
      queries: {
        status: { isRequired: true, isIn: ['foo', 'bar'] },
        email: { isRequired: false, isEmail: true },
        age: { isRequired: true, isNatural: true },
      },
    },
  },
  function (req, res, next) {
    res.send(req.params)
  }
)

// Ensure there is a file uploaded:
server.post(
  {
    url: '/test/:name',
    validation: {
      resources: {
        name: { isRequired: true, isIn: ['foo', 'bar'] },
      },
      files: {
        myfile: { isRequired: true },
      },
    },
  },
  function (req, res, next) {
    res.send(req.params)
  }
)

// Checks the body of the request contains a json payload with a `person` object with the following attributes:
//   firstName - required
//   middle - optional
//   lastName - required
//   emails - optional array of email addresses with at most 5 elements
server.put(
  {
    url: '/products/:id/labels/:label',
    validation: {
      resources: {
        id: { isRequired: true, isNatural: true },
        label: { isRequired: true },
      },
      queries: {
        status: { isRequired: true, isIn: ['foo', 'bar'] },
      },
      content: {
        person: {
          isObject: {
            properties: {
              firstName: { isRequired: true },
              middle: { isRequired: false },
              lastName: { isRequired: true },
              emails: {
                isArray: {
                  maxLength: 5,
                  element: { isEmail: true },
                },
              },
            },
          },
        },
        label: { isRequired: true },
      },
    },
  },
  function (req, res, next) {
    res.send(req.params)
  }
)

// Validate header fields
server.get(
  {
    url: '/test/something/:name',
    validation: {
      resources: {
        name: { isRequired: true, isIn: ['foo', 'bar'] },
      },
      headers: {
        requestid: { isRequired: true },
      },
    },
  },
  function (req, res, next) {
    res.send(req.params)
  }
)

// Validate header fields
server.get(
  {
    url: '/test/something/:name',
    validation: {
      resources: {
        name: { isRequired: true, isIn: ['foo', 'bar'] },
      },
      headers: {
        requestid: { isRequired: true },
      },
    },
  },
  function (req, res, next) {
    res.send(req.params)
  }
)

server.listen(8001, function () {
  console.log('%s listening at %s', server.name, server.url)
})
```

## Use

Simply install it through npm

    npm install restify-fresh-validation

<!-- FIXME: CHECK ORIGINAL VALIDATOR.JS FEATURES THAT SEEM TO HAVE BEEN DUPLICATED HERE, DELEGATE TO VALIDATOR INSTEAD -->
<!-- FIXME: EXPLORE CONDITIONAL VALIDATION ORIGINAL INFO -->

## Models

The request `resource`, `query` and `headers` contain string values, even though they may
be representing numbers, booleans, Dates or other types.

An optional `model` property can be specified to transform the request value to a specific type.
When validation of a property succeeds and a `model` is specified, the original request value
is replaced with the transformed value.

```javascript
// Creates an instance of date from a numeric or string value
function DateModel(value) {
    return new Date(Number(value) || value);
}

server.get({url: '/search', validation: {
    queries: {
        text: { isRequired: true },
        from: { model: DateModel },
        to: { model: DateModel },
        summary: { isBoolean, model: Boolean },
        page: { isNatural: true, model: Number }
    }
}, function (req, res, next) {
    console.log("Query:", JSON.stringify(req.query));
    res.send(req.query);
}))
```

When handling the request `GET /search?text=Hello&from=2017-12-1&to=1514678400000&summary=true&page=3`,
the query property types will be `string`, `number`, `Date`, `Date` and `number`, respectively
and the following will be logged:

```
Query: {"text":"Hello","from":"2017-12-01T06:00:00.000Z","to":"2017-12-31T00:00:00.000Z","summary":true,"page":3}
```

Without specifying the `model` settings, the query property types would have been strings and the following would
have been logged:

```
Query: {"text":"Hello","from":"2017-12-1","to":"1514678400000","summary":"true","page":"3"}
```

### Validator Models

To avoid having to specify models in your validation configurations, you can
configure models to be automatically applied based on the validator.

```javascript
server.use(
  restifyValidation.validationPlugin({
    validatorModels: {
      isInt: Number,
    },
  })
)
```

When you specify the standard `restifyValidation.validatorModels`, it will supply models
for the following validators:

- isBoolean - converts value to `boolean`
- isDate - converts value to `Date`
- isDecimal - converts value to `number`
- isDivisibleBy - converts value to `number`
- isFloat - converts value to `number`
- isInt - converts value to `number`
- isNatural - converts value to `number`

The `validatorModels` configuration can also take an array of settings.
The following example uses `restifyValidation.validatorModels` but then overrides
the model for the `isDate` validator to map values to `moment` rather than to `Date`.

```javascript
var moment = require('moment')
server.use(
  restifyValidation.validationPlugin({
    validatorModels: [restifyValidation.validatorModels, { isDate: moment }],
  })
)
```

## License

The MIT License (MIT)

Copyright (c) 2022 Christophe Porteneuve / Delicious Insights
Original (forked) code copyright (c) 2014 Timo Behrmann, Guillaume Chauvet

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
