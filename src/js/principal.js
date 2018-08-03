const selectRestaurant = document.getElementById("select-restaurant-rating");
const span = document.getElementById("num_res");
//BOTONES
const btnSearch = document.getElementById("btn-search");
const modalBody = document.getElementById("modalBody");
//modal
var modal , instance;
document.addEventListener('DOMContentLoaded', function() {
   modal = document.getElementById('modal1');
   var instances = M.Modal.init(modal);
    instance = M.Modal.getInstance(modal);
 
});
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
              if(filtro == 'opening_hours'){
               
                if (restaurant[filtro] ? restaurant[filtro].open_now == true ? true : false : false) {
                  
                  cont++;
                  createMarker(restaurant);
                }
              }else{
                if (restaurant[filtro] > 4) {
                  cont++;
                  createMarker(restaurant);
                }
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
    modalBody.innerHTML = '';
    let template = ` <h6 style="display:inline">${place.name}</h6><img src="${place.icon}" style="display:inline;width:15px">
                    ${place.photos ? place.photos["0"].html_attributions["0"] ? '<strong>Dueño/fotos(click):'+place.photos["0"].html_attributions["0"]+'</strong>' : '' : '' }
                    <p><strong>Direccion: </strong>${place.vicinity}</p>
                    <p><strong>Abierto?</strong>${place.opening_hours ? place.opening_hours.open_now  ? 'Si' : 'No' : 'No'}</p>`;
      
    modalBody.innerHTML = template;
    instance.open();
   
   
  });
}
selectRestaurant.addEventListener('change', function(){
  filtro = event.target.value;
  initMap(filtro);
})

