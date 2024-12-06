import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import dotenv from 'dotenv'
import admin from './admin'
import form from './form'

const app = new Hono()
dotenv.config()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route("/admin", admin)
app.route("/form", form)

const port = 3000
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})
