/* src/config-static.js */
import Static from 'koa-static'

/**
 * Configure the middleware.
 * @param {StaticConfig} config
 */
function configure(config) {
  const middleware = Static(config)
  return middleware
}

/* documentary types/static.xml */

export default configure