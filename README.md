# microservice_project

this project is a simple skeleton code for microservice architecture pattern using nodejs , postgres , prisma , Rest , GraphQL
Thanks to MR Gontara Salah which has inspired and given really good knowledge for setting up this project.

![image!](Diagram1.jpg)

# USER MICROSERVICE

Contains API related to creating A new USER and API end point to get this USER

```http
  GET /users
```

```http
  POST /user
```

| Parameter   | Type     | Description                       |
| :-----------| :------- | :-------------------------------- |
| `name`      | `string` | **Required**.                     |
| `prenom`    | `string` | **Required**.                     |

# ORDER MICROSERVICE

Contains API related to creating A new ORDER and API end point to get this ORDER

```http
  GET /orders
```

```http
  POST /orders
```

| Parameter        | Type     | Description                       |
| :----------------| :------- | :-------------------------------- |
| `name`           | `string` | **Required**.                     |
| `description`    | `string` | **Required**.                     |


# Requirements

Node 18
Git
Contentful CLI (only for write access)

# Common setup

Clone the repo and install the dependencies.

git clone https://github.com/sofiene-chouchen/microservice_project.git

`cd microserviceProject`

`npm install`

# Run

To start the ApiGateway server, run the following

`node apiGerway.js`

To start the User server, run the following

`cd userMicroservice`

`node userMicroservice.js`

To start the Order server, run the following

`cd orderMicroservice`

`node orderMicroservice.js`
