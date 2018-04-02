docker pull postgres
docker run -d -p 127.0.0.1:5432:5432 --name psql postgres
docker pull rabbitmq
docker run -d -p 127.0.0.1:5672:5672 --name rabbit rabbitmq
