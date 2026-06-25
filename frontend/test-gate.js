const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/dashboard/home',
  method: 'GET',
  headers: {
    'Cookie': 'cs_uid=1sVRgRufWuT3WHcHcsv3KataAX42'
  }
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  
  // Also try a non-admin
  const options2 = {
    hostname: 'localhost',
    port: 3000,
    path: '/dashboard/home',
    method: 'GET',
    headers: {
      'Cookie': 'cs_uid=some_other_uid'
    }
  };
  
  const req2 = http.request(options2, (res2) => {
    console.log(`\nNON-ADMIN STATUS: ${res2.statusCode}`);
    console.log(`NON-ADMIN HEADERS: ${JSON.stringify(res2.headers)}`);
    process.exit(0);
  });
  req2.end();
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});
req.end();
