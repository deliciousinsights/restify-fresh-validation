var index = require('../../lib/index')

describe('Conditions', function () {
  it('exists', function (done) {
    var validationReq = { params: { a: 'fdsa' } }
    var validationModel = {
      resources: {
        a: { exists: true },
        b: { isRequired: index.when.exists({ variable: 'a' }) },
      },
    }

    var missingErrors = index.validation.process(
      validationModel,
      validationReq,
      { errorsAsArray: true }
    )
    missingErrors.length.should.equal(1)
    missingErrors[0].type.should.equal('MISSING')

    validationReq.params.b = 'test'
    var presentErrors = index.validation.process(
      validationModel,
      validationReq,
      { errorsAsArray: true }
    )
    presentErrors.length.should.equal(0)

    validationReq.params = {}
    var notRequiredErrors = index.validation.process(
      validationModel,
      validationReq,
      { errorsAsArray: true }
    )
    notRequiredErrors.length.should.equal(0)

    done()
  })

  it('paramMatches', function (done) {
    var validationReq = { params: { a: 'fdsa' } }
    var validationModel = {
      resources: {
        a: { isRequired: false },
        b: {
          isRequired: index.when.paramMatches({
            variable: 'a',
            matches: ['asdf', 'fdsa'],
          }),
        },
      },
    }

    var errors = index.validation.process(validationModel, validationReq, {
      errorsAsArray: true,
    })
    errors.length.should.equal(1)
    errors[0].type.should.equal('MISSING')

    validationModel = {
      resources: {
        a: { isRequired: false },
        b: {
          isRequired: index.when.paramMatches({
            variable: 'a',
            matches: ['fdsa'],
          }),
        },
      },
    }

    errors = index.validation.process(validationModel, validationReq, {
      errorsAsArray: true,
    })
    errors.length.should.equal(1)
    errors[0].type.should.equal('MISSING')

    validationModel = {
      resources: {
        a: { isRequired: false },
        b: {
          isRequired: index.when.paramMatches({
            variable: 'a',
            matches: ['asdf'],
          }),
        },
      },
    }

    errors = index.validation.process(validationModel, validationReq, {
      errorsAsArray: true,
    })
    errors.length.should.equal(0)

    validationReq.query = { a: 'test' }
    validationModel = {
      resources: {
        a: { isRequired: true },
      },
      queries: {
        a: {
          isRequired: index.when.paramMatches({
            scope: 'resources',
            variable: 'a',
            matches: ['fdsa'],
          }),
        },
      },
    }

    errors = index.validation.process(validationModel, validationReq, {
      errorsAsArray: true,
    })
    errors.length.should.equal(0)

    done()
  })
})
