const Express = require(`express`)
let {
	Artcle,
	Tag,
	Content,
	Op,
	Artcle_Tag
} = require("../db.js")
let C = require("memory-cache")
let M = require("../methods.js")
let S = require('async').series
let router = Express.Router()

//列出
router.all("/emerge", function(req, res, next) {
	req.necs = ["limit"]
	next()
}, M.argChecker, function(req, res, next) {
	Artcle.findAndCountAll({
		...req.args,
		order: [
			["id", "DESC"]
		]
	}).then(data => {
		res.send(data)
	})
})

//列出
router.all("/list", function(req, res, next) {
	req.necs = ["offset", "limit"]
	next()
}, M.argChecker, function(req, res, next) {
	Artcle.findAll({
		...req.args,
		order: [
			["id", "DESC"]
		]
	}).then(data => {
		res.send(data)
	})
})

router.all("/listByTagIds", function(req, res, next) {
	req.necs = ["offset", "limit", "tagIds"]
	next()
}, M.argChecker, function(req, res, next) {
	req.state.tagIds = JSON.parse(req.args.tagIds)
	Artcle.findAll({
		...req.args,
		include: [{
			model: Tag,
			where: {
				id: {
					[Op.in]: req.state.tagIds
				}
			}
		}],
		where: {
			tagIds: {
				[Op.like]: `%${req.state.tagIds.sort().join('%')}%`
			}
		},
		order: [
			["id", "DESC"]
		]
	}).then(data => {
		res.send(data)
	})
})

router.all("/emergeByTagIds", function(req, res, next) {
	req.necs = ["tagIds"]
	next()
}, M.argChecker, function(req, res, next) {
	req.state.tagIds = JSON.parse(req.args.tagIds)
	Artcle.findAndCountAll({
		limit: 20,
		include: [{
			model: Tag,
			where: {
				id: {
					[Op.in]: req.state.tagIds
				}
			}
		}],
		where: {
			tagIds: {
				[Op.like]: `%${req.state.tagIds.sort().join('%')}%`
			}
		},
		order: [
			["id", "DESC"]
		]
	}).then(data => {
		res.send(data)
	})
})

router.all("/show", function(req, res, next) {
	req.necs = ["id"]
	next()
}, M.argChecker, function(req, res, next) {
	Artcle.findByPk(req.args.id, {
		include: [Tag, Content]
	}).then(data => {
		if (data != null) {
			res.send(data)
		} else {
			res.status(403).send("非法请求！")
		}
	})
})

//鉴权
router.all("/*", M.ironGolem)

//添加
router.all("/push", function(req, res, next) {
	req.necs = ["title", "cover", "summary"]
	next()
}, M.argChecker, function(req, res, next) {
	Artcle.create(req.args).then(row => {
		res.send(row)
	})
})

//删除
router.all("/remove", function(req, res, next) {
	req.necs = ["id"]
	next()
}, M.argChecker, function(req, res, next) {
	Artcle.destroy({
		where: req.args
	}).then(res.status(200).send("删除成功！")).catch(res.status(403).send())
})

//更新
router.all("/update", function(req, res, next) {
	req.necs = ["id", "title", "cover", "summary", "logo", "cardStyle"]
	next()
}, M.argChecker, function(req, res, next) {
	Artcle.update(req.args, {
		where: {
			id: req.args.id
		}
	}).then(res.status(200).send("更新成功！")).catch(res.status(403).send())
})

module.exports = router