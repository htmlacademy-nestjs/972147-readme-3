docker_start:
		@docker compose -f ./project/apps/users/docker-compose.dev.yml up -d
		@docker compose -f ./project/apps/posts/docker-compose.dev.yml up -d
		@docker compose -f ./project/apps/notifications/docker-compose.dev.yml up -d
		@docker compose -f ./project/apps/files/docker-compose.dev.yml up -d
docker_stop:
		@docker compose -f ./project/apps/users/docker-compose.dev.yml down
		@docker compose -f ./project/apps/posts/docker-compose.dev.yml down
		@docker compose -f ./project/apps/notifications/docker-compose.dev.yml down
		@docker compose -f ./project/apps/files/docker-compose.dev.yml down
prepare:
		@echo "Preparing..."
		@echo "Installing npm deps..."
		@cd project && npm install
		@echo "Npm deps has been installed."
		@echo "Creating .env files..."
		@cp ./project/apps/users/.env-example ./project/apps/users/.env
		@cp ./project/apps/posts/.env-example ./project/apps/posts/.env
		@cp ./project/apps/notifications/.env-example ./project/apps/notifications/.env
		@cp ./project/apps/files/.env-example ./project/apps/files/.env
		@cp ./project/apps/bff/.env-example ./project/apps/bff/.env
		@echo ".env files has been created."
		@echo "Running docker compose..."
		@make docker_start
		@echo "Docker compose has been runned."
		@echo "Preparing databases..."
		@cd ./project && npx nx run posts:db:generate
		@cd ./project && npx nx run posts:db:migrate
		@cd ./project && npx nx run posts:db:seed
		@echo "Databases has been prepared."
		@echo "Preparing has been finished."
run_users:
		@cd ./project && npx nx run users:serve
run_posts:
		@cd ./project && npx nx run posts:serve
run_notifications:
		@cd ./project && npx nx run notifications:serve
run_files:
		@cd ./project && npx nx run files:serve
run_bff:
		@cd ./project && npx nx run bff:serve
