<template>
    <v-container fluid class="mt-10">
        <v-row align="center" justify="center">
        <v-col cols="7">
            MACHIN VS TRUC
            <v-card flat color="green" height="220">
                <v-card-text class="white--text">
                <v-row class="mt-9" align="center" justify="center">
                    <v-col cols="12">
                    <p class="text-center">
                        CHOOSE MAP
                    </p>
                    </v-col>
                    <v-btn-toggle
                    v-model="toggle_exclusive" mandatory>
                    <v-btn>
                        <v-icon>mdi-format-align-left</v-icon>
                    </v-btn>
                    <v-btn>
                        <v-icon>mdi-format-align-center</v-icon>
                    </v-btn>
                    <v-btn> 
                        <v-icon>mdi-format-align-right</v-icon>
                    </v-btn>
                    <v-btn>
                        <v-icon>mdi-format-align-justify</v-icon>
                    </v-btn>
                    </v-btn-toggle>
                </v-row>
                </v-card-text>
            </v-card>

            <v-card flat color="green" class="mt-3" height="150">
                <v-card-text class="white--text">
                <v-row align="center" justify="center" class="mt-1">
                    <v-col cols="12">
                    <p class="text-center">
                        CHOOSE POWER-UP
                    </p>
                    </v-col>
                    <v-btn-toggle
                    v-model="toggle_exclusive"
                    mandatory
                    >
                    <v-btn>
                        <v-icon>mdi-format-align-left</v-icon>
                    </v-btn>
                    <v-btn>
                        <v-icon>mdi-format-align-center</v-icon>
                    </v-btn>
                    <v-btn>
                        <v-icon>mdi-format-align-right</v-icon>
                    </v-btn>
                    <v-btn>
                        <v-icon>mdi-format-align-justify</v-icon>
                    </v-btn>
                    </v-btn-toggle>
                </v-row>
                </v-card-text>
            </v-card>

        <v-btn class="mt-5" block height="60" > READY! </v-btn>
        </v-col>
        </v-row>
    </v-container>
</template>


<script lang="ts">

export default {
    name: 'Pregame',
    data() {
        return {
            toggle_exclusive: undefined,
        }    
    },
}
</script>

<style scoped>
@import '../../assets/fonts/LEMONMILK/stylesheet.css';

p {
  font-family: "lemon_milkmedium";
  font-size: 30px;
  letter-spacing: 0.1em;
  /* margin-left: 60px; */
}
</style>