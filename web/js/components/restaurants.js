Vue.component("app-restaurant", {
	props: ["nom", "cuisine", "id", "index"],
	data: function() {
		return {};
	},
	template: `<tr  v-on:click="removeRestaurant()"
                    v-bind:id="id"
                    v-bind:style="{color: (index%2) ? 'red' : 'green' }"
                >
                    <td>{{id}}</td>
                    <td>{{nom}}</td>
                    <td>{{cuisine}}</td>
            </tr>`,
	methods: {
		removeRestaurant: function() {
			this.nom = "Restaurant supprimé!";
			this.$emit("restaurantclicked", this.id);
		}
	}
});
