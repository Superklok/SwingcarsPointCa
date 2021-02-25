mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
	container: 'showPageMap',
	style: 'mapbox://styles/mapbox/dark-v10',
	center: voiture.geometry.coordinates,
	zoom: 13
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
	.setLngLat(voiture.geometry.coordinates)
	.setPopup(
		new mapboxgl.Popup({offset: 25})
			.setHTML(
				`<h3>${ voiture.nom }</h3><p>${ voiture.localisation }</p>`
			)
	)
	.addTo(map)