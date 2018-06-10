tsc
mkdir dist
uglifyjs ./js/*.js -c -o ./dist/jzbuilder.min.js --source-map "url='jzbuilder.min.js.map'"