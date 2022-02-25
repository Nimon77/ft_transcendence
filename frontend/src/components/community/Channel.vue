<template>
    <v-card flat tile min-width="18%" class="d-flex flex-column" height="90%">
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
        <v-text-field v-model="searchCR" dense class="d-flex justify-center mb-n2 mt-5 pl-5 pr-5" label="search channel"></v-text-field>
      </v-form>
      <v-divider class="mt-1"></v-divider>
  
      <v-list-item-group height="100px" v-if="searchCR==''" mandatory style="border: solid;"> <!-- Si je ne cherche pas de CR -->
        <div v-for="CR in userCR.items" :key="CR.id">
        <v-list-item two-line router :to="'/community/' + CR.id">
          <v-list-item-content>
            <v-list-item-title > {{CR.name | upCase}} </v-list-item-title>
            <v-list-item-subtitle> public <v-icon  small color="yellow"> mdi-account </v-icon> </v-list-item-subtitle>
          </v-list-item-content>
          <OptionChannel @leaveRoom="leaveRoom(CR.id)"/>
        </v-list-item>
        </div>
        <v-divider></v-divider>
      </v-list-item-group>

      <v-list v-if="searchCR!=''" > <!-- Si je cherche un CR -->
        <div>
        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-title > BONJOUR </v-list-item-title>
            <v-list-item-subtitle> public </v-list-item-subtitle>
          </v-list-item-content>
          
          <!-- <v-btn v-if="!passwordCR" dark color="blue" @click.prevent>
            <v-list-item-title class="text-center">JOIN</v-list-item-title>
          </v-btn> -->
          <!-- v-else -->
          <v-dialog  v-model="PWdialog" max-width="600px" >
          <template v-slot:activator="{ on, attrs }">
            <v-btn  dark color="blue" @click.prevent="PWdialog = !PWdialog">
              <v-list-item-title v-bind="attrs" v-on="on" class="text-center">JOIN</v-list-item-title>
            </v-btn>
          </template>
          <v-card>
            <v-card-title class="text-h5 green">
              <span class="text-h5 white--text">Enter Password</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" >

                    <v-form ref="form" v-model="valid">
                    <v-text-field v-model="name" :rules="rules" type="password" label="set your password channel"></v-text-field>
                    </v-form>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1 white--text" :disabled="!valid" depressed tile  @click="PWdialog=!PWdialog"> JOIN </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        
        </v-list-item>
        </div>
        <v-divider></v-divider>
        <div>
        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-title > OY </v-list-item-title>
            <v-list-item-subtitle> private </v-list-item-subtitle>
          </v-list-item-content>
          <!-- <OptionChannel @leaveRoom="leaveRoom(CR.id)"/> -->
        </v-list-item>
        </div>
        <v-divider></v-divider>
      </v-list>
    
    </v-card>
</template>


<script lang="ts">
import Vue from 'vue';
import OptionChannel from './OptionChannel.vue'

Vue.component('OptionChannel', OptionChannel);

export default Vue.extend({
    name: 'Channel',
    props: {
      user: [],
      userCR: [],
    },
    data() {
        return {
          dialog: false,
          PWdialog: false,
          showInput: false,
          valid: true,
          name: '',
          password: '',
          searchCR: '',
        }
    },
    methods: {
      async leaveRoom(idCR) {
        console.log("IN CHAN LEAVE ROOM");
        await this.$http.post('/chatroom/' + idCR, {id: this.user.id,}).then((resp) => console.log(resp))
        this.$emit('newCR');
      },
      async newChannel() {
        await this.$http.post('/user/chatroom', {name: this.name,}).then((resp) => console.log(resp))
        this.dialog = false;
        this.$emit('newCR');
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