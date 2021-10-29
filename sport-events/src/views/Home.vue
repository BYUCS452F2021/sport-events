<template>
  <div class="home">
    <Login v-if="not_logged_in"></Login>
    <div v-else>
      <br>
      <h2>Upcoming Events</h2>
      <br>
      <b-form-input v-model="text" placeholder="Search"></b-form-input>
      <b-table striped hover :items="items"></b-table>
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
        fields: ["Creator Username", "Sport", "City", "Date Time", "Difficulty", "Players Needed"],
        text: "",
      }
    },
  async created() {
    try {
      let response = await axios.get("/upcoming");
      for (let event of response.data) {
        let eventDate = new Date(event.dateTime * 1000);
        event.dateTime = moment(eventDate).format('MMMM Do YYYY, h:mm:ss a');
        this.items.push(event);
      }

    } catch(error) {
      console.log(error);
    }
  },
  computed: {
    not_logged_in() {
      if (this.$root.$data.userID) {
        return false;
      }
      return true;
    }
  },
}
</script>
