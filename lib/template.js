// Simple JavaScript Templating by John Resig
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

var exports = module.exports
fs = require('fs');


// general template creation function
// data may be a template string, a filename of
// a function whose contents will be treated as a
// template string (see example).
exports.Template = function (data, callback) {

	// supplied data is a string
	if (typeof(data) === 'string')
	{	
		// is the string a filename?
		if (data.match(/^(\/|[A-Z]:\\).+/i)
			/*|| data.match(/[\d\w_\.]+.\w+/i)*/)
			return exports.loadTemplate(data, callback);

		// assume it's plain template code
		if (typeof(callback) === 'function')
			return callback(null, exports.createTemplate(data));
			else return exports.createTemplate(data);
	} 
		// supplied data is a function -> heredoc
		else if (typeof(data) === 'function')
	{
		// turn function code into template code
		if (typeof(callback) === 'function')
			return callback(null, exports.heredoc(data));
			else return exports.heredoc(data);

	} else {
		// invalid data
		if (typeof(callback) === 'function')
			callback(new Error('Invalid arguments for Template().'), null);
			else throw 'Invalid arguments for Template().';
	}

} // Template



// turn a string into a template
// original code by John Resig
exports.createTemplate = function (str) {

	// template code must be string
	if (typeof(str) !== 'string') return function () { return 'Error'};

	// create template function
    return new Function("obj",
		"if(typeof(obj) !== 'object') var obj = {}; "
		+ "try { var p=[],print=function(){p.push.apply(p,arguments);};" +

		// Introduce the data as local variables using with(){}
		"with(obj){p.push('" +

		// Convert the template into pure JavaScript
		str
			.replace(/[\r\t\n]/g, " ")
			.split("<%").join("\t")
			.replace(/((^|%>)[^\t]*)'/g, "$1\r")
			.replace(/\t=(.*?)%>/g, "',$1,'")
			.split("\t").join("');")
			.split("%>").join("p.push('") // '
			.split("\r").join("\\'")
		+ "');}return p.join(''); } catch (err) { return 'TemplateError: ' + err;}");

} // createTemplate



// load a template from a file
exports.loadTemplate = function (fileName, callback) {
	try {
		// if callback is provided, load template asynchroniously
		if (typeof(callback) == 'function') {
			// async method
			fs.readFile(fileName, 'utf8', function (err, data) {
				if (err) return callback(err, null);
				return callback(null, exports.Template(data));
			});
		} else {
			// synchroneous method
			var data = fs.readFileSync(fileName, 'utf8');
			return exports.Template(data);
		}
	} catch (err) {
		// exception handling 
		if (typeof(callback) === 'function') 
			callback(err, null);
			else throw(err);
	}		
} // loadTemplate



// treat a function as heredoc, for inline templates ..
exports.heredoc = function (func) {
	if (typeof(func) !== 'function') return exports.Template('');
	var str = func.toString();
	str = str.replace(/(^.*\{\s*\/\*\s*)/g, '');
	str = str.replace(/(\s*\*\/\s*\}.*)$/g, '');
	return exports.Template(str);
} // heredoc()
