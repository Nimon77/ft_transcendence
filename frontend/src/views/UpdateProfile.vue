<template>
  <v-container fluid>
    <!-- <v-row justify="center"> -->
    <v-card dark class="mt-10 profile">
      <v-sheet color="green" dark min-height="100" width="100%" class="text-center">
        <v-divider class="pt-7"></v-divider>
        <span class="span">COMPLETE YOUR PROFILE</span>
      </v-sheet>
      <v-form v-model="valid" @submit.prevent="validate()">
      <v-card-text>
              <v-text-field
                :rules="rules"
                v-model="username"
                label="Username"
                filled
                class="mt-2"
                autofocus
              ></v-text-field>
              <v-container v-if="image.src">
              <!-- <v-card class="mt-6 cropper" v-if="image.src"> -->
                <cropper
                  :src="image.src"
                  :stencil-props="{
                    aspectRatio: 1,
                  }"
                  class="cropper"
                  ref="cropper"
                />
              <!-- </v-card> -->
              </v-container>
          </v-card-text>
          <v-card-actions>
              <v-btn @click="$refs.file.click()" class="center">
                <v-icon>mdi-upload</v-icon> Upload Avatar
                <input ref="file" type="file" accept="image/*" style="display:none" @change="loadImage($event)" />
              </v-btn>
              <v-btn :disabled="!valid" @click="validate()" class="center">
                <v-icon>mdi-check</v-icon>  Validate
              </v-btn>
          </v-card-actions>
      </v-form>
    </v-card>
  </v-container>
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
      let rule2 = v => (v.length <= 8) || 'must be less than 8 characters';
      rules.push(rule2);
      return rules;
    }
  },
  methods: {
    validate(): void {
      if (this.image.src) {
        const { canvas } = this.$refs.cropper.getResult();
        if (canvas) {
          canvas.toBlob((blob) => {
            const form = new FormData();
            form.append('file', blob, this.image.name);
            this.$http.put('/user/me/avatar', form).then(() => {
              this.$http.get("/user/me/avatar", { responseType: 'arraybuffer' }).then(res => {
                const avatar = "data:image/*" + ";base64," + Buffer.from(res.data).toString('base64')
                this.$store.commit('setAvatar', avatar);
              });
            });
          }, this.image.type);
        }
      }
      if (this.username) {
        this.$http.put('/user/me', {
          username: this.username,
        }).then(() => {
          this.$http.get('/user/me').then((res) => {
            this.$http.get("/user/me/avatar", { responseType: 'arraybuffer' }).then(res => {
              const avatar = "data:image/*" + ";base64," + Buffer.from(res.data).toString('base64')
              this.$store.commit('setAvatar', avatar);
            });
            this.$store.commit('setUser', res.data);
            this.$store.commit('setReady', true);
            this.$router.push({ name: 'Main' });
          });
        });
      }
    },
    reset(): void {
      this.image = {
        src: null,
        type: null
      }
    },
    loadImage(event): void {
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
  created() {
    this.$http.get('/user').then(response => {
      this.users = response.data;
    });
  }
});
</script>

<style>
@import '~@/assets/fonts/LEMONMILK/stylesheet.css';

html, body {
	overflow: hidden !important
}

.span {
  font-family: "lemon_milkmedium";
  font-size: 30px;
  letter-spacing: 0.1em;
  /* margin-left: 60px; */
}

.profile {
  width: 75vh;
  max-height: 75vh;
  margin: auto;
}

.cropper {
  width: 40vh;
  height: 40vh;
  background: #1E1E1E;

  /* object-fit: cover; */
  margin: auto;
}

.center {
  margin: auto;
}

</style>
