const Express = require("express")
let {
	User
} = require("../db.js")
let T = require("sequelize")
let C = require("memory-cache")
let J = require("jsonwebtoken")
let M = require("../methods.js")
let router = Express.Router()



//检查
router.all("/check", function(req, res, next) {
	req.necs = ["mail"]
	next()
}, M.argChecker, function(req, res, next) {
	User.findOrCreate({
		where: {
			mail: req.args.mail
		}
	}).then(([user, created]) => {
		if (created || !user.verify) {
			//新用户（注意防止恶意请求）
			if (C.get(`Code:${user.id}`) == null) {
				let code = M.genVerificationCode()
				C.put(`Code:${user.id}`, code, 1000 * 60 * 30) //30分钟有效
				M.mail(req.args.mail, "验证码（30分钟内有效）", `<h1>${code}</h1>`)
			}
			res.status(201).send(user.id.toString()) //201代表离成功还差一步
		} else {
			//老用户
			C.put(`User:${user.id}`, user.dataValues, 1000 * 60 * 60 * 24) //24小时
			res.send(user.id.toString())
		}
	}).catch(e => {
		console.log(e)
	})
})
//验证邮箱
router.all("/verify", function(req, res, next) {
	req.necs = ["id", "code", "password"]
	next()
}, M.argChecker, function(req, res, next) {
	//预处理
	req.args.password = M.md5(req.args.password)
	//检查验证码是否正确
	if (C.get(`Code:${req.args.id}`) == req.args.code) {
		//验证码正确则删除内存
		C.del(`Code:${req.args.id}`)
		//更新数据库用户状态
		User.update({
			verify: true,
			password: req.args.password
		}, {
			where: {
				id: req.args.id
			},
			returning: true
		}).then(function(user) {
			C.put(`User:${user.id}`, user.dataValues, 1000 * 60 * 60 * 24) //24小时
			//签发jwt
			let token = J.sign({
				id: user.id,
				position: user.position
			}, process.env.MYSQL_ROOT_PASSWORD, {
				expiresIn: "1day"
			})
			res.send(token)
		}).catch(e => {
			console.log(e)
		})
	} else {
		//验证码不正确
		res.status(403).send("验证码错误！")
	}
})
//登入
router.all("/sign", function(req, res, next) {
	req.necs = ["id", "password"]
	next()
}, M.argChecker, function(req, res, next) {
	//预处理
	req.args.password = M.md5(req.args.password)
	//读取用户数据
	let user = C.get(`User:${req.args.id}`)
	if (user != null) {
		if (user.password == req.args.password) {
			//签发jwt
			let token = J.sign({
				id: user.id,
				position: user.position
			}, process.env.MYSQL_ROOT_PASSWORD, {
				expiresIn: "1day"
			})
			res.send(token)
		} else {
			res.status(403).send("密码错误！")
		}
	} else {
		res.status(403).send("非法请求！")
	}
})

module.exports = router
