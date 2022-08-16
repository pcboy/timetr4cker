docker:
	docker-compose up -d

create_database:
	docker-compose run api npx sequelize-cli db:create
