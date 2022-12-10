// -- IMPORTS -- //
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;


// HTTP request promisifier
function makeRequest(type, url, body) {

    // Promisify!
    return new Promise(function(resolve, reject) {

        let httpRequest = new XMLHttpRequest();

        // Create the request
        httpRequest.open(type, url);

        // Let the server know we are sending JSON
        // If sending
        if (type == "POST") {
            httpRequest.setRequestHeader("Content-Type", "application/json");
        }

        // Define what happens upon success or failure
        httpRequest.onreadystatechange = function() {
            // Wait until the request is complete (status 4)
            // The promise response will be in the form of [response, text]

            if (this.readyState == 4 && this.status == 200) {
                // Success!
                try {
                    resolve(JSON.parse(this.responseText));
                } catch {
                    resolve(this.responseText);
                }
            }
            
            else if (this.readyState == 4) {
                // Fail...
                reject(this.responseText);
            }
        };

        // Send the request!
        httpRequest.send(JSON.stringify(body));
    });
}

(function main() {
    // Important info
    let channelID = "UCM2eCQho7OrnnIRDDcHjWWQ";
    let ytapiKEY = "[obfuscated]";

    // The YouTube request
    let ytRequest = makeRequest("GET", "https://www.googleapis.com/youtube/v3/channels?part=statistics&id="+channelID+"&key="+ytapiKEY);

    // When the YouTube request comes back...
    ytRequest.then((response) => {

        // Get the sub count
        let subc = response.items[0].statistics.subscriberCount;
        console.log(subc);

        // IFTTT important info
        let trigger_id = "wrq_test";
        let ifttt_key = "[obfuscated]";

        // Send the IFTTT request!
        let iftttRequest = makeRequest("POST", "https://maker.ifttt.com/trigger/" + trigger_id + "/with/key/" + ifttt_key, {"value1": subc});
    })
})();