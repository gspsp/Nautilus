let Express = require("express")
let Db = require("./db.js")
let app = Express()
let port = 8881
//预处理
{
	let BodyParser = require("body-parser")
	app.use(BodyParser.urlencoded({
		extended: false
	}))
	app.use(BodyParser.json())
	app.use(function(req, res, next) {
		//跨域处理
		if (req.method == "OPTIONS") {
			res.status(200).send()
			return
		}
		req.input = {}
		switch (req.method) {
			case "POST":
				req.input = req.body
				break
			case "GET":
				req.input = req.query
				break
		}
		req.input.ip = req.headers["ali-cdn-real-ip"]
		next()
	})
}
// 调试环境
if (process.env.OS == "Windows_NT") {
	port = 80
	app.use(function(req, res, next) {
		console.log({
			"index": req.path.substr(1),
			"method": req.method,
			"input": req.input
		})
		next()
	})
}
//加载路由
{
	let Fs = require("fs")
	Fs.readdirSync("routers").forEach(function(router) {
		if (router.substr(-3) != "ban") {
			app.use(
				`/${router.substr(0,router.length-3)}`,
				require(`./routers/${router}`)
			)
			console.log(`/${router.substr(0,router.length-3)}/ is Loaded`)
		}
	})
}

/*-------------------起服务-------------------*/
var server = app.listen(port, "0.0.0.0", function() {
	var host = server.address().address
	var port = server.address().port
	console.log(`地址为 http://${host}:${port}`)
})
