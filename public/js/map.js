const map = new mapboxgl.Map({
    accessToken: process.env.MAP_TOKEN,
    style: 'mapbox://styles/mapbox/standard',
    container: 'map', // container ID
    center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 10 // starting zoom
});

// console.log(coordinates);

// create a marker at the recieved coordinate
const marker = new mapboxgl.Marker({color:'red'})
  .setLngLat(listing.geometry.coordinates) //listing coordinates
  .setPopup(
    new mapboxgl.Popup({offset: 25}).setHTML(
      `<h4> ${listing.location} </h4> <p> Exact loction will be provided after booking. </p>`
    )
  )
  .addTo(map);