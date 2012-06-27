jQuery(document).ready(function($){
  console.log("Connecting to chatty server:", location.host);
  var socket = io.connect(location.host);
  
  var _storage = (function() {
    if( typeof localStorage === 'object' ) 
      return localStorage;
    else if( typeof globalStorage === 'object' )
      return globalStorage[location.host];
    else return "";  
  })();
  
  var nick = {
    _name: null,
    get name(){
      if(_storage.nickname){
        this._name = _storage.nickname; 
      } else this._name = "Anon" + Math.floor(Math.random()*1000+1000);
      return this._name;
    },
    set name(val){
      this._name = val;
      _storage.nickname = val;
    }
  };  
  
  function appendMessage(timestamp, name, message, type, prepend){
    var t = timestamp ? new Date(timestamp) : new Date();
    var time = t.toTimeString().split(' ')[0];
    var datetime = t.toISOString();
    var html = '<article id="'+timestamp+'" class="chat '+type+'">' +
               '<header><time pubdate datetime="'+datetime+'">'+time+'</time></header>' +
               (name ? '<b>'+unescape(name)+'</b>' : '')+
               '<mark>'+unescape(message)+ '</mark>' +
               '</article>';
    
      if(!prepend) $('section#content','section#chat').append(html);
      else $('section#content','section#chat').prepend(html);
      $("#sound").attr('src',"sounds/"+$("#select").val());
    var el = document.getElementById(timestamp);  
    el.scrollIntoView(true);      
  }
  
  socket.on('msg', function() {
    appendMessage.apply(this,arguments);
  });
  
  socket.on('connect',function(){
    if(nick.name === null) {
      socket.emit('get history',null,100,0);
    }
	  this.emit('set nickname',unescape(nick.name));
	  socket.emit('get users');
  });
  
  socket.on('history',function(messages) {
    for(var i = 0; i < messages.length; i++){
      messages[i].push('prepend');
      appendMessage.apply(this,messages[i]);
    }
  });

  function addUser(user){
    var html = '<article id="' + user + '" class="user">' +
              '<b>'+unescape(user)+'</b>' +
              '</article>';
    $('section#users').append(html);         
  }
  
  socket.on('users',function(users){
    $('section#users article.user').remove();
    for(var i = 0; i < users.length; i++) {
      addUser(users[i]);
    }
  });
  
  socket.on('user changed nick',function(timestamp,old,name){
     $('section#users article#'+old).remove();
     addUser(name);
  });
  
  socket.on('user disconnected', function(timestamp,name){
    $('section#users article#'+name).remove();
  });
  
  socket.on('user joined',function(timestamp,name){
    addUser(name);
  });
  
  socket.on('server',function(msg){
    appendMessage(null,null,msg,"server");
  });
  
  socket.on('nick ready',function(timestamp,name){
	  appendMessage(timestamp,nick.name,"Your nickname is now " + unescape(name),"server");
	  $('section#users article#'+nick.name).remove();
	  addUser(name);
	  nick.name = name;
	});
	
	socket.on('nick taken',function(name){
	  var newname = name + Math.floor(Math.random()*1000+1000);
	  socket.emit('set nickname',newname);
	});
	
	socket.on('received',function(timestamp){
	  $("article.chat#"+timestamp).removeClass("pending");
	});
	
	socket.on('discarded',function(timestamp,message){
	  $("article.chat#"+timestamp).addClass("discarded").removeClass("pending"); 
	});
	
  $("#send-message").bind('change',function() { 
	  var msg = this.value;
	  if(msg[0] === '/') {
		  var v = 0
		    , arg = msg.split(' ')
		    , cmd = arg[v++].slice(1);
		  switch( cmd ) {
		    case 'nick':
			    socket.emit("set nickname",arg[v]);
			    break;
		    case 'history': 
		      var user = null;
		      if( !(Number(arg[v]) >= 0) ) { user = arg[v++]; }
		      var count = arg[v++] || 100, offset = arg[v++] || 0;
		      socket.emit('get history',user,count,offset);
		      break;
		    case 'clear':
		      var timestamp = new Date().getTime();
		      var t = arg[v] || 0; 
		      $("article.chat").each(function(element){
	          if( this.id < timestamp - t ) $(this).remove();
	        });
	        break;
	       case 'users':
	        socket.emit("get users");
	        break;
	      default: break;  
		  }
	  } else {
	    var timestamp = new Date().getTime();
		  socket.emit("msg",timestamp,msg);
		  appendMessage(timestamp,nick.name,msg,"self pending");
	  }
	    this.value = "";
	}); 
	
	
});
