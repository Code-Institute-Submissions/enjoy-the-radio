const serverGeoNames = "http://api.geonames.org/export/geonamesData.js?username=juanpaco";
const serverRadioBrowser = "https://nl1.api.radio-browser.info/json/stations/bycountryexact/";
const serverCountries = "https://nl1.api.radio-browser.info/json/countries";

const iFavicon = "assets/images/live-broadcast-icon.png";

var power = false;
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
getData(successRadio,serverRadioBrowser + 'mexico');

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

function playControl (radioStationResolved) {
    console.log(radioStationResolved);
    sound = new Howl({
            src: [radioStationResolved],
            html5: true
        });
    sound.load();
    sound.play();
}

/*function getDataFromServer (dataServer, cb) {
    $.ajax({
        url: dataServer
    })
        .done (function (result) {
            cb(result);
        });
}*/

// ------------------------------------------------- Interactive User Interfase

function getCurrentLocationRadio (geoServer) {
    getDataFromServer (geoServer, function (countries) {
        return countries.substr(countries.search("CountryCode=")+13,2);
    });
}

// ------------------------------------------------------------  Radio Controls

function powerControl () {
    power = !power;
    if (power) {
        playControl (stations [0].url_resolved);
        updatePanel(stations[0].favicon, stations[0].country, stations[0].name, 
        stations[0].bitrate, stations[0].codec, stations[0].tags);
        $(".power i").css("color","green"); 
    } else {
        stopStation();
    }
}

function muteControl () {
    muted = !muted;
    sound.mute(muted);
}

function stopStation() {
    sound.unload();
    updatePanel(iFavicon, "", "set power on...", "", "", "");
    $(".power i").css("color","red");
}

function nextStation (count) {
    muted = true;
    muteControl();
    stopStation();
    if (stationIndex < countries[countryIndex].stationcount) {
        stationIndex = stationIndex + count;
    } else {
        stationIndex = 0;
    }
    playControl(stations[stationIndex].url_resolved);
    updatePanel(stations[stationIndex].favicon, stations[stationIndex].country, stations[stationIndex].name, 
        stations[stationIndex].bitrate, stations[stationIndex].codec, stations[stationIndex].tags);
}

function updatePanel(sFavicon, sCountry, sName, sBitrate, sCodec, sTags) {
    $("#dataRadioBrowser img").attr("src",sFavicon);  
    $("#dataRadioBrowser .infoCountryRadioStation").text(sCountry);
    $("#dataRadioBrowser .infoNameRadioStation p").text(sName.substring(0,20));
    $("#dataRadioBrowser .infoBitrateRadioStation p").text(sBitrate + " " + sCodec);
    $("#dataRadioBrowser .tagRadioStation p").text(sTags.substring(0,20));
}

function nextCountry () {
    countryIndex += 1;
    stopStation();
    getData(successRadio,serverRadioBrowser + countries[countryIndex].name);
    console.log(countries[countryIndex].name + "  /  "+ countries[countryIndex].stationcount); 
}