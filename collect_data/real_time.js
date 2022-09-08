
const lib_complete_info = require("./complete_info_functions");




const axios = require('axios');//get url
axios.default.timeout === 60000;


//const fs = require("fs");//write to file
// const http = require('http');
// const https = require('https');



const air_labs_API_KEY = '1170dda1-31bb-4f88-a7f5-62f0f9fb82a2'
var airlabs_webcite = "https://airlabs.co/"


// function start() {
//     var csv1 = "flight_number,is_summer_vacation,is_holyday,f_month,week_day,company,arrival_country,depurture_country,flight_type,weather_dep,weather_arr,punctuality,f_status,scheduled_arr_time,scheduled_dep_time,updated_arr_time,updated_dep_time,webcite,time_info_taken";

//     // WRITE TO FILE
//     fs.writeFileSync("arrive3.csv", csv1);
//     fs.writeFileSync("depurture3.csv", csv1);

//     //axios set to keep alive
//     const httpAgent = new http.Agent({ keepAlive: true });
//     const httpsAgent = new https.Agent({ keepAlive: true });

//     // on the instance
//     axios.create({
//         httpAgent,  // httpAgent: httpAgent -> for non es6 syntax
//         httpsAgent,
//     });

//     return httpAgent, httpsAgent;
// }
function kfkat(data) {
    console.log(data);
}


async function doGetRequest(/*httpAgent, httpsAgent*/) {
    try {
        responseArr = await axios.all([
            axios.get(`https://airlabs.co/api/v9/flights?_view=array&_fields=
                                    airline_iata,
                                    airline_icao,
                                    flight_number,
                                    flight_icao,
                                    flight_iata,
                                    lat,
                                    lng,
                                    alt,
                                    dir,
                                    dep_iata,
                                    dep_icao,
                                    arr_iata,
                                    arr_icao,
                                    updated,
                                    status&dep_iata=TLV&api_key=${air_labs_API_KEY}`),//,

            axios.get(`https://airlabs.co/api/v9/flights?_view=array&_fields=
                                airline_iata,
                                airline_icao,
                                flight_number,
                                flight_icao,
                                flight_iata,
                                lat,
                                lng,
                                alt,
                                dir,
                                dep_iata,
                                dep_icao,
                                arr_iata,
                                arr_icao,
                                updated,
                                status&arr_iata=TLV&api_key=${air_labs_API_KEY}`)]);
        console.log("r0:", responseArr[0].data.response)
        // console.log("r1:", responseArr[1].data.response)


        // var time_info_taken = get_now();
        // //dep
        // await responseArr[0].data.response.forEach(async response => {
        var full_info = await axios.get(`https://airlabs.co/api/v9/flight?flight_iata=IB3316&api_key=${air_labs_API_KEY}`);
        // airline_iata,
        // airline_icao,
        // flight_number,
        // flight_icao,
        // flight_iata,
        // lat,
        // lng,
        // alt,
        // dir,
        // dep_iata,
        // dep_icao,
        // arr_iata,
        // arr_icao,
        // updated,
        // status&arr_iata=TLV&api_key=${air_labs_API_KEY}`, { httpAgent: httpAgent, httpsAgent: httpsAgent });
        console.log("r0:", responseArr[0].data.response)
        // https://airlabs.co/api/v9/flight?flight_iata=AA6&api_key=YOUR-API-KEY

        // var flight_number = response.flight_number;
        // var is_summer_vacation = false;//
        // var is_holyday = isJewishIsraelyHolyday(convert_utc_to_loacl_time(convert_utc_str_to_date_type(response.arr_time_utc)).split(" ")[0]);//
        // var f_month = convert_utc_str_to_date_type(response.dep_time_utc).getMonth();
        // var week_day = convert_utc_str_to_date_type(response.dep_time_utc).getDay() + 1;
        // var company = await get_company_name(response.airline_iata, response.airline_icao, httpAgent, httpsAgent);
        // var arrival_country = await get_country_name(response.arr_iata, response.arr_icao, httpAgent, httpsAgent);
        // var depurture_country = await get_country_name(response.dep_iata, response.dep_icao, httpAgent, httpsAgent);
        // var flight_type = null;//need to caculate distance
        // var weather_dep = null;// need to pull from weather api
        // var weather_arr = null;//

        // var punctuality = null;
        // var minute_delay_in_dep = null;
        // if (response.status === "landed" || response.status === "active") {
        //     minute_delay_in_dep = minutes_difference(convert_utc_str_to_date_type(response.dep_estimated_utc), convert_utc_str_to_date_type(response.dep_time_utc));
        // }
        // punctuality = late_status(minute_delay_in_dep);

        // var scheduled_arr_time = convert_utc_to_loacl_time(convert_utc_str_to_date_type(response.arr_time_utc));
        // var scheduled_dep_time = convert_utc_to_loacl_time(convert_utc_str_to_date_type(response.dep_time_utc));
        // var updated_arr_time = convert_utc_to_loacl_time(convert_utc_str_to_date_type(response.arr_estimated_utc));
        // var updated_dep_time = convert_utc_to_loacl_time(convert_utc_str_to_date_type(response.dep_estimated_utc));
        // var webcite = airlabs_webcite;
        // var f_status = response.status;

        // const info = [flight_number, is_summer_vacation, is_holyday, f_month, week_day, company, arrival_country, depurture_country, flight_type, weather_dep, weather_arr, punctuality,
        //     f_status, scheduled_arr_time, scheduled_dep_time, updated_arr_time, updated_dep_time, webcite, time_info_taken];
        // console.log(info);
        // var csv = "";

        // csv += info.join(",") + "\r\n";

        // fs.appendFileSync("depurture3.csv", csv);


        // });

        //arr
        //         await responseArr[1].data.response.forEach(async response => {


        //             var flight_number = response.flight_number;
        //             var is_summer_vacation = false;//
        //             var is_holyday = false;//
        //             var f_month = convert_utc_str_to_date_type(response.dep_time_utc).getMonth();
        //             var week_day = convert_utc_str_to_date_type(response.dep_time_utc).getDay() + 1;
        //             var company = await get_company_name(response.airline_iata, response.airline_icao);
        //             var arrival_country = await get_country_name(response.arr_iata, response.arr_icao);
        //             var depurture_country = await get_country_name(response.dep_iata, response.dep_icao);
        //             var flight_type = null//need to caculate distance
        //             var weather_dep = null// need to pull from weather api
        //             var weather_arr = null//

        //             var punctuality = null;
        //             if(response.status==="landed"&&response.delayed===null)
        //             {punctuality = late_status(0);}
        //             else {punctuality = late_status(response.delayed);}

        //             var scheduled_arr_time = convert_utc_to_loacl_time(convert_utc_str_to_date_type(response.arr_time_utc))
        //             var scheduled_dep_time = convert_utc_to_loacl_time(convert_utc_str_to_date_type(response.dep_time_utc))
        //             var updated_arr_time = convert_utc_to_loacl_time(convert_utc_str_to_date_type(response.arr_estimated_utc))
        //             var updated_dep_time = convert_utc_to_loacl_time(convert_utc_str_to_date_type(response.dep_estimated_utc))
        //             var webcite = airlabs_webcite

        //             var f_status = response.status
        //             // (C) APPEND MORE
        // //             YEAR,MONTH,DAY,DAY_OF_WEEK,AIRLINE,FLIGHT_NUMBER,ORIGIN_AIRPORT,DESTINATION_AIRPORT,
        // // SCHEDULED_DEPARTURE,DEPARTURE_TIME,DEPARTURE_DELAY,
        // // SCHEDULED_TIME,SCHEDULED_ARRIVAL,ARRIVAL_TIME,ARRIVAL_DELAY,DELAY_TYPE,DISTANCE_TYPE,
        // // IS_HOLYDAY,IS_VICATION,WEATHER_DEP_DESC,WEATHER_DEP_DESC_CODE,
        // // WEATHER_DEP_DEG,WEATHER_ARR_DESC,WEATHER_ARR_DESC_CODE,WEATHER_ARR_DEG
        // // country,lat,long

        //             year


        //             const info = [flight_number, is_summer_vacation, is_holyday, f_month, week_day, company, arrival_country, depurture_country,
        //                  flight_type, weather_dep, weather_arr, punctuality,
        //                 f_status, scheduled_arr_time, scheduled_dep_time, updated_arr_time, updated_dep_time, webcite, time_info_taken];
        //             console.log(info);
        //var csv = "";
        //csv += info.join(",") + "\r\n";
        //fs.appendFileSync("arrive3.csv", csv);
        // })
    }
    catch (err) { console.log(err); }





}

doGetRequest();
