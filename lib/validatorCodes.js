var validatorDefaultError = {
  isEmail: 'Invalid email',
  isUrl: 'Invalid URL',
  isIP: 'Invalid IP',
  isAlpha: 'Invalid characters',
  isAlphanumeric: 'Invalid characters',
  isBoolean: 'Invalid boolean',
  isHexadecimal: 'Invalid hexadecimal',
  isHexColor: 'Invalid hexcolor',
  isNumeric: 'Invalid number',
  isLowercase: 'Invalid characters',
  isUppercase: 'Invalid characters',
  isInt: 'Invalid integer',
  isNatural: 'Invalid natural number',
  isDecimal: 'Invalid decimal',
  isDivisibleBy: 'Not divisible',
  notNull: 'String is empty',
  isNull: 'String is not empty',
  notEmpty: 'String is empty',
  equals: 'Not equal',
  contains: 'Invalid characters',
  notContains: 'Invalid characters',
  regex: 'Invalid characters',
  notRegex: 'Invalid characters',
  len: 'String is not in range',
  isUUID: 'Not a UUID',
  isUUIDv3: 'Not a UUID v3',
  isUUIDv4: 'Not a UUID v4',
  isUUIDv5: 'Not a UUID v5',
  isDate: 'Not a date',
  isAfter: 'Invalid date',
  isBefore: 'Invalid date',
  isIn: 'Unexpected value or invalid argument',
  notIn: 'Unexpected value or invalid argument',
  min: 'Invalid number',
  max: 'Invalid number',
  isCreditCard: 'Invalid credit card',
}

var _ = require('lodash')

var messages = (module.exports.messages = {
  isRequired: 'Field is required',
  undefinedVariable: 'Variable is not present',
  equalTo: 'Needs to equal (THE OTHER FIELD)',
  _default: 'Invalid value',
})

_.extend(messages, validatorDefaultError)

module.exports.codes = {
  _default: 'INVALID',
  undefinedVariable: 'UNDEFINED',
  isRequired: 'MISSING',
}
