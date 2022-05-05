# FULLSTACK JAVASCRIPT BITCOIN WALLET 

### A full-stack Non-custodial Bitcoin wallet built with bitcoinjs, and blockstream APIs

## Prerequisites
 - Bitcoin knowledge
 - Nodejs installed
 - Typescript knowledge
 - Reactjs/Nextjs knowledge 

## Project structure

- Client - Reactjs/Nextjs
- Backend - Nodejs/Expressjs
- Database - Postgres
- Database ORM Library - Knex

NOTE: You need postgres installed to run this application successfully

## How To Run

  Clone the repository

  ```git clone https://github.com/elraphty/FullstackBitcoinWallet.git```

  After cloning the repository, install the dependencies

  ### BACKEND

  ```cd backend```

  ``` npm install  ```

   - Create a .env file ```touch .env```
   - Copy the placeholders from the .env.sample file into your .env 
   - Create a local postgres database
   - Update the .env variable values with yours
   - After creating and updating the .env file
   - Run ``` knex migrate:latest ```  (Knex will create and migrate the database schema for you)  
   - Run ``` npm run dev ```


  ### CLIENT

  ```cd client ```

  ``` yarn install ```
  
  ``` npm run dev  ```

  