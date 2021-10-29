<template>
  <div class="home">
    <Login v-if="not_logged_in"></Login>
    <div v-else>
      <br>
      <h2>Upcoming Events</h2>
      <br>
      <b-form-input v-model="text" placeholder="Search"></b-form-input>
      <b-table striped hover :items="items" :fields="fields">
      </b-table>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Login from '../components/Login'
import axios from "axios";
import moment from "moment"
export default {
  name: 'Home',
  components: {
    Login
  },

  data() {
      return {
        items: [],
        fields: ["creator", "sport", "city", "dateTime", "difficulty", "playersNeeded",
        { key: 'add', label: 'Add' }],
        text: "",
        eventsJoined: [],
      }
    },
  computed: {
    not_logged_in() {
      if (this.$root.$data.userID) {
        return false;
      }
      return true;
    },
  },
  async created() {
    try {
      let response = await axios.get("/joined", {
        userID: this.$root.$data.userID,
      });

      for (let event of response.data) {
        this.eventsJoined.push(event.eventID);
      }

      response = await axios.get("/upcoming");
      for (let event of response.data) {
        let eventDate = new Date(event.dateTime * 1000);
        event.dateTime = moment(eventDate).format('MMMM Do YYYY, h:mm a');

        //if (this.isEventJoined(event.eventID)) {
          //event.isJoined = true;
        //}
        //else {
          //event.isJoined = false;
        //}

        event.index = this.items.length
        this.items.push(event);
      }
    } catch(error) {
      console.log(error);
    }
  },
}
</script>
