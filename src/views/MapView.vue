<template>
  <div id="map-container">
    <map-2-d :zoom="zoomLevel" :center="mapCenter" />
    <div class="zoom-button" id="zoom-in" @click="zoomIn">
      <b class="zoom-char">+</b>
    </div>
    <div class="zoom-button" id="zoom-out" @click="zoomOut">
      <b class="zoom-char">−</b>
    </div>
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
  components: { Map2D },
  methods: {
    zoomIn: function () {
      this.zoomLevel += 1
    },
    zoomOut: function () {
      this.zoomLevel -= 1
    }
  }
})

</script>

<style scoped>
#map-container {
  width: 100vw;
  height: 100vh;
}
#zoom-in {
  top: 20px;
}
#zoom-out {
  top: 60px;
}
.zoom-button {
  position: absolute;
  left: 20px;
  width: 40px;
  height: 40px;
  z-index: 1;
  background: white;
  text-align: center;
  display: table;
  border: 1px solid #aaa;
}
.zoom-button:hover {
  background: #ddd;
}
.zoom-char {
  font-size: 32px;
  display: table-cell;
  vertical-align: middle;
}
</style>
