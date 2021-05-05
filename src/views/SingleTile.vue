<template>
  <div id="tile" />
</template>

<script lang="ts">
import Vue from 'vue'
import REGL from 'regl'
import { loadImage, tileUrl } from '../components/util'
import { TileCoord } from '../components/geo'

// Shaders
import vert from '../assets/glsl/single-tile/quad.vert'
import frag from '../assets/glsl/single-tile/quad.frag'

// Sample Tile
const tile: TileCoord = { z: 13, x: 7262, y: 3232 }

export default Vue.extend({
  data () {
    return {
      regl: {} as REGL.Regl
    }
  },
  async mounted () {
    const regl = REGL('#tile')

    // Load tile as WebGL texture
    const img = await loadImage(tileUrl.std(tile))
    const texture: REGL.Texture2D = regl.texture(img as REGL.TextureImageData)

    // Draw single tile
    const drawTile = regl({
      vert: vert,
      frag: frag,
      attributes: {
        position: [
          [0, 1], [1, 1], [0, 0],
          [0, 0], [1, 1], [1, 0]
        ]
      },
      uniforms: {
        mapTexture: texture
      },
      count: 6
    })
    drawTile()

    this.regl = regl
  },
  destroyed () {
    this.regl.destroy()
  }
})

</script>

<style scoped>
#tile {
  width: 512px;
  height: 512px;
}
</style>
