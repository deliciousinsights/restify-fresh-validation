var _ = require('lodash')
var utils = require('./utils')

module.exports.paramMatches = function (params) {
  return conditionalChecker(params, function (matches, value) {
    var result
    if (_.isArray(matches)) {
      result = _.includes(matches, value)
    } else {
      result = _.isEqual(matches, value)
    }
    return result
  })
}

module.exports.exists = function (params) {
  return conditionalChecker(params, function (matches, value) {
    return !_.isUndefined(value)
  })
}

var conditionalChecker = (module.exports.conditionalChecker = function (
  params,
  validator
) {
  return function () {
    var scope = !params.scope
      ? this.scope
      : utils.getExternalScope(params.scope)
    var variable = params.variable
    var matches = params.matches
    return validator(matches, this.req[scope][variable])
  }
})
