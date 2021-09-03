for (let i = 0; i < 1000; i++) {
	let word = String.fromCodePoint(Math.round(Math.random() * 20901) + 19968) //生成随机汉字
	let code = Buffer.from(word).toString('base64')
	if(code.search('/')!=-1){
		console.log(code)
	}
}
