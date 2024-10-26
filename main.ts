import { Hono } from 'hono'

const app = new Hono()

// deno-lint-ignore no-explicit-any
app.get('/', (c: { text: (arg0: string) => any; }) => {
  return c.text('Hello Hono!')
})

Deno.serve(app.fetch)
