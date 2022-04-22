function booleanModel(val) {
  return val === 'true' || val === true
}

function dateModel(val) {
  return new Date(Number(val) || val)
}

var numberModel = Number

module.exports.booleanModel = booleanModel
module.exports.dateModel = dateModel
module.exports.numberModel = numberModel

module.exports.validatorModels = {
  isBoolean: booleanModel,
  isDate: dateModel,
  isDecimal: numberModel,
  isDivisibleBy: numberModel,
  isFloat: numberModel,
  isInt: numberModel,
  isNatural: numberModel,
}
