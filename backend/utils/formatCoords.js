function formatCoords(coords) {
    // Check if coordinates are numbers, truncate to 6 digits if so}
    let cleanCoords, _lat, _long
    let lat, long

    if (coords) {
        // Trim spaces and split by comma `,`
        cleanCoords = coords.replace(/\s/g, '')
        _lat = cleanCoords.split(',')[0]
        _long = cleanCoords.split(',')[1]

        // Convert latitude to number and truncate, or if not possible return raw input
        if (_lat && _lat.length > 0 && !isNaN(parseFloat(_lat))) {
            lat = parseFloat(_lat).toFixed(6)
        } else {
            lat = _lat
        }

        // Convert longitude to number and truncate, or if not possible return raw input
        if (_long && _long.length > 0 && !isNaN(parseFloat(_long))) {
            long = parseFloat(_long).toFixed(6)
        } else {
            long = _long
        }

        // Return formatted coordinate string
        return `${lat}, ${long}`
    } else {
        // Can't format, just return the raw input
        return coords
    }
}

module.exports = formatCoords
