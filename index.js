const fs = require('fs')
const path = require('path')
const Koa = require('koa')
const Router = require('@koa/router')

const app = new Koa()
const router = new Router()

router.get('/wopi/files/:name', (ctx, next) => {
  try {
    const name = ctx.params.name
    const p = path.resolve('./office', name)
    const stat = fs.statSync(p)
    console.log(Date.now(), '返回文件信息', name)
    ctx.body = {
      BaseFileName: name,
      OwnerId: 'admin',
      Size: stat.size,
      Version: Date.now(),
    }
    ctx.response.set('Content-Type', 'application/json')
  } catch (err) {
    console.log(Date.now(), '返回文件信息错误', err)
    throw err
  }
})

router.get('/wopi/files/:name/contents', (ctx, next) => {
  try {
    const name = ctx.params.name
    const p = path.resolve('./office', name)
    const s = fs.createReadStream(p)
    console.log(Date.now(), '返回文件流', name)
    const stat = fs.statSync(p)
    ctx.response.set("Content-type", "application/octet-stream")
    ctx.response.set('Content-Length', stat.size)
    ctx.response.set('Content-Disposition', `attachment;filename=${name}`)
    ctx.body = s
  } catch (err) {
    console.log(Date.now(), '返回文件信息流', err)
    throw err
  }
})

app
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(8080, () => {
  console.log('[demo] route-use-middleware is starting at port 8080')
})

