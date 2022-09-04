

//airlabs
var airlabs_API_KEY = "d1363006-5b3b-4fa1-a071-d0956cc9d8fe"//new!!! masaday.anak
var airlabs_webcite = "https://airlabs.co/"
const dayjs = require('dayjs');
const axios = require('axios');



function get_now() {
    /**
     * get current time in the following format: 
     * 26-08-2022  18:04:10
     */
    let today = dayjs();
    return today.format("DD-MM-YYYY  HH:mm:ss");

}



async function get_company_name(iata, icao) {
    /**
     * get company name by its iata code or its icao code.
     */
    compony_name = null
    if (iata != null) {
        let res = await axios.get(`https://airlabs.co/api/v9/airlines?iata_code=${iata}&api_key=${airlabs_API_KEY}`);
        compony_name = res.data.response[0].name;
    }
    else if (icao != null) {
        let res = await axios.get(`https://airlabs.co/api/v9/airlines?icao_code=${icao}&api_key=${airlabs_API_KEY}`);
        compony_name = res.data.response[0].name;
    }
    //console.log("company name: " + compony_name)
    return compony_name;
}

async function get_country_name(iata, icao) {
    /**
    * get company airport iata code or icao code.
    */
    country_code = null
    country_name = null
    if (iata != null) {
        let res = await axios.get(`https://airlabs.co/api/v9/airports?iata_code=${iata}&api_key=${airlabs_API_KEY}`);
        country_code = res.data.response[0].country_code;
    }
    else if (icao != null) {
        let res = await axios.get(`https://airlabs.co/api/v9/airports??icao_code=${icao}&api_key=${airlabs_API_KEY}`);
        country_code = res.data.response[0].country_code;
    }
    //console.log("country_code: " + country_code)
    if (country_code != null) {
        let res = await axios.get(`https://airlabs.co/api/v9/countries?code=${country_code}&api_key=${airlabs_API_KEY}`);
        country_name = res.data.response[0].name;
    }
    //console.log("country_name: " + country_name)
    return country_name;

}
function convert_utc_str_to_date_type(utc_date_str) {
    /**
     * console.log(convert_utc_to_isreal_time('2022-08-30 16:00'))
     * >> 2022-08-30T16:00:00.000Z
     */
    if (utc_date_str != null) {
        const date_time = utc_date_str.split(" ");
        utc_date_str = date_time[0] + "T" + date_time[1] + "Z";
        return new Date(utc_date_str);
    }
    return null;

}
function convert_utc_to_loacl_time(utc_date) {
    /**
     * recive utc date in Date type
     * return  string of local time
     */
    if (utc_date != null) {
        return utc_date.toLocaleDateString() + ' ' + utc_date.toLocaleTimeString();
    }
    return null;
}

function minutes_difference(utc_date1, utc_date2) {
    if (utc_date1 != null && utc_date2 != null) { return (utc_date1.getTime() - utc_date2.getTime()) / 60000; }
    return null;
}
function late_status(minutes) {
    if (minutes != null) {
        if (minutes <= 15) { return 'ok'; }
        else if ((minutes <= 60)) { return 'slightly late'; }
        else { return 'very late'; }
    }
    else {
        return null;
    }
}


async function doGetRequest() {

    responseArr = await axios.all([axios.get(`https://airlabs.co/api/v9/schedules??_view=array&_fields=
                                    airline_iata,
                                    airline_icao,
                                    flight_number,
                                    dep_iata,
                                    dep_icao,
                                    dep_time_utc,
                                    dep_estimated_utc,
                                    arr_iata,
                                    arr_icao,
                                    arr_time_utc,
                                    arr_estimated_utc,
                                    delayed,
                                    status&dep_iata=TLV&api_key=${airlabs_API_KEY}`),

    axios.get(`https://airlabs.co/api/v9/schedules??_view=array&_fields=
                                    airline_iata,
                                    airline_icao,
                                    flight_number,
                                    dep_iata,
                                    dep_icao,
                                    dep_time_utc,
                                    dep_estimated_utc,
                                    arr_iata,
                                    arr_icao,
                                    arr_time_utc,
                                    arr_estimated_utc,
                                    delayed,
                                    status&arr_iata=TLV&api_key=${airlabs_API_KEY}`)
    ]);
    // console.log("r0:", responseArr[0].data.response)
    // console.log("r1:", responseArr[1].data.response)


    var time_info_taken = get_now();

    responseArr[0].data.response.forEach(async response => {
        var flight_number = response.flight_number;
        var is_summer_vacation = false;//
        var is_holyday = false;//
        var f_month = convert_utc_str_to_date_type(response.dep_time_utc).getMonth();
        var week_day = convert_utc_str_to_date_type(response.dep_time_utc).getDay() + 1;
        var company = await get_company_name(response.airline_iata, response.airline_icao);
        var arrival_country = await get_country_name(response.arr_iata, response.arr_icao);
        var depurture_country = await get_country_name(response.dep_iata, response.dep_icao);
        var flight_type = null;//need to caculate distance
        var weather_dep = null;// need to pull from weather api
        var weather_arr = null;//

        var punctuality = null;
        var minute_delay_in_dep = null;
        if (response.status === "landed" || response.status === "active") {
            minute_delay_in_dep = minutes_difference(convert_utc_str_to_date_type(response.dep_estimated_utc), convert_utc_str_to_date_type(response.dep_time_utc));
        }
        punctuality = late_status(minute_delay_in_dep);

        var scheduled_arr_time = convert_utc_to_loacl_time(convert_utc_str_to_date_type(response.arr_time_utc));
        var scheduled_dep_time = convert_utc_to_loacl_time(convert_utc_str_to_date_type(response.dep_time_utc));
        var updated_arr_time = convert_utc_to_loacl_time(convert_utc_str_to_date_type(response.arr_estimated_utc));
        var updated_dep_time = convert_utc_to_loacl_time(convert_utc_str_to_date_type(response.dep_estimated_utc));
        var webcite = airlabs_webcite;
        var f_status = response.status;

        const info = [flight_number, is_summer_vacation, is_holyday, f_month, week_day, company, arrival_country, depurture_country, flight_type, weather_dep, weather_arr, punctuality,
            f_status, scheduled_arr_time, scheduled_dep_time, updated_arr_time, updated_dep_time, webcite, time_info_taken];
        console.log(info);
        var csv = "";

        csv += info.join(",") + "\r\n";

        fs.appendFileSync("depurture.csv", csv);


    });


    await responseArr[1].data.response.forEach(async response => {
        var flight_number = response.flight_number;
        var is_summer_vacation = false;//
        var is_holyday = false;//
        var f_month = convert_utc_str_to_date_type(response.dep_time_utc).getMonth();
        var week_day = convert_utc_str_to_date_type(response.dep_time_utc).getDay() + 1;
        var company = await get_company_name(response.airline_iata, response.airline_icao);
        var arrival_country = await get_country_name(response.arr_iata, response.arr_icao);
        var depurture_country = await get_country_name(response.dep_iata, response.dep_icao);
        var flight_type = null//need to caculate distance
        var weather_dep = null// need to pull from weather api
        var weather_arr = null//

        var punctuality = null;
        punctuality = late_status(response.delayed)

        var scheduled_arr_time = convert_utc_to_loacl_time(convert_utc_str_to_date_type(response.arr_time_utc))
        var scheduled_dep_time = convert_utc_to_loacl_time(convert_utc_str_to_date_type(response.dep_time_utc))
        var updated_arr_time = convert_utc_to_loacl_time(convert_utc_str_to_date_type(response.arr_estimated_utc))
        var updated_dep_time = convert_utc_to_loacl_time(convert_utc_str_to_date_type(response.dep_estimated_utc))
        var webcite = airlabs_webcite

        var f_status = response.status
        // (C) APPEND MORE
        const info = [flight_number, is_summer_vacation, is_holyday, f_month, week_day, company, arrival_country, depurture_country, flight_type, weather_dep, weather_arr, punctuality,
            f_status, scheduled_arr_time, scheduled_dep_time, updated_arr_time, updated_dep_time, webcite, time_info_taken];
        console.log(info);
        var csv = "";
        csv += info.join(",") + "\r\n";
        fs.appendFileSync("arrive.csv", csv);
    })



}



doGetRequest();
// // (A) MANUAL CSV STRING
// var csv1 = "flight_number,is_summer_vacation,is_holyday,f_month,week_day,company,arrival_country,depurture_country,flight_type,weather_dep,weather_arr,punctuality,f_status,scheduled_arr_time,scheduled_dep_time,updated_arr_time,updated_dep_time,webcite,time_info_taken";

// // (B) WRITE TO FILE
// const fs = require("fs");
// fs.writeFileSync("arrive.csv", csv1);
// fs.writeFileSync("depurture.csv", csv1);


// console.log("Done!");