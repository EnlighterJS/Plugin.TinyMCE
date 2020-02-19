const serve = require('koa-static');
const Koa = require('koa');
const app = new Koa();

app.use(serve('.'));

app.listen(8080);
console.log('started dev webserver..');