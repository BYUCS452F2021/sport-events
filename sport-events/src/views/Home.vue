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

export default {
  name: 'Home',
  components: {
    Login
  },

  data() {
      return {
        not_logged_in: true,
        items: [
          { sport_name: '', date: '', time: '', difficulty_level: '', players_needed: '' },
        ],
        text: "",
      }
    }
}
</script>
