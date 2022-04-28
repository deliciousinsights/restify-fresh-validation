var should = require('should')
var _ = require('lodash')
var index = require('../../lib/index')

var test = function (
  validatorName,
  validatorValue,
  correctValue,
  incorrectValue
) {
  var validationReq = { query: {} }
  var validationModel = { queries: { myParameter: { isRequired: true } } }
  var options = { errorsAsArray: true }

  validationModel.queries.myParameter[validatorName] = validatorValue

  if (validatorName === 'isEmpty') {
    validationModel.queries.myParameter.isRequired = false
  } else {
    //check MISSING validation
    var checkMissing = index.validation.process(
      validationModel,
      validationReq,
      options
    )
    checkMissing.length.should.equal(1)
    checkMissing[0].type.should.equal('MISSING')
  }

  // check VALID validation
  if (!_.isArray(correctValue)) {
    correctValue = [correctValue]
  }

  _.each(correctValue, function (value) {
    validationReq.query.myParameter = value
    var checkValid = index.validation.process(
      validationModel,
      validationReq,
      options
    )
    checkValid.length.should.equal(0)
  })

  // check INVALID validation
  if (!_.isArray(incorrectValue)) {
    incorrectValue = [incorrectValue]
  }

  _.each(incorrectValue, function (value) {
    validationReq.query.myParameter = value
    var checkInvalid = index.validation.process(
      validationModel,
      validationReq,
      options
    )
    checkInvalid.length.should.equal(1)
    checkInvalid[0].type.should.equal('INVALID')
  })
}

describe('Validators', function () {
  describe('node-validator', () => {
    it('arrays', function () {
      test('isInt', true, '123', [['456', '0.123']])
    })
    it('contains', function () {
      test('contains', 'foo', 'foobar', 'bar')
    })
    it('equals', function () {
      test('equals', 'foobar', 'foobar', 'foobar2')
    })
    it('is', function () {
      test('is', /^abc$/, 'abc', 'aac')
    })
    it('isAfter', function () {
      test('isAfter', '2011-08-04', '2011-08-05', '2011-08-04')
    })
    it('isAlpha', function () {
      test('isAlpha', true, 'abc', 'a1')
    })
    it('isAlphanumeric', function () {
      test('isAlphanumeric', true, 'a1', 'a1!')
    })
    it('isAscii', () => {
      test('isAscii', true, '99 hens on a wall 1 fell down', 'déjà demain')
    })
    it('isBase32', () => {
      test(
        'isBase32',
        true,
        'ORUGS4ZANFZSAYTBONSTGMRAORSXQ5A=',
        'dGhpcyBpcyBub3QgYmFzZTMyIHRleHQ='
      )
    })
    it('isBase58', () => {
      test(
        'isBase58',
        true,
        '2d4bH6gYhhJC6EiMKsh9PXrEkZqS',
        'dGhpcyBpcyBub3QgYmFzZTMyIHRleHQ='
      )
    })
    it('isBase64', () => {
      test(
        'isBase64',
        true,
        'dGhpcyBpcyBub3QgYmFzZTMyIHRleHQ=',
        'this is not base64 text, you know!'
      )
    })
    it('isBefore', function () {
      test('isBefore', '2011-08-04', '2011-08-03', '2011-08-04')
    })
    it('isBIC', () => {
      test('isBIC', true, 'SOGEFRPP', 'NOTQUITE')
    })
    it('isBoolean', function () {
      test('isBoolean', true, ['false', 'true'], ['0', '1', 'FALSE', 'TRUE'])
    })
    it('isBtcAddress', () => {
      test(
        'isBtcAddress',
        true,
        'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
        'Not a BTC Address'
      )
    })
    it('isByteLength', () => {
      test(
        'isByteLength',
        { min: 2 },
        ['É', 'ab', 'abc', 'Dé'],
        ['a', 'b', 'c']
      )
    })
    it('isCreditCard', () => {
      test('isCreditCard', true, '4242424242424242', '4242424242424243')
    })
    it('isCurrency', () => {
      test('isCurrency', true, '$123.45', 'ABC')
    })
    it('isDataURI', () => {
      test('isDataURI', true, 'data:,Hello%2C%20World%21', 'foobar')
    })
    it('isDate', function () {
      test('isDate', true, '2011-08-04', '20110804')
    })
    it('isDecimal', function () {
      test(
        'isDecimal',
        true,
        ['0.5', '-123', '-1', '-123.4', '123'],
        ['0,5', 'false']
      )
    })
    it('isDivisibleBy', () => {
      test('isDivisibleBy', 5, ['20', '10', '5', '25'], ['7', '9', '14', '22'])
    })
    it('isEAN', () => {
      test('isEAN', true, ['1234567890128', '65833254'], '123456789012')
    })
    it('isEmail', function () {
      test('isEmail', true, 'test@email.de', 'asdfasdf.de')
    })
    it('isEmpty', () => {
      test('isEmpty', true, '', 'hello')
    })
    it('isEthereumAddress', () => {
      test(
        'isEthereumAddress',
        true,
        '0x7011f3edc7fa43c81440f9f43a6458174113b162',
        'Not an ETH address'
      )
    })
    it('isFloat', function () {
      test(
        'isFloat',
        true,
        ['0.5', '-123', '-1', '0.5', '-123.4', '123'],
        ['0,5', 'false']
      )
    })
    it('isFQDN', () => {
      test(
        'isFQDN',
        true,
        ['example.com', 'sub.zero.net', 'foo.bar.baz.quux'],
        ['foobar', 'foo-bar', 'foo.', '.bar']
      )
    })
    it('isFullWidth', () => {
      test('isFullWidth', true, 'ａ ｂ ｃ ｄ ｅ ｆ', 'abcdef')
    })
    it('isHalfWidth', () => {
      test('isHalfWidth', true, 'abcdef', 'éàô')
    })
    it('isHash', () => {
      test('isHash', 'md5', '01234567890123456789012345678901', [
        '000',
        'g'.repeat(40),
      ])
      test(
        'isHash',
        'sha256',
        'b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9',
        'g'.repeat(64)
      )
    })
    it('isHexadecimal', function () {
      test('isHexadecimal', true, 'df', 'w')
    })
    it('isHexColor', function () {
      test('isHexColor', true, ['#000000', 'ffffff'], '#aaaaaaaasdf')
    })
    it('isHSL', () => {
      test(
        'isHSL',
        true,
        ['hsl(0, 100%, 50%)', 'hsla(0.3rad,100%,75%,0.3)'],
        ['hsl(0, 100, 50)', 'hsla(120,100,75%,0.3)']
      )
    })
    it('isIBAN', () => {
      test(
        'isIBAN',
        true,
        ['ES91 2100 0418 4502 0005 1332', 'FR14 2004 1010 0505 0001 3M02 606'],
        ['ES91 2100 0418 4502 0005 1333', 'FR14 2004 1010 0505 0001 3M02 607']
      )
    })
    it('isIdentityCard', () => {
      test('isIdentityCard', 'ES', '99999999R', '123456789')
    })
    it('isIMEI', () => {
      test('isIMEI', true, '354784054129987', '12345678901234')
    })
    it('isIn', function () {
      test('isIn', ['a', 'bc'], ['a', 'bc'], 'c')
    })
    it('isInt', function () {
      test('isInt', true, ['123', '0', '123'], ['a1', '123.4', '-123.4', '0.5'])
    })
    it('isIP', function () {
      test('isIP', true, ['127.0.0.1', '::1', 'fe80::1234%1'], 'asdf')
    })
    it('isIPRange', () => {
      test('isIPRange', true, ['10.1.2.0/20', '2000::/4'], '127.0.0.1')
    })
    it('isISBN', () => {
      test('isISBN', true, '978-2-1234-5680-3', '978-2-1234-5680-4')
    })
    it('isISIN', () => {
      test('isISIN', true, 'FR0000052292', 'FR00000522999')
    })
    it('isISO8601', () => {
      test(
        'isISO8601',
        true,
        ['2022-04-28', '2022-02-28T11:23:17+0200'],
        '04/28/2022'
      )
    })
    it('isISO31661Alpha2', () => {
      test('isISO31661Alpha2', true, ['ES', 'FR'], ['YY', 'ZZ'])
    })
    it('isISO31661Alpha3', () => {
      test('isISO31661Alpha3', true, ['ESP', 'FRA'], ['YYY', 'ZZZ'])
    })
    it('isISO4217', () => {
      test('isISO4217', true, ['EUR', 'GBP', 'USD'], ['FOO', 'BAR', 'BAZ'])
    })
    it('isISRC', () => {
      test('isISRC', true, 'USSKG1912345', 'FRABC420123')
    })
    it('isISSN', () => {
      test('isISSN', true, '2049-3630', '2049-3631')
    })
    it('isJSON', () => {
      test('isJSON', true, '{"name":"John"}', [
        'foo',
        '{name:"John"}',
        "{'name':'John'}",
      ])
    })
    it('isJWT', () => {
      test('isJWT', true, 'foo.bar.baz', 'foobar')
    })
    it('isLatLong', () => {
      test('isLatLong', true, '42,3', '42,foo')
    })
    it('isLength', () => {
      test('isLength', true, 'hello', [])
      test('isLength', { min: 4, max: 10 }, 'hello', ['foo', 'hello world'])
    })
    it('isLicensePlate', () => {
      test('isLicensePlate', 'de-DE', 'AU0719', 'HH-071-XY')
    })
    it('isLocale', () => {
      test('isLocale', true, ['es-MX', 'fr-FR'], 'foobar')
    })
    it('isLowercase', function () {
      test('isLowercase', true, 'abc', 'aBc')
    })
    it('isMACAddress', () => {
      test('isMACAddress', true, '01-02-03-04-05-ab', '01-02-03-04-05')
    })
    it('isMagnetURI', () => {
      test(
        'isMagnetURI',
        true,
        'magnet:?xt=urn:btih:c12fe1c06bba254a9dc9f519b335aa7c1367a88a',
        'foobar:?xt=urn:bith:coin'
      )
    })
    it('isMD5', () => {
      test('isMD5', true, '0'.repeat(32), '0'.repeat(40))
    })
    it('isMimeType', () => {
      test(
        'isMimeType',
        true,
        ['text/plain', 'application/json'],
        ['foo', 'foo-bar']
      )
    })
    it('isMobilePhone', () => {
      test(
        'isMobilePhone',
        'fr-FR',
        ['0678901234', '0789012345'],
        ['0123456789', '0901234567']
      )
    })
    it('isMongoId', () => {
      test('isMongoId', true, '0'.repeat(24), '0'.repeat(10))
    })
    it('isMultibyte', () => {
      test('isMultibyte', true, 'déjà', 'foobar')
    })
    it('isNumeric', function () {
      test('isNumeric', true, ['1', '-1', '123', '123.4'], ['asd', 'false'])
    })
    it('isOctal', () => {
      test('isOctal', true, '644', '678')
    })
    it('isPassportNumber', () => {
      test('isPassportNumber', 'FR', '42FR12345', 'FR4212345')
    })
    it('isPort', () => {
      test('isPort', true, '1234', '70000')
    })
    it('isPostalCode', () => {
      test('isPostalCode', 'FR', '92700', '1234')
    })
    it('isRFC3339', () => {
      test('isRFC3339', true, '1996-12-19T16:39:57-08:00', '2022/12/19')
    })
    it('isRgbColor', () => {
      test(
        'isRgbColor',
        true,
        ['rgb(10,10,10)', 'rgb(10%,20%,30%)', 'rgba(10,10,10,0.5)'],
        ['rgb(-10,50,300)']
      )
    })
    it('isSemVer', () => {
      test('isSemVer', true, '1.2.3', '1.2')
    })
    it('isSurrogatePair', () => {
      test('isSurrogatePair', true, '😄', 'foobar')
    })
    it('isSlug', () => {
      test('isSlug', true, ['foo-bar', 'foobar'], ['foo---bar', 'foo bar'])
    })
    it('isStrongPassword', () => {
      test('isStrongPassword', true, 'tR0ubaDoUr!', 'secret')
    })
    it('isTaxID', () => {
      test('isTaxID', 'fr-FR', '0345595195274', '0345595195275')
    })
    it('isUppercase', function () {
      test('isUppercase', true, 'ABC', 'ABc')
    })
    it('isURL', function () {
      test('isURL', true, 'http://www.google.de', 'asdfasdf')
    })
    it('isUUID', function () {
      test('isUUID', true, 'A987FBC9-4BED-3078-CF07-9141BA07C9F3', 'abc')
    })
    it('isVariableWidth', () => {
      test('isVariableWidth', true, 'ａｂｃｄｅｆ foobar', [
        'ａｂｃｄｅｆ',
        'foobar',
      ])
    })
    it('isVAT', () => {
      test('isVAT', 'GB', 'GB999 9999 73', 'GB999 9999')
    })
    it('isWhitelisted', () => {
      test(
        'isWhitelisted',
        'aeiouy',
        ['aie', 'yo', 'you', 'yea'],
        ['hi', 'hey', 'hoi']
      )
    })
    it('matches', () => {
      test('matches', /foo/i, ['foo', 'foobar', 'Foo'], ['fou', 'oof', 'bar'])
    })
  })
  it('isArray', function () {
    test('isArray', false, [123, 'string'], [[123], ['string', 123, false]])
    test('isArray', true, [[123], ['string', 123, false]], [123, 'string'])
    test(
      'isArray',
      { minLength: 2 },
      [
        [1, 2],
        [1, 2, 3],
      ],
      [123, [1]]
    )
    test('isArray', { maxLength: 3 }, [[1], [1, 2, 3]], [123, [1, 2, 3, 4]])
    test(
      'isArray',
      { element: { isNatural: true } },
      [[1], [1, 2, 3]],
      [['a'], [-1]]
    )
    var validationModel = {
      element: {
        isObject: {
          properties: {
            name: { isRequired: true },
            age: { isNatural: true, isRequired: false },
          },
        },
      },
    }
    test(
      'isArray',
      validationModel,
      [
        [
          {
            name: 'Alice',
          },
          {
            name: 'Bob',
            age: 33,
          },
        ],
      ],
      [
        ['a'],
        [
          {
            name: 'Alice',
            age: -5,
          },
        ],
      ]
    )
  })

  it('isDictionary', function () {
    test(
      'isDictionary',
      false,
      [123, 'string', [123]],
      [{}, { a: 123 }, { a: 'string', b: 123, c: false }]
    )
    test(
      'isDictionary',
      true,
      [
        {},
        { a: 123 },
        { a: 'string', b: 123, c: false },
        { a: 123, b: 'string' },
      ],
      [123, [123], 'abc']
    )
    test(
      'isDictionary',
      { minLength: 2 },
      [
        { a: 1, b: 2 },
        { a: 1, b: 2, c: 3 },
      ],
      [123, {}, { a: 123 }]
    )
    test(
      'isDictionary',
      { maxLength: 3 },
      [{}, { a: 1 }, { a: 1, b: 2, c: 3 }],
      [123, { a: 1, b: 2, c: 3, d: 4 }]
    )
    test(
      'isDictionary',
      { key: { isIn: ['a', 'b'] } },
      [{}, { a: 1 }, { a: 1, b: 2 }],
      [{ a: 'a', d: 'b' }, { c: -1 }]
    )
    test(
      'isDictionary',
      { value: { isNatural: true } },
      [{}, { a: 1 }, { a: 1, b: 2, c: 3 }],
      [{ a: 'a' }, { a: -1 }]
    )
    var validationModel = {
      key: { isEmail: true },
      value: {
        isObject: {
          properties: {
            name: { isRequired: true },
            age: { isNatural: true, isRequired: false },
          },
        },
      },
    }
    test(
      'isDictionary',
      validationModel,
      [
        {
          'a@example.com': { name: 'Alice' },
          'b@example.com': { name: 'Bob', age: 33 },
        },
      ],
      [
        {
          'a@example.com': 'a',
        },
        {
          'a@example.com': { name: 'Alice', age: -5 },
        },
        {
          'not an email': { name: 'Bob', age: 33 },
        },
      ]
    )
  })

  it('isObject', function () {
    test('isObject', false, [123, 'string', [123]], [{}, { name: 'bob' }])
    test('isObject', true, [{}, { name: 'bob' }], [123, 'string', [123]])
    test(
      'isObject',
      { properties: { value: { isNatural: true } } },
      [{ value: 123 }, { value: 123, name: 'bob' }],
      [{ value: -5 }, { value: 'abc' }]
    )
    var validationModel = {
      properties: {
        address: {
          isObject: {
            properties: {
              street: {
                isRequired: true,
              },
              city: {
                isRequired: true,
              },
              zip: {
                isNatural: true,
              },
            },
          },
        },
        luckyNumbers: {
          isArray: {
            element: {
              isNatural: true,
            },
          },
        },
      },
    }
    test(
      'isObject',
      validationModel,
      [
        {
          address: {
            street: 'Elm Street',
            city: 'Springfield',
            zip: 12345,
          },
        },
        {
          address: {
            street: 'Elm Street',
            city: 'Springfield',
            zip: 12345,
          },
          luckyNumbers: [1, 13, 888],
        },
      ],
      [
        'test',
        123,
        {
          address: {
            street: 'Elm Street',
            city: 'Springfield',
            zip: -5,
          },
        },
        {
          address: {
            street: 'Elm Street',
            city: 'Springfield',
            zip: 12345,
          },
          luckyNumbers: [1, 'not a number', 888],
        },
      ]
    )
  })
})
