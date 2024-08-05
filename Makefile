# Load .env
ifneq (,$(wildcard .env))
    include .env
    export $(shell sed 's/=.*//' .env)
else
    $(info .env file not found, proceeding without it)
endif


# Setup .env
setup-env:
	chmod 644 .env
	cp -f .env ./docker/$(ENV)/.env
	chmod 644 ./docker/$(ENV)/.env

# Docker
build:
	@docker build -t hub.playgroundvina.com/pg/$(NAME):$(ENV) -f docker/Dockerfile . --no-cache

push:
	@docker push hub.playgroundvina.com/pg/$(NAME):$(ENV)

pull:
	@docker pull hub.playgroundvina.com/pg/$(NAME):$(ENV)

test:
	@docker run --rm hub.playgroundvina.com/pg/$(NAME):$(ENV) ./test/test.sh

clean:
	@docker rmi hub.playgroundvina.com/pg/$(NAME):$(ENV) || true

# Run
start:
	@docker compose -f docker/$(ENV)/docker-compose.yml -p $(NAME)-$(ENV) down
	@docker compose -f docker/$(ENV)/docker-compose.yml -p $(NAME)-$(ENV) up -d

stop:
	@docker compose -f docker/$(ENV)/docker-compose.yml -p $(NAME)-$(ENV) down

# Telegram Notify
notify_start:
	@curl -X POST -H 'Content-Type: application/json' -d '{"chat_id": "$(CHAT_ID)", "text": "$(JOB_NAME): #$(BUILD_NUMBER)\n=====\nStarted!", "disable_notification": false}' "https://api.telegram.org/bot$(TOKEN)/sendMessage"

notify_success:
	@curl -X POST -H 'Content-Type: application/json' -d '{"chat_id": "$(CHAT_ID)", "text": "$(JOB_NAME): #$(BUILD_NUMBER)\n=====\n✅ Deploy succeeded!", "disable_notification": false}' "https://api.telegram.org/bot$(TOKEN)/sendMessage"

notify_failure:
	@curl -X POST -H 'Content-Type: application/json' -d '{"chat_id": "$(CHAT_ID)", "text": "$(JOB_NAME): #$(BUILD_NUMBER)\n=====\n❌ Deploy failure!", "disable_notification": false}' "https://api.telegram.org/bot$(TOKEN)/sendMessage"

notify_aborted:
	@curl -X POST -H 'Content-Type: application/json' -d '{"chat_id": "$(CHAT_ID)", "text": "$(JOB_NAME): #$(BUILD_NUMBER)\n=====\n❌ Deploy aborted!", "disable_notification": false}' "https://api.telegram.org/bot$(TOKEN)/sendMessage"