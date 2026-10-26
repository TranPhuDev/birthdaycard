export const mapEmbedUrl = query =>
  `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=16&output=embed`

export const directionsUrl = query =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`
