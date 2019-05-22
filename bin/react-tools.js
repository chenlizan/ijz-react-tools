#!/usr/bin/env node

const program = require('commander');
const webpack = require('webpack');
const dll_config = require('../script/webpack.dll.config');

// 定义版本和参数选项
program
    .version('0.1.0', '-v, --version')
    .option('dll', 'build dll');

// 必须在.parse()之前，因为node的emit()是即时的
program.on('--help', function(){
    console.log('  Examples:');
    console.log('');
    console.log('    this is an example');
    console.log('');
});

program.parse(process.argv);

if(program.dll) {
    console.log('building dll');
    const compiler = webpack(dll_config);
    compiler.run(()=>{});
}
