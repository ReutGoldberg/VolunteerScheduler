# ReadMe for a successful project launch:

1. DATABASE URL:
 *  For production: can use the get command listed in the ReadMe file to fetch the latest DB url from Heroku
	Then, update the DATABASE_URL in server/.env file so the project will use the Production DB URL
	
* For Development usage: 
  Use your local pgAdmin connection string. 
  
Once connection string is valid and set. 

The schema.prisma file will have the project's DB structure
By running: 'npx prisma migrate dev --name init'
This takes the db's configuration in the schema file and overrides the local db to have the same configuration and table structure.
Note - this will remove all the previous tables and structure to match the current one defined in your project. 
(This way we can make sure we're all working on the same schema structure) 


### `Fake Data Generation DB:`   
* The Fake Data mechanisem is completely isolated from the Production DB.
So any changes applied won't affect the production DB.
To switch to the fake data part do the following:

  1. In schema.prisma commnet-out the `datasource db` part for `DATABASE_URL`
  and uncomment the `datasource db` part for `FAKE_DATABASE_URL`.
  2. Run migrations: "npx prisma migrate dev --name init" to make sure the FAKE DB alligned with the scehme of the project.
  3. Go to the AppConfig file and set the `IS_SHOW_FAKE` flag to `true`.
  4. Go to Server, Config.js and change the following entry to `true`: config.server_app.IS_FAKE
  5. Run the app and the server.
  6. Create fake data. 
