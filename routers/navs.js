const Express = require(`express`)
let {
	Nav
} = require("../db.js")
let C = require("memory-cache")
let J = require("jsonwebtoken")
let M = require("../methods.js")
let router = Express.Router()

//列出
router.all("/list", function(req, res, next) {
	Nav.findAll().then(rows => {
		res.send(rows)
	})
})

//鉴权
router.all("/*", M.ironGolem)

//添加
router.all("/push", function(req, res, next) {
	req.necs = ["title", "to", "icon"]
	next()
}, M.argChecker, function(req, res, next) {
	Nav.create(req.args).then(row => {
		res.send(row)
	})
})
//删除
router.all("/remove", function(req, res, next) {
	req.necs = ["id"]
	next()
}, M.argChecker, function(req, res, next) {
	Nav.destroy({
		where: req.args
	}).then(res.status(200).send("删除成功！")).catch(res.status(403).send())
})
//更新
router.all("/update", function(req, res, next) {
	req.necs = ["id", "title", "to", "icon"]
	next()
}, M.argChecker, function(req, res, next) {
	Nav.update(req.args, {
		where: {
			id: req.args.id
		}
	}).then(res.status(200).send("更新成功！")).catch(res.status(403).send())
})

module.exports = router
