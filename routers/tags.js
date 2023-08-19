const Express = require(`express`)
let {
	Artcle,
	Tag,
	Artcle_Tag,
	Op
} = require("../db.js")
let C = require("memory-cache")
let M = require("../methods.js")
let S = require('async').series
let router = Express.Router()


//列出
router.all("/list", function(req, res, next) {
	Tag.findAll(req.args).then(rows => {
		res.send(rows)
	})
})

//鉴权
router.all("/*", M.ironGolem)

//添加
router.all("/push", function(req, res, next) {
	req.necs = ["name"]
	next()
}, M.argChecker, function(req, res, next) {
	Tag.create(req.args, {
		ignoreDuplicates: true
	}).then(row => {
		res.send(row)
	})
})

//删除
router.all("/remove", function(req, res, next) {
	req.necs = ["id"]
	next()
}, M.argChecker, function(req, res, next) {
	S([function(next) {
		Artcle.findAll({
			include: [{
				model: Tag,
				where: {
					id: req.args.id
				}
			}]
		}).then(artcles => {
			//找到 需要更新的 artcles 逐个添加任务
			let tasks = []
			artcles.forEach(artcle => {
				tasks.push(function(next) {
					let tagIds = artcle.tagIds.split(',')
					let place = tagIds.indexOf(req.args.id)
					if (place != -1) tagIds.splice(place, 1)
					Artcle.update({
						tagIds: tagIds.sort().join(',')
					}, {
						where: {
							id: artcle.id
						}
					}).then(next(null), e => next(e))
				})
			})
			//执行更新任务，此处可能消耗时间较长
			S(tasks, function(e) {
				if (e != null) {
					//返回错误信息
					next(e)
				} else {
					//进入下一步
					next(null)
				}
			})
		})
	}, function(next) {
		Tag.destroy({
			where: req.args
		}).then(next(null), e => next(e))
	}], function(e) {
		if (e != null) {
			console.log(e)
			res.status(500).send("删除失败！")
		} else {
			res.status(200).send("删除成功！")
		}
	})
})

//更新
router.all("/update", function(req, res, next) {
	req.necs = ["id", "name"]
	next()
}, M.argChecker, function(req, res, next) {
	Tag.update(req.args, {
		where: {
			id: req.args.id
		}
	}).then(res.status(200).send("更新成功！")).catch(res.status(403).send())
})

//绑定
router.all("/bind", function(req, res, next) {
	req.necs = ["tagId", "artcleId"]
	next()
}, M.argChecker, function(req, res, next) {
	S({
		artcle: function(next) {
			// Artcle.findByPk(req.args.artcleId)
			// 	.then(artcle => next(null, artcle), e => next(e))
			Artcle.findOne({
				include: [{
					model: Tag
				}],
				where: {
					id: req.args.artcleId
				}
			}).then(artcle => next(null, artcle), e => next(e))
		},
		tag: function(next) {
			Tag.findByPk(req.args.tagId)
				.then(tag => next(null, tag), e => next(e))
		}
	}, function(e, r) {
		if (e != null) {
			console.log(e)
			res.status(500).send("绑定失败！")
		} else {
			S([function(next) {
				//绑定
				r.artcle.addTag(r.tag).then(next(null), e => next(e))
			}, function(next) {
				//重整artcle 的 tagIds
				req.state.tagIds = []
				r.artcle.tags.forEach(tag => {
					req.state.tagIds.push(tag.id)
				})
				req.args.tagId = parseInt(req.args.tagId)
				if (!req.state.tagIds.includes(req.args.tagId)) req.state.tagIds.push(req.args.tagId)
				next(null)
			}, function(next) {
				//更新artcle 的 tagIds
				Artcle.update({
					tagIds: req.state.tagIds.sort().join(',')
				}, {
					where: {
						id: req.args.artcleId
					}
				}).then(next(null), e => next(e))
			}], function(e) {
				if (e != null) {
					console.log(e)
					res.status(500).send("绑定失败！")
				} else res.status(200).send("绑定成功！")
			})
		}
	})
})

//解绑
router.all("/unbind", function(req, res, next) {
	req.necs = ["tagId", "artcleId"]
	next()
}, M.argChecker, function(req, res, next) {
	S({
		artcle: function(next) {
			Artcle.findOne({
				include: [{
					model: Tag
				}],
				where: {
					id: req.args.artcleId
				}
			}).then(artcle => next(null, artcle), e => next(e))
		},
		tag: function(next) {
			Tag.findByPk(req.args.tagId)
				.then(tag => next(null, tag))
				.catch(e => next(e))
		}
	}, function(e, r) {
		if (e != null) {
			res.status(500).send("解绑失败！")
		} else {
			S([function(next) {
				//解绑
				r.artcle.removeTag(r.tag).then(next(null), e => next(e))
			}, function(next) {
				//重整artcle 的 tagIds
				req.state.tagIds = []
				r.artcle.tags.forEach(tag => {
					req.state.tagIds.push(tag.id)
				})
				req.args.tagId = parseInt(req.args.tagId)
				let place = req.state.tagIds.indexOf(req.args.tagId)
				if (place != -1) req.state.tagIds.splice(place, 1)
				next(null)
			}, function(next) {
				//更新artcle 的 tagIds
				Artcle.update({
					tagIds: req.state.tagIds.sort().join(',')
				}, {
					where: {
						id: req.args.artcleId
					}
				}).then(next(null), e => next(e))
			}], function(e) {
				if (e != null) {
					console.log(e)
					res.status(500).send("解绑失败！")
				} else res.status(200).send("解绑成功！")
			})
		}
	})
})

module.exports = router