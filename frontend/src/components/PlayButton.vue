<template>
<v-dialog width="500" max-height="500" v-model="dialog">
    <template v-slot:activator="{ on, attrs }">
    <v-btn
    v-on:click="playerFund"
    v-bind="attrs"
    v-on="on"          
    slot="activator"
    class="btn" color="yellow--text"
    tile x-large depressed
    width="295" height="90">
    PLAY
    </v-btn>
    </template>
    <v-card>
    <v-card-title>
        <div style="margin-left: 120px">
        <h3 class="headline">Searching for player...</h3>
        <div style="margin-left: 95px; margin-top: 30px; margin-bottom: 20px;"> <v-progress-circular indeterminate color="grey"></v-progress-circular> </div>
        </div>
    </v-card-title>
    <v-card-actions>
        <v-btn @click="dialog=false" style="margin-left: 200px" elevation="0" dark color="red">CANCEL</v-btn>
    </v-card-actions>
    </v-card>
</v-dialog>

</template>


<script lang='ts'>

let date:number = Date.now();

export default {
    name: 'PlayButton',
    data() : unknown {
        return {
            dialog: false,
            date,
        }
    },
    methods: {
      closeDialog(): void {
        if (this.dialog == true)
        {
            this.dialog == false;
            this.$router.push('/pregame');
            return;
        }
        return;
      },
      playerFund() : unknown {
          setTimeout(this.closeDialog, 3000);
          return;
      },
    },
}
</script>

<style scoped>

</style>