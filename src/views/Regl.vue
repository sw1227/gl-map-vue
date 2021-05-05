<template>
  <div id="regl"></div>
</template>

<script lang="ts">
import Vue from 'vue'
import REGL from 'regl'

const frag = `
precision mediump float;
uniform vec4 color;
void main() {
  gl_FragColor = color;
}`
const vert = `
precision mediump float;
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0, 1);
}`

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
    const regl = REGL()
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
