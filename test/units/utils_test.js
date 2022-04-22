var should = require('should')
var utils = require('../../lib/utils')

describe('Utils', function () {
  describe('hasValue', function () {
    it('for null', function (done) {
      utils.hasValue(null).should.false
      done()
    })

    it('for undefined', function (done) {
      utils.hasValue(undefined).should.false
      done()
    })

    it('for string', function (done) {
      utils.hasValue('').should.false
      utils.hasValue('a').should.true
      done()
    })

    it('for array', function (done) {
      utils.hasValue([]).should.false
      utils.hasValue(['a']).should.true
      done()
    })
  })

  describe('getExternalScope', function () {
    it('for null', function (done) {
      ;(utils.getExternalScope(null) === undefined).should.be.true
      done()
    })

    it('for resources', function (done) {
      utils.getExternalScope('resources').should.equal('params')
      done()
    })
    it('for queries', function (done) {
      utils.getExternalScope('queries').should.equal('query')
      done()
    })
    it('for body', function (done) {
      utils.getExternalScope('content').should.equal('body')
      done()
    })
    it('for headers', function (done) {
      utils.getExternalScope('headers').should.equal('headers')
      done()
    })
  })

  describe('getInternalScope', function () {
    it('for null', function (done) {
      ;(utils.getInternalScope(null) === undefined).should.be.true
      done()
    })

    it('for resources', function (done) {
      utils.getInternalScope('params').should.equal('resources')
      done()
    })
    it('for queries', function (done) {
      utils.getInternalScope('query').should.equal('queries')
      done()
    })
    it('for body', function (done) {
      utils.getInternalScope('body').should.equal('content')
      done()
    })
    it('for headers', function (done) {
      utils.getInternalScope('headers').should.equal('headers')
      done()
    })
  })
})
