<template>
  <div class="home">
    <br>
    <h2>Manage Events</h2>
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
          { sport_name: '', date: '', time: '', difficulty_level: '', comment: '', decision: '' },

        ]
      }
    },
    created() {
      if (!this.$root.$data.userID) {
        this.$router.push("/")
      }
    },
}
</script>
