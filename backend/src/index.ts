import { Hono } from 'hono'
import { logger } from './middleware'
import usersGroup from './api/users'

const app = new Hono().basePath('/api')
app.use(logger)

app.route('/users', usersGroup)


app.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default app
