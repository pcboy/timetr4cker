all:
	cd api && pnpm install && nohup pnpm start &
	cd web && pnpm install && nohup pnpm dev & 

create_database:
	cd api && pnpx sequelize-cli db:create
