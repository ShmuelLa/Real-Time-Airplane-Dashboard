const fs = require('fs');
const redis = requite("./redis/redis_op");




async function generateHTML(obj, file, topic) {
    try {
        var content1 = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="utf-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link href="css/landingAndtakeoff.css" rel="stylesheet">
            <title>${topic}</title>
        </head>
        <body>
            
            <div class="bg-image"></div>
            <div class="bg-text">
                <h1>Real Time Take-Offs</h1>
            </div>
    
            <div class="p-text">
                <p><ul>`
        var content2 =`             
                </ul></p>
            </div>
            
        </body>
        </html>`
        for (var entry of obj.entries()) {
            // var key = entry[0];
            // var value = entry[1];
                redis.redisGetJson(entry[1].FLIGHT_IATA_CODE).then((res) => {
                content1+= `<li>Flight IATA: ${entry[1].FLIGHT_IATA_CODE}, ${entry[1].ORIGIN_AIRPORT}->${entry[1].DESTINATION_AIRPORT} Prediction: ${res.PREDICTION}</li>\n`
            })
        }
        // obj.forEach(dict => {
        //     redis.redisGetJson(dict.FLIGHT_IATA_CODE).then((res) => {
        //         content1+= `<li>Flight IATA: ${dict.FLIGHT_IATA_CODE}, ${dict.ORIGIN_AIRPORT}->${dict.DESTINATION_AIRPORT} Prediction: ${res.PREDICTION}</li>\n`
        //     })
        // })
        fs.writeFile(`./public/${file}.html`, content1+content2, function (err) {
            if (err) throw err;
            console.log('Saved!');
        });
    }
    catch (e) {
        console.error(e);
    }
}
module.exports = {generateHTML}