import { TileCoord } from './geo'

// Load image from URL
export function loadImage (imageUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.src = imageUrl
    image.onload = async () => {
      resolve(image)
    }
  })
}

export const tileUrl = {
  std: (tile: TileCoord) => `https://cyberjapandata.gsi.go.jp/xyz/std/${tile.z}/${tile.x}/${tile.y}.png`
}
