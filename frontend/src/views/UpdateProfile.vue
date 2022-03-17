<template>
  <v-container fluid>
    <v-row justify="center">
    <v-card class="mt-10" min-width="50%">
      <v-sheet color="green" dark min-height="100" width="100%" class="text-center">
        <v-divider class="pt-7"></v-divider>
        <span class="span">COMPLETE YOUR PROFILE</span>
      </v-sheet>
      <v-form @submit.prevent="validate()">
      <v-card-text>
        <v-container>
          <v-row>
            <v-col align="center" cols="12" class="mt-11">
              <v-text-field
                v-model="username"
                label="Username"
                filled
                class="mt-2"
                autofocus
              ></v-text-field>
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
            <v-col align="center" cols="12" class="mt-11">
              <v-btn @click="$refs.file.click()">
                <v-icon>mdi-upload</v-icon> Upload Avatar
                <input ref="file" type="file" accept="image/*" style="display:none" @change="loadImage($event)" />
              </v-btn>
              <v-btn @click="validate()">
                <v-icon>mdi-check</v-icon>  Validate
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      </v-form>
    </v-card>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
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
  name: 'UpdateProfile',
  data() {
    return {
      image: {
        name: '',
        src: '',
        type: '',
      },
      username: '',
    };
  },
  methods: {
    validate() {
      if (this.image.src) {
        const { canvas } = this.$refs.cropper.getResult();
        if (canvas) {
          canvas.toBlob((blob) => {
            const form = new FormData();
            form.append('file', blob, this.image.name);
            this.$http.put('/user/me/avatar', form);
          }, this.image.type);
        }
      }
      if (this.username) {
        this.$http.put('/user/me', {
          username: this.username,
        }).then(() => {
          this.$http.get('/user/me').then((res) => {
            this.$store.commit('setUser', res.data);
            this.$store.commit('setReady', true);

            this.$http.get("/user/me/avatar", { responseType: 'arraybuffer' }).then(res => {
              this.$store.commit('setAvatar', _arrayBufferToBase64(res.data));
            });
            this.$router.push({ name: 'Main' });
          });
        });
      }
    },
    reset() {
      this.image = {
        src: null,
        type: null
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
      }
    },
  },
});
</script>

<style>
@import '~@/assets/fonts/LEMONMILK/stylesheet.css';

.span {
  font-family: "lemon_milkmedium";
  font-size: 30px;
  letter-spacing: 0.1em;
  /* margin-left: 60px; */
}
</style>
