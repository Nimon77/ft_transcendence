<template>
    <v-card flat tile min-width="18%" class="d-flex flex-column" height="640px">
      <v-sheet color="green" dark min-height="100" width="100%" class="text-center">
        <v-divider class="pt-7"></v-divider>
        <span class="span"> CHANNELS </span>
      </v-sheet>

    <v-dialog v-model="dialog" persistent max-width="600px" >
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on" class="ma-1" color="green" bottom tile left  @click="dialog = !dialog">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="text-h5 green">
          <span class="text-h5 white--text">Create your own Channel</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" >

                <v-form ref="form" v-model="valid">
                <v-text-field v-model="name" :rules="rules" label="name of channel"></v-text-field>
                </v-form>

              </v-col>
              <v-col cols="12">
                <v-text-field v-model="password" label="Password*" type="password"></v-text-field>
              </v-col>
            </v-row>
          <small>*not mandatory</small>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" depressed tile dark @click="dialog = false"> Cancel </v-btn>
          <v-btn color="blue darken-1 white--text" :disabled="!valid" depressed tile  @click="newChannel"> SAVE </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

      <v-form>
        <v-text-field dense class="d-flex justify-center mb-n2 mt-5 pl-5 pr-5" label="search channel"></v-text-field>
      </v-form>
      <v-divider class="mt-1"></v-divider>
  
      <v-list-item-group mandatory>
        <v-list-item two-line router to="/">
          <v-list-item-content>
            <v-list-item-title > BANANA ROOM </v-list-item-title>
            <v-list-item-subtitle> public <v-icon  small color="yellow"> mdi-account </v-icon> </v-list-item-subtitle>
          </v-list-item-content>
              <v-btn @click.prevent="testBtn" icon> <v-icon >mdi-dots-vertical</v-icon> </v-btn>
        </v-list-item>
        <v-divider></v-divider>

        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-title > PRIVATE ROOM </v-list-item-title>
            <v-list-item-subtitle> private </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-list-item-action-text>
              <v-btn icon> <v-icon >mdi-dots-vertical</v-icon> </v-btn>
            </v-list-item-action-text>
          </v-list-item-action>
        </v-list-item>
        <v-divider></v-divider>
      </v-list-item-group>
    
    </v-card>
</template>


<script lang="ts">

import Vue from 'vue';

export default Vue.extend({
    name: 'Channel',
    data() {
        return {
          dialog: false,
          showInput: false,
          valid: true,
          name: '',
          password: '',
        }
    },
    methods: {
      testBtn() {
        console.log("GNEEEEE");
      },
      async newChannel() {
        // await this.$http.post('/user/chatroom', {name: this.name,}).then((resp) => console.log(resp))
        await this.$http.get('/user/chatroom').then((resp) => console.log(resp))
        this.dialog = false
      }
    },
    computed: {
      rules() {
        const rules = [];
        let rule = v => !!v;
        rules.push(rule);
        let rule2 = v => (v && v.length <= 8) || 'must be less than 8 characters';
        rules.push(rule2);
        return rules;
      }
    }
})
</script>

<style scoped>

.v-list-item-group {
  display: flex !important;
  flex-direction: column;
  overflow: auto;
}

</style>