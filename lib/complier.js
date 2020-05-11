const path = require('path');
const fs = require('fs');
const {getAst,getDependecies,getCode} = require('./parser');


module.exports =  class Complier{
	constructor(options){
		const {entry,output} = options;
		this.entry = entry;
		this.output = output;
		this.modules = [];
	}
	run(){
		const info = this.build(this.entry);
		console.log(info)
		this.modules.push(info);
		for (var i = 0; i < this.modules.length; i++) {
			const item = this.modules[i];
			const {dependecies} = item;
			if (dependecies) {
				for (var j in dependecies) {
					this.modules.push(this.build(dependecies[j]));
				}
			}
		}
		const obj = {};
		this.modules.forEach((item,index)=>{
			obj[item.filename] = {
				id:index,
				dependecies : item.dependecies,
				code : item.code
			}
		});
		this.file(obj);
	}
	build(filename){
		let ast = getAst(filename);
		let dependecies = getDependecies(ast,filename);
		let code = getCode(ast);
		return {
			filename,
			dependecies,
			code
		}
	}
	file(graph){
		let modules = '';

		graph.forEach(mod=>{
			modules += `
				${mod.id}:[
					function(require,module,exports){
						${mod.code}
					},
					${mod.dependecies}
				]
			`;
		})

		const result = `
			(function(){

			})({${modules}})
		`;
	}
}