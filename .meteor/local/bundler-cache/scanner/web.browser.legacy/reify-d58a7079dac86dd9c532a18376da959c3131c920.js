
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./popover.cjs.production.min.js')
} else {
  module.exports = require('./popover.cjs.development.js')
}
