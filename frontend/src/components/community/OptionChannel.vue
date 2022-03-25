<template>
<v-menu dark offset-x>
  <template v-slot:activator="{ on, attrs }">
    <v-btn @click.prevent v-on="on" v-bind="attrs" icon> <v-icon >mdi-dots-vertical</v-icon> </v-btn>
  </template>
  <v-list>
    <v-list-item>
      <v-btn dark class="ma-1" color="green" tile @click="leaveChannel">
        <v-list-item-title class="text-center">Leave Channel</v-list-item-title>
      </v-btn>
    </v-list-item>
    <v-list-item v-if="channel.owner.id == user.id && channel.public == false">
      <v-dialog v-model="dialog" max-width="600px" >
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on" dark class="ma-1" color="green" tile @click="dialog = !dialog">
            <v-list-item-title class="text-center">Manage Password</v-list-item-title>
          </v-btn>
        </template>
        <v-card dark>
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
                  <v-text-field v-model="newPassword" type="password" label="New Password"></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" depressed tile dark @click="dialog = false"> Cancel </v-btn>
            <v-btn color="blue darken-1 white--text" :disabled="!valid" depressed tile @click="changePassword"> SAVE </v-btn>
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
      channel: {},
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
        leaveChannel() {
          this.$emit('leaveChannel');
        },
        changePassword() {
          this.$http.post('/channel/' + this.channel.id + '/change', {
            oldPassword: this.oldPassword, newPassword: this.newPassword
          }).catch(error => {
            if (error.response.status == 403) {
              this.$toast.error('Wrong password', { position: 'top-left' });
            }
          });
          this.oldPassword = '';
          this.newPassword = '';
          this.dialog =! this.dialog;
        }
    },

    computed: {
      user() {
        return this.$store.getters.getUser;
      },
      rules() {
        const rules = [];
        let rule = v => !!v;
        rules.push(rule);
        return rules;
      }
    }
})
</script>

<style scoped>

</style>
