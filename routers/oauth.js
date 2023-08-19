const Express = require(`express`)
let {
	Oauth,
	User,
	Op
} = require("../db.js")
let C = require("memory-cache")
let M = require("../methods.js")
let S = require('async').series
let J = require("jsonwebtoken")
let fetch = require("node-fetch")
let router = Express.Router()

//检查
router.all("/qq", function(req, res, next) {
	fetch("https://graph.qq.com/oauth2.0/me?" + new URLSearchParams({
		access_token: req.get("Authorization")
	})).then(r => {
		r.text().then(t => {
			let j = JSON.parse(t.slice(10, -3))
			if (j.openid !== undefined) {
				C.put(`0token:${req.get("Authorization")}`, {
					openId: j.openid,
					type: "qq"
				}, 1000 * 60 * 30)
				res.status(200).send()
			} else {
				res.status(403).send()
			}
		})
	})
})

//登入
router.all("/sign", function(req, res, next) {
	let openId = C.get(`0token:${req.get("Authorization")}`).openId
	if (openId !== null) {
		Oauth.findOrCreate({
			where: {
				openId: openId
			},
			defaults: {
				type: C.get(`0token:${req.get("Authorization")}`).type
			}
		}).then(([oauth, created]) => {
			if (created || !oauth.userId) {
				//未绑定账号
				C.put(`Oauth:${openId}`, oauth.dataValues, 1000 * 60 * 30) //30分钟
				res.status(201).send("请完成绑定！") //201代表离成功还差一步
			} else {
				//已绑定账号
				User.findByPk(oauth.userId).then(user => {
					C.put(`User:${user.id}`, user.dataValues, 1000 * 60 * 60 * 24) //24小时
					//签发jwt
					let token = J.sign({
						id: user.id,
						position: user.position
					}, process.env.MYSQL_ROOT_PASSWORD, {
						expiresIn: "1day"
					})
					res.send(token)
				})
			}
		})
	} else {
		res.status(403).send()
	}
})

//绑定
router.all("/bind", function(req, res, next) {
	req.necs = ["openId"]
	next()
}, M.argChecker, function(req, res, next) {
	//先对token进行结构拿到userid，再从cache读oauthid
	let oauth = C.get(`Oauth:${req.args.openId}`)
	if (oauth !== null) {
		//拿到userId
		J.verify(req.get("Authorization"), process.env.MYSQL_ROOT_PASSWORD, function(err, user) {
			if (err == null) {
				Oauth.update({
					userId: user.id
				}, {
					where: {
						id: oauth.id
					}
				}).then(res.status(200).send("绑定成功！"))
			} else {
				res.status(403).send()
			}
		})
	} else {
		res.status(403).send()
	}
})

module.exports = router
