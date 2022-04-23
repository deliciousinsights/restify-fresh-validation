const _ = require('lodash')
const validation = require('./validation')
const error = require('./error')
const model = require('./model')
const when = require('./conditions')

module.exports.validation = validation
module.exports.error = error
module.exports.when = when
module.exports.validatorModels = model.validatorModels
module.exports.validationPlugin = validationPlugin

const DEFAULT_OPTIONS = {
  errorsAsArray: true,
  errorHandler: false,
  forbidUndefinedVariables: false,
  validatorModels: {},
}

function validationPlugin(options) {
  // Massage options
  options = { ...DEFAULT_OPTIONS, ...options }
  if (_.isArray(options.validatorModels)) {
    options.validatorModels = options.validatorModels.reduce((acc, models) => ({
      ...acc,
      ...models,
    }))
  }

  // Produce middleware
  return function restifyFreshValidationMW(req, res, next) {
    const spec = (req.route && req.route.spec) || req.route
    const validationModel = spec && spec.validation

    if (validationModel) {
      const errors = validation.process(validationModel, req, options)

      if (
        (errors && options.errorsAsArray && errors.length > 0) ||
        (!options.errorsAsArray && Object.keys(errors).length > 0)
      ) {
        return error.handle(errors, req, res, options, next)
      }
    }

    next()
  }
}
