const serverGeoNames = "http://api.geonames.org/export/geonamesData.js?username=juanpaco";
const serverRadioBrowser = "https://nl1.api.radio-browser.info/json/stations/bycountryexact/";
const serverCountries = "https://nl1.api.radio-browser.info/json/countries";

$(".playSt i").css("color","red");                              // inicialmente en color rojo

var stations = [];                                              // array con las estaciones para un país seleccionado
var countries = [];                                             // array con todos los paises en la bd
var iStation = 0;                                               // indice con la estación actual que se está escuchando
var iCountry = 0;                                               // indice con el país actual seleccionado
var sound = new Howl ({
    src: "http://s5.mexside.net:8256/stream"
})

function dataServer (serverName) {
	return serverName;
}

function getData(success, serverName) {
    const url = dataServer(serverName);
    const request = {url};
    const promise = axios(request);
    promise.then (success, error);
}

function successCountries (response) {
    countries = response.data;
    iCountry = countries.length - 1;
    nextCountry (1);
    getData(successRadio,serverRadioBrowser + countries[0].name);
}

function successRadio (response) {
    stations = response.data;
    nextStation (1);
}

function error (err) {
	alert("Error: "+JSON.stringify(err.response, null, 2));
}

function playStation () {
    stopStation();
    if (stations[iStation].url_resolved.includes("M3U8")) {
        playc();
    } else {
        sound = new Howl({
            src: stations[iStation].url_resolved,
            html5: true,
            format: ['webm'],
            onloaderror: sound.once('load', function(){
                sound.play();
            }),
            onplayerror: sound.once('load', function(){
                sound.play();
            })
        });
        sound.load();
        sound.play();
        if (sound.playing()) {$(".playSt i").css("color","green");}
    }
}

function stopStation () {
    if (sound.playing()) {
        sound.unload();
        $(".playSt i").css("color","red")
    }
}

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

function playc() {
    var video = document.getElementById('video');
    //video.height = 300;
	video.width = 200;
    var videoSrc = stations[iStation].url_resolved;
    if (Hls.isSupported()) {
        var hls = new Hls();
        hls.loadSource(videoSrc);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, function() {
            video.play();
        });
    }
        else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = videoSrc;
            video.addEventListener('loadedmetadata', function() {
            video.play();
        });
    }
}


function enjoyTR () {
    getData(successCountries, serverCountries);
}

enjoyTR ();