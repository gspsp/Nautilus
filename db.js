let {
	Sequelize,
	DataTypes,
	Op
} = require("sequelize")

let Tables = new Sequelize("galasp", "root", process.env.MYSQL_ROOT_PASSWORD, {
	host: process.env.MYSQL_HOST,
	dialect: "mysql",
	logging: false,
	define: {
		charset: "utf8",
		collate: "utf8_general_ci"
	},
	dialectOptions: {
		dateStrings: true,
		typeCast: true
	},
	timezone: "+08:00"
})

let Artcle = Tables.define("artcle", {
	title: {
		type: DataTypes.STRING,
		allowNull: false,
		charset: "utf8"
	},
	cover: {
		type: DataTypes.STRING,
		charset: "utf8"
	},
	summary: {
		type: DataTypes.STRING,
		charset: "utf8"
	},
	logo: {
		type: DataTypes.STRING,
		charset: "utf8",
		defaultValue: "note"
	},
	cardStyle: {
		type: DataTypes.STRING,
		charset: "utf8",
		defaultValue: "big"
	},
	tagIds: {
		type: DataTypes.STRING,
		charset: "utf8",
		defaultValue: ""
	}
})

Artcle.sync({
	alter: true
})

let Tag = Tables.define("tag", {
	name: {
		type: DataTypes.STRING,
		allowNull: false,
		charset: "utf8"
	}
}, {
	indexes: [{
		unique: true,
		fields: ["name"]
	}]
})

Tag.sync({
	alter: true
})

let Artcle_Tag = Tables.define("artcle_tag", {
	artcleId: {
		type: DataTypes.INTEGER
	},
	tagId: {
		type: DataTypes.INTEGER
	}
})

Artcle_Tag.sync({
	alter: true
})

Artcle.belongsToMany(Tag, {
	through: Artcle_Tag
})

Tag.belongsToMany(Artcle, {
	through: Artcle_Tag
})

let Content = Tables.define("content", {
	artcleId: {
		type: DataTypes.INTEGER
	},
	markdown: {
		type: DataTypes.TEXT,
		charset: "utf8"
	},
	html: {
		type: DataTypes.TEXT,
		charset: "utf8"
	}
})

Content.sync({
	alter: true
})

Artcle.hasOne(Content)
Content.belongsTo(Artcle)

let Friend = Tables.define("friend", {
	name: {
		type: DataTypes.STRING,
		allowNull: false,
		charset: "utf8"
	},
	url: {
		type: DataTypes.STRING
	}
})

Friend.sync({
	alter: true
})

let Nav = Tables.define("nav", {
	title: {
		type: DataTypes.STRING,
		allowNull: false,
		charset: "utf8"
	},
	to: {
		type: DataTypes.STRING,
		charset: "utf8"
	},
	icon: {
		type: DataTypes.TEXT,
		charset: "utf8"
	}
})

Nav.sync({
	alter: true
})

let Info = Tables.define("info", {
	key: {
		type: DataTypes.STRING,
		allowNull: false,
		charset: "utf8"
	},
	value: {
		type: DataTypes.STRING,
		charset: "utf8"
	},
	tag: {
		type: DataTypes.STRING,
		charset: "utf8"
	}
})

Info.sync({
	alter: true
})

let User = Tables.define("user", {
	mail: {
		type: DataTypes.STRING,
		allowNull: false,
		charset: "utf8"
	},
	password: {
		type: DataTypes.STRING
	},
	verify: {
		type: DataTypes.BOOLEAN,
		defaultValue: false
	},
	position: {
		type: DataTypes.STRING,
		defaultValue: "joker"
	}
})

User.sync({
	alter: true
})

let Oauth = Tables.define("oauth", {
	userId: {
		type: DataTypes.INTEGER
	},
	openId: {
		type: DataTypes.STRING
	},
	type: {
		type: DataTypes.STRING,
		charset: "utf8"
	}
})

Oauth.sync({
	alter: true
})

User.hasMany(Oauth)
Oauth.belongsTo(User)

let Config = Tables.define("config", {
	key: {
		type: DataTypes.STRING,
		allowNull: false,
		charset: "utf8"
	},
	value: {
		type: DataTypes.STRING,
		charset: "utf8"
	},
	tag: {
		type: DataTypes.STRING,
		charset: "utf8"
	}
})

Config.sync({
	alter: true
})

module.exports = {
	Artcle,
	Tag,
	Artcle_Tag,
	Content,
	Op,
	Friend,
	Nav,
	Info,
	User,
	Oauth,
	Config
}