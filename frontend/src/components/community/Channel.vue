<template>
  <v-card dark flat tile min-width="18%" class="d-flex flex-column" height="80%">
    <v-sheet color="green" dark min-height="100" width="100%" class="text-center">
      <v-divider class="pt-7"></v-divider>
      <span class="span"> CHANNELS </span>
    </v-sheet>

    <v-dialog v-if="!chatDirect" v-model="dialog" persistent max-width="600px" >
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on" class="ma-1" color="green" bottom tile left  @click="dialog = !dialog">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>
      <v-card dark>
        <v-card-title class="text-h5 green">
          <span class="text-h5 white--text">Create your own Channel</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" >
                <v-form ref="form" v-model="valid" @submit.prevent="createChannel" >
                  <v-text-field v-model="name" :rules="rules" label="name of channel" autofocus></v-text-field>
                </v-form>
              </v-col>
              <v-col cols="12">
                <v-form @submit.prevent="createChannel">
                  <v-text-field v-model="password" :rules="rulesPassword" label="Password*" type="password"></v-text-field>
                </v-form>
              </v-col>
            </v-row>
            <small>*not mandatory</small>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" depressed tile dark @click="dialog = false"> Cancel </v-btn>
          <v-btn color="blue darken-1 white--text" :disabled="!valid" depressed tile  @click="createChannel"> SAVE </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-text-field v-if="!chatDirect" v-model="searchChannel" dense class="d-flex justify-center mb-n2 mt-5 pl-5 pr-5" label="search channel"></v-text-field>
    <v-divider class="mt-1"></v-divider>

    <v-list v-if="searchChannel == '' && !chatDirect" mandatory> <!-- Si je ne cherche pas de CR -->
      <v-list-item-group>
        <div v-for="channel in myChannels" :key="channel.id">
          <v-list-item two-line @click="changeChannel(channel.id)">
            <v-list-item-content>
              <v-list-item-title > {{channel.name}} </v-list-item-title>
              <v-list-item-subtitle v-if="channel.public"> public
                <v-icon v-if="isAdmin(channel.adminId)" small color="yellow"> mdi-account </v-icon>
                <v-icon v-if="channel.owner.id == user.id" small color="blue"> mdi-crown </v-icon>
              </v-list-item-subtitle>
              <v-list-item-subtitle v-else> private
                <v-icon v-if="isAdmin(channel.adminId)" small color="yellow"> mdi-account </v-icon>
                <v-icon v-if="channel.owner.id == user.id" small color="blue"> mdi-crown </v-icon>
              </v-list-item-subtitle>
            </v-list-item-content>
            <OptionChannel @leaveChannel="leaveChannel(channel.id)" :channel="channel"/>
          </v-list-item>
          <v-divider></v-divider>
        </div>
      </v-list-item-group>
    </v-list>

    <v-list v-if="searchChannel != '' && !chatDirect" > <!-- Si je cherche un CR -->
      <div v-for="channel in filteredChannels" :key="channel.id">
        <v-list-item two-line v-if="alreadyJoin(channel.id)==false">
          <v-list-item-content>
            <v-list-item-title > {{channel.name}} </v-list-item-title>
            <v-list-item-subtitle v-if="channel.public"> public </v-list-item-subtitle>
            <v-list-item-subtitle v-else> private </v-list-item-subtitle>
          </v-list-item-content>

          <v-btn v-if="channel.public" dark color="blue" @click.prevent="joinChannel(channel.id)">
            <v-list-item-title class="text-center">JOIN</v-list-item-title>
          </v-btn>
          <v-dialog v-else v-model="passwordDialog" max-width="600px" >
            <template v-slot:activator="{ on, attrs }">
              <v-btn dark color="blue" @click.prevent="passwordDialog = !passwordDialog">
                <v-list-item-title v-bind="attrs" v-on="on" class="text-center">JOIN</v-list-item-title>
              </v-btn>
            </template>
            <v-card dark>
              <v-card-title class="text-h5 green">
                <span class="text-h5 white--text">Enter Password</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" >
                      <v-form @submit.prevent="joinChannel(channel.id)">
                        <v-text-field v-model="password" type="password" label="Enter password channel"></v-text-field>
                      </v-form>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1 white--text" depressed tile  @click="joinChannel(channel.id)"> JOIN </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-list-item>
        <v-divider></v-divider>
      </div>
    </v-list>
    <v-list v-if="chatDirect">
      <v-list-item-group v-for="channel in directChannels" :key="channel.id">
        <v-list-item @click="changeChannel(channel.id)">
          <v-list-item-icon>
            <v-icon>mdi-message-text</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{channel.users.find(channelUser => channelUser.id != user.id).username}} </v-list-item-title>
          </v-list-item-content>
          <v-list-item-avatar>
            <v-avatar>
              <img v-auth-image="'/user/' + channel.users.find(channelUser => channelUser.id != user.id).id + '/avatar'" alt="" class="mr-2">
            </v-avatar>
          </v-list-item-avatar>
        </v-list-item>
        <v-divider></v-divider>
      </v-list-item-group>
    </v-list>
    <v-card-actions class="justify-center">
        <v-btn color="blue darken-1" class="ma-1" min-width="50%" dark depressed tile @click="chatDirect = false; idCurrentChannel = 0">General</v-btn>
        <v-btn color="blue darken-1" class="ma-1" min-width="50%" dark depressed tile @click="chatDirect = true; idCurrentChannel = 0">DM</v-btn>
    </v-card-actions>
  </v-card>
</template>


<script lang="ts">
import Vue from 'vue';
import OptionChannel from './OptionChannel.vue'

Vue.component('OptionChannel', OptionChannel);

export default Vue.extend({
  name: 'Channel',

  props: {
    socket: {},
  },

  data() {
      return {
        dialog: false,
        passwordDialog: false,
        showInput: false,
        valid: true,
        name: '',
        password: '',
        searchChannel: '',
        awaitingSearch: false,
      }
  },

  computed: {
    idCurrentChannel: {
      get() {
        return this.$store.getters.getIdCurrentChannel;
      },
      set(id: number) {
        this.$store.commit('setIdCurrentChannel', id);
      }
    },
    channels: {
      get() {
        return this.$store.getters.getChannels;
      },
      set(channels: unknown) {
        this.$store.commit('setChannels', channels);
      }
    },
    myChannels: {
      get() {
        return this.$store.getters.getMyChannels;
      },
      set(myChannels: unknown) {
        this.$store.commit('setMyChannels', myChannels);
      }
    },
    chatDirect: {
      get() {
        return this.$store.getters.getChatDirect;
      },
      set(chatDirect: unknown) {
        this.$store.commit('setChatDirect', chatDirect);
      }
    },
    directChannels: {
      get() {
        return this.$store.getters.getDirectChannels;
      },
      set(directChannels: unknown) {
        this.$store.commit('setDirectChannels', directChannels);
      }
    },
    user() {
      return this.$store.getters.getUser;
    },
    filteredChannels(): unknown {
      return this.channels.filter((channel) => {
        return channel.name.match(this.searchChannel);
      })
    },
    rules() {
      const rules = [];
      let rule = v => !!v;
      rules.push(rule);
      let rule2 = v => (v && v.length <= 8) || 'must be less than 8 characters';
      rules.push(rule2);
      let rule3 = v => !this.channels.some(channel => channel.name === v) || 'already exists';
      rules.push(rule3);
      return rules;
    },
    rulesPassword() {
      const rules = [];
      let rule = v => v.length <= 16 || 'must be less than 16 characters';
      rules.push(rule);
      return rules;
    }
  },

  methods: {
    isAdmin(listAdminsId: [number]) {
      return listAdminsId.includes(this.user.id);
    },
    alreadyJoin(toJoin: number) {
      return this.myChannels.some(channel => channel.id == toJoin);
    },
    joinChannel(idChannel) {
      this.socket.emit('join', {id: idChannel, password: this.password});
      this.searchChannel = '';
      this.$emit('fetchChannels');
      this.password = '';
      this.passwordDialog = false;
    },
    leaveChannel(idChannel) {
      this.socket.emit('leave', { channelId: idChannel })
      if (this.currentIdCR == idChannel)
        this.currentIdCR = 0;
    },
    createChannel() {
      if (this.valid) {
        if (this.password == '')
          this.$http.post('/channel', {name: this.name, public: true}).then(() => {
            this.$emit('fetchChannels');
          });
        else
          this.$http.post('/channel', {name: this.name, public: false, password: this.password }).then(() => {
            this.$emit('fetchChannels');
          });
        this.dialog = false;
        this.name = '';
        this.password = '';
      }
    },
    changeChannel(idChannel) {
      this.idCurrentChannel = idChannel;
    },
  },

  watch: {
    searchChannel() {
      if (!this.awaitingSearch) {
        setTimeout(() => {
          this.$emit('fetchChannels');
          this.awaitingSearch = false;
        }, 500);
        this.awaitingSearch = true;
      }
    },
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
