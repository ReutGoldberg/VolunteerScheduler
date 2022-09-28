export const config = {
      server_app: {
      port: 5000, 
      name: 'myapp',
      localhost: `http://localhost`,
      notVerifiedUserMsg: "User token is not verified",
      fullCapacityMsg: "Full capacity",
      invalidUserMsg: "User email is not valid",
      noAdminRightsMsg: "User is not an admin - request failed",
      IS_FAKE: false
    },
    client_app:{
      port: 3000, 
      localhost: 'http://localhost:3000',
      client_id: "83163129776-q90s185nilupint4nb1bp0gsi0fb61vs.apps.googleusercontent.com",
    },
    FakeDB: {  
      preToken: "fake_data_token-"
    }
   };
  // module.exports = config;

