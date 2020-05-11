const path = require('path');
const fs = require('fs');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
//transfromFormAst把抽象语法树还原为es5代码
const {transformFromAst} = require('@babel/core');
//transfromFormAst过程中的转换规则 
const core = require('@babel/core');


module.exports = {
	getAst:(path)=>{
		// 内容
		const content = fs.readFileSync(path,'utf-8');
		// 抽象语法树
		return parser.parse(content,{
			sourceType:"module", // 指定依赖的类型  module为es6的导入类型
		});
	},
	getDependecies:(ast,filename)=>{
		// 提取抽象语法树里节点类型为ImportDeclaration的node对象
		const dependecies = {};
		traverse(ast,{
			ImportDeclaration({node}){
				const dirname = path.dirname(filename);
				const newfile = './'+path.posix.join(dirname,node.source.value);
				dependecies[node.source.value] = newfile;
				// console.log(newfile,dirname,node.source.value)
			}
		});
		return dependecies;
	},
	getCode:(ast)=>{
		// 把ast转换为es5
		const {code} = transformFromAst(ast,null,{
			presets:["@babel/preset-env"],
		});
		return code;
	}
}