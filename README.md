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
cd chatty
node chatty-server
```
You need to have [node.js](http://nodejs.org/#download) for that to work.  
After you have done this you should be able to access the [chat-server](http://127.0.0.1:8088).

Database
--------
To be able to run the chat-server in Full-Feature-Mode(tm) you need to have a database.
For that you also need to [install ArangoDB](/triAGENS/ArangoDB/).  

To get arango up and running you need to git, compile and install it 
```
git clone git://github.com/triaAGENS/ArangoDB.git
cd ArangoDB
./configure
make
sudo make install
/usr/local/sbin/arangod
```
For additional information please consult the [arangodb](/triAGENS/ArangoDB/) project.

Configuration
-------------
The chatty.json configuration file should be simple and self explanatory.  
  
Client
------------------
All client side resources are placed in the public directory.  
Chat commands recognized:
* /nick \<your nick\> : Set a nickname (defaults to AnonXXX). The nick is persisted in localstorage.
* /clear : clears the messages (locally).
* /history \<user\> | \<count\> | \<offset\> : Shows \<count\> number of lines history from \<offset\> for specified \<user\> (or all by default).


How to contribute
-----------------
* Send your contributions as [pull requests](/kaerus/chatty/pulls/)
* Write documentation on the project [wiki](/kaerus/chatty/wiki/)
* Repost bugs, feature requests & suggestions as [issues](/kaerus/chatty/issues/) 





