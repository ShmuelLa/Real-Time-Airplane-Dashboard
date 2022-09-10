const fs = require('fs');




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
        obj.forEach(dict => {
            content1+= `<li>Flight IATA: ${dict.FLIGHT_IATA_CODE}, Prediction: ${dict.PREDICTION}</li>\n`
        })
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