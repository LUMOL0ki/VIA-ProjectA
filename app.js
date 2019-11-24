//Css
$("body").css('background-image', 'url("images/project_a_background.jpg")');
$("body").css('background-size', 'cover');
$("body").css('color', 'white');
$("bode").css('font-family', 'sans-serif');

(function () {
    var locationSection = document.getElementById("location-input-section");
    var map;
    var input = document.getElementById("autocomplete");
    var searchButton = document.getElementById('search');
    var geocoder;

    //On load
    function init() {
        var locationButton = document.getElementById("location-button");
        locationButton.addEventListener("click", locatorButtonPressed, false); 
        
        
        initWeather();
        geocoder = new google.maps.Geocoder();

        searchButton.addEventListener("click", search, false);
    }

    function search(){
        geocoder.geocode( { 'address': input.value}, function(results, status) {
            if (status == 'OK') {
              map.setCenter(results[0].geometry.location);
              var marker = new google.maps.Marker({
                  map: map,
                  position: results[0].geometry.location
              });
              //console.log(results[0]);
              //console.log(results[0].geometry.location.lat() + " " + results[0].geometry.location.lng());
              getWeather(results[0].geometry.location.lat(), results[0].geometry.location.lng());
            } else {
              alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    }

    function getWeather(lat, long){
        let language = "en";

        let degrees = [
            document.querySelector('.degreeToday'),
            document.querySelector('.degreeTomorow'),
            document.querySelector('.degreeAfterTomorow')
        ];

        let descriptions = [
            document.querySelector('.temperatureDescriptionToday'),
            document.querySelector('.temperatureDescriptionTomorow'),
            document.querySelector('.temperatureDescriptionAfterTomorow')
        ];

        let icons = [
            document.querySelector('.temperatureIconToday'),
            document.querySelector('.temperatureIconTomorow'),
            document.querySelector('.temperatureIconAfterTomorow')
        ];

        let locationTimezone = document.querySelector('.locationTimezone');

        const proxy = "https://cors-anywhere.herokuapp.com/";

        const weatherApi = `${proxy}https://api.darksky.net/forecast/fa5365be7b7038001aa3afd4f5d45cae/${lat},${long}?lang=${language}`;

        //get parsed weather data and set data
        $.getJSON(weatherApi, function(forecast){
            //console.log(forecast);

            for(i = 0; i < 3; i++){
                const {apparentTemperatureHigh, apparentTemperatureLow, summary, icon} = forecast.daily.data[i];
                degrees[i].textContent = Math.round((((apparentTemperatureHigh + apparentTemperatureLow)/2) - 32)/1.8) + " °C";
                descriptions[i].textContent = summary;
                setIcon(icon, icons[i]);
            }

            const {temperature, summary} = forecast.daily.data;
            locationTimezone.textContent = "Timezone: " + forecast.timezone;
        });
    }

    function initWeather(){
        let longitute;
        let latitute;   
        let language = "en";

        let degrees = [
            document.querySelector('.degreeToday'),
            document.querySelector('.degreeTomorow'),
            document.querySelector('.degreeAfterTomorow')
        ];

        let descriptions = [
            document.querySelector('.temperatureDescriptionToday'),
            document.querySelector('.temperatureDescriptionTomorow'),
            document.querySelector('.temperatureDescriptionAfterTomorow')
        ];

        let icons = [
            document.querySelector('.temperatureIconToday'),
            document.querySelector('.temperatureIconTomorow'),
            document.querySelector('.temperatureIconAfterTomorow')
        ];

        let locationTimezone = document.querySelector('.locationTimezone');

        const proxy = "https://cors-anywhere.herokuapp.com/";
        
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(position => {
                longitute = position.coords.longitude;
                latitute = position.coords.latitude;

                
                const weatherApi = `${proxy}https://api.darksky.net/forecast/fa5365be7b7038001aa3afd4f5d45cae/${latitute},${longitute}?lang=${language}`;

                //get parsed weather data and set data
                $.getJSON(weatherApi, function(forecast){
                    //console.log(forecast);

                    for(i = 0; i < 3; i++){
                        const {apparentTemperatureHigh, apparentTemperatureLow, summary, icon} = forecast.daily.data[i];
                        degrees[i].textContent = Math.round((((apparentTemperatureHigh + apparentTemperatureLow)/2) - 32)/1.8) + " °C";
                        descriptions[i].textContent = summary;
                        setIcon(icon, icons[i]);
                    }

                    const {temperature, summary} = forecast.daily.data;
                    locationTimezone.textContent = "Timezone: " + forecast.timezone;
                });
                getUserAddressBy(latitute, longitute);
                initMap(latitute, longitute);
            });   
        } 
    }


    //Request your location
    function locatorButtonPressed() {
        locationSection.classList.add("loading");  
        initWeather();
        //getUserAddressBy(latitute, longitute);
        //search();
    }

    //Set Address
    function getUserAddressBy(lat, long) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var address = JSON.parse(this.responseText)
                setAddressToInputField(address.results[5].formatted_address)
            }
        };
        xhttp.open("GET", "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + long + "&key=AIzaSyCJoy_92jetwHdboQ1gJMLpmMdom8dyhr8", true);
        xhttp.send();
    }

    //Set address to input
    function setAddressToInputField(address) {
        input.value = address;
        locationSection.classList.remove("loading");
    }

    var defaultBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(45.4215296, -75.6971931),
    );

    var options = {
        bounds: defaultBounds
    };

    //input autocomplete
    var autocomplete = new google.maps.places.Autocomplete(input, options);

    //Set map and zoom
    function initMap(lat, long) {
        map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: lat, lng: long},
        zoom: 12
        });
    }

    //Set weather icon
    function setIcon(icon, iconId){
        const skycons = new Skycons({color: "white"});
        const currentIcon = icon.replace(/-/g, "_").toUpperCase();
        skycons.play;
        return skycons.set(iconId, Skycons[currentIcon]);
    }

    init()

})();