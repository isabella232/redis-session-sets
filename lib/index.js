'use strict'

const CSRF = require('csrf')

const Session = require('./session')
const { ms } = require('./utils')
const Store = require('./store')

module.exports = (app, options) => {
  options.key = options.key || 'session-id'
  options.overwrite = true
  options.httpOnly = options.httpOnly !== false
  options.signed = options.signed !== false
  options.maxAge = ms(options.maxAge || '28 days')

  const store = new Store(options)
  const tokens = new CSRF(options)

  return Object.assign(koaRedisSessionSets, {
    store,
    tokens,
    options,
    createSession,
    getReferenceKey
  })

  function koaRedisSessionSets (ctx, next) {
    ctx.session = createSession(ctx)
    return next()
  }

  // create the session
  function createSession (ctx) {
    return new Session(ctx, store, tokens, options)
  }

  // get the key for a reference set
  function getReferenceKey (field, value) {
    return store.getReferenceKey(field, value)
  }
}
