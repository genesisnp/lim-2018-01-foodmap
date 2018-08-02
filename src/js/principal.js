const selectRestaurant = document.getElementById("select-restaurant-rating");
const span = document.getElementById("num_res");
console.log(selectRestaurant)
var map, infoWindow, filtro;

function initMap(filtro) {
  
  infoWindow = new google.maps.InfoWindow;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      map = new google.maps.Map(document.getElementById('map'), {
        center: pos,
        zoom: 15
      });

      infoWindow.setPosition(pos);
      infoWindow.setContent('Location found.');
      infoWindow.open(map);
      map.setCenter(pos);
      var service = new google.maps.places.PlacesService(map);
     
      service.nearbySearch({
        location: pos,
        radius: 500,
        type: ['restaurant']
      }, function (results, status) {
        
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          let cont = 0;
          results.forEach(restaurant => {
            if(filtro){
              if (restaurant[filtro] > 4) {
                cont++;
                createMarker(restaurant);
              }
            }else{
              cont++;
               createMarker(restaurant);
            }
            span.innerText = cont;
          });
        }
      });
    }, function () {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

function createMarker(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  google.maps.event.addListener(marker, 'click', function () {
    console.log(place)
    infoWindow.setContent(place.name);
    infoWindow.open(map, this);
  });
}
selectRestaurant.addEventListener('change', function(){
  filtro = event.target.value;
  initMap(filtro);
})

