<template>
  <v-container >
    <h1 style="text-align: center;titl;color: white">
      Complete your profile
    </h1>
    <v-row>
      <v-col align="center" cols="12" class="mt-11">
        <v-form v-model="valid">
        <v-text-field
          v-model="username"
          :rules="rules"
          label="Username"
          filled
          class="mt-2"
          color="white"
        ></v-text-field>
        </v-form>
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
        <v-btn :disabled="!valid" @click="validate()">
          <v-icon>mdi-check</v-icon>  Validate
        </v-btn>
      </v-col>
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
      valid: true,
      users: [],
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
  async beforeCreate() {
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
      if (this.users.length == 0)
        return rules;
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
      return rules;
    }
  },
});
</script>
