let Sequelize = require('sequelize')

let db = new Sequelize("galasp", "root", process.env.MYSQL_ROOT_PASSWORD, {
	host: "mysql",
	dialect: "mysql",
	logging: false,
	define: {
		charset: "utf8",
		collate: "utf8_general_ci"
	}
})

module.exports = db
