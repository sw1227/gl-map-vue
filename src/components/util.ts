import { TileCoord } from './geo'

// TODO: 名前的型で間違えてdegreeにradianを渡せないようにする
export type Degree = number
export type Radian = number

export function deg2rad (deg: Degree): Radian {
  return Math.PI / 180 * deg
}
export function rad2deg (rad: Radian): Degree {
  return 180 / Math.PI * rad
}

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
