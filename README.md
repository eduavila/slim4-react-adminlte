# Slim v4 com React.

Modelo padrão para projeto API - [Slim PHP micro framework](https://www.slimframework.com).

Used technologies: `PHP, Slim 4, MySQL, Redis ,PHP-DI, Eloquent ORM, PHPUnit, env var, Docker & Docker Compose`.

## INSTALAÇÃO RÁPIDA:

### Pré-requisito:

- PHP >= 7.2
- Composer ~ 1.x
- MySQL/MariaDB.

## Recursos

* Slim php 4.3
* Eloquent ORM 6.15
* NQuery 1.0
* Php DotEnv 
* Database Migrations ([Phinx](https://phinx.org/))
* Database Migrations Generator
* Unit- and integrations tests (PHPUnit)

### With Composer:

Você pode criar um novo projeto executando os seguintes comandos:

```bash
$ composer create-project maurobonfietti/slim4-api-skeleton [my-api-name]
$ cd [my-api-name]
$ cp .env.example .env
$ composer test
$ composer start
```


#### Configure sua conexão com o MySQL Server:

Por padrão, a API usa um banco de dados MySQL.

Você pode verificar e editar esta configuração no seu arquivo `.env`:

```
DB_HOST='127.0.0.1'
DB_NAME='yourMySqlDatabase'
DB_USER='yourMySqlUsername'
DB_PASS='yourMySqlPassword'
```

## DOCUMENTATION:

### Instalar dependencia PHP

~~~
$ composer install 
~~~

## Frontend


#### Rodar webpack em dev.

~~~
$ cd resources/
$ yarn run dev 
~~~


#### Rodar webpack em produção.

~~~
$ cd resources/
$ yarn run production 
~~~


### Criar nova migration
~~~
$ composer create-migration NovaMigration
~~~

### Rodar Migration 

~~~
$ composer migrate
~~~

### Rodar Seed 


### Executar Fila Queue (redis)

~~~
    php src/app/cli.php RunQueue
~~~ 

* Ativar fila no supervisord

##### Perfil padrao
-   1 - `Administrador` 
-   2 - `Gestor` 
-   2 - `Usuario`


## DOCKER (Opcional):

If you like Docker, you can use this project with **docker** and **docker-compose**.

### MINIMAL DOCKER VERSION:

* Engine: 18.03+
* Compose: 1.21+


### DOCKER COMMANDS:

```bash
# Criar container de desevolvimento
$ docker-compose -f docker-compose.dev.yml up -d --build

# Teste na API.

$ curl http://localhost:8081

ou 

Postman  GET http://localhost:8081


# Teste na Front .
acessar no browser http://localhost:8080

# Stop and remove containers.
$ docker-compose down
```


# Front End

- React
- React Router
- Redux 
- Admin LTE
-   
Todos arquivos do front se encontra nas pasta ```/resources```


## Comando para executar em DEV front end.
~~~ 
$ yarn install
ou 
$ npm install

$yarn run dev
ou
npm run dev
~~~

## Comando gerar arquivo para produção

Após execução dos comando abaixo não tiver nenhum erro, ele criara uma pasta ``public/dist`` onde ficará todo código de produção.
para testar acessar ``http://localhost:8081``.
~~~
$ yarn install 
ou 
$ npm install

$yarn run build
ou
npm run build
~~~