#!/usr/bin/env node

function usage() {
    console.log('Usage:');
    console.log('  dll');
}

var args = process.argv.slice(2);

if (args.indexOf('--help') >= 0) {
    usage();
    process.exit(0);
}
var command = args.shift();

switch (command) {
    case 'dll':
        console.log('dll');
        break;

    default:
        usage();
        process.exit(1);
}
