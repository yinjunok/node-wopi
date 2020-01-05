const fs = require('fs')
const path = require('path')
const Koa = require('koa')
const Hash = require('hash.js')
const Router = require('@koa/router')

const app = new Koa()
const router = new Router()

router.get('/files/:name', (ctx, next) => {
  const name = ctx.params.name
  const p = path.resolve('./office', name)
  const stat = fs.statSync(p)
  const file = fs.readFileSync(p, 'utf8')
  ctx.body = {
    BaseFileName: name,
    OwnerId: 'admin',
    Size: stat.size,
    SHA256: Hash.sha256().update(file).digest('hex'),
    Version: Date.now(),
  }
  ctx.response.set('Content-Type', 'application/json')
})

router.post('/files/:name/contents', (ctx, next) => {
  const name = ctx.params.name
  const p = path.resolve('./office', name)
  const s = fs.createReadStream(p)
  ctx.response.set("Content-type", "application/octet-stream")
  ctx.body = s
})

app
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(8080, () => {
  console.log('[demo] route-use-middleware is starting at port 8080')
})

