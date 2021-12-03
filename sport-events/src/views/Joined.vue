<template>
  <div class="home">
    <b-card>
    <br>
    <h2>Joined Events</h2>
    <br>
    <b-table striped hover :items="items" :fields="fields" id="joined-table">
      <template #cell(remove)="row">
        <b-button @click="removeFromJoined(row)">
          Leave Event
        </b-button>
      </template>
    </b-table>
  </b-card>
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
    try {
      let userID = this.$root.$data.userID;
      console.log("userID");
      console.log(userID);
      let response = await axios.get('/joined/' + userID, {
        userID: userID
      });

      for (let event of response.data) {
        let eventDate = new Date(event.dateTime);
        event.date = moment(eventDate).format('MMMM Do YYYY, h:mm a');
        event.index = this.items.length;
        this.items.push(event);
      }
    } catch(error) {
      console.log(error);
    }

  },
  data() {
      return {
      items: [],
      fields: ["creator", "sport", "city", "date", "difficulty", "playersNeeded",
      { key: 'remove', label: 'Leave' }],
      }
    },
  methods: {
    async removeFromJoined(event) {
      let userID = this.$root.$data.userID;
      try {
        await axios.delete("/membership/" + event._id + "/" + userID);
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

<style>
#joined-table {
  padding-right: 20px;
  padding-left: 20px;
}

</style>
