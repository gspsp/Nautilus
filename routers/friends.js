const Express = require(`express`)
let Db = require("../db.js")
let Type = require("sequelize")
let Cache = require("memory-cache")
let Jwt = require("jsonwebtoken")
let Methods = require("../methods.js")
let router = Express.Router()

let Friend = Db.define("friend", {
	name: {
		type: Type.STRING,
		allowNull: false,
		charset: "utf8"
	},
	url: {
		type: Type.STRING
	}
})

Friend.sync({
	alter: true
})
//列出
router.all("/list", function(req, res, next) {
	Friend.findAll()
		.then(rows => {
			let data = []
			rows.forEach(row => {
				data.push(row.dataValues)
			})
			return data
		})
		.then((data) => {
			res.send(data)
		})
})
//鉴权
router.all("/*", function(req, res, next) {
	Jwt.verify(req.get("Authorization"), process.env.MYSQL_ROOT_PASSWORD, function(err, input) {
		if (err == null) {
			let user = Cache.get(`User:${input.id}`)
			if (user != null) {
				if (user.role == "admin") {
					req.user = user
					next()
				} else {
					res.status(403).send("权限不够！")
				}
			} else {
				res.status(403).send("请重新登录！")
			}

		} else {
			res.status(403).send("请先登录！")
		}
	})
})
//添加
router.all("/push", function(req, res, next) {
	//参数验证
	let e = Methods.parmCheck(req, ["name", "url"])
	if (e != null) {
		res.status(403).send(e)
		return
	}

	Friend.create({
		name: req.input.name,
		url: req.input.url
	}).then(res.status(200).send("添加成功！")).catch(res.status(403).send())
})
//删除
router.all("/remove", function(req, res, next) {
	//参数验证
	let e = Methods.parmCheck(req, ["id"])
	if (e != null) {
		res.status(403).send(e)
		return
	}

	Friend.destroy({
		where: {
			id: req.input.id
		}
	}).then(res.status(200).send("删除成功！")).catch(res.status(403).send())
})
//更新
router.all("/update", function(req, res, next) {
	//参数验证
	let e = Methods.parmCheck(req, ["id", "name", "url"])
	if (e != null) {
		res.status(403).send(e)
		return
	}

	Friend.update({
		name: req.input.name,
		url: req.input.url
	}, {
		where: {
			id: req.input.id
		}
	}).then(res.status(200).send("更新成功！")).catch(res.status(403).send())
})

module.exports = router
