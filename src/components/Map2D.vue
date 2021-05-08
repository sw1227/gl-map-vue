<template>
  <div id="map2d" />
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import REGL from 'regl'
import { loadImage, tileUrl } from '../components/util'
import { calculateTilesInView, LatLon, tileSize } from '../components/geo'

// Shaders
import vert from '../assets/glsl/multiple-tiles/quad.vert'
import frag from '../assets/glsl/multiple-tiles/quad.frag'

type TilesProp = {
  texture: REGL.Texture2D
  offsetX: number
  offsetY: number
}

export default Vue.extend({
  props: {
    center: Object as PropType<LatLon>,
    zoom: Number
  },
  data () {
    return {
      regl: {} as REGL.Regl,
      selector: '#map2d'
    }
  },
  watch: {
    zoom: function () {
      this.drawMap()
    }
  },
  methods: {
    drawMap: async function () {
      const bbRect = document.querySelector(this.selector)!.getBoundingClientRect()

      // Get tile list in the current view
      const tiles = calculateTilesInView(this.center, this.zoom, bbRect.width, bbRect.height)
      const images = await Promise.all(tiles.map(tile => loadImage(tileUrl.std(tile.tile))))

      const xSize = tileSize / bbRect.width
      const ySize = tileSize / bbRect.height
      const draw = this.regl({
        vert: vert,
        frag: frag,
        attributes: {
          tex: [[0, 0], [1, 0], [0, 1], [0, 1], [1, 0], [1, 1]],
          position: [
            [0, 1], [xSize, 1], [0, 1 - ySize],
            [0, 1 - ySize], [xSize, 1], [xSize, 1 - ySize]
          ]
        },
        uniforms: {
          mapTexture: this.regl.prop<TilesProp, 'texture'>('texture'),
          offsetX: this.regl.prop<TilesProp, 'offsetX'>('offsetX'),
          offsetY: this.regl.prop<TilesProp, 'offsetY'>('offsetY')
        },
        count: 6
      })

      draw(tiles.map((t, i) => {
        const texture = this.regl.texture(images[i] as REGL.TextureImageData)
        const offsetX = t.offset.x / bbRect.width
        const offsetY = t.offset.y / bbRect.height
        return {
          texture,
          offsetX,
          offsetY
        }
      }))
    }
  },
  async mounted () {
    const regl = REGL(this.selector)
    this.regl = regl
    this.drawMap()
  },
  destroyed () {
    this.regl.destroy()
  }
})
</script>

<style scoped>
#map2d {
  width: 100%;
  height: 100%;
}
</style>
