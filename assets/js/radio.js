//  OPUS 94: http://s5.mexside.net:8256/stream

const serverGeoNames = "http://api.geonames.org/export/geonamesData.js?username=juanpaco";
const serverRadioBrowser = "https://nl1.api.radio-browser.info/json/stations/bycountrycodeexact/";

/*const ajaxServer = (server) => $.ajax({
    url: server,

})
    .done (function (result) {
        return result;
    });

var x = ajaxServer(serverRadioBrowser+"mx");
console.log(x, Object.keys(x), x.responseJSON);*/

//const countryRadioStation = getCurrentLocationRadio(serverGeoNames);

const dbStations = require('/assets/stations/stations.json')

// ---------------------------------------------------------------- Server Data

function getDataFromServer (dataServer, cb) {
    $.ajax({
        url: dataServer
    })
        .done (function (result) {
            cb(result);
        });
}

// ------------------------------------------------- Interactive User Interfase

function getRadioStations() {
    var x = ajaxServer(serverRadioBrowser+"mx");
    console.log(x, Object.keys(x), x.responseJSON);

/*  $.ajax({
    url: "https://nl1.api.radio-browser.info/json/stations/bycountrycodeexact/mx"
  })
    .done (function (result) {
      return result;
    });*/
}

function playRadioStation(radioCodeCountry, radioStation) {
    getDataFromServer(serverRadioBrowser + radioCodeCountry, function (dataRadioBrowser) {
        updateRadioStationPanel (dataRadioBrowser[radioStation].favicon);
        $("#dataRadioBrowser .infoNameRadioStation p").text(dataRadioBrowser[radioStation].name.substring(0,20));
        $("#dataRadioBrowser .infoBitrateRadioStation p").text(dataRadioBrowser[radioStation].bitrate + " " + dataRadioBrowser[radioStation].codec);
        $("#dataRadioBrowser .tagRadioStation p").text(dataRadioBrowser[radioStation].tags.substring(0,20));
        playControl(dataRadioBrowser[radioStation].url_resolved);
    });
}

function getCurrentLocationRadio (geoServer) {
    getDataFromServer (geoServer, function (countries) {
        return countries.substr(countries.search("CountryCode=")+13,2);
    });
}

function updateRadioStationPanel (radioStationData) {
    $("#dataRadioBrowser img").attr("src", radioStationData);
    //$("#dataRadioBrowser .infoNameRadioStation p").text(dataRadioBrowser[radioStation].name.substring(0,20));
    //$("#dataRadioBrowser .infoCountryRadioStation p").text(dataRadioBrowser[radioStation].country);
    //$("#dataRadioBrowser .infoBitrateRadioStation p").text(dataRadioBrowser[radioStation].bitrate + " " + dataRadioBrowser[radioStation].codec);
    //$("#dataRadioBrowser .tagRadioStation p").text(dataRadioBrowser[radioStation].tags.substring(0,20));
}

// ------------------------------------------------------------  Radio Controls

function powerControl () {
}

function playControl (radioStationUrl) {
    var sound = new Howl({
            src: [radioStationUrl],
            html5: true
        }).play();
}

function muteControl () {
    return sound.mute(true);
};
