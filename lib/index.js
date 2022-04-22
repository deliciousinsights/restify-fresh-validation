var _ = require('lodash')
var self = {
  validation: require('./validation'),
  error: require('./error'),
  model: require('./model'),
  when: require('./conditions'),
}

module.exports.validation = self.validation
module.exports.error = self.error
module.exports.when = self.when
module.exports.validatorModels = self.model.validatorModels

var defaultOptions = {
  errorsAsArray: true,
  errorHandler: false,
  forbidUndefinedVariables: false,
  validatorModels: {},
}

module.exports.validationPlugin = function (options) {
  options = _.extend({}, defaultOptions, options)
  if (_.isArray(options.validatorModels)) {
    // Combine list of validatorModels
    var validatorModels = _.toArray(options.validatorModels)
    validatorModels.unshift({})
    options.validatorModels = _.extend.apply(null, validatorModels)
  }
  return function (req, res, next) {
    var validationModel = req.route ? req.route.validation : undefined

    if (validationModel) {
      // validate
      var errors = self.validation.process(validationModel, req, options)

      if (
        (errors && options.errorsAsArray && errors.length > 0) ||
        (!options.errorsAsArray && _.keys(errors).length > 0)
      ) {
        return self.error.handle(errors, req, res, options, next)
      }
    }

    next()
  }
}
