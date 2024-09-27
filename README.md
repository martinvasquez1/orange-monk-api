# Orange Monk API

This REST API serves as the backend for a social media web application. It features the use of SQL and NoSQL databases.

Currently, it features separate endpoints and controllers for SQL and NoSQL databases, but future updates will consolidate them to minimize redundancy.

## Technologies

- Node.js
- Express
- MongoDB
- PostgreSQL
- Mongoose
- Sequelize

## Installation

Follow these step-by-step instructions to set up the project locally:

1. Clone the repository:

```bash
git clone https://github.com/martinvasquez1/orange-monk-api
cd orange-monk-api
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables: Create a .env file in the root directory and add the following variables:

```bash
NODE_ENV="development"
JWT_SECRET="shhh..."
SQL_DATABASE_URL="your_url"`
```

4. Run the application:

```bash
npm run dev
```

### API Documentation

- [SQL Documentation.](https://github.com/martinvasquez1/orange-monk-api/wiki/sql-documentation)
- NoSQL Documentation.
