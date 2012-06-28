Chatty
======

Chatty is a chat server and client application.  
![Screenshot from client](http://www.kaerus.com/images/chatty.png)    

It consist of a node.js server with an ArangoDB backend and a html5/javascript client.
__________________________________________________________________________________________
Install
-------
As a prerequisite you need to have [node.js](http://nodejs.org/#download) and [git](http://git-scm.com/book/en/Getting-Started-Installing-Git).    

Then run some commands in your terminal.
```
git clone git://github.com/kaerus/chatty.git
cd chatty
npm install 
node chatty-server
```
After you have done that you should be able to access the [chat-server](http://127.0.0.1:8088).

Database
--------
To run the chat-server in Full-Feature-Mode(tm) you have to [install ArangoDB](/triAGENS/ArangoDB/).   

Clone ArangoDB, compile and install:  
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





