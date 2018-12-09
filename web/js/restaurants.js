window.onload = init;

function init() {
	// appelée quand tout est prêt
	console.log("init");
	afficherRestaurants();
}

function afficherRestaurants() {
	console.log("afficherRestaurants");

	let url = "http://localhost:8085/api/restaurants";

	fetch(url)
		.then(data => {
			// reponse en JSON, on transforme en objet JS
			return data.json();
		})
		.then(reponse => {
			console.log(reponse.msg);

			// les restaurants sont dans response.data
			let restaurants = reponse.data;

			// la liste dans laquelle on va inserer les restaurants
			// selector API, param = selecteur CSS
			let liste = document.querySelector("#listeRestaurants");
			liste.innerHTML = "";

			// on va iterer sur les restaurants
			restaurants.forEach((r, index) => {
				// On cree un <li></li> avec l'API du DOM
				let li = document.createElement("li");
				li.innerHTML = r.nom + " cuisine : " + r.cuisine;
				li.id = r.id;
				li.onclick = supprimerRestaurant;
				// On le rajoute à la liste <ul></ul>
				liste.append(li);
			});
		})
		.catch(err => {
			console.log(err);
		});
}

function supprimerRestaurant(event) {
	let li = event.target;
	console.log("supprimerRestaurant, id=" + li.id);

	let url = "http://localhost:8085/api/restaurants/" + li.id;

	fetch(url, {
		method: "DELETE"
	})
		.then(data => {
			return data.json();
		})
		.then(reponse => {
			console.log(reponse.msg);
			afficherRestaurants();
		})
		.catch(err => {
			console.log(err);
		});
}

function ajouterRestaurant(event) {
	console.log("ajouterRestaurant");

	// 1 on supprime le comportement par defaut du navigateur
	// qui soumet le form et re affiche une page après
	event.preventDefault();

	// 2 On recupere le formulaire
	let form = event.target;

	// 3 on recupere tout le contenu
	let dataFormulaire = new FormData(form);

	// 4 on envoie les données en ajax au serveur
	let url = "http://localhost:8085/api/restaurants/";

	fetch(url, {
		method: "POST",
		body: dataFormulaire
	})
		.then(data => {
			return data.json();
		})
		.then(reponse => {
			console.log(reponse.msg);
			afficherRestaurants();
		})
		.catch(err => {
			console.log(err);
		});
}
