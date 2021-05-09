import { Degree, deg2rad, rad2deg } from './util'

// Tile: 256 x 256 pixels
export const tileSize = 256

// 経度の範囲を[-180, +180)に正規化
export function normalizeLongitude (deg: Degree): Degree {
  return deg - 360 * Math.floor((deg + 180) / 360)
}

// ----- タイル座標、ピクセル(UI上の)、緯度経度、ピクセル座標 の型と値を宣言(Companion object pattern) -----
// タイル座標
export type TileCoord = {
  z: number
  x: number
  y: number
}
export const TileCoord = {
  from (z: number, x: number, y: number): TileCoord {
    return { z, x, y }
  }
}

// 画面(UI)上のピクセル位置
export type PixelPos = {
  x: number
  y: number
}
export const PixelPos = {
  from (x: number, y: number): PixelPos {
    return { x, y }
  }
}

// 緯度経度のペア
export type LatLon = {
  lat: Degree,
  lon: Degree
}
export const LatLon = {
  from (lat: Degree, lon: Degree): LatLon {
    return {
      lat,
      lon: normalizeLongitude(lon)
    }
  }
}

// ピクセル座標: 特定のズームレベルにおいて地理的な位置をピクセル単位で特定する座標
export type PixelCoord = {
  x: number
  y: number
  z: number
}
export const PixelCoord = {
  from (x: number, y: number, z: number): PixelCoord {
    return {
      x: Math.round(x),
      y: Math.round(y),
      z: z
    }
  }
}

// ----- 座標変換に関する関数たち -----
// 特定のズームレベルのもとで、緯度経度をピクセル座標に変換
export function latLonToPixel (center: LatLon, zoom: number): PixelCoord {
  const L: Degree = 85.05112878
  // this.lon is normalized in [-180, +180)
  const x = (1 << (zoom + 7)) * (center.lon / 180 + 1)
  const y = (1 << (zoom + 7)) / Math.PI * (
    -Math.atanh(Math.sin(deg2rad(center.lat))) + Math.atanh(Math.sin(deg2rad(L)))
  )
  return PixelCoord.from(x, y, zoom)
}

// 与えられたピクセル座標を含むタイルのタイル座標（同一のズームレベルのもの）を取得
function getTileFromPixel (pixel: PixelCoord): TileCoord {
  const tx = Math.floor(pixel.x / tileSize)
  const ty = Math.floor(pixel.y / tileSize)
  return TileCoord.from(pixel.z, tx, ty)
}

// 与えられたピクセル座標を緯度経度に変換
export function pixelToLatLon (pixel: PixelCoord): LatLon {
  const L: Degree = 85.05112878
  const lat = rad2deg(Math.asin(Math.tanh(
    -(Math.PI * pixel.y / (1 << (pixel.z + 7))) + Math.atanh(Math.sin(deg2rad(L)))
  )))
  const lon = 180 * (pixel.x / (1 << (pixel.z + 7)) - 1)
  const latlon = LatLon.from(lat, lon)
  return latlon
}

// 与えられたピクセル座標について、同一ズームレベルでその点を含むタイル内でのピクセル位置を取得
function getPixelInTile (pixel: PixelCoord): PixelPos {
  return PixelPos.from(
    pixel.x % tileSize,
    pixel.y % tileSize
  )
}

// ----- 地図表示関連 -----
// 画面におけるタイルの表示情報: タイル座標とUI上オフセットを保持する
interface TileCell {
  tile: TileCoord,
  offset: PixelPos
}

// 与えられた画面表示条件下で、必要なタイルのリストと各タイルのUI上の表示位置を計算
export function calculateTilesInView (center: LatLon, zoom: number, width: number, height: number) {
  // 与えられたズームレベルと画面中心の緯度経度から、画面上中心ピクセルのピクセル座標を取得
  // 画面上中心ピクセルcenterPixelは、floor(width/2), floor(height/2)番目のピクセルとする
  const centerPixel = latLonToPixel(center, zoom)
  // 中心ピクセルの属するタイル座標と、そのタイルにおける中心ピクセルの位置を計算
  const centerTile = getTileFromPixel(centerPixel)
  const centerOffset = getPixelInTile(centerPixel)

  // 中心ピクセルと画面上の地図サイズ(px)から、北西端と南東端のピクセルのピクセル座標を計算
  // North-West
  const nwPixel = PixelCoord.from(
    centerPixel.x - Math.floor(width / 2),
    centerPixel.y - Math.floor(height / 2),
    zoom
  )
  const nwTile = getTileFromPixel(nwPixel)
  // South-East
  const sePixel = PixelCoord.from(
    centerPixel.x + width - Math.floor(width / 2),
    centerPixel.y + height - Math.floor(height / 2),
    zoom
  )
  const seTile = getTileFromPixel(sePixel)

  // 画面表示が必要なタイルのリストと、各タイルの表示位置を計算
  const tiles: TileCell[] = []
  for (let x = nwTile.x; x <= seTile.x; x++) {
    for (let y = nwTile.y; y <= seTile.y; y++) {
      // オフセットは、中心ピクセルを含むタイルのオフセットをタイル整数個分ずらしたもの（左上原点）
      tiles.push({
        tile: TileCoord.from(zoom, x, y),
        offset: PixelPos.from(
          width / 2 + tileSize * (x - centerTile.x) - centerOffset.x,
          height / 2 + tileSize * (y - centerTile.y) - centerOffset.y
        )
      })
    }
  }
  return tiles
}
