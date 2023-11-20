<p align="center">
  <img src="assets/Expressjs.png" alt="Express Icon">
</p>

# Express Starter Template

[![NodeJS Version](https://img.shields.io/badge/NodeJS-20.9.0-green.svg)](https://nodejs.org/en)
[![Express Version](https://img.shields.io/badge/fastify-4.24.2-blue.svg)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

## Features

- Shemas and Models.
- Routes.
- Authentication.
- Easy integration and extensibility to fit your project requirements.

## 🛠️ Built with:

- [NodeJS](https://nodejs.org/en)
- [Express](https://expressjs.com/)

## Getting Started

Follow these steps to get the project up and running on your local machine.

1. Clone this repository using `git clone https://github.com/clinton-mwachia/express-starter-template.git`.
2. create a `.env` file and add the following variables

    - DB = 
    - PORT=
    - SECRET=
    - API=

2. Install dependencies using `npm install`.
3. Start the development server with `npm run dev`.

## Benchmark

`autocannon -c 100 -d 5 -p 10 http://127.0.0.1:4050/users`