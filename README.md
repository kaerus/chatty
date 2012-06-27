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
You need to have [node.js](http://nodejs.org/#download) for that to work.  

Database
--------
You also need [ArangoDB](/triAGENS/ArangoDB/) and create a collection (db.name) to use.  

To get arango up and running you need to grab, compile and install 
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





