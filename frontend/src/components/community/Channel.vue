<template>
    <v-card flat tile min-width="18%" class="d-flex flex-column" height="80%">
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
                <v-form ref="form" v-model="valid" @submit.prevent="newChannel" >
                  <v-text-field v-model="name" :rules="rules" label="name of channel"></v-text-field>
                </v-form>
              </v-col>
              <v-col cols="12">
                <v-form @submit.prevent="newChannel">
                  <v-text-field v-model="password" label="Password*" type="password"></v-text-field>
                </v-form>
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
  
      <v-list v-if="searchCR==''" mandatory> <!-- Si je ne cherche pas de CR -->
       <v-list-item-group>
        <div v-for="CR in userCR" :key="CR.id">
        <v-list-item two-line @click="changeCR(CR.id)">
          <v-list-item-content>
            <v-list-item-title > {{CR.name}} </v-list-item-title>
            <v-list-item-subtitle v-if="CR.public"> public
              <v-icon v-if="isAdmin(CR.adminId)" small color="yellow"> mdi-account </v-icon>
              <v-icon v-if="CR.ownerId == user.id" small color="blue"> mdi-account-child-circle </v-icon>
            </v-list-item-subtitle>
            <v-list-item-subtitle v-else> private
              <v-icon v-if="isAdmin(CR.adminId)" small color="yellow"> mdi-account </v-icon>
              <v-icon v-if="CR.ownerId == user.id" small color="blue"> mdi-account-child-circle </v-icon>
            </v-list-item-subtitle>
          </v-list-item-content>
          <OptionChannel @leaveRoom="leaveRoom(CR.id)" :isOwner="CR.ownerId == user.id" :CR="CR"/>
        </v-list-item>
        <v-divider></v-divider>
        </div>
      </v-list-item-group>
      </v-list>

      <v-list v-if="searchCR!=''" > <!-- Si je cherche un CR -->
        <div v-for="cr in filteredCRs" :key="cr.id">
        <v-list-item two-line v-if="alreadyJoin(cr.id)==false">
          <v-list-item-content>
            <v-list-item-title > {{cr.name}} </v-list-item-title>
            <v-list-item-subtitle v-if="cr.public"> public </v-list-item-subtitle>
            <v-list-item-subtitle v-else> private </v-list-item-subtitle>
          </v-list-item-content>
          
          <v-btn v-if="cr.public" dark color="blue" @click.prevent="joinRoom(cr.id)">
            <v-list-item-title class="text-center">JOIN</v-list-item-title>
          </v-btn>
          <v-dialog v-else v-model="PWdialog" max-width="600px" >
          <template v-slot:activator="{ on, attrs }">
            <v-btn dark color="blue" @click.prevent="PWdialog = !PWdialog">
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
                    <v-form @submit.prevent="joinRoom(cr.id)">
                      <v-text-field v-model="password" type="password" label="Enter password channel"></v-text-field>
                    </v-form>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1 white--text" depressed tile  @click="joinRoom(cr.id)"> JOIN </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        
        </v-list-item>
        <v-divider></v-divider>
        </div>
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
      userCR: [],
      CRs: [],
      socket: {},
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
          awaitingSearch: false,
        }
    },
    computed: {
      currentIdCR: {
        get() {
          return this.$store.getters.getIdCR;
        },
        set(id: number) {
          this.$store.commit('setIdCR', id);
        }
      },
      user() {
        return this.$store.state.user;
      },
      filteredCRs(): unknown {
        // console.log('FILTERED CR', this.CRs); // TODO: remove
        return this.CRs.filter((cr) => {
          return cr.name.match(this.searchCR);
        })
      },

      rules() {
        const rules = [];
        let rule = v => !!v;
        rules.push(rule);
        let rule2 = v => (v && v.length <= 8) || 'must be less than 8 characters';
        rules.push(rule2);
        return rules;
      },
    },
    methods: {
      isAdmin(adminIds: []) {
        let adminId;
        for (adminId in adminIds)
          if (adminIds[adminId] == this.user.id)
            return true;
        return false;
      },
      alreadyJoin(toJoin: number) {
        let i = 0;
        while (i < this.userCR.length)
        {
          if (this.userCR[i].id == toJoin)
            return true;
          i++;
        }
        // console.log("FALSE"); // TODO: remove
        return false;
      },
      checkPW() {
        this.PWdialog=!this.PWdialog
      },
      async joinRoom(idCR) {
        console.log('Join ROOM', idCR, this.password); // TODO: remove
        this.socket.emit('join', {id: idCR, password: this.password});
        // try { await this.$http.put('/channel/join', {id: idCR, password: this.password}).then((resp) => console.log(resp)) } // TODO: remove
        // catch(error) {
        //   console.log(error.message); // TODO: remove
        //   alert("You can't access this channel")
        // }
        this.searchCR = '';
        this.$emit('fetchCR');
        // this.currentIdCR = idCR;
        this.password = '';
        this.PWdialog = false;
      },
      async leaveRoom(idCR) {
        console.log("leave ROOM ", idCR); // TODO: remove
        this.socket.emit('leave', { roomId: idCR })
        // await this.$http.put('/channel/' + idCR + '/leave', {id: this.user.id,}).then((resp) => console.log(resp)) // TODO: remove
        if (this.currentIdCR != 0)
          this.currentIdCR = 0;
        this.$emit('fetchCR');
      },
      async newChannel() {
        // console.log('USER ID IN CHANNEL', this.user.id); //TODO: remove
        if (this.valid) {
          if (this.password == '')
            await this.$http.post('/channel', {name: this.name, public: true}).then((resp) => {
              console.log(resp); //TODO: remove
              if (resp.status == 201)
                this.currentIdCR = resp.data.id;
            });
          else
            await this.$http.post('/channel', {name: this.name, public: false, password: this.password }).then((resp) => {
              console.log(resp); //TODO: remove
              if (resp.status == 201)
                this.currentIdCR = resp.data.id;
            });
          this.dialog = false;
          this.$emit('fetchCR');
          this.name = '';
          this.password = '';
        }
      },
      changeCR(idCR) {
        this.currentIdCR = idCR;
        this.$emit('fetchCR');
      },
    },
    created() {
      this.socket.on('join', (data) => {
        console.log('JOIN', data); // TODO: remove
        if (data.user.id == this.user.id)
          this.currentIdCR = data.room.id;
        this.$emit('fetchCR');
      });
      this.socket.on('leave', (data) => {
        console.log('LEAVE', data); // TODO: remove
        this.$emit('fetchCR');
      });
    },
    watch: {
      searchCR() {
        if (!this.awaitingSearch) {
          setTimeout(() => {
            this.$emit('fetchCR');
            this.awaitingSearch = false;
          }, 1000);
          this.awaitingSearch = true;
        }
      }
    }
})
</script>

<style scoped>


html {
  overflow: hidden !important;
}

.v-list {
  display: flex !important;
  flex-direction: column;
  height: 70vh;
  overflow: auto;
}

</style>
