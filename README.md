### MIT License
 [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# Title

## Table of Contents

- [Description](#Description)

- [Installation](#Installation)

- [Usage with Examples](#Usage)

- [Credits](#Credits)

- [Contribute](#Contribute)

## Description
This is a server-side API for an ecommerce-like website. It's written entirely in JavaScript uses Node as a runtime environment, Express for listening to requests and handling routes, and Sequelize to interact with a SQL database in a way that is easy to change from one SQL dialect to another (I.E. from MySQL to SQL Server). It also uses dotenv to privately add SQL usernames and passwords that will be used on the server. This API uses the CRUD methods (Create, Read, Update, and Delete) to manipulate the SQL database and keep track of products, product tags, and categories of products using both One-to-Many and Many-to-Many relationships.

## Installation
To install this, make sure you have MySQL and Node.js installed, then do the following steps:
1. Clone the github repository
2. Install the dependencies using `npm i`
3. Copy the .env.EXAMPLE file, add your MySQL username and password and save it as .env
4. Navigate to the db directory and run `mysql -u root -p < schema.sql` and enter your password
5. Navigate to the e-commerce_backend directory and run `node seeds/`
6. Run `npm start` to start the server

## Usage with Examples
Clicking the image below will bring you to a quick demonstration showing the api and it's various functionalities.

[![E-commerce API Demo](https://img.youtube.com/vi/h9ij8g2WhEo/0.jpg)](https://youtu.be/h9ij8g2WhEo)

## Credits
This projects was made by Phoenix Staley using sample code from the University of Washington's JavaScript bootcamp.

## Contribute
If you wish to contribute, please feel free to [email me](mailto:PhoenixStaley_Developer@outlook.com)!