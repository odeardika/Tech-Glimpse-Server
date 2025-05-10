import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { getNews } from '../module/getNews';

const app = new Hono()
app.use(cors())

app.get('/', (c) => {
  return c.text('Tech Glimpse Server Running')
});

app.get('/news', async (c) => {
  const news = await getNews();
  
  return c.json(news)
})

export default app
