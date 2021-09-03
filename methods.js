let Nodemailer = require('nodemailer')
let transporter = Nodemailer.createTransport({
	host: "smtpdm.aliyun.com",
	port: 465,
	secureConnection: true,
	auth: {
		user: "hedw1g@galasp.cn",
		pass: process.env.MYSQL_ROOT_PASSWORD
	}
})
let rules = {
	mail: new RegExp(
		/^[0-9a-zA-z].+?@(?:126\.com|qq\.com|88\.com|139\.com|189\.com|aliyun\.com|sina\.cn|sina\.com|mail\\.sohu\.com|263\.net|xinnet\.com)$/
	),
	src: new RegExp(/^https:\/\/.+?$/),
	tags: new RegExp(/^[^、 ]+?(、[^、 ]+?)*$/),
	name: new RegExp(/^[^ ]+$/),
	url: new RegExp(/^(http|https):\/\/.+?$/)
}

let methods = {
	parmCheck: function(req, nece) {
		let miss = []
		nece.forEach(parm => {
			if (req.input[parm] == undefined) {
				miss.push(parm)
			} else {
				if (rules[parm] != undefined) {
					//存在规则
					if (!rules[parm].test(req.input[parm])) {
						miss.push(parm)
					}
				}
			}
		})
		return miss.length != 0 ? `缺少合法参数${miss.join('、')}！` : null
	},
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
	}
}

module.exports = methods
