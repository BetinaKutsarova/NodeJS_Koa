# NodeJS_Koa

Node.js CRUD app with Koa framework. Consists of:

- An authentication route and middleware
- User management module
- Private module
- Seed file for cleating the 2 db files + admin creation on start


Key features:
- Register
- Login to obtain JWT token

- Only admins can directly create an account
- Only admins can get all users
- Get user by ID - if an admin, get every user. If a regular user, get only yourself
- Update user - if an admin, update every user. If a regular user, update only yourself
- Delete user - if an admin, delete every user. If a regular user, detele only yourself

- Create a personal private item
- Get all private items of logged-in user only
- Get private item by ID of logged-in user only
- Update private item of logged-in user only
- Delete private item of logged-in user only