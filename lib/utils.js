var _ = require('lodash')

module.exports._speratorChar = '.'
var internalToExternalScope = {
  resources: 'params',
  queries: 'query',
  content: 'body',
  files: 'files',
  headers: 'headers',
}

var hasValue = (module.exports.hasValue = function (value) {
  var result
  if (_.isArray(value)) {
    result = value.length > 0
  } else {
    result = !(
      _.isNull(value) ||
      _.isUndefined(value) ||
      (_.isString(value) && value.trim() === '')
    )
  }
  return result
})

module.exports.getScopeKeys = Object.keys(internalToExternalScope)

var getExternalScope = (module.exports.getExternalScope = function (scope) {
  return internalToExternalScope[scope]
})

var getInternalScope = (module.exports.getInternalScope = function (scope) {
  for (var key in internalToExternalScope) {
    if (
      internalToExternalScope.hasOwnProperty(key) &&
      internalToExternalScope[key] === scope
    ) {
      return key
    }
  }
})
