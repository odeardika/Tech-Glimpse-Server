import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { handle } from 'hono/vercel';
import { getNews } from '../module/getNews';
import homeView from '../view/homeView';
import sendEmail from '../module/sendEmail';
import { getEmail } from '../module/sendEmail';

export const config = {
  runtime: 'edge'
}

const app = new Hono().basePath('')

app.use(cors())

app.get('/', homeView)

app.get('/news', async (c) => {
  const news = await getNews();
  
  return c.json(news);
})

app.get('/email', getEmail);


export default handle(app)
