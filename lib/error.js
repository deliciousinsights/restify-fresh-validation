var _ = require('lodash')

function parseErrorMessage(errors, template) {
  var compiled = _.template(
    template || '<%= field %> (<%= type %>): <%= reason %>'
  )
  var key
  var message = []

  for (key in errors) {
    if (errors.hasOwnProperty(key)) {
      message.push(
        compiled({
          field: errors[key].field,
          type: errors[key].type,
          reason: errors[key].reason,
        })
      )
    }
  }

  return message.join(', ')
}

module.exports.handle = function (errors, req, res, options, next) {
  if (options.handleError) {
    return options.handleError(res, errors, next)
  } else if (options.errorHandler) {
    res.send(
      new options.errorHandler(parseErrorMessage(errors, options.template))
    )
    return next(false)
  } else {
    res.send(409, {
      code: 'InvalidArgument',
      message: 'Validation failed',
      errors: errors,
    })
    return next(false)
  }
}
