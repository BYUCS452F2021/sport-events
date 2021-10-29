<template>
  <div class="home">
    <Login v-if="not_logged_in"></Login>
    <div v-else>
      <b-card>
      <br>
      <h2>Upcoming Events</h2>
      <br>
      <b-form-input v-model="text" placeholder="Search" class="search-bar"></b-form-input>
      <b-table striped hover :items="items" :fields="fields">
        <template #cell(action)="row">
          <b-button v-if="!row.item.isJoined" @click="joinEvent(row.item)">
            Join Event
          </b-button>
          <b-button v-else @click="leaveEvent(row.item)">
            Leave Event
          </b-button>
        </template>
      </b-table>
    </b-card>
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
        { key: 'action', label: 'Join/Leave' }],
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
      let response = await axios.get("/joined/" + this.$root.$data.userID);

      for (let event of response.data) {
        this.eventsJoined.push(event.eventID);
      }

      response = await axios.get("/upcoming");
      for (let event of response.data) {
        let eventDate = new Date(event.dateTime);
        event.dateTime = moment(eventDate).format('MMMM Do YYYY, h:mm a');

        if (this.isEventJoined(event.eventID)) {
          event.isJoined = true;
        }
        else {
          event.isJoined = false;
        }

        event.index = this.items.length
        this.items.push(event);
      }
    } catch(error) {
      console.log(error);
    }
  },
  methods: {
    isEventJoined(id) {
      for (let eventID of this.eventsJoined) {
        if (eventID == id) {
          return true;
        }
      }
      return false;
    },
    async joinEvent(event) {
      try {
        await axios.post("/membership", {
          userID: this.$root.$data.userID,
          eventID: event.eventID
        })
        event.isJoined = true;
      } catch(error) {
        console.log(error);
      }

    },
    async leaveEvent(event) {
      try {
        await axios.delete("/membership", {
          data: {
          userID: this.$root.$data.userID,
          eventID: event.eventID
        }
        })
        event.isJoined = false;
      } catch(error) {
        console.log(error);
      }

    }
  },
}
</script>

<style>
.search-bar {
  margin-bottom: 20px;
}
</style>
