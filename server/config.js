const config = {
    server_app: {
      port: 5001, 
      name: 'myapp'
    },
    client_app:{
      port: 3000, 
      localhost: 'http://localhost:3000'
    },
    db: {
      host: 'ec2-34-247-172-149.eu-west-1.compute.amazonaws.com',
      port: 5432,
      name: 'd1nh45sqjqnkq5',
      user: 'tcfgmaystrxtxn',
      password: '928a7e59ef684cb88eee92d5e01a714b2cac5fdba4c3bcb5384a1a7fb2109267',
      uri: 'postgres://tcfgmaystrxtxn:928a7e59ef684cb88eee92d5e01a714b2cac5fdba4c3bcb5384a1a7fb2109267@ec2-34-247-172-149.eu-west-1.compute.amazonaws.com:5432/d1nh45sqjqnkq5'
    }

   };
   module.exports = config;

