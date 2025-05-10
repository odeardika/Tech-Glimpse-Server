import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { getNews } from '../module/getNews';

export const config = {
  runtime: 'edge'
}

const app = new Hono().basePath('/api')

app.get('/', (c) => {
  return c.body('<h1>Tech Glimpse Server Running</h1>')
})

app.get('/news', async (c) => {
  const news = await getNews();
  
  return c.json(news)
})


export default handle(app)
