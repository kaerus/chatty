/* 
 * Chatty chat server with irc like commands
 *
 * Developed by anders @ kaerus com.
 * MIT licensed, feel free to use, share and modify. 
 *
 * Copyright (c) 2012 <anders@kaerus.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software 
 * and associated documentation files (the "Software"), to deal in the Software without restriction, 
 * including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, 
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial 
 * portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT 
 * LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 */

var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')
  , url = require('url')
  , util = require('util')
  , path = require('path')
  , extend = require('node.extend')
  , arango = require('arango.client')
  , template = require('./lib/template')
  , config = {
    _config: {  "app": "chatty",
                "name":	"Chatty server",
                "version": "0.1.2"
    },
    show_help: function(){
      console.log("Command line options:","arguments --server <hostname:port | socket>" +
	                                        " --template <html template>");
	    process.exit(0);
    },
    get: function(conf){
      this._config.file = conf;
	    /* parse command line options */
      for( var i = 0, option = process.argv; option[i]; i++) {
        switch(option[i]) {
          case '--help':
            this.show_help();
            break;
          case '--server':
            this._config.server = option[++i];
            break;
          case '--port':
            this._config.listen = option[++i];
            break;
          case '--template':
            this._config.template = option[++i];
            break;
          case '--config':
            this._config.file = option[++i];
            break;
        }
      }
       try { 
		    extend(this._config,JSON.parse(fs.readFileSync(this._config.file, 'utf8'))); 
	    }	catch(err) { 
		    if(process.argv.length < 3){
	 		    this.show_help();
		    } 
	    }
	    return this._config;
    }
}.get('chatty.json');

process.on('exit', function(code,signal){
	console.log("Process uptime %s, exit",process.uptime(), code ? code : "", signal ? signal : "" );
});

console.log("%s configuration:\n", config.name,util.inspect(config) );

var layout = template.loadTemplate(config.template);
var banner = "<!--\n";
banner += " Chatty-client v" + config.version + " Copyright (c) Kaerus 2012, by Anders Elo <anders @ kaerus com>.\n";
banner += " MIT licensed, feel free to use, share and modify as long as this notice is included.\n";
banner += " Developers and users should send contributions to <http://github.com/kaerus/chatty>.\n";
banner += "-->\n";

var db = new arango.Connection(config.db).on('error',function(err){
	console.log("DB Error:",util.inspect(err));
});

console.log("Waiting for requests on %s", config.server);
if(fs.existsSync(config.server)) {
  app.listen(config.server);
}
else {
  var srv = config.server.split(':');
  app.listen(srv[1],srv[0]);
}  

function handler (req, res) {
  var u = url.parse(req.url,true);
  var filePath = './public' + u.pathname;
         
  var extname = path.extname(filePath) || "";
  var contentType = 'text/html';
  switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.svg':
            contentType = 'image/svg+xml';
            break;
        case '.gif':
            contentType = 'image/gif';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.aiff':
            contentType = 'audio/mpeg';
            break;
        case '.mp3':
            contentType = 'audio/mp3';
            break;
  }
  if(filePath === './public/') {
    // Respond with html template
	  res.writeHead(200);
	  res.end(banner + layout());
	} else {
	  // Respond with file
    fs.exists(filePath, function(exists) {
      if (exists) {
        fs.readFile(filePath, function(error, content) {
          if (error) {
            // File read error
            res.writeHead(500);
            res.end();
          }
          else {
            // Send file content to client
	          res.writeHead(200,{"Content-Type":contentType });
	          res.end(content);
	        }        
	      }); 
      } else {
     	  // File not found
   	    res.writeHead(404);
    	  res.end("not found");
      }
    });
  }
}

var names = {};

function storeMessage(timestamp,name,msg,type){
  var path = "/_api/document?collection=" + config.db.name + "&createCollection=true";
  var data = {ch: "",timestamp:timestamp,name:name,msg:msg,type:type};
	db.request.post(path,data,function(res){
  }).on('error',function(err){	
      console.log("Store error:", util.inspect(err) );
  });
        						
}

function broadcast(msg,timestamp,name,data,type){
    this.broadcast.emit(msg,timestamp,name,data,type);
    storeMessage(timestamp,name,data,type);
}

io.sockets.on('connection', function (socket) {
     	
  var server_msg = config.name +' v '+ config.version;               
  socket.emit('server', server_msg);
 
 
  socket.on('disconnect', function() {
    var name = socket.store.data.nickname;
    var timestamp = new Date().getTime(); 
    delete names[name];
    socket.broadcast.emit('user disconnected',timestamp,name);
  });
  
  socket.on('set nickname', function (n) {
    /* escape the name */
    var timestamp = new Date().getTime()
      , name = escape(n); 
    if(names[name]) {
      if(names[name]!==socket.id)
        socket.emit('nick taken',name);
    } else {
      socket.get('nickname',function(err,oldname){
	if (oldname) socket.broadcast.emit("user changed nick", timestamp, oldname, name);
	else socket.broadcast.emit("user joined", timestamp, name);	
        socket.emit('nick ready',timestamp,name);
        socket.set('nickname',name);
        if(oldname) delete names[oldname];
        names[name] = socket.id;
      });
   }   
  });

  socket.on('msg', function (timestamp,m) {
    /* escape the message */
    var message = escape(m);
    socket.get('nickname', function (err, name) {
      var now = new Date().getTime();
      if( now - 10000 < timestamp ) {
        broadcast.call(socket,"msg", timestamp, name, message, "public");
	      socket.emit("received",timestamp);
      } else {   
        socket.emit("discarded",timestamp);
	    }
    });
  });
  
  /* return list of names */
  socket.on('get users', function(){
    socket.emit('users',Object.keys(names));
  });
 
  /* return (user) history */
  socket.on('get history', function(name,count,offset){
    var filter = name ? "FILTER u.name == '" + escape(name) +"'" : "";
	  db.request.post("/_api/cursor",
			{query: "FOR u IN @@collection " + filter + 
				" LIMIT " + parseInt(offset) + " , " + parseInt(count) +
				" SORT u.timestamp DESC RETURN [u.timestamp,u.name,u.msg,u.type]", 
			 bindVars: {"@collection": db.name}}, function(ret) {
	 	if(ret.result.length > 0)
	    		socket.emit("history", ret.result);
	  }).on('error',function(err){
	    util.log("history error:", util.inspect(err) );
	  });	 
  });
});
