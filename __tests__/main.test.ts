import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import dotenv from 'dotenv'

dotenv.config()

// shows how the runner will run a javascript action with env / stdout protocol
test('test runs', () => {
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecSyncOptions = {
    env: process.env,
  }
  console.log(cp.execSync(`node ${ip}`, options).toString())
})
