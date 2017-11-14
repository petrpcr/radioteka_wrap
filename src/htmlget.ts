
import { get } from "http";

export function GetHtml(pUrl: string, BodyParse: (rawBody: string,content:string) => void) {

    get(pUrl, (res) => {
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
        res.on('data', (chunk) => {rawBody += chunk; });
        res.on('end', () => {
            BodyParse(rawBody,contentType)
        });

    }).on('error', (e) => {
        console.error(`Got error: ${e.message}`);
    });
}
