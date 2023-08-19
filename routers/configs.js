const Express = require(`express`)
let {
	Config
} = require("../db.js")
let C = require("memory-cache")
let M = require("../methods.js")
let router = Express.Router()


//列出
router.all("/list", function(req, res, next) {
	req.necs = []
	next()
}, M.argChecker, function(req, res, next) {
	Config.findAll().then(rows => {
		res.send(rows)
	})
})

//鉴权
router.all("/*", M.ironGolem)

//添加
router.all("/push", function(req, res, next) {
	req.necs = ["key", "value", "tag"]
	next()
}, M.argChecker, function(req, res, next) {
	Config.create({
		key: req.args.key,
		value: req.args.value,
		tag: req.args.tag
	}).then(row => {
		res.send(row)
	})
})

//删除
router.all("/remove", function(req, res, next) {
	req.necs = ["id"]
	next()
}, M.argChecker, function(req, res, next) {
	Config.destroy({
		where: {
			id: req.args.id
		}
	}).then(res.status(200).send("删除成功！")).catch(res.status(403).send())
})

//更新
router.all("/update", function(req, res, next) {
	req.necs = ["id", "key", "value", "tag"]
	next()
}, M.argChecker, function(req, res, next) {
	Config.update({
		key: req.args.key,
		value: req.args.value,
		tag: req.args.tag
	}, {
		where: {
			id: req.args.id
		}
	}).then(res.status(200).send("更新成功！")).catch(res.status(403).send())
})

module.exports = router
