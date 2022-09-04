var axios = require('axios');

const google_API_KEY='AIzaSyBt9glf5ArfXN4iiEdRJZNjisyVP0O8s5M'
function distance(loc1,loc2)
{
var config = {
  method: 'get',
  url: 'https://maps.googleapis.com/maps/api/distancematrix/json?origins=place_idTLV&destinations=place_idNY&units=imperial&key='+google_API_KEY,
  headers: { }
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});
}
distance();