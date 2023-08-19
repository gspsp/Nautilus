const Express = require(`express`)
let {
	Artcle,
	Tag,
	Content,
	Op
} = require("../db.js")
let C = require("memory-cache")
let M = require("../methods.js")
let S = require('async').series
let router = Express.Router()

//鉴权
router.all("/*", M.ironGolem)

//添加
router.all("/push", function(req, res, next) {
	req.necs = ["artcleId", "markdown", "html"]
	next()
}, M.argChecker, function(req, res, next) {
	Content.create(req.args).then(row => {
		res.send(row)
	})
})

//更新
router.all("/update", function(req, res, next) {
	req.necs = ["id", "artcleId", "markdown", "html"]
	next()
}, M.argChecker, function(req, res, next) {
	Content.update(req.args, {
		where: {
			id: req.args.id
		}
	}).then(res.status(200).send("更新成功！")).catch(res.status(403).send())
})

module.exports = router
