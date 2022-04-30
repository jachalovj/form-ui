const Koa = require('koa');
const KoaBody = require('koa-body');
const compress = require('koa-compress');
const session = require('koa-session');

const routers = require('./routers');
const config = require('./config/config')

const app = new Koa();
app.keys = [config.secret]
// 响应压缩
app.use(compress());
app.use(session(app))

// 配置请求头
app.use(KoaBody({
    multipart: true,
    parsedMethods: ['POST', 'GET'],
    jsonLimit: '20mb',
    formLimit: '20mb',
    textLimit: '20mb',
    formidable: {
        maxFileSize: '2gb',
    },
}));

app.use(routers.routes(), routers.allowedMethods());

app.listen(config.PORT);
console.log('Listening on :' + config.PORT);
console.log(`host:  http://localhost:8866`);
