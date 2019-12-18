import Goa from '../../../src'

const goa = new Goa()
goa.use((ctx) => {
  /* start example */
  ctx.response.etag = 'md5hashsum'
  ctx.response.etag = '"md5hashsum"'
  ctx.response.etag = 'W/"123456789"'
  /* end example */
})
