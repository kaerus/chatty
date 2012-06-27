Chatty
======

Chatty is an experimental chat server for exploring socket.io and ArangoDB.  
It consist of a node.js server (with an arangodb backend) and a html5/javascript client.
__________________________________________________________________________________________
Install
-------
To install run
```
npm install git://github.com/kaerus/chatty.git
```

Database
--------
You need to [install ArangoDB](/triAGENS/ArangoDB/).

Configuration
-------------
The chatty.json configuration file should be simple and self explanatory.  
  
Client
------------------
All client side resources are placed in the public directory.
Chat commands recognized:
* /nick \<your nick\> : Set a nickname (defaults to AnonXXX). The nick is persisted in localstorage.
* /clear : clears the messages (locally).
* /history \<user\> | \<count\> \<port\> : Show history for specified user (or all by default).


How to contribute
-----------------
* Send your contributions as [pull requests](/kaerus/chatty/pulls/)
* Write documentation on the project [wiki](/kaerus/chatty/wiki/)
* Repost bugs, feature requests & suggestions as [issues](/kaerus/chatty/issues/) 





