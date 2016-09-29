build:
	docker build -t tacnoman/mines .

setup-docker:
	docker run --name mines -p 4567:4567 8888:8888 tacnoman/mines

setup:
	npm install

test:
	gulp test
