<template>
  <div class="home">
    <br>
    <h2>Joined Events</h2>
    <br>
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
          { sport_name: '', city: '', date: '', time: '', difficulty_level: '', players_needed: '' },
          
        ]
      }
    }
}
</script>