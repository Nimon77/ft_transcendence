<template>
    <v-card flat class="mx-10 d-flex flex-column" color="white" min-width="50%" max-width="50%" height="645">
    <v-container fluid>
    
        <v-sheet color="green" height="100" dark width="100%" class="text-center">
        <v-divider class="pt-4"></v-divider>
        <span class="span"> CHAT </span>
        </v-sheet>
        
        <v-card elevation="2" class="pt-3 mt-3" color="white" min-width="100%" max-width="100%" height="440">
            <v-list>
                <v-card flat tile width="400px" color="white" >
                <v-card-text>
                        Joebul :
                        <div> MES SAGEeeeee eeefefeegegegegege gegegegege gegegegeg ethetbdfbdgndgqet bwdbwdqet!!</div>
                </v-card-text>
                </v-card >
                <v-divider class="mt-1"></v-divider>
                <v-card flat tile width="400px" color="white" >
                <v-card-text>
                        Joebul :
                        <div> MES SAGEeeeee eeefefeegegegegege gegegegege gegegegeg ethetbdfbdgndgqet bwdbwdqet!!</div>
                </v-card-text>
                </v-card >
                <v-divider class="mt-1"></v-divider>
                
                <v-card flat tile width="100%" color="blue" dark style="justify: right">
                <v-card-text class="text-right">
                        MOI :
                        <div> MES SAGEeeeee eeefefeegegegegege gegegegege gegegegeg ethetbdfbdgndgqet bwdbwdqet!!</div>
                </v-card-text>
                </v-card >
                <v-divider class="mt-1"></v-divider>
                <v-card flat tile width="100%" color="blue" dark style="justify: right">
                    <v-card-text class="text-right">
                            MOI :
                            <div> MES SAGEeeeee eeefefeegegegegege gegegegege gegegegeg ethetbdfbdgndgqet bwdbwdqet!!</div>
                    </v-card-text>
                    </v-card >
                <v-divider class="mt-1"></v-divider>
                <v-card flat tile width="400px" color="white" >
                <v-card-text>
                        Joebul :
                        <div> MES SAGEeeeee eeefefeegegegegege gegegegege gegegegeg ethetbdfbdgndgqet bwdbwdqet!!</div>
                </v-card-text>
                </v-card >
                <v-divider class="mt-1"></v-divider>
            </v-list>
        </v-card>


    <v-spacer></v-spacer>
    <v-row style="margin-top: 0px">
        <v-col cols="12">
      <v-card-actions>
        <v-sheet color="green" height="50" dark width="100%" class="text-center">
            <v-app-bar bottom color="rgba(0,0,0,0)" flat>
                <v-text-field class="mt-5" append-outer-icon="mdi-send"
                filled clear-icon="mdi-close-circle" label="Message" type="text"
                ></v-text-field>
            </v-app-bar>
        </v-sheet>
      </v-card-actions>
        </v-col>
    </v-row>
    </v-container>
    </v-card>
</template>

    <!-- <v-card class="mt-10 mr-2" max-width="350px" color="blue" dark>
    <v-list-item three-line>
        <v-list-item-content>
        <div class=" mb-4">
            GNE
        </div>
        <v-list-item-subtitle>2 mins ago <span class="ml-16">Seen 1:23PM</span></v-list-item-subtitle>  
        </v-list-item-content>
    </v-list-item>
    </v-card > -->


<script lang="ts" >
export default {
    name: 'Chat',
    data() {
        return {

        }
    }
}
</script>

<style scoped>

@import '../../assets/fonts/LEMONMILK/stylesheet.css';

.span {
  font-family: "lemon_milkmedium";
  font-size: 40px;
  letter-spacing: 0.2em;
  /* margin-left: 60px; */
}

.v-list{
  height:440px;
  overflow-y:auto
}

</style>