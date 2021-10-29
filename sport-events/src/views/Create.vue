<template>
    <div class="create">
        <b-card title="Create Event" style="width: 40%;" id="form-card">
            <b-form @submit="onSubmit">
                <b-form-input
                id="sport_name"
                v-model="form.sport_name"
                placeholder="Sport name"
                class="form-input">
                </b-form-input>

                <b-form-input
                id="city"
                v-model="form.city"
                placeholder="City"
                class="form-input">
                </b-form-input>

                <b-form-datepicker
                id="date"
                style="text-align: left;"
                v-model="form.date"
                class="form-input"
                value-as-date>
                </b-form-datepicker>

                <b-form-timepicker
                id="time"
                style="text-align: left;"
                v-model="form.time"
                class="form-input">
                </b-form-timepicker>

                <b-form-select
                id="difficulty_level"
                v-model="form.difficulty_level"
                :options="difficulty_options"
                style="width: 100%">
                </b-form-select>

                <b-form-input
                id="players_needed"
                v-model="form.players_needed"
                placeholder="Players needed"
                class="form-input">
                </b-form-input>

                <b-button v-if="disableButton"
                variant="primary"
                id="btn"
                type="submit"
                disabled>
                    submit
                </b-button>
                <b-button v-else
                variant="primary"
                id="btn"
                type="submit"
                disabled>
                    submit
                </b-button>
            </b-form>
        </b-card>
    </div>
</template>

<script>
import axios from "axios";
export default {
    name: 'Create',
    components: {
    },
    created() {
      if (!this.$root.$data.userID) {
        this.$router.push("/")
      }
    },
    data() {
        return {
            form: {
                sport_name: '',
                city: '',
                date: '',
                time: '',
                difficulty_level: null,
                players_needed: ''
            },
            difficulty_options: [
                {value: null, text: 'Please select an option', disabled: true},
                {value: 'beginner', text: 'Beginner'},
                {value: 'intermediate', text: 'Intermediate'},
                {value: 'advanced', text: 'Advanced'}
            ]
        }
    },
    methods: {
        async onSubmit(event) {
            event.preventDefault();
            try {
              let timeArray = this.form.time.split(":");
              this.form.date.setHours(timeArray[0], timeArray[1], timeArray[2]);
              await axios.post("/event", {
                userID: this.$root.$data.userID,
                sport: this.form.sport_name,
                datetime: this.form.date.getTime(),
                difficulty: this.form.difficulty_level,
                playersNeeded: this.form.players_needed
              })
            } catch(error) {
              console.log(error);
            }
      },
    },
    computed: {
      disableButton() {
        if (!this.form.sport_name || !this.form.city || !this.form.date || !this.form.time || !this.form.difficulty_level
          || !this.form.players_needed) {
            return true
        }
        return false;
      }
    }
}
</script>

<style scoped>
    .create {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    #form-card {
        margin-top: 10vw;
        box-shadow: 5px 10px 8px #888888;
    }
    .form-input {
        margin: 20px 0;
    }
    #btn {
        cursor: pointer;
        margin-bottom: 10px;
    }
</style>
