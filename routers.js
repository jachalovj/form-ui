const router = require('koa-router')()
const views = require('koa-views')
const path = require('path')
const config = require('./config/config')
const { getAccountList, registAccount } = require('./utils/account')
const { submitForm } = require('./utils/form')

router.use(views(path.resolve(__dirname, './views'), { map: { html: 'swig' } }))

//登录验证
const checkLogin = async (username, password) => {
    if (!username) return false
    const accountList = await getAccountList();
    const accountMap = {};
    accountList.filter(ele => ele).map(item => {
        const currAccount =  item.split(':')[0]
        const currPassword = item.split(':')[1]
        accountMap[currAccount] = currPassword
    })
    if (!password) return accountMap[username] ? true : false
    else return accountMap[username] === password ? true : false
}

router.get('*', async (ctx,next) => {
    if (!config.whiteList.includes(ctx.originalUrl)) return await ctx.redirect('login')
    else {
        if (ctx.session.user) {
            const flag = await checkLogin(ctx.session.user)
            if (!flag) {
                delete ctx.session.user
                return await ctx.redirect('login', { text: '登录失败'} )
            }
        }
        return next()
    }
})


// 登录
router.get('/login', async (ctx, next) => {
    return await ctx.render('login', { title: '登录' })
});

router.post('/login', async (ctx, next) => {
    const body = ctx.request.body;
    try {
        const flag = await checkLogin(body.username, body.password)
        if (!flag) {
            await ctx.render('login', { text: '登录失败' });
        } else {
            ctx.session.user = body.username
            await ctx.redirect('form')
        }
    } catch (e) {
        await ctx.throw(e);
    }
});

// 登出
router.post('/logout', async (ctx, next) => {
    delete ctx.session.user;
    await ctx.redirect('/login');
})

// 注册
router.get('/regist', async (ctx, next) => {
    await ctx.render('regist', { title: '注册' })
})

router.post('/regist', async (ctx, next) => {
    const body = ctx.request.body;
    if (!body.key || body.key !== config.key) return ctx.render('regist', { text: '密钥错误' })
    try {
        const flag = await checkLogin(body.username);
        if (flag) {
            return ctx.render('regist', { text: '已存在用户' })
        } else {
            registAccount(body)
            ctx.session.user = body.username
            return ctx.render('form')
        }
    } catch (e) {
        await ctx.throw(e);
    }
});


// 表单
router.get('/form', async (ctx, next) => {
    const flag = await checkLogin(ctx.session.user)
    if (!flag) return await ctx.redirect('login')
    await ctx.render('form', { title: '表单' })
})

router.post('/form', async (ctx, next) => {
    const body = ctx.request.body;
    const user = ctx.session.user;
    if (!checkLogin(user)) return ctx.redirect('login')
    try {
        body.username = user
        submitForm(body)
        return ctx.redirect('form', { text: '提交成功'})
    } catch (e) {
        await ctx.throw(e);
    }
});


module.exports = router
