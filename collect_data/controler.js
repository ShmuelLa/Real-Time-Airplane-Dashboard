const real_time_flights = require("./real_time");
const producer = require("./producer");
// const consumer = require("./consume_2");

//real_time_flights.get_real_time_flights();
var info={
    YEAR: 2022,
    MONTH: 8,
    DAY: 9,
    DAY_OF_WEEK: 6,
    AIRLINE_NAME: 'Arkia Israeli Airlines',
    AIRLINE_IATA_CODE: 'IZ',
    FLIGHT_NUMBER: '336',
    FLIGHT_IATA_CODE: 'IZ336',
    ORIGIN_AIRPORT_IATA: 'FCO',
    DESTINATION_AIRPORT_IATA: 'TLV',
    SCHEDULED_DEPARTURE: '9.9.2022 12:05:00',
    DEPARTURE_TIME: null,
    UPDATED_DEPARTURE_TIME: null,
    SCHEDULED_ARRIVAL: '9.9.2022 15:25:00',
    ARRIVAL_TIME: null,
    UPDATED_ARRIVAL_TIME: null,
    DEPARTURE_DELAY: null,
    ARRIVAL_DELAY: null,
    FLIGHT_STATUS: 'en-route',
    DELAY_TYPE: null,
    DISTANCE_TYPE: 'Median',
    IS_HOLYDAY: false,
    IS_VICATION: false,
    WEATHER_DEP_DESC: 'Patchy rain possible',
    WEATHER_DEP_DESC_CODE: 1063,
    WEATHER_DEP_DEG: 34.6,
    WEATHER_ARR_DESC: 'Sunny',
    WEATHER_ARR_DESC_CODE: 1000,
    WEATHER_ARR_DEG: 37.5,
    DEPARTURE_COUNTRY: 'ITALY',
    ARRIVAL_COUNTRY: 'ISRAEL',
    LAT: 33.140446,
    LNG: 33.058479,
    DIR: 123
  }
  producer.sendMessage(JSON.stringify(info),'prediction_request');
  //consumer.consume_prediction('dash-board', 'prediction', 'prediction');
  