const axios = require('axios');
const params = {
  access_key: '506102a34b6c2a4d938d6db6e0271858'
}

axios.get('https://api.aviationstack.com/v1/flights', {params})
  .then(response => {
    const apiResponse = response.data;
    if (Array.isArray(apiResponse['results'])) {
        apiResponse['results'].forEach(flight => {
            if (!flight['live']['is_ground']) {
                console.log(`${flight['airline']['name']} flight ${flight['flight']['iata']}`,
                    `from ${flight['departure']['airport']} (${flight['departure']['iata']})`,
                    `to ${flight['arrival']['airport']} (${flight['arrival']['iata']}) is in the air.`);
            }
        });
    }
  }).catch(error => {
    console.log(error);
  });