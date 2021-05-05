<template>
  <div id="regl" />
</template>

<script lang="ts">
import Vue from 'vue'
import REGL from 'regl'

// Shaders
import vert from '../assets/glsl/test.vert'
import frag from '../assets/glsl/test.frag'

type TriangleProp = {
  color: [number, number, number, number]
}

export default Vue.extend({
  data () {
    return {
      regl: {} as REGL.Regl
    }
  },
  mounted () {
    const regl = REGL('#regl')
    const options: REGL.DrawConfig = {
      frag: frag,
      vert: vert,
      attributes: {
        position: [[0, -1], [-1, 0.5], [1, 1]] // No need to flatten
      },
      uniforms: {
        color: regl.prop<TriangleProp, 'color'>('color')
      },
      count: 3 // Number of vertices to draw in this command
    }
    const drawTriangle = regl(options)
    regl.frame(({ time }) => {
      regl.clear({
        color: [0, 0, 0, 0],
        depth: 1
      })
      drawTriangle({
        color: [
          Math.cos(time * 1.0),
          Math.sin(time * 0.8),
          Math.cos(time * 3.0),
          1
        ]
      })
    })
    this.regl = regl
  },
  destroyed () {
    this.regl.destroy()
  }
})

</script>

<style scoped>
#regl {
  width: 100vw;
  height: 100vh;
}
</style>
