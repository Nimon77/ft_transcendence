<template>
<v-menu offset-x>
    <template v-slot:activator="{ on, attrs }">
    <v-btn @click.prevent v-on="on" v-bind="attrs" icon> <v-icon >mdi-dots-vertical</v-icon> </v-btn>
    </template>
    <v-list>
    
    <v-list-item>
        <v-btn dark class="ma-1" color="green" tile @click="leaveRoom">
            <v-list-item-title class="text-center">Leave Channel</v-list-item-title>
        </v-btn>
    </v-list-item>

    <v-list-item v-if="isOwner && CR.public == false">
    <v-dialog v-model="dialog" max-width="600px" >
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on" dark class="ma-1" color="green" tile @click="dialog = !dialog">
            <v-list-item-title class="text-center">Manage Password</v-list-item-title>
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="text-h5 green">
          <span class="text-h5 white--text">Set Password</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" >

                <v-form ref="form" v-model="valid">
                <v-text-field v-model="oldPassword" type="password" label="Old Password"></v-text-field>
                </v-form>
                <v-text-field v-model="newPassword" type="password" label="New Password*"></v-text-field>
              </v-col>
            </v-row>
            <small>*leave empty for no password</small>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" depressed tile dark @click="dialog = false"> Cancel </v-btn>
          <v-btn color="blue darken-1 white--text" :disabled="!valid" depressed tile @click="changePW"> SAVE </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    </v-list-item>
    </v-list>
</v-menu>
</template>


<script lang='ts'>
import Vue from 'vue';

export default Vue.extend({
    name: 'OptionChannel',
    props: {
      isOwner: Boolean,
      CR: [],
    },
    data() {
        return {
            dialog: false,
            oldPassword: '',
            newPassword: '',
            valid: false,
        }
    },
    methods: {
        leaveRoom() {
            console.log("LEAVE");
            this.$emit('leaveRoom');
        },
        async changePW() {
          try {await this.$http.post('/channel/' + this.CR.id + '/change/', {oldPassword: this.oldPassword, newPassword: this.newPassword})
          .then((resp) => console.log(resp))
          }
          catch(error) {alert("wrong password")}
          this.dialog=!this.dialog;
        }
    },
    computed: {
      rules() {
        const rules = [];
        let rule = v => !!v;
        rules.push(rule);
        return rules;
      }
    }

    // created() {

    // }
})
</script>

<style scoped>

</style>