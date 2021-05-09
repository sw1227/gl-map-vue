import REGL from 'regl'
import { loadImage, tileUrl } from '../components/util'
import { calculateTilesInView, LatLon, PixelCoord, tileSize, latLonToPixel, pixelToLatLon } from '../components/geo'

// Shaders
import vert from '../assets/glsl/multiple-tiles/quad.vert'
import frag from '../assets/glsl/multiple-tiles/quad.frag'

type TilesProp = {
  texture: REGL.Texture2D
  offsetX: number
  offsetY: number
}

export default class WebMap {
  width: number
  height: number
  regl: REGL.Regl
  zoom: number
  center: LatLon
  centerPixel: PixelCoord

  constructor (selector: string, center: LatLon, zoom: number) {
    // Map size
    const bbRect = document.querySelector(selector)!.getBoundingClientRect()
    this.width = bbRect.width
    this.height = bbRect.height
    // Regl instance
    this.regl = REGL(selector)
    // Map state
    this.zoom = zoom
    this.center = center
    this.centerPixel = latLonToPixel(center, zoom)
  }

  destroy () {
    this.regl.destroy()
  }

  shift (x: number, y: number) {
    this.centerPixel = PixelCoord.from(
      this.centerPixel.x + x,
      this.centerPixel.y + y,
      this.centerPixel.z
    )
    this.center = pixelToLatLon(this.centerPixel)
    this.draw()
  }

  moveTo (pos: LatLon) {
    this.center = pos
    this.centerPixel = latLonToPixel(pos, this.zoom)
    this.draw()
  }

  incrementZoom () {
    this.zoom += 1
    this.centerPixel = PixelCoord.from(
      this.centerPixel.x << 1,
      this.centerPixel.y << 1,
      this.zoom
    )
    this.draw()
  }

  decrementZoom () {
    this.zoom -= 1
    this.centerPixel = PixelCoord.from(
      this.centerPixel.x >> 1,
      this.centerPixel.y >> 1,
      this.zoom
    )
    this.draw()
  }

  async draw () {
    // Get tile list in the current view
    // TODO: PixelCoordはすでにこのクラスに保持しているので、それを渡す
    const tiles = calculateTilesInView(this.center, this.zoom, this.width, this.height)
    const images = await Promise.all(tiles.map(tile => loadImage(tileUrl.std(tile.tile))))

    const xSize = tileSize / this.width
    const ySize = tileSize / this.height
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
      const offsetX = t.offset.x / this.width
      const offsetY = t.offset.y / this.height
      return {
        texture,
        offsetX,
        offsetY
      }
    }))
  }
}
