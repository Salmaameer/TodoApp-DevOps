build-docker-image:
	docker build -t dohaelsawi/todo-app .

build-docker-container:
	docker run -p 8090:8090 --name todo-app-container todo-app

delete-container:
	docker rm todo-app-container

all: build-docker-image build-docker-container
