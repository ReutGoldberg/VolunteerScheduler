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