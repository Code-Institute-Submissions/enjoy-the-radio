const serverRadioBrowser = "https://nl1.api.radio-browser.info/json/stations/bycountryexact/";
const serverCountries = "https://nl1.api.radio-browser.info/json/countries";

var stations = [];                                              // array con las estaciones para un país seleccionado
var countries = [];                                             // array con todos los paises en la bd
var iStation = 0;                                               // indice con la estación actual que se está escuchando
var iCountry = 0;                                               // indice con el país actual seleccionado
var sound = new Howl ({                                         // Howler audio object. Initial constructor
    src: "http://s5.mexside.net:8256/stream"
})

// To get data from server using axios library
function getData(success, serverName) {
    const url = serverName;
    const request = {url};
    const promise = axios(request);
    promise.then (success, error);
}

// Promise function to get countries data
function successCountries (response) {
    countries = response.data;
    iCountry = countries.length - 1;
    nextCountry (1);
    getData(successRadio,serverRadioBrowser + countries[0].name);
}

// Promise function to get radio stations data
function successRadio (response) {
    stations = response.data;
    nextStation (1);
}

function error (err) {
	alert("Error: "+JSON.stringify(err.response, null, 2));
}

// Play a station clicked with play button
function playStation () {
    stopStation();
    sound = new Howl({
        src: stations[iStation].url_resolved,
        html5: true,
        format: ['webm'],
        onloaderror: sound.once('load', function(){
            sound.load();
        }),
        onplayerror: sound.once('load', function(){
            sound.play();
        })       
    });
    sound.load();
    sound.play();
}

function stopStation () {
    if (sound.playing()) {
        sound.unload();
    }
}

// Increment / Decrement array index of stations to change stations
function nextStation (count) {
    stopStation();
    if (iStation == 0 && count == -1) {
        iStation = stations.length - 1;
    } else {
        if (iStation == stations.length - 1 && count == 1) {
            iStation = 0;
        } else {
            iStation += count;
        }
    }
    $(".headerRB img").attr("src",stations[iStation].favicon);
    $("#dataRB .infoNameRS").html("<p>"+stations[iStation].name.substring(0,16)+"</p>");
    $("#dataRB .infoBitrateRS").html("<p>"+stations[iStation].bitrate + " " + stations[iStation].codec+"</p>");
    $("#dataRB .tagRS").html("<p>"+stations[iStation].tags.substring(0,35)+"</p>");
    $("#dataRB .favoriteRS").html("<a href="+stations[iStation].homepage+" target='_blank'><i class='fas fa-globe'></i></a>");
}

// Increment / Decrement array index of countries to change country
function nextCountry (count) {
    stopStation();
    if (iCountry == 0 && count == -1) {
        iCountry = countries.length - 1;
    } else {
        if (iCountry == countries.length - 1 && count == 1) {
            iCountry = 0;
        } else {
            iCountry += count;
        }
    }
    iStation = 0;
    $("#dataRB .infoCountryRS").html("<p>"+countries[iCountry].name.substring(0,30) + " ("+ countries[iCountry].stationcount + ")"+"</p>");
    getData(successRadio, serverRadioBrowser + countries[iCountry].name);
}

function enjoyTR () {
    getData(successCountries, serverCountries);
}

enjoyTR ();