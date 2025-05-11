import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { handle } from 'hono/vercel';
import { getNews } from '../module/getNews';

export const config = {
  runtime: 'edge'
}

const app = new Hono().basePath('')

app.use(cors())

app.get('/', (c) => {
  return c.body('<h1>Tech Glimpse Server Running</h1>')
})

app.get('/news', async (c) => {
  const news = await getNews();
  
  return c.json(news)
})


export default handle(app)
