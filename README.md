#Installing and running the project
#Dependencies

** For running this program , you need to  install Nodejs v8+ and MongoDB v3+

** Follow the following steps to install Nodejs and MongoDB for ubuntu , for other operating system , kindly please look for the official docs!!

1. Install Nodejs
	For ubuntu :  Open your terminal and type : 
	
					curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -

					sudo apt-get install -y nodejs


	For other operating system , kindly follow Nodejs official docs

2. Install mongodb
	For ubuntu : Open terminal and type  :

				 sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 9DA31620334BD75D9DCB49F368818C72E52529D4

				 echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/4.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.0.list

				 sudo apt-get update

				 sudo apt-get install -y mongodb-org

				 sudo service mongod start
	
	For other operating system, kindly follow mongodb official docs

#Steps to run app

Step 0 : Open your terminal

Step 1 :  Type and press enter : 
				git clone https://github.com/fenago/ipfs

Step 2 : Type and press enter : 
				cd ipfs

Step 3 : Type and press enter : 
				node app.js

Step 4 : go to http://localhost:3000 and you will see the project running