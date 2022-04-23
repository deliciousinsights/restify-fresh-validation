- Dependency updates (esp. vulns)

Lodash:

Closes https://github.com/z0mt3c/node-restify-validation/issues/86
Closes https://github.com/z0mt3c/node-restify-validation/pull/87

Mocha, Supertest (high priority)
Coveralls (removal? Is it even used?)
Should
Sinon
Validator (will likely require TONS of updates)

- Ensure all Validator.js features are properly exposed and use proper messaging
- Code cleanup within lib (ES2015+, strict mode)
- Migrate from Mocha / should to Jest
- Attempt to remove Lodash entirely (check used Lodash methods semantics)
- Address issues: https://github.com/z0mt3c/node-restify-validation/issues
- Setup Travis CI; check badge
- Migrate from Coveralls to Codecov; check badge
- Add Dependabot badges etc.
- Restore when applicable stripped parts of README (conditional checks, etc.)
- Deprecate content/resources/queries in favor of body/params/query
