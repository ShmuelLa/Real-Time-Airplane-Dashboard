const lib_complete_info = require("./complete_info_functions");
// const producer = require("./producer");
const my_sql = require("./my_sql");

const axios = require('axios');//get url
const air_labs_API_KEY = '0b8736c6-beac-4b70-88a8-b984fb5edaf7'






async function get_real_time_flights(arriving_flights,depurturing_flights) {
    try {
        var con=my_sql.create_sql_connection();
        arr_web_time = []
        var response_arr = await axios.all([axios.get(`https://airlabs.co/api/v9/flights?_fields=
                                    airline_iata,
                                    airline_icao,
                                    flight_number,
                                    flight_icao,
                                    flight_iata,
                                    dir,
                                    lat,
                                    lng,
                                    alt,
                                    dir,
                                    dep_iata,
                                    dep_icao,
                                    arr_iata,
                                    arr_icao,
                                    updated,
                                    status&arr_iata=TLV&api_key=${air_labs_API_KEY}`),
                                    axios.get(`https://airlabs.co/api/v9/schedules?_fields=airline_iata,
                                    airline_icao,
                                    flight_number,
                                    flight_icao,
                                    flight_iata,
                                    dep_iata,
                                    dep_icao,
                                    arr_iata,
                                    arr_icao,
                                    &dep_iata=TLV&api_key=${air_labs_API_KEY}`)]);
                                   
        //console.log("r0:", response.data.response);
        my_sql.add_row_info(con,{"webcite": `https://airlabs.co/api/v9/flights?`, "date_time": lib_complete_info.getNow(), "data": response_arr[0].data.response});
        my_sql.add_row_info(con,{"webcite": 'https://airlabs.co/api/v9/schedules?', "date_time": lib_complete_info.getNow(), "data": response_arr[1].data.response});

        console.log("r0:", response_arr[0].data.response);
        console.log("r1:", response_arr[01].data.response);

        response_arr[0].data.response.forEach(async res => {
            try { 
                var time_info = await axios.get(`https://airlabs.co/api/v9/flight?_fields=dep_time, dep_time_utc, dep_estimated_utc, dep_actual_utc,arr_time_utc,arr_estimated_utc,dep_delayed,delayed,arr_delayed,arr_actual_utc,&flight_iata=${res.flight_iata}&api_key=${air_labs_API_KEY}`);
                my_sql.add_row_info(con,{"webcite": `https://airlabs.co/api/v9/flight?&flight_iata=${res.flight_iata}`, "date_time": lib_complete_info.getNow(), "data": time_info.data.response});
                time_info = time_info.data.response;
                //console.log(time_info);
                var flight_number = res.flight_number;
                var flight_iata = res.flight_iata;

                var is_summer_vacation = lib_complete_info.isSummerVacation(time_info.dep_time_utc);
                var res_including_api_info = await lib_complete_info.isJewishIsraelyHolyday(time_info.dep_time_utc);
                var is_holyday=res_including_api_info[0];
                my_sql.add_row_info(con,{"webcite": res_including_api_info[1], "date_time": lib_complete_info.getNow(), "data": res_including_api_info[2]});
                console.log({"webcite": res_including_api_info[1], "date_time": lib_complete_info.getNow(), "data": res_including_api_info[2]});
                var year_month_day_day_of_the_week = lib_complete_info.getYearMonthDay(time_info.dep_time_utc);
                var year = year_month_day_day_of_the_week[0];
                var f_month = year_month_day_day_of_the_week[1];
                var f_date_day = year_month_day_day_of_the_week[2];
                var week_day = year_month_day_day_of_the_week[3];

                var company_code = res.airline_iata;
                res_including_api_info= await lib_complete_info.getCompanyName(res.airline_iata, res.airline_icao);
                var company_name =res_including_api_info[0];
                my_sql.add_row_info(con,{"webcite": res_including_api_info[1], "date_time": lib_complete_info.getNow(), "data": res_including_api_info[2]});


                var arrival_country_name = await lib_complete_info.getCountryNameForAirport(res.arr_iata, res.arr_icao);
                var depurture_country_name = await lib_complete_info.getCountryNameForAirport(res.dep_iata, res.dep_icao);


                var flight_type = lib_complete_info.distanseStatus(await lib_complete_info.distanceFromTLV(res.dep_iata, res.dep_icao));//need to caculate distance
                var weather_dep_desc_desc_code_deg = await lib_complete_info.getWeatherForAirport(res.dep_iata, time_info.dep_time_utc, lib_complete_info.convertUtcStrToDateType(time_info.dep_time_utc).getHours());// need to pull from weather api
                var weather_arr_desc_desc_code_deg = await lib_complete_info.getWeatherForAirport(res.arr_iata, time_info.arr_time_utc, lib_complete_info.convertUtcStrToDateType(time_info.arr_time_utc).getHours());
                my_sql.add_row_info(con,{"webcite": weather_dep_desc_desc_code_deg[3], "date_time": lib_complete_info.getNow(), "data": weather_dep_desc_desc_code_deg[4]});
                my_sql.add_row_info(con,{"webcite": weather_arr_desc_desc_code_deg[3], "date_time": lib_complete_info.getNow(), "data": weather_arr_desc_desc_code_deg[4]});

                var punctuality = null;
                if (res.status === "landed" && res.delayed === null) { punctuality = lib_complete_info.delayStatus(0); }
                else { punctuality = lib_complete_info.delayStatus(time_info.arr_delayed); }

                var scheduled_arr_time = lib_complete_info.convertUtcToLoaclTime(time_info.arr_time_utc);
                var scheduled_dep_time = lib_complete_info.convertUtcToLoaclTime(time_info.dep_time_utc);
                var updated_arr_time = lib_complete_info.convertUtcToLoaclTime(time_info.arr_estimated_utc);
                var updated_dep_time = lib_complete_info.convertUtcToLoaclTime(time_info.dep_estimated_utc);
                var actual_dep_time = lib_complete_info.convertUtcToLoaclTime(time_info.dep_actual_utc);
                var actual_arr_time = lib_complete_info.convertUtcToLoaclTime(time_info.arr_actual_utc)
                // var webcite = airlabs_webcite

                var f_status = res.status;


                const info = {"YEAR": year,"MONTH": f_month, "DAY": f_date_day,"DAY_OF_WEEK": week_day, "AIRLINE_NAME": company_name, "AIRLINE_IATA_CODE": company_code,
                    "FLIGHT_NUMBER": flight_number,"FLIGHT_IATA_CODE": flight_iata,"ORIGIN_AIRPORT_IATA": res.dep_iata, "DESTINATION_AIRPORT_IATA": res.arr_iata,
                    "SCHEDULED_DEPARTURE": scheduled_dep_time,"DEPARTURE_TIME": actual_dep_time,"UPDATED_DEPARTURE_TIME": updated_dep_time,
                    "SCHEDULED_ARRIVAL": scheduled_arr_time,"ARRIVAL_TIME": actual_arr_time, "UPDATED_ARRIVAL_TIME": updated_arr_time,
                    "DEPARTURE_DELAY": time_info.dep_delayed, "ARRIVAL_DELAY": time_info.arr_delayed,"FLIGHT_STATUS": f_status,
                    "DELAY_TYPE": punctuality,"DISTANCE_TYPE": flight_type, "IS_HOLYDAY": is_holyday, "IS_VICATION": is_summer_vacation,
                    "WEATHER_DEP_DESC": weather_dep_desc_desc_code_deg[0], "WEATHER_DEP_DESC_CODE": weather_dep_desc_desc_code_deg[1],
                    "WEATHER_DEP_DEG": weather_dep_desc_desc_code_deg[2], "WEATHER_ARR_DESC": weather_arr_desc_desc_code_deg[0],
                    "WEATHER_ARR_DESC_CODE": weather_arr_desc_desc_code_deg[1], "WEATHER_ARR_DEG": weather_arr_desc_desc_code_deg[2],
                    "DEPARTURE_COUNTRY": depurture_country_name.country, "ARRIVAL_COUNTRY": arrival_country_name.country, "LAT": res.lat,"LNG": res.lng,"DIR":res.dir,"PREDICTION": 'Calculating'};
                    console.log(info);
                    await lib_complete_info.update_redis(info,arriving_flights,depurturing_flights);
            //    await producer.sendMessage(JSON.stringify(info),'real-time-data');
            }
            catch(err){
                console.log(err);
            }
            });
            response_arr[1].data.response.forEach(async res => {
                try{
          
                var time_info = await axios.get(`https://airlabs.co/api/v9/flight?_fields=   dir,lat,alt,updated,status,delayed,
                lng,dep_time, dep_time_utc, dep_estimated_utc, dep_actual_utc,arr_time_utc,arr_estimated_utc,dep_delayed,delayed,arr_delayed,arr_actual_utc,&flight_iata=${res.flight_iata}&api_key=${air_labs_API_KEY}`);
                my_sql.add_row_info(con,{"webcite": `https://airlabs.co/api/v9/flight?&flight_iata=${res.flight_iata}`, "date_time": lib_complete_info.getNow(), "data": time_info.data.response});
                time_info = time_info.data.response;
                // console.log(time_info);
                var flight_number = res.flight_number;
                var flight_iata = res.flight_iata;

                var is_summer_vacation = lib_complete_info.isSummerVacation(time_info.dep_time_utc);
                var res_including_api_info = await lib_complete_info.isJewishIsraelyHolyday(time_info.dep_time_utc);
                var is_holyday=res_including_api_info[0];
                my_sql.add_row_info(con,{"webcite": res_including_api_info[1], "date_time": lib_complete_info.getNow(), "data": res_including_api_info[2]});


                var year_month_day_day_of_the_week = lib_complete_info.getYearMonthDay(time_info.dep_time_utc);
                var year = year_month_day_day_of_the_week[0];
                var f_month = year_month_day_day_of_the_week[1];
                var f_date_day = year_month_day_day_of_the_week[2];
                var week_day = year_month_day_day_of_the_week[3];

                var company_code = res.airline_iata;
                res_including_api_info= await lib_complete_info.getCompanyName(res.airline_iata, res.airline_icao);
                var company_name =res_including_api_info[0];
                my_sql.add_row_info(con,{"webcite": res_including_api_info[1], "date_time": lib_complete_info.getNow(), "data": res_including_api_info[2]});

                var arrival_country_name = await lib_complete_info.getCountryNameForAirport(res.arr_iata, res.arr_icao);
                var depurture_country_name = await lib_complete_info.getCountryNameForAirport(res.dep_iata, res.dep_icao);


                var flight_type = lib_complete_info.distanseStatus(await lib_complete_info.distanceFromTLV(res.dep_iata, res.dep_icao));//need to caculate distance
                var weather_dep_desc_desc_code_deg = await lib_complete_info.getWeatherForAirport(res.dep_iata, time_info.dep_time_utc, lib_complete_info.convertUtcStrToDateType(time_info.dep_time_utc).getHours());// need to pull from weather api
                var weather_arr_desc_desc_code_deg = await lib_complete_info.getWeatherForAirport(res.arr_iata, time_info.arr_time_utc, lib_complete_info.convertUtcStrToDateType(time_info.arr_time_utc).getHours());
                my_sql.add_row_info(con,{"webcite": weather_dep_desc_desc_code_deg[3], "date_time": lib_complete_info.getNow(), "data": weather_dep_desc_desc_code_deg[4]});
                my_sql.add_row_info(con,{"webcite": weather_arr_desc_desc_code_deg[3], "date_time": lib_complete_info.getNow(), "data": weather_arr_desc_desc_code_deg[4]});

                var punctuality = null;
                if (time_info.status === "landed" && time_info.delayed === null) { punctuality = lib_complete_info.delayStatus(0); }
                else { punctuality = lib_complete_info.delayStatus(time_info.arr_delayed); }

                var scheduled_arr_time = lib_complete_info.convertUtcToLoaclTime(time_info.arr_time_utc);
                var scheduled_dep_time = lib_complete_info.convertUtcToLoaclTime(time_info.dep_time_utc);
                var updated_arr_time = lib_complete_info.convertUtcToLoaclTime(time_info.arr_estimated_utc);
                var updated_dep_time = lib_complete_info.convertUtcToLoaclTime(time_info.dep_estimated_utc);
                var actual_dep_time = lib_complete_info.convertUtcToLoaclTime(time_info.dep_actual_utc);
                var actual_arr_time = lib_complete_info.convertUtcToLoaclTime(time_info.arr_actual_utc)

                var f_status = time_info.status;


                const info = {"YEAR": year,"MONTH": f_month, "DAY": f_date_day,"DAY_OF_WEEK": week_day, "AIRLINE_NAME": company_name, "AIRLINE_IATA_CODE": company_code,
                    "FLIGHT_NUMBER": flight_number,"FLIGHT_IATA_CODE": flight_iata,"ORIGIN_AIRPORT_IATA": res.dep_iata, "DESTINATION_AIRPORT_IATA": res.arr_iata,
                    "SCHEDULED_DEPARTURE": scheduled_dep_time,"DEPARTURE_TIME": actual_dep_time,"UPDATED_DEPARTURE_TIME": updated_dep_time,
                    "SCHEDULED_ARRIVAL": scheduled_arr_time,"ARRIVAL_TIME": actual_arr_time, "UPDATED_ARRIVAL_TIME": updated_arr_time,
                    "DEPARTURE_DELAY": time_info.dep_delayed, "ARRIVAL_DELAY": time_info.arr_delayed,"FLIGHT_STATUS": f_status,
                    "DELAY_TYPE": punctuality,"DISTANCE_TYPE": flight_type, "IS_HOLYDAY": is_holyday, "IS_VICATION": is_summer_vacation,
                    "WEATHER_DEP_DESC": weather_dep_desc_desc_code_deg[0], "WEATHER_DEP_DESC_CODE": weather_dep_desc_desc_code_deg[1],
                    "WEATHER_DEP_DEG": weather_dep_desc_desc_code_deg[2], "WEATHER_ARR_DESC": weather_arr_desc_desc_code_deg[0],
                    "WEATHER_ARR_DESC_CODE": weather_arr_desc_desc_code_deg[1], "WEATHER_ARR_DEG": weather_arr_desc_desc_code_deg[2],
                    "DEPARTURE_COUNTRY": depurture_country_name.country, "ARRIVAL_COUNTRY": arrival_country_name.country, "LAT": time_info.lat,"LNG": time_info.lng,"DIR":time_info.dir,"PREDICTION": 'Calculating'};
                    console.log(info);
                    await lib_complete_info.update_redis(info,arriving_flights,depurturing_flights);

            //    await producer.sendMessage(JSON.stringify(info),'real-time-data');
                }
                catch(err){
                    console.log(err);
                }
            }); 
        }
        catch(err){
            console.log(err);
        }

}


module.exports={get_real_time_flights,air_labs_API_KEY}
