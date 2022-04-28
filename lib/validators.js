var _ = require('lodash')
var validator = require('./compatible-validator')
var utils = require('./utils')

var validators = (module.exports = {
  isRequired: function (key, submittedValue, myValidator) {
    var isRequired = _.isFunction(myValidator.value)
      ? myValidator.value.call(this, key, myValidator)
      : myValidator.value

    if (!isRequired && !utils.hasValue(submittedValue)) {
      return false
    } else if (isRequired && !utils.hasValue(submittedValue)) {
      return true
    }
  },
  equalTo: function (key, submittedValue, myValidator) {
    if (!_.isEqual(submittedValue, this.req[this.scope][myValidator.value])) {
      return true
    }
  },
  isArray: function (key, submittedValue, myValidator) {
    var isArray = _.isFunction(myValidator.value)
      ? myValidator.value.call(this, key, myValidator)
      : myValidator.value

    if (!isArray) {
      if (_.isArray(submittedValue)) {
        myValidator.msg = 'Field is an array'
        return true
      }
    } else if (submittedValue && !_.isArray(submittedValue)) {
      myValidator.msg = 'Field is not array'
      return true
    } else if (submittedValue && _.isObject(isArray)) {
      if (isArray.minLength && submittedValue.length < isArray.minLength) {
        myValidator.msg = 'Not enough elements'
        return true
      }
      if (isArray.maxLength && submittedValue.length > isArray.maxLength) {
        myValidator.msg = 'Too many elements'
        return true
      }
      if (isArray.element) {
        return validateCollectionValues(this, submittedValue, isArray.element)
      }
    }
  },
  isDictionary: function (key, submittedValue, myValidator) {
    var isDictionary = _.isFunction(myValidator.value)
      ? myValidator.value.call(this, key, myValidator)
      : myValidator.value

    if (!isDictionary) {
      if (_.isObject(submittedValue) && !_.isArray(submittedValue)) {
        myValidator.msg = 'Field is an object'
        return true
      }
    } else if (
      submittedValue &&
      (!_.isObject(submittedValue) || _.isArray(submittedValue))
    ) {
      myValidator.msg = 'Field is not object'
      return true
    } else if (submittedValue && _.isObject(isDictionary)) {
      var keys = _.keys(submittedValue)
      if (isDictionary.minLength && keys.length < isDictionary.minLength) {
        myValidator.msg = 'Not enough elements'
        return true
      }
      if (isDictionary.maxLength && keys.length > isDictionary.maxLength) {
        myValidator.msg = 'Too many elements'
        return true
      }
      if (isDictionary.key) {
        var renamedElements = {}
        var keyError = _.reduce(
          submittedValue,
          (previousError, value, key) => {
            if (previousError) {
              return previousError
            }
            var validateKey = this.validateValue(
              '(key:' + JSON.stringify(key) + ')',
              _.constant(key),
              isDictionary.key
            )
            if (!validateKey.error && key !== String(validateKey.value)) {
              // isDictionary.key.model has changed the name of the element
              delete submittedValue[key]
              renamedElements[validateKey.value] = value
            }
            return validateKey.error
          },
          false
        )
        // Merge renamed elements
        _.extend(submittedValue, renamedElements)
        if (keyError) {
          return keyError
        }
      }
      if (isDictionary.value) {
        var valueError = validateCollectionValues(
          this,
          submittedValue,
          isDictionary.value
        )
        if (valueError) {
          return valueError
        }
      }
    }
  },
  isObject: function (key, submittedValue, myValidator) {
    var isObject = _.isFunction(myValidator.value)
      ? myValidator.value.call(this, key, myValidator)
      : myValidator.value
    if (!isObject) {
      if (_.isObject(submittedValue) && !_.isArray(submittedValue)) {
        myValidator.msg = 'Field is an object'
        return true
      }
    } else if (!_.isObject(submittedValue) || _.isArray(submittedValue)) {
      myValidator.msg = 'Field is not object'
      return true
    } else if (_.isObject(isObject)) {
      if (isObject.properties) {
        return this.validateProperties(submittedValue, isObject.properties)
      }
    }
  },
})

function validateCollectionValues(context, collection, validationRules) {
  return _.reduce(
    collection,
    function (previousError, value, index) {
      if (previousError) {
        return previousError
      }
      var validateValue = context.validateValue(
        '[' + JSON.stringify(index) + ']',
        _.constant(value),
        validationRules
      )
      if (!validateValue.error) {
        collection[index] = validateValue.value
      }
      return validateValue.error
    },
    false
  )
}

var notSupported = ['len', 'notNull', 'isNull', 'notEmpty']
var validatorFunctionKeys = _.difference(_.functionsIn(validator), notSupported)

_.each(validatorFunctionKeys, function (element, index, array) {
  if (!_.has(validators, element)) {
    var validatorFunction = validator[element]

    validators[element] = function (key, submittedValue, myValidator) {
      var requiredValue = myValidator.value
      var isRequired = _.isFunction(requiredValue)
        ? requiredValue.call(this, key, validator)
        : requiredValue
      const validatorArgs = [submittedValue]
      // We currently assume that a validator's second argument could not be a
      // boolean.  This is so 'isXxx: true' descriptors do not result in `true`
      // being passed as the validator's second argument, which may be an
      // optional options object whose extension with defaults would break on a
      // boolean original value.
      if (typeof isRequired !== 'boolean') {
        validatorArgs.push(isRequired)
      }

      if (
        isRequired !== false &&
        (!utils.hasValue(submittedValue) ||
          !validatorFunction(...validatorArgs))
      ) {
        return true
      }
    }
  }
})
