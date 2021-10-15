<template>
    <div class="event_panel">
        <div id="header">
            <h1>Sport Events</h1>
            <v-text-field
            label="Search"
            outlined
            dense>
            </v-text-field>
        </div>
        <div id="events">
            <v-btn
            elevation="2"
            outlined
            x-large
            v-for="event in events"
            :key="event">
                <v-row>
                    <v-col>{{ event.username }}</v-col>
                    <v-col>{{ event.sport_name }}</v-col>
                    <v-col>{{ event.skill_level }}</v-col>
                    <v-col>{{ event.date }}</v-col>
                    <v-col>{{ event.city }}</v-col>
                </v-row>
            </v-btn>
        </div>
    </div>
</template>

<script>
export default {
  name: 'event_panel',
  data: function() {
      return {
          events: [
            {
                username:  "victorvel", 
                sport_name:  "volleyball", 
                skill_level:  "medium", 
                date: "10/31/21 5:00PM", 
                city: "Provo"
            }, 
            {
                username: "ung123", 
                sport_name: "basketball", 
                skill_level: "easy", 
                date: "10/25/21 4:00PM", 
                city: "Orem"
            }, 
            {
                username: "Thor", 
                sport_name: "fighting", 
                skill_level: "expert", 
                date: "12/25/21 3:00PM", 
                city: "Lehi"
            }
        ]
      }
  }
}
</script>

<style scoped>
#header {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
}
#events {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
}
.v-btn {
    margin: 20px;
    width: 80%;
    
}
</style>