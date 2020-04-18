const serverGeoNames = "http://api.geonames.org/export/geonamesData.js?username=juanpaco";
const serverRadioBrowser = "https://nl1.api.radio-browser.info/json/stations/bycountryexact/";
const serverCountries = "https://nl1.api.radio-browser.info/json/countries";

var power = false;
$(".power i").css("color","red");

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
getData(successRadio,serverRadioBrowser + 'méxico');

function successRadio (response) {
    stations = response.data;
}

function successCountries (response) {
    countries = response.data;
}

function error (err) {
	alert("Error: "+JSON.stringify(err.response.data, null, 2));
}

function playControl (pStation, pCountry, pName, pBitrate, pCodec, pTags) {
    sound = new Howl({
            src: pStation,
            html5: true,
            format: ['webm'],
            preload: true,
            autoplay: true,
            onloaderror: console.log ("error on load: QUE HAGO!!!"),
            onplayerror: console.log ("error on play: QUE HAGO!!!")
        });
    updatePanel (pCountry, pName, pBitrate, pCodec, pTags);
    $(".power i").css("color","green");
}

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
        playControl (stations [stationIndex].url_resolved, stations[stationIndex].country, stations[stationIndex].name, 
        stations[stationIndex].bitrate, stations[stationIndex].codec, stations[stationIndex].tags); 
    } else {
        stopStation();
    }
}

function stopStation(pCountry) {
    sound.unload();
    updatePanel (pCountry, "set power on...", "", "", "");
    $(".power i").css("color","red");
}

function nextStation (count) {
    stopStation(countries[countryIndex].name);
    if (stationIndex < countries[countryIndex].stationcount) {
        stationIndex = stationIndex + count;
    } else {
        stationIndex = 0;
    }
    if (stations[stationIndex].codec == "UNKNOWN") {
        playc(stations[stationIndex].url_resolved, stations[stationIndex].country, stations[stationIndex].name, 
            stations[stationIndex].bitrate, stations[stationIndex].codec, stations[stationIndex].tags)
    } else {
        playControl(stations[stationIndex].url_resolved, stations[stationIndex].country, stations[stationIndex].name, 
            stations[stationIndex].bitrate, stations[stationIndex].codec, stations[stationIndex].tags);
    }
    console.log("Estacion: "+stationIndex + " > " + stations[stationIndex].url_resolved);
}

function updatePanel (sCountry, sName, sBitrate, sCodec, sTags) {
    $("#dataRadioBrowser .infoCountryRadioStation").text(sCountry);
    $("#dataRadioBrowser .infoNameRadioStation p").text(sName.substring(0,20));
    $("#dataRadioBrowser .infoBitrateRadioStation p").text(sBitrate + " " + sCodec);
    $("#dataRadioBrowser .tagRadioStation p").text(sTags.substring(0,20));
}

function nextCountry (count) {
    if (countryIndex < countries.length) {
        countryIndex = countryIndex + count;
    } else {
        countryIndex = 0;
    }
    stationIndex = 0;
    getData(successRadio,serverRadioBrowser + countries[countryIndex].name);
    stopStation(countries[countryIndex].name);
    console.log(countryIndex + " - Pais: "+countries[countryIndex].name + "  Estaciones:  "+ countries[countryIndex].stationcount);
}

$( function() {
    $( "#accordion" ).accordion();
  } );

function playc(urlM3U8, pCountry, pName, pBitrate, pCodec, pTags) {
    
    updatePanel (pCountry, pName, pBitrate, pCodec, pTags);
    $(".power i").css("color","green");

    var video = document.getElementById('video');
    //video.height = 300;
	video.width = 200;
    var videoSrc = urlM3U8;
    if (Hls.isSupported()) {
        var hls = new Hls();
        hls.loadSource(videoSrc);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, function() {
            video.play();
        });
    }
    // hls.js is not supported on platforms that do not have Media Source Extensions (MSE) enabled.
    // When the browser has built-in HLS support (check using `canPlayType`), we can provide an HLS manifest (i.e. .m3u8 URL) directly to the video element through the `src` property.
    // This is using the built-in support of the plain video element, without using hls.js.
    // Note: it would be more normal to wait on the 'canplay' event below however on Safari (where you are most likely to find built-in HLS support) the video.src URL must be on the user-driven
    // white-list before a 'canplay' event will be emitted; the last video event that can be reliably listened-for when the URL is not on the white-list is 'loadedmetadata'.
        else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = videoSrc;
            video.addEventListener('loadedmetadata', function() {
            video.play();
        });
    }
}

