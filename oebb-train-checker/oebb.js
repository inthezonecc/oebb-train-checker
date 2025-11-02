import {createClient} from 'hafas-client'
import {profile as oebb} from 'hafas-client/p/oebb/index.js'
import cron from 'node-cron'
import express from 'express'

// Create the ÖBB HAFAS client
const hafas = createClient(oebb, 'homeassistant')

// HTTP server for Home Assistant integration
const app = express()
const PORT = process.env.PORT || 3000

// Configuration from environment variables (for Home Assistant add-on)
const FROM_STATION = process.env.FROM_STATION || 'Tullnerfeld Bahnhof'
const TO_STATION = process.env.TO_STATION || 'Wien Hbf'
const DEPARTURE_HOUR = parseInt(process.env.DEPARTURE_HOUR || '6', 10)
const DEPARTURE_MINUTE = parseInt(process.env.DEPARTURE_MINUTE || '30', 10)

// Store latest train data
let latestTrainData = {
  status: 'pending',
  lastUpdate: null,
  trains: [],
  error: null
}

// Check if today is a weekday (Monday-Friday)
function isWeekday() {
  const day = new Date().getDay()
  return day >= 1 && day <= 5 // 1 = Monday, 5 = Friday
}

// Main function to check trains for today after configured time
// Returns data structure for API/console output
async function checkTrains() {
  const now = new Date()
  const today = new Date(now)
  today.setHours(DEPARTURE_HOUR, DEPARTURE_MINUTE, 0, 0) // Set to configured time today
  
  // Check if today is a weekday
  if (!isWeekday()) {
    const message = `${now.toLocaleDateString()} is not a weekday. Skipping train check.`
    console.log(message)
    latestTrainData = {
      status: 'skipped',
      lastUpdate: now.toISOString(),
      trains: [],
      error: null,
      message: message
    }
    return latestTrainData
  }

  const timeStr = `${DEPARTURE_HOUR.toString().padStart(2, '0')}:${DEPARTURE_MINUTE.toString().padStart(2, '0')}`
  console.log(`\n[${now.toLocaleString()}] Checking trains for ${today.toLocaleDateString()} after ${timeStr}...`)
  
  try {
    // 1️⃣ Resolve both stations
    const fromResults = await hafas.locations(FROM_STATION, {results: 1})
    const from = fromResults[0]
    
    // Search for destination station (handle special case for Wien Hbf)
    let toResults = await hafas.locations(TO_STATION, {results: 5})
    let to = toResults.find(s => 
      s.name?.includes('Hauptbahnhof') || 
      s.name === TO_STATION ||
      s.name?.toLowerCase().includes(TO_STATION.toLowerCase())
    ) || toResults[0]

    if (!from) {
      throw new Error(`Could not find station: ${FROM_STATION}`)
    }
    if (!to) {
      throw new Error(`Could not find station: ${TO_STATION}`)
    }

    console.log(`From: ${from.name} (${from.id})`)
    console.log(`To:   ${to.name} (${to.id})`)

    // 2️⃣ Query journeys from configured stations today after configured time
    const {journeys} = await hafas.journeys(from.id, to.id, {
      departure: today,
      results: 10, // Get more results to filter after configured time
      stopovers: true,   // include intermediate stops
      remarks: true      // include notes/warnings
    })

    if (!journeys || journeys.length === 0) {
      console.log('No journeys found')
      latestTrainData = {
        status: 'no_journeys',
        lastUpdate: now.toISOString(),
        trains: [],
        error: null,
        from: {name: from.name, id: from.id},
        to: {name: to.name, id: to.id}
      }
      return latestTrainData
    }

    // Filter journeys that depart after 6:30 AM
    const filteredJourneys = journeys.filter(j => {
      const leg = j.legs?.[0]
      if (!leg || !leg.departure) return false
      const departureTime = new Date(leg.departure)
      return departureTime >= today
    })

    if (filteredJourneys.length === 0) {
      console.log(`No trains found after ${timeStr}`)
      latestTrainData = {
        status: 'no_trains',
        lastUpdate: now.toISOString(),
        trains: [],
        error: null,
        from: {name: from.name, id: from.id},
        to: {name: to.name, id: to.id}
      }
      return latestTrainData
    }

    // Format delay in minutes
    const formatDelay = (delaySeconds) => {
      if (!delaySeconds || delaySeconds === 0) return null
      const minutes = Math.floor(delaySeconds / 60)
      return minutes > 0 ? minutes : 0
    }

    // Process and format train data
    const trains = filteredJourneys.slice(0, 10).map(j => {
      const leg = j.legs?.[0]
      if (!leg) return null

      const departureDelay = formatDelay(leg.departureDelay)
      const arrivalDelay = formatDelay(leg.arrivalDelay)
      const isCancelled = leg.cancelled === true
      
      const departureTime = leg.departure ? new Date(leg.departure).toISOString() : null
      const plannedDeparture = leg.plannedDeparture ? new Date(leg.plannedDeparture).toISOString() : null
      const arrivalTime = leg.arrival ? new Date(leg.arrival).toISOString() : null
      const plannedArrival = leg.plannedArrival ? new Date(leg.plannedArrival).toISOString() : null

      return {
        line: leg.line?.name || 'Unknown',
        lineId: leg.line?.id || null,
        cancelled: isCancelled,
        origin: {
          name: leg.origin?.name || 'Unknown',
          id: leg.origin?.id || null
        },
        destination: {
          name: leg.destination?.name || 'Unknown',
          id: leg.destination?.id || null
        },
        departure: {
          time: departureTime,
          planned: plannedDeparture,
          delayMinutes: departureDelay,
          platform: leg.departurePlatform || leg.plannedDeparturePlatform || null
        },
        arrival: {
          time: arrivalTime,
          planned: plannedArrival,
          delayMinutes: arrivalDelay,
          platform: leg.arrivalPlatform || leg.plannedArrivalPlatform || null
        },
        remarks: leg.remarks?.map(r => r.text).filter(Boolean) || []
      }
    }).filter(Boolean)

    // Update latest data
    latestTrainData = {
      status: 'success',
      lastUpdate: now.toISOString(),
      trains: trains,
      error: null,
      from: {name: from.name, id: from.id},
      to: {name: to.name, id: to.id},
      count: trains.length
    }

    // Console output (show first 3)
    console.log(`\nFound ${trains.length} train(s) after ${timeStr}. Showing next 3:`)
    trains.slice(0, 3).forEach(train => {
      console.log('----------------------------')
      console.log(`🚆 ${train.line}${train.cancelled ? ' ❌ CANCELLED' : ''}`)
      console.log(`From: ${train.origin.name}`)
      console.log(`   Departure: ${train.departure.time ? new Date(train.departure.time).toLocaleTimeString() : 'Unknown'}${train.departure.delayMinutes ? ` (+${train.departure.delayMinutes} min)` : ''}`)
      if (train.departure.platform) {
        console.log(`   Platform:  ${train.departure.platform}`)
      }
      console.log(`To:   ${train.destination.name}`)
      console.log(`   Arrival:   ${train.arrival.time ? new Date(train.arrival.time).toLocaleTimeString() : 'Unknown'}${train.arrival.delayMinutes ? ` (+${train.arrival.delayMinutes} min)` : ''}`)
      if (train.arrival.platform) {
        console.log(`   Platform:  ${train.arrival.platform}`)
      }
      if (train.remarks.length > 0) {
        console.log(`   Remarks:`)
        train.remarks.forEach(remark => {
          console.log(`     • ${remark}`)
        })
      }
    })

    return latestTrainData
  } catch (error) {
    console.error('Error checking trains:', error)
    latestTrainData = {
      status: 'error',
      lastUpdate: now.toISOString(),
      trains: [],
      error: error.message
    }
    return latestTrainData
  }
}

// REST API endpoints for Home Assistant
app.use(express.json())

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Get latest train data (main endpoint for Home Assistant)
app.get('/api/trains', (req, res) => {
  res.json(latestTrainData)
})

// Get next train (first train in the list)
app.get('/api/trains/next', (req, res) => {
  const nextTrain = latestTrainData.trains.length > 0 ? latestTrainData.trains[0] : null
  res.json({
    status: latestTrainData.status,
    lastUpdate: latestTrainData.lastUpdate,
    train: nextTrain
  })
})

// Trigger manual check
app.post('/api/trains/check', async (req, res) => {
  console.log('Manual train check triggered via API')
  const result = await checkTrains()
  res.json(result)
})

// Start HTTP server with error handling
try {
  app.listen(PORT, '0.0.0.0', () => {
    const timeStr = `${DEPARTURE_HOUR.toString().padStart(2, '0')}:${DEPARTURE_MINUTE.toString().padStart(2, '0')}`
    console.log(`🚂 Train checker API server started!`)
    console.log(`   From: ${FROM_STATION}`)
    console.log(`   To: ${TO_STATION}`)
    console.log(`   Departure time: ${timeStr}`)
    console.log(`   Server running on http://0.0.0.0:${PORT}`)
    console.log(`   API endpoint: http://localhost:${PORT}/api/trains`)
    console.log(`   Next train: http://localhost:${PORT}/api/trains/next`)
    console.log(`   Health check: http://localhost:${PORT}/health`)
    console.log(`\nSchedule: Every weekday (Monday-Friday) at ${timeStr} (Vienna time)`)
    console.log('Running initial check...\n')
  }).on('error', (err) => {
    console.error('ERROR: Failed to start server:', err)
    console.error('Port:', PORT)
    console.error('Error code:', err.code)
    process.exit(1)
  })
} catch (error) {
  console.error('ERROR: Failed to start server:', error)
  process.exit(1)
}

// Add error handlers to prevent silent crashes
process.on('uncaughtException', (error) => {
  console.error('ERROR: Uncaught Exception:', error)
  console.error('Stack:', error.stack)
  // Don't exit - keep server running
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('ERROR: Unhandled Rejection at:', promise)
  console.error('Reason:', reason)
  // Don't exit - keep server running
})

// Schedule to run every weekday at configured time
// Cron syntax: minute hour day-of-month month day-of-week
cron.schedule(`${DEPARTURE_MINUTE} ${DEPARTURE_HOUR} * * 1-5`, async () => {
  try {
    await checkTrains()
  } catch (error) {
    console.error('ERROR in scheduled train check:', error)
  }
}, {
  timezone: 'Europe/Vienna' // Vienna timezone
})

// Run once immediately if it's a weekday
if (isWeekday()) {
  checkTrains().catch((error) => {
    console.error('ERROR in initial train check:', error)
  })
}