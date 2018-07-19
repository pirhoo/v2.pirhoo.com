run:
	gulp serve

deploy:
	gulp build
	gulp deploy

install:
	sudo apt-get install graphicsmagick
	npm install
	bower install
