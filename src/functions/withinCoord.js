export default function within(region, long, lat) {
  return (
    lat >= region.latitude - region.latitudeDelta / 2 &&
    lat <= region.latitude + region.latitudeDelta / 2 &&
    long >= region.longitude - region.longitudeDelta / 2 &&
    long <= region.longitude + region.longitudeDelta / 2
  )
}