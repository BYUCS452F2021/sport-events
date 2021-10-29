<template>
  <div class="home">
    <b-card>
    <br>
    <h2>Manage My Events</h2>
    <br>
    <b-table striped hover :items="items" :fields="fields">
      <template #cell(remove)="row">
        <b-button @click="triggerEditModal(row)">
          Edit Event
        </b-button>
      </template>
    </b-table>
  </b-card>
    <b-modal id="modal-1" title="Edit This Event" @ok="saveEvent">
      <b-form>
          <b-form-input
          id="sport_name"
          v-model="editEvent.sport"
          placeholder="Sport name"
          class="form-input">
          </b-form-input>

          <b-form-input
          id="city"
          v-model="editEvent.city"
          placeholder="City"
          class="form-input">
          </b-form-input>

          <b-form-datepicker
          id="date"
          style="text-align: left;"
          v-model="editDate"
          class="form-input"
          value-as-date>
          </b-form-datepicker>

          <b-form-timepicker
          id="time"
          style="text-align: left;"
          v-model="editTime"
          class="form-input">
          </b-form-timepicker>

          <b-form-select
          id="difficulty_level"
          v-model="editEvent.difficulty"
          :options="difficulty_options"
          style="width: 100%">
          </b-form-select>

          <b-form-input
          id="players_needed"
          v-model="editEvent.playersNeeded"
          placeholder="Players needed"
          class="form-input">
          </b-form-input>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "axios";
import moment from "moment";
export default {
  name: 'Home',
  components: {
  },
  data() {
      return {
        items: [],
        fields: ["sport", "city", "date", "difficulty", "playersNeeded",
        { key: 'remove', label: 'Edit' }],
        editEvent: {},
        editDate: "",
        editTime: "",
        difficulty_options: [
            {value: null, text: 'Please select an option', disabled: true},
            {value: 'beginner', text: 'Beginner'},
            {value: 'intermediate', text: 'Intermediate'},
            {value: 'advanced', text: 'Advanced'}
        ],
      }
    },
    async created() {
      if (!this.$root.$data.userID) {
        this.$router.push("/")
      }

      try {
        let response = await axios.get("/event/" + this.$root.$data.userID);
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
    methods: {
      triggerEditModal(row) {
        this.editEvent = row.item;
        let date = new Date(this.editEvent.dateTime);
        console.log(date.getHours());
        console.log(date.getMinutes());
        this.editTime = "" + date.getHours() + ":" + date.getMinutes() + ":00"
        this.editDate = date
        this.$bvModal.show("modal-1");
      },
      async saveEvent() {
        let timeArray = this.editTime.split(":");
        this.editDate.setHours(timeArray[0], timeArray[1], timeArray[2]);
        await axios.put("/event/" + this.editEvent.eventID, {
          userID: this.$root.$data.userID,
          sport: this.editEvent.sport,
          city: this.editEvent.city,
          dateTime: this.editDate.getTime(),
          difficulty: this.editEvent.difficulty,
          playersNeeded: this.editEvent.playersNeeded
        })
        this.editEvent.dateTime = this.editDate.getTime()
        this.editEvent.date = moment(this.editDate).format('MMMM Do YYYY, h:mm a');
      }
    }
}
</script>

<style scoped>
.form-input {
  margin-top: 15px !important;
  margin-bottom: 15px !important;
}
</style>
