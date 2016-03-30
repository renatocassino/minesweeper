build:
	docker build -t tacnoman/mines .

setup:
	docker run --name mines -p 4567:4567 8888:8888 tacnoman/mines

gulp-installer:
	@npm install gulp-jasmine
