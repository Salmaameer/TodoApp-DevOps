build-docker-image:
	docker build -t your-todo-app .

build-docker-container:
	docker run -p 8081:80 your-todo-app

all: build-docker-image build-docker-container
