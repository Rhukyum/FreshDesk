import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function isAdmin(): Promise<boolean> {
  if (process.platform !== 'win32') return false
  try {
    await execAsync('net session', { timeout: 5000 })
    return true
  } catch {
    return false
  }
}

export async function getSystemInfo(): Promise<{
  isAdmin: boolean
  username: string
  hostname: string
  os: string
}> {
  const adminStatus = await isAdmin()
  let username = process.env.USERNAME || process.env.USER || 'Unknown'
  let hostname = process.env.COMPUTERNAME || 'Unknown'
  let os = `Windows ${process.env.OS || ''}`

  try {
    const { stdout } = await execAsync('systeminfo | findstr /B /C:"OS Name" /C:"OS Version"', {
      timeout: 10000
    })
    const lines = stdout.split('\n').map((l) => l.trim())
    const osNameLine = lines.find((l) => l.startsWith('OS Name'))
    if (osNameLine) {
      os = osNameLine.replace('OS Name:', '').trim()
    }
  } catch {
    // keep defaults
  }

  return { isAdmin: adminStatus, username, hostname, os }
}
