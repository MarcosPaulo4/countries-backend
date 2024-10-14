NestJS Starter Project


Description
This repository is a starter template for projects using the NestJS framework with TypeScript.

Project Setup
Prerequisites
Node.js (version 14 or higher)
Yarn or npm
Installation

Set up environment variables by copying .env.example to .env:
cp .env.example .env

Install the project dependencies:
yarn install
# or
npm install

Compile and run the project:
yarn run start
# or
npm run start

Run Modes
Development
To run the project in development mode:
yarn run start

Watch Mode
To start the server with file watching enabled:
yarn run start:dev

Production Mode
To compile and run the project in production mode:
yarn run start:prod

Technologies Used
NestJS - A progressive Node.js framework for building efficient, scalable, and modular server-side applications.
TypeScript - A strongly typed programming language that builds on JavaScript.
Yarn/NPM - Package managers used to install dependencies and run scripts.

Useful Commands
Generate a new module: nest g module <module-name>
Generate a new controller: nest g controller <controller-name>
Generate a new service: nest g service <service-name>
# countries-backend
