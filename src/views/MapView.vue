<template>
  <div id="map-container">
    <div id="map" />
    <div class="zoom-button" id="zoom-in" @click="zoomIn">
      <b class="zoom-char">+</b>
    </div>
    <div class="zoom-button" id="zoom-out" @click="zoomOut">
      <b class="zoom-char">−</b>
    </div>
    <div class="zoom-button" id="move-w" @click="move(-20, 0)">
      <b class="zoom-char">←</b>
    </div>
    <div class="zoom-button" id="move-e" @click="move(20, 0)">
      <b class="zoom-char">→</b>
    </div>
    <div class="zoom-button" id="move-n" @click="move(0, -20)">
      <b class="zoom-char">↑</b>
    </div>
    <div class="zoom-button" id="move-s" @click="move(0, +20)">
      <b class="zoom-char">↓</b>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { LatLon } from '../components/geo'
import WebMap from '../components/WebMap'

const initState = {
  zoom: 14,
  center: LatLon.from(35.44, 139.14)
}

export default Vue.extend({
  data () {
    return {
      map: {} as WebMap
    }
  },
  methods: {
    zoomIn: function () {
      this.map.incrementZoom()
    },
    zoomOut: function () {
      this.map.decrementZoom()
    },
    move: function (x: number, y: number) {
      this.map.shift(x, y)
    }
  },
  mounted () {
    this.map = new WebMap('#map', initState.center, initState.zoom)
    this.map.draw()
  },
  destroyed () {
    this.map.destroy()
  }
})

</script>

<style scoped>
#map-container {
  width: 100vw;
  height: 100vh;
}
#map {
  width: 100%;
  height: 100%;
}
#zoom-in {
  top: 20px;
}
#zoom-out {
  top: 60px;
}
#move-e {
  top: 120px;
}
#move-w {
  top: 170px;
}
#move-n {
  top: 220px;
}
#move-s {
  top: 270px;
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
