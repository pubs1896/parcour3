 function initMap() {
 	var paris1 = {
 		lat: 48.866667,
 		lng: 2.333333
 	};
 	var map = new google.maps.Map(document.getElementById('map'), {
 		zoom: 13,
 		mapTypeId: google.maps.MapTypeId.ROADMAP,
 		center: paris1
 	});

 	// Modifi le cluster
 	var image = '../images/cycles.png';
 	var image1 = '../images/Calque0.png';
 	ajaxGet("https://api.jcdecaux.com/vls/v1/stations?contract=Paris&apiKey=65615471c59811b0241689994e769f3677ec2758", function (reponse) {

 		// Transforme la réponse en un tableau d'adresses
 		var objects = JSON.parse(reponse);
 		objects.forEach(function (object) {

 			// Les markers individuel ne sont afficher qu'après l'événement du changement de zoom.
 			google.maps.event.addListener(map, 'zoom_changed', function () {

 				if (map.zoom > 14) {
 					// position pour cluster individuel
 					var paris = {
 						lat: object.position.lat,
 						lng: object.position.lng
 					}
 					var marker = new google.maps.Marker({
 						position: paris,
 						icon: image,
 						map: map,
 						title: 'Location vélib',
 						zIndex: 2000
 					});

 					// affiche les infos de la station au clique
 					marker.addListener('click', function () {


 						if (window.matchMedia("(max-width: 700px)").matches) {
 							// Mobile
 							document.getElementById('map').style.width = 100 + "%";
 						} else {
 							// ordinateur
 							document.getElementById('map').style.width = 65 + "%";
 						}
 						// extraction des données de la station
 						var station = object.address;
 						sessionStorage.nameStation = object.name; // Appel la fonction affiche le nom de la station  
 						var stre = object.status;
 						var veloDispo = object.available_bikes;
 						var placeDispo = object.available_bike_stands;
 						var statusFr = stre.replace("CLOSED", "Fermer");

 						if (stre === 'OPEN') {
 							var statusFr = stre.replace("OPEN", "Ouvert");
 						}
 						if (veloDispo > 0) {
 							if (window.matchMedia("(max-width: 700px)").matches) {
 								// Mobile

 								res = "<a href=#mob><button onclick='Signature.reservation();' id='louer'>Résérver</button></a>";
 							} else {
 								// ordinateur

 								res = "<a href=#footer><button onclick='Signature.reservation()' id='louer'>Résérver</button></a>";
 							}
 						}
 						if (veloDispo <= 0 || object.status === "CLOSED") {
 							res = "Nombres de vélos disponible insuffisant. Oo station fermer<br /> Choisisser une autre station";
 						}
 						document.getElementById('reservation').style.display = "block";
 						// affiche une fenête d'info sur la station
 						document.getElementById('reservation').innerHTML = "Détail de la station:<br />" + "<br /><strong>Nom de la station</strong><br />" + sessionStorage.nameStation + "<br /><br /><strong>adresse de la station</strong><br />" + station + "<br /><br /><strong>La station est</strong> " + statusFr + "<br /><br /><strong>Nombre de vélos disponible</strong> " + veloDispo + "<br /><strong>nombre de places disponible </strong>" + placeDispo + "<br /><p></p>" + res + "<br />";

 						var contentString = '<div id="content">' + '<strong>La station est </strong>' + statusFr +
 							'</div>';
						
						
 					});

 				}


 			});

 			// position pour groupe de clusters
 			locations.push({
 				lat: object.position.lat,
 				lng: object.position.lng,
 			});


 		});


 		// Ajoute les groupes clusters dans la map.
 		var markers = locations.map(function (location, i) {
 			return new google.maps.Marker({
 				position: location,
 				icon: image1,
 			});

 		});
 		var markerCluster = new MarkerClusterer(map, markers, {
 			imagePath: '../images/m'
 		});


 	});

 	if (sessionStorage.newNameStation != '') {
 		minuteur.decompte();
 	}
 }

 var locations = []
