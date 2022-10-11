import {faker} from '@faker-js/faker';


function generateFakeUser(){

  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const email = faker.internet.email();
  const token = faker.datatype.uuid().toString();
  const isAdmin = faker.datatype.boolean();

  //return the newely created user as an object
  return {
    "first_name": firstName,
    "last_name": lastName,
    "email":email,
    "token":token, 
    "is_admin":isAdmin
  }
}


function generateFakeEvent(){

    const title = faker.company.bsNoun();
    const labels = faker.lorem.words();
    const details = faker.company.catchPhrase();
    const created_by = faker.name.findName(); //returns full name
    const location = faker.address.city();

    const min_volunteers = faker.datatype.number({min:0, max:255});
    const max_volunteers = faker.datatype.number({min:min_volunteers, max:255});

    const start_time = faker.date.soon(10); //random date from Now --> +10days
    const end_time  = faker.date.soon(1,start_time); //random date from start_time wihtin the same 24h
    
    return {
      "title": title,
      "details": details,
      "labels": labels,
      "created_by": created_by,
      "location": location,
      "min_volunteers": min_volunteers,
      "max_volunteers": max_volunteers,
      "start_time": start_time,
      "end_time": end_time
    }
  }

  function generateFakeLabel(){
    const name = faker.company.bsBuzz();
    return {
        "name": name
    }
  }


  function generateFakeLog(){  
      const text = faker.lorem.text();
      const logTime = faker.date.soon(10);
      return {
          "text": text,
          "time": logTime
      }
    }

    export {generateFakeUser, generateFakeEvent, generateFakeLabel, generateFakeLog};