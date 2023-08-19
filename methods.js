let Nodemailer = require('nodemailer')
let J = require("jsonwebtoken")
let C = require("memory-cache")
let rules = require("./rules.js")
let transporter = Nodemailer.createTransport({
	host: "smtpdm.aliyun.com",
	port: 465,
	secureConnection: true,
	auth: {
		user: "hedw1g@galasp.cn",
		pass: process.env.MYSQL_ROOT_PASSWORD
	}
})

module.exports = {
	mail: function(to, subject, html) {
		let mailOptions = {
			from: "鹦鹉螺号<hedw1g@galasp.cn>",
			to: to,
			subject: subject,
			html: html
		}
		transporter.sendMail(mailOptions, function(error, info) {
			if (error) {
				console.log(error)
				return
			}
		})
	},
	genVerificationCode: function() {
		let word = String.fromCodePoint(Math.round(Math.random() * 20901) + 19968) //生成随机汉字
		let code = Buffer.from(word).toString('base64').replace('/', '-')
		return code
	},
	argChecker: function(req, res, next) {
		//去除无关项
		let args = req.args
		req.args = {}
		req.necs.forEach(nec => {
			req.args[nec] = args[nec]
		})
		//筛选不合法项
		let miss = []
		req.necs.forEach(nec => {
			if (req.args[nec] == undefined) {
				miss.push(nec)
			} else {
				if (rules[nec] != undefined) {
					//规则验证
					let legal = true
					for (let i = 0; i < rules[nec].length && legal; i++) {
						legal &= rules[nec][i].test(req.args[nec])
					}
					if (legal) {
						//合法,数字项转为int
						if (req.args[nec] % 1 == 0 && req.args[nec].length != 0) {
							req.args[nec] = parseInt(req.args[nec])
						}
					} else {
						//不合法
						miss.push(nec)
					}
				}
			}
		})
		if (miss.length != 0) {
			res.status(403).send(`缺少合法参数${miss.join('、')}！`)
			return
		} else {
			next()
		}
	},
	md5: require("md5"),
	ironGolem: function(req, res, next) {
		// 调试环境
		if (req.isDEBUG) {
			next()
			return
		}
		J.verify(req.get("Authorization"), process.env.MYSQL_ROOT_PASSWORD, function(err, args) {
			if (err == null) {
				let user = C.get(`User:${args.id}`)
				if (user != null) {
					if (user.position == "king") {
						req.user = user
						next()
					} else {
						res.status(403).send("权限不够！")
					}
				} else {
					res.status(302).send("请重新登录！")
				}

			} else {
				res.status(403).send("请先登录！")
			}
		})
	}
}
