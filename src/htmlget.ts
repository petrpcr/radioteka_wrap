
import { get } from "http";

export function GetHtml(pUrl: string, BodyParse: (rawBody: string,content:string) => void) {

    get(pUrl, (res:any) => {
        const { statusCode } = res;
        const contentType: string = res.headers['content-type'].toString();

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
        let rawBody = "";
        res.on('data', (chunk:any) => {rawBody += chunk; });
        res.on('end', () => {
            BodyParse(rawBody,contentType)
        });

    }).on('error', (e) => {
        console.error(`Got error: ${e.message}`);
    });
}
//https://stackoverflow.com/questions/11944932/how-to-download-a-file-with-node-js-without-using-third-party-libraries
export function DownloadFile(url:string, dest:string, cb) {
    var file = fs.createWriteStream(dest);
    var request = http.get(url, function(response) {
      response.pipe(file);
      file.on('finish', function() {
        file.close(cb);  // close() is async, call cb after close completes.
      });
    }).on('error', function(err) { // Handle errors
      fs.unlink(dest); // Delete the file async. (But we don't check the result)
      if (cb) cb(err.message);
    });
  };
