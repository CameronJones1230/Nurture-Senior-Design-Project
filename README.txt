Overview:
This project is a Node.js backend application with MongoDB as the database, designed to handle 
user authentication and plant management functionality. It provides endpoints for registering 
users, logging in, managing plants, and fetching user data.

Prerequisites:
Node.js installed on your computer.
MongoDB Community Server installed.
Basic knowledge of using the command line.


Installation:
Clone the repository to your local machine.
Navigate to the backend directory by running "cd backend" in the terminal.
Install dependencies by running "npm install" within the terminal.


Running the Server:
Navigate to the backend directory within the sddec24-16 parent folder with "cd backend"
Start the server by running "node server.js" in the terminal.

Accessing Endpoints:
To access the endpoints from another device (e.g., Raspberry Pi), you'll need to 
replace 192.168.1.142 in the endpoint URLs with your computer's IPv4 address.
You can find your IPv4 address by running ipconfig in the terminal.
Example endpoint: http://your-ipv4-address:3000/user/login.

Endpoints:
POST /user/register: Register a new user.
POST /user/login: Log in an existing user.
POST /user/:userId/plant: Create a new plant for a specific user.
PUT /user/:userId/plant: Update an existing plant for a specific user.
GET /user/users: Fetch all users.
GET /user/:userId: Fetch a specific user by their ID.
DELETE /user/:id: Delete a user by their ID.

Usage:
Use the provided login screen to log in with existing credentials.
Use the create account screen to register a new user.
After logging in, use the provided endpoints to manage users and plants.

Notes:
Make sure both the Raspberry Pi and your computer are on the same network without a VPN to access the server.