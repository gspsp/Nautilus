const Express = require(`express`)
let {
	Friend
} = require("../db.js")
let T = require("sequelize")
let C = require("memory-cache")
let J = require("jsonwebtoken")
let M = require("../methods.js")
let router = Express.Router()

//列出
router.all("/list", function(req, res, next) {
	Friend.findAll().then(rows => {
		res.send(rows)
	})
})

//鉴权
router.all("/*", M.ironGolem)

//添加
router.all("/push", function(req, res, next) {
	req.necs = ["name", "url"]
	next()
}, M.argChecker, function(req, res, next) {
	Friend.create({
		name: req.args.name,
		url: req.args.url
	}).then(row => {
		res.send(row)
	})
})
//删除
router.all("/remove", function(req, res, next) {
	req.necs = ["id"]
	next()
}, M.argChecker, function(req, res, next) {
	Friend.destroy({
		where: {
			id: req.args.id
		}
	}).then(res.status(200).send("删除成功！")).catch(res.status(403).send())
})
//更新
router.all("/update", function(req, res, next) {
	req.necs = ["id", "name", "url"]
	next()
}, M.argChecker, function(req, res, next) {
	Friend.update({
		name: req.args.name,
		url: req.args.url
	}, {
		where: {
			id: req.args.id
		}
	}).then(res.status(200).send("更新成功！")).catch(res.status(403).send())
})

module.exports = router
