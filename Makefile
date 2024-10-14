build-docker-image:
	docker build -t todo-app .

build-docker-container:
	docker run -p 8090:8090 todo-app

all: build-docker-image build-docker-container
