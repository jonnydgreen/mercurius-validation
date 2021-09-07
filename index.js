'use strict'

const fp = require('fastify-plugin')
const Validation = require('./lib/validation')
const { validateOpts } = require('./lib/utils')

const plugin = fp(
  async function (app, opts) {
    validateOpts(opts)

    // Start validation and register hooks
    const validation = new Validation(opts)

    // Override resolvers with validation handlers
    // TODO: validate policy
    const validationPolicy = opts.validation ?? {}
    validation.registerValidationPolicy(app.graphql.schema, validationPolicy)

    // Add hook to regenerate the resolvers when the schema is refreshed
    app.graphql.addHook('onGatewayReplaceSchema', async (instance, schema) => {
      validation.registerValidationPolicy(schema)
    })
  },
  {
    name: 'mercurius-validation',
    fastify: '>=3.x',
    dependencies: ['mercurius']
  }
)

module.exports = plugin