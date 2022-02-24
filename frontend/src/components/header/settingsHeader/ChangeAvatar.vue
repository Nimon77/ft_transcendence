<template>
    <v-dialog transition="scale-transition" max-width="400" persistent>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on" color="blue" dark max-width="160"> Avatar/Username </v-btn>
        </template>
        <template v-slot:default="dialog">
          <v-card>
            <v-toolbar color="primary" elevation="0" class="text-h5 pl-5" dark>CHANGE YOUR THINGS HERE</v-toolbar>
            <v-card-text>
              <v-container fluid>
              <v-row>
              <v-col align="center" cols="12" class="mt-11" >
                
                <v-form ref="form" v-model="valid">
                <v-text-field v-model="username" :rules="rules" label="new username" solo></v-text-field>
                </v-form>
              
              </v-col>
              <v-col cols="12">
                <v-file-input label="new avatar" chips truncate-length="21" ></v-file-input>
              </v-col>
              </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn color="red" dark @click="dialog.value = false" >CANCEL</v-btn>
              <v-btn color="blue" class="white--text" :disabled="!valid" @click="setNewName" >OK!</v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
        name: 'ChangeAvatar',
        components: {
        },
        data(): unknown {
            return {
              isFound: false,
              users: [],
              valid: true,
              username: '',
            }
        },
        methods: {
          async setNewName() {
            this.dialog = false;
            await this.$http.put('/user/me', {username: this.username,}).then(response => {
              console.log('PUT REQUEST', response);
              });
            location.reload();
          }
        },

        async created() {
          await this.$http.get('/user').then(response => {
            this.users = response.data;
          });
            console.log('USERS : ', this.users);
        },
        computed: {
          rules() {
            const rules = [];
            let existingName: string = null;
            let i = 0;
            // console.log('IN RULES, username = ', this.username);

            existingName = this.users[i].log;
            while (this.username != existingName && i < this.users.length) {
              // console.log('EXISTING NAME : ', existingName);
              existingName = this.users[i++].log;
              // i++;
            }
            // console.log('AFTER WHILE ', existingName);
            if (this.username === existingName) {
              const rule = `username already exist`;
              rules.push(rule);
            }
            let rule = v => !!v;
            rules.push(rule);
            let rule2 = v => (v && v.length <= 8) || 'must be less than 8 characters';
            rules.push(rule2);
            return rules;
          }
        }
        // watch: {
        //   username: function() {
        //     console.log('CHECKING USERNAME')
        //   },
        // },
    });
</script>

<style scoped>

</style>
