<template>
    <v-dialog transition="scale-transition" max-width="400" persistent>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on" color="blue" dark max-width="160"> Avatar/Username </v-btn>
        </template>
        <template v-slot:default="dialog">
          <v-card>
            <v-form @submit.prevent="setNewInfos(dialog)" ref="form" v-model="valid">
              <v-toolbar color="primary" elevation="0" class="text-h5 pl-5" dark>CHANGE YOUR THINGS HERE</v-toolbar>
              <v-card-text>
                <v-container fluid>
                <v-row>
                <v-col align="center" cols="12" class="mt-11" >
                  
                  <!-- <v-form ref="form" v-model="valid"> -->
                  <v-text-field v-model="username" :rules="rules" label="new username"></v-text-field>
                  <!-- </v-form> -->
                
                </v-col>
                <v-col cols="12">
                  <v-card class="mt-6" v-if="image.src">
                    <cropper
                      :src="image.src"
                      :stencil-props="{
                        aspectRatio: 1,
                      }"
                      ref="cropper"
                    />
                  </v-card>
                </v-col>
                </v-row>
                <v-row>
                <v-col cols="12" class="text-center">
                  <v-btn @click="$refs.file.click()">
                    <v-icon>mdi-upload</v-icon> Upload Avatar
                    <input ref="file" type="file" accept="image/*" style="display:none" @change="loadImage($event)" />
                  </v-btn>
                </v-col>
                </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions class="justify-end">
                <v-btn color="red" dark @click="dialog.value = false" >CANCEL</v-btn>
                <v-btn
                  color="blue"
                  class="white--text"
                  :disabled="!valid"
                  @click="setNewInfos(dialog)"
                >OK!</v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </template>
      </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';

Vue.component('cropper', Cropper);

// This function is used to detect the actual image type,
function getMimeType(file, fallback = null) {
  const byteArray = new Uint8Array(file).subarray(0, 4);
  let header = '';
  for (let i = 0; i < byteArray.length; i++) {
    header += byteArray[i].toString(16);
  }
  switch (header) {
    case '89504e47':
      return 'image/png';
    case '47494638':
      return 'image/gif';
    case 'ffd8ffe0':
    case 'ffd8ffe1':
    case 'ffd8ffe2':
    case 'ffd8ffe3':
    case 'ffd8ffe8':
      return 'image/jpeg';
    default:
      return fallback;
  }
}

function _arrayBufferToBase64( buffer ) {
  let binary = '';
  const bytes = new Uint8Array( buffer );
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
      binary += String.fromCharCode( bytes[ i ] );
  }
  return window.btoa( binary );
}

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
              image: {
                name: '',
                src: '',
                type: '',
              },
            }
        },
        methods: {
          async setNewInfos(dialog) {
            if (this.valid) {
              dialog.value = false;
              if (this.image.src) {
                const { canvas } = this.$refs.cropper.getResult();
                if (canvas) {
                  canvas.toBlob((blob) => {
                    const form = new FormData();
                    form.append('file', blob, this.image.name);
                    this.$http.put('/user/me/avatar', form).then(() => {
                      this.$http.get("/user/me/avatar", { responseType: 'arraybuffer' }).then(res => {
                        this.$store.commit('setAvatar', _arrayBufferToBase64(res.data));
                      });
                    });
                  }, this.image.type);
                }
              }
              if (this.username != '') {
                await this.$http.put('/user/me', {username: this.username,}).then(response => {
                  console.log('PUT REQUEST', response); // TODO: remove
                  });
              }
              await this.$http.get('/user/me').then(response => {
                this.$store.commit('setUser', response.data);
              });
              this.username = '';
              this.$http.get('/user').then(response => {
                this.users = response.data;
              });
            }
          },

          loadImage(event) {
            const { files } = event.target;
            if (files && files[0]) {
              if (this.image.src) {
                URL.revokeObjectURL(this.image.src);
              }
              const blob = URL.createObjectURL(files[0]);
              const reader = new FileReader();
              reader.onload = (e => {
                this.image = {
                  name: files[0].name,
                  src: blob,
                  type: getMimeType(e.target.result, files[0].type),
                };
              });
              reader.readAsArrayBuffer(files[0]);
              this.valid = true;
            }
          },
        },

        async created() {
          await this.$http.get('/user').then(response => {
            this.users = response.data;
          });
            console.log('USERS : ', this.users); // TODO: remove
        },
        computed: {
          rules() {
            const rules = [];
            let existingName: string = null;
            let i = 0;

            if (this.username.length > 0) {
              existingName = this.users[i].username;
              while (this.username != existingName && i < this.users.length) {
                existingName = this.users[i++].username;
              }
              if (this.username === existingName) {
                const rule = `username already exist`;
                rules.push(rule);
              }
              let rule2 = v => (v && v.length <= 8) || 'must be less than 8 characters';
              rules.push(rule2);
            }
            return rules;
          }
        }
    });
</script>

<style scoped>

</style>
