import  http  = require("http");

http.get('http://www.rozhlas.cz/dvojka/stream/',(res) => {
    const { statusCode } = res;
    const contentType:string = res.headers['content-type'].toString();
  
    let error;
    if (statusCode !== 200) {
      error = new Error('Request Failed.\n' +
                        `Status Code: ${statusCode}`);
    } else if (!/^text\/html/.test(contentType)) {
      error = new Error('Invalid content-type.\n' +
                        `Expected application/json but received ${contentType}`);
    }

    if (error) {
      console.error(error.message);
      // consume response data to free up memory
      res.resume();
      return;
    }
  
    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
      try {
        console.log(rawData);

      } catch (e) {
        
        console.error(e.message);
      
    }
    });
  }).on('error', (e) => {
    console.error(`Got error: ${e.message}`);
  });
  


