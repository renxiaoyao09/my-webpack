const path = require('path');

module.exports = {
	entry:'./src/index.js',
	output:{
		path:path.join(__dirname,'dist'),
		filename:'bundle.[hash:5].js'
	}
}