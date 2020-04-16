const serverGeoNames = "http://api.geonames.org/export/geonamesData.js?username=juanpaco";
const serverRadioBrowser = "https://nl1.api.radio-browser.info/json/stations/bycountrycodeexact/";
const serverCountries = "https://nl1.api.radio-browser.info/json/countrycodes"

var stations = [];
var countries = [];
var sound;
var muted = false;
var stationIndex = 0;
var countryIndex = 0;
var currentCountry = '';

function dataServer (serverName) {
	return serverName;
}

function getData(success, serverName) {

    const url = dataServer(serverName);
    const request = {url};
    const promise = axios(request);
    promise.then (success, error);
}

getData(successCountries, serverCountries);
getData(successRadio,serverRadioBrowser + 'fr');

function successRadio (response) {
    stations = response.data;
}

function successCountries (response) {
    countries = response.data;
}

function error (err) {
    console.log(typeof err.response.data)
	alert("Error: "+JSON.stringify(err.response.data, null, 2));
}

function playControl (radioStationUrl) {
    sound = new Howl({
            src: [radioStationUrl],
            html5: true,
            autoplay: true
        })
}

function getDataFromServer (dataServer, cb) {
    $.ajax({
        url: dataServer
    })
        .done (function (result) {
            cb(result);
        });
}

// ------------------------------------------------- Interactive User Interfase

function getCurrentLocationRadio (geoServer) {
    getDataFromServer (geoServer, function (countries) {
        return countries.substr(countries.search("CountryCode=")+13,2);
    });
}

// ------------------------------------------------------------  Radio Controls

function powerControl () {
    console.log (stations [22].url);
    playControl (stations [22].url);
}

function muteControl () {
    muted = !muted;
    sound.mute(muted);
}

function stopStation() {
    sound.stop()
}

function nextStation (count) {
    stopStation();
    muted = true;
    muteControl();
    if (stationIndex < countries[countryIndex].stationcount) {
        stationIndex = stationIndex + count;
    } else {
        stationIndex = 0;
    }
    playControl(stations[stationIndex].url);
    updatePanel();
}

function updatePanel() {
    $("#dataRadioBrowser img").attr("src",stations[stationIndex].favicon);  
    $("#dataRadioBrowser .infoCountryRadioStation").text(stations[stationIndex].country);
    $("#dataRadioBrowser .infoNameRadioStation p").text(stations[stationIndex].name.substring(0,20));
    $("#dataRadioBrowser .infoBitrateRadioStation p").text(stations[stationIndex].bitrate + " " + stations[stationIndex].codec);
    $("#dataRadioBrowser .tagRadioStation p").text(stations[stationIndex].tags.substring(0,20));
}

function nextCountry () {
    countryIndex += 1;
    stopStation();
    getData(successRadio,serverRadioBrowser + countries[countryIndex].name);
    console.log(countries[countryIndex].name + "  /  "+ countries[countryIndex].stationcount); 
/*
    playControl(stations[stationIndex].url_resolved);
    console.log(sound.state() + " / " + stations[stationIndex].countrycode);
    $("#dataRadioBrowser img").attr("src",stations[stationIndex].favicon);
    $("#dataRadioBrowser .infoCountryRadioStation").text(stations[stationIndex].country);
    $("#dataRadioBrowser .infoNameRadioStation p").text(stations[stationIndex].name.substring(0,20));
    $("#dataRadioBrowser .infoBitrateRadioStation p").text(stations[stationIndex].bitrate + " " + stations[stationIndex].codec);
    $("#dataRadioBrowser .tagRadioStation p").text(stations[stationIndex].tags.substring(0,20));*/
}