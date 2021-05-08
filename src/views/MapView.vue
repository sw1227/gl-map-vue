<template>
  <div id="map-container">
    <map-2-d :zoom="zoomLevel" :center="mapCenter" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Map2D from '../components/Map2D.vue'
import { LatLon } from '../components/geo'

export default Vue.extend({
  data () {
    return {
      zoomLevel: 14,
      mapCenter: LatLon.from(35.44, 139.14)
    }
  },
  components: { Map2D }
})

</script>

<style scoped>
#map-container {
  width: 100vw;
  height: 100vh;
}
</style>
