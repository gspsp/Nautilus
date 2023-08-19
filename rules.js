let chameleon = {
	http: new RegExp(/^https*:\/\/.+$/),
	number: new RegExp(/^[0-9]+$/),
	noSpaces: new RegExp(/^[^ ]+$/),
	//长度
	k: new RegExp(/^[\s\S]{0,2}$/), //2
	l: new RegExp(/^[\s\S]{0,8}$/), //8
	m: new RegExp(/^[\s\S]{0,18}$/), //18
	n: new RegExp(/^[\s\S]{0,32}$/), //32
	kpowl: new RegExp(/^[\s\S]{0,256}$/), //2^8
	kpowm: new RegExp(/^[\s\S]{0,262144}$/), //2^18
	kpown: new RegExp(/^[\s\S]{0,4294967296}$/), //2^32
}

module.exports = {
	mail: [
		new RegExp(
			/^[0-9a-zA-z].+?@(?:126\.com|qq\.com|88\.com|139\.com|189\.com|aliyun\.com|sina\.cn|sina\.com|mail\\.sohu\.com|263\.net|xinnet\.com)$/
		),
		chameleon.m
	],
	src: [
		chameleon.http,
		chameleon.noSpaces,
		chameleon.kpowl
	],
	tags: [
		new RegExp(/^[^、 ]+?(、[^、 ]+?)*$/)
	],
	url: [
		chameleon.http,
		chameleon.noSpaces,
		chameleon.kpowl
	],
	limit: [
		chameleon.number,
		chameleon.k
	],
	offset: [
		chameleon.number,
		chameleon.kpowm
	],
	id: [
		chameleon.number,
		chameleon.l
	],
	artcleId: [
		chameleon.number,
		chameleon.l
	],
	markdown: [
		chameleon.kpown
	],
	html: [
		chameleon.kpown
	],
	name: [
		chameleon.m
	],
	key: [
		chameleon.m
	],
	value: [
		chameleon.kpowl
	],
	title: [
		chameleon.m
	],
	cover: [
		chameleon.http,
		chameleon.noSpaces,
		chameleon.kpowl
	],
	openId: [
		chameleon.kpowl
	]
}
