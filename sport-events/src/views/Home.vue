<template>
  <div class="home">
    <br>
    <h2>Upcoming Events</h2>
    <br>
    <b-form-input v-model="text" placeholder="Search"></b-form-input>
    <b-table striped hover :items="items"></b-table>
  </div>
</template>

<script>
// @ is an alias to /src


export default {
  name: 'Home',
  components: {
  },

  data() {
      return {
        items: [
          { sport_name: '', date: '', time: '', difficulty_level: '', players_needed: '' },
        ],
        text: "",
      }
    }
}
</script>
