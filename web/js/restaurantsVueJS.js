window.onload = init;

function init() {
	Vue.use(VueMaterial.default);

	new Vue({
		el: "#app",
		data: {
			// les modèles // l'element HTML qui contient la vue
			restaurants: [],
			count: 0,
			nom: "",
			cuisine: "",
			page: 0,
			pagesize: 10,
			nomRecherche: "",
			cuisineRecherchee: "",
			updateForm: false,
			updateId: "",
			updateName: "",
			updateCuisine: "",
			prec: "",
			suiv: "",
			last: "",
			maxPage: -1,
			fractionCount: ""
		},
		mounted() {
			this.afficherRestaurants();
		},
		methods: {
			updateShowForm(r) {
				console.log(r);
				this.updateForm = true;
				this.updateId = r._id;
				this.updateName = r.name;
				this.updateCuisine = r.cuisine;
			},
			afficherRestaurants() {
				let url =
					"http://localhost:8085/api/restaurants?" +
					"page=" +
					this.page +
					"&pagesize=" +
					this.pagesize +
					"&nom=" +
					this.nomRecherche +
					"&cuisine=" +
					this.cuisineRecherchee;

				fetch(url)
					.then(data => {
						// reponse en JSON, on transforme en objet JS
						return data.json();
					})
					.then(reponse => {
						console.log(reponse.msg);
						this.restaurants = reponse.data;
						this.count = reponse.count;
						this.maxPage = -1;
						this.pagination();
					})
					.catch(err => {
						console.log(err);
					});
			},
			ajouterRestaurant() {
				// 1 on supprime le comportement par defaut du navigateur
				// qui soumet le form et re affiche une page après
				event.preventDefault();

				// 2 On recupere le formulaire
				let form = event.target;

				// 3 on recupere tout le contenu
				let dataFormulaire = new FormData(form);
				dataFormulaire.append("nom", this.nom);
				dataFormulaire.append("cuisine", this.cuisine);

				// 4 on envoie les données en ajax au serveur
				let url = "http://localhost:8085/api/restaurants";

				fetch(url, { method: "POST", body: dataFormulaire })
					.then(data => {
						return data.json();
					})
					.then(reponse => {
						console.log(reponse.msg);
						this.afficherRestaurants();
					})
					.catch(err => {
						console.log(err);
					});

				this.nom = "";
				this.cuisine = "";
				this.afficherRestaurants();
			},
			supprimerRestaurant(r) {
				console.log("supprimerRestaurant, " + r._id);

				// 1 on envoie une requete DELETE sur api/restaurant/id
				let url = "http://localhost:8085/api/restaurants/" + r._id;

				fetch(url, { method: "DELETE" })
					.then(data => {
						return data.json();
					})
					.then(reponse => {
						console.log(reponse.msg);
						this.afficherRestaurants();
					})
					.catch(err => {
						console.log(err);
					});
			},
			modifierRestaurant(r) {
				console.log("modifierRestaurant, " + this.updateId);

				event.preventDefault();

				let form = event.target;
				let dataFormulaire = new FormData(form);
				dataFormulaire.append("nom", this.updateName);
				dataFormulaire.append("cuisine", this.updateCuisine);

				let url =
					"http://localhost:8085/api/restaurants/" + this.updateId;

				fetch(url, {
					method: "PUT",
					body: dataFormulaire
				})
					.then(data => {
						return data.json();
					})
					.then(reponse => {
						console.log(reponse.msg);
						this.afficherRestaurants();
					})
					.catch(err => {
						console.log(err);
					});

				this.updateForm = false;
				this.updateId = "";
				this.updateName = "";
				this.updateCuisine = "";
			},
			getColor(index) {
				return index % 2 ? "red" : "green";
			},
			onChange() {
				this.fractionCount = "";
				this.page = 0;
				this.maxPage = -1;
				this.prec = "";
				this.suiv = "";

				this.afficherRestaurants();
			},
			pagination() {
				let Prev_1 = this.pagesize * this.page + 1;
				let Prev_2 = this.pagesize * (this.page + 1);
				let Next_1 = this.pagesize * (this.page + 1) + 1;
				let Next_2 = this.pagesize * (this.page + 2);
				let Last_1 = this.count - (this.count % this.pagesize) + 1;

				if (this.pagesize * (this.page + 1) >= this.count) {
					this.maxPage = this.page;
					Prev_1 = Next_1 - this.pagesize * 2;
					Prev_2 = Next_1 - this.pagesize - 1;
					Next_2 = this.count;
				}

				if (Next_1 > Next_2) {
					Next_1 = this.pagesize * this.page + 1;
				}

				if (Next_2 > this.count) {
					Next_2 = this.count;
				}

				if (this.page == 0) {
					this.prec = "1 - " + this.pagesize;
				} else {
					this.prec = Prev_1 + " - " + Prev_2;
				}

				this.suiv = Next_1 + " - " + Next_2;
				this.last = Last_1 + " - " + this.count;
				this.fractionCount =
					(this.maxPage == this.page
						? this.count
						: this.pagesize * (this.page + 1)) +
					" / " +
					this.count;
			},
			lastPage() {
				console.log("lastPage");
				this.page = Math.floor(this.count / this.pagesize);
				this.afficherRestaurants();
			},
			pagePrecedente() {
				console.log("pagePrecedente");
				this.page--;
				this.afficherRestaurants();
			},
			pageSuivante() {
				console.log("pageSuivante");
				this.page++;
				this.afficherRestaurants();
			},
			// _.debounce vient de lodash et permet de n'appeler getRestaurantsFromServer que lorsqu'on a arrêté de taper
			// pendant 300ms, ça évite d'envoyer une requête au serveur à chaque touche...
			chercherRestaurants: _.debounce(function() {
				this.afficherRestaurants();
			}, 300)
		}
	});
}
