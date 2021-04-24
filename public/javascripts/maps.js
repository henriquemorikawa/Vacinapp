function initMap(address) {
  // Create the map.
  
  function getLatLng(location){
    // console.log( (document.getElementById('input').value))
    
    axios.get('https://maps.googleapis.com/maps/api/geocode/json',{
      params: {
        address: location,
        key: 'AIzaSyDj6wmIjpczM4k04kXjh5ykY6aKOqSUI94'
      }
    })
    .then(function(response){
      let latLng = { lat: response.data.results[0].geometry.location.lat, lng: response.data.results[0].geometry.location.lng }
    
      const map = new google.maps.Map(document.getElementById("map"), {
        center: latLng,
        zoom: 17,
        mapId: "8d193001f940fde3",
      });
      // Create the places service.
      const service = new google.maps.places.PlacesService(map);
      let getNextPage;
      const moreButton = document.getElementById("more");
      

      moreButton.onclick = function () {
        moreButton.disabled = true;

        if (getNextPage) {
          getNextPage();
        }
      };
      // Perform a nearby search.
      service.nearbySearch(
        { location: latLng, radius: 10000, type: "hospital" },
        (results, status, pagination) => {
          if (status !== "OK" || !results) return;
          addPlaces(results, map);
          moreButton.disabled = !pagination || !pagination.hasNextPage;

          if (pagination && pagination.hasNextPage) {
            getNextPage = () => {
              // Note: nextPage will call the same handler function as the initial call
              pagination.nextPage();
            };
          }
        }
      );
    })
    .catch(function(error){
      console.log(error)
    })
  }
  let location = document.getElementById('input').value
  getLatLng(location)
  
}

function addPlaces(places, map) {
  const placesList = document.getElementById("places");

  for (const place of places) {
    if (place.geometry && place.geometry.location) {
      const image = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25),
      };
      new google.maps.Marker({
        map,
        icon: image,
        title: place.name,
        position: place.geometry.location,
      });
      const li = document.createElement("li");
      li.textContent = place.name;
      placesList.appendChild(li);
      li.addEventListener("click", () => {
        map.setCenter(place.geometry.location);
      });
    }
  }
}

function searchHospital(){
  initMap(document.getElementById('input').value)
}

window.addEventListener('load', () => {
  document.getElementById('search-button').onclick = searchHospital;
})