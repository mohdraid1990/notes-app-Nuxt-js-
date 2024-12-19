export async function getCurrentLocation() {
  try {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject)
    })
    
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`
    )
    const data = await response.json()
    return data.display_name || 'Unknown location'
  } catch (error) {
    console.error('Error getting location:', error)
    return 'Location not available'
  }
}

export function formatDateTime(date, locale = 'en') {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    calendar: 'gregory'
  }).format(new Date(date))
}