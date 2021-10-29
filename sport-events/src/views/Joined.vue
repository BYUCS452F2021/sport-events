<template>
  <div class="home">
    <br>
    <h2>Joined Events</h2>
    <br>
    <b-table striped hover :items="items" :fields="fields">
      <template #cell(remove)="row">
        <b-button @click="removeFromJoined(row)">
          Remove Event
        </b-button>
      </template>
    </b-table>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "axios"
import moment from "moment"
export default {
  name: 'Home',
  components: {
  },
  async created() {
    if (!this.$root.$data.userID) {
      this.$router.push("/")
    }

    let response = await axios.get("/joined", {
      userID: this.$root.$data.userID,
    });

    for (let event of response.data) {
      let eventDate = new Date(event.dateTime * 1000);
      event.dateTime = moment(eventDate).format('MMMM Do YYYY, h:mm a');
      event.index = this.items.length;
      this.items.push(event);
    }
  },
  data() {
      return {
      items: [],
      fields: ["creator", "sport", "city", "dateTime", "difficulty", "playersNeeded",
      { key: 'remove', label: 'Remove' }],
      }
    },
  methods: {
    async removeFromJoined(event) {
      let userID = this.$root.$data.userID;
      try {
        await axios.delete("/membership", {
          userID: userID,
          eventID: event.eventID
        });
        console.log(event);
        this.items.splice(event.index, 1);
        this.$forceUpdate()
      } catch(error) {
        console.log(error);
      }
    },
  }
}
</script>
