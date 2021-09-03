const Express = require("express")
let Db = require("../db.js")
let Type = require("sequelize")
let Cache = require("memory-cache")
let Jwt = require("jsonwebtoken")
let Md5 = require("md5")
let Methods = require("../methods.js")
let router = Express.Router()

let User = Db.define("user", {
	mail: {
		type: Type.STRING,
		allowNull: false,
		charset: "utf8"
	},
	password: {
		type: Type.STRING
	},
	verify: {
		type: Type.BOOLEAN,
		defaultValue: false
	},
	role: {
		type: Type.STRING,
		defaultValue: "joker"
	}
})

User.sync({
	alter: true
})

//检查
router.all("/check", function(req, res, next) {
	//参数验证
	let e = Methods.parmCheck(req, ["mail"])
	if (e != null) {
		res.status(403).send(e)
		return
	}

	User.findOrCreate({
		where: {
			mail: req.input.mail
		}
	}).then(([user, created]) => {
		if (created || !user.verify) {
			//新用户（注意防止恶意请求）
			if (Cache.get(`Code:${user.id}`) == null) {
				let code = Methods.genVerificationCode()
				Cache.put(`Code:${user.id}`, code, 1000 * 60 * 30) //30分钟有效
				Methods.mail(req.input.mail, "验证码（30分钟内有效）", `<h1>${code}</h1>`)
			}
			res.status(201).send(user.id.toString()) //201代表离成功还差一步
		} else {
			//老用户
			Cache.put(`User:${user.id}`, user.dataValues, 1000 * 60 * 60 * 24) //24小时
			res.send(user.id.toString())
		}
	}).catch(e => {
		console.log(e)
	})
})
//验证邮箱
router.all("/verify", function(req, res, next) {
	//参数验证
	let e = Methods.parmCheck(req, ["id", "code", "password"])
	if (e != null) {
		res.status(403).send(e)
		return
	}

	//预处理
	req.input.password = Md5(req.input.password)
	//检查验证码是否正确
	if (Cache.get(`Code:${req.input.id}`) == req.input.code) {
		//验证码正确则删除内存
		Cache.del(`Code:${req.input.id}`)
		//更新数据库用户状态
		User.update({
			verify: true,
			password: req.input.password
		}, {
			where: {
				id: req.input.id
			},
			returning: true
		}).then(function(user) {
			Cache.put(`User:${user.id}`, user.dataValues, 1000 * 60 * 60 * 24) //24小时
			//签发jwt
			let token = Jwt.sign({
				id: user.id,
				role: user.role
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
	//参数验证
	let e = Methods.parmCheck(req, ["id", "password"])
	if (e != null) {
		res.status(403).send(e)
		return
	}

	//预处理
	req.input.password = Md5(req.input.password)
	//读取用户数据
	let user = Cache.get(`User:${req.input.id}`)
	if (user != null) {
		if (user.password == req.input.password) {
			//签发jwt
			let token = Jwt.sign({
				id: user.id,
				role: user.role
			}, process.env.MYSQL_ROOT_PASSWORD, {
				expiresIn: "1day"
			})
			res.send(token)
		} else {
			res.status(400).send()
		}
	} else {
		res.status(403).send()
	}
})

module.exports = router
