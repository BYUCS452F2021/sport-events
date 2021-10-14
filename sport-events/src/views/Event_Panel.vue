<template>
    <div class="event_panel">
        <h1>Hello World</h1>
        <div id="events">
            <v-btn
            elevation="2"
            outlined
            x-large>
            victor velasco
            volleyball
            Medium
            Kiwanis Park
            </v-btn>
        </div>
    </div>
</template>

<script>
export default {
  name: 'event_panel',
}
</script>

<style scoped>
#events {
    display: flex;
    justify-content: center;
}
.v-btn {
    margin: 20px;
    width: 80%;
    
}
</style>