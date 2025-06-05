import * as cheerio from 'cheerio';
import axios from 'axios';
import News from '../types/News';

function getFavicon(url: string, favicon: string){
    const urlParts = url.split('/');

    return urlParts[0]+'//' + urlParts[2] + favicon;
}

async function getNewsMetadata(url: string) {
    try {
        const html = await axios.get(url);
        const $ = cheerio.load(html.data);

        // get meta data
        const title = $('meta[property="og:title"]').attr('content');
        const description = $('meta[property="og:description"]').attr('content');
        const tempImage = $('meta[property="og:image"]').attr('content'); 
        const favicon = $('link[rel="shortcut icon"]').attr('href');

        const image = tempImage ? (tempImage.startsWith('http') ? tempImage : new URL(tempImage, url).href) : null;

        return { 
            title, 
            description, 
            image, 
            favicon: favicon ? getFavicon(url, favicon) : null,
        };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            // console.error('Error fetching metadata:', error.message);
        }
        else if (error instanceof TypeError && error.message === 'Invalid URL') {
            // console.error('Invalid URL:', url);
        } else if (error instanceof Error && 'code' in error && (error as { code: string }).code === 'ECONNRESET') {
            // console.error('Connection was reset while fetching metadata:', url);
        } else {
            // console.error('Unexpected error:', error);
        }
        return {status: 500, message: 'Error fetching metadata'};
    }
        
}

export async function getListNews(url: string) {
    const data = await fetch(url);

    return data.json();
}

export async function getNews() {
    const listNewsId = await getListNews("https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty");
    const data: News[] = await Promise.all(listNewsId.slice(0, 30).map(async (id: number) => {
        const news = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`);
        const metadata = await getNewsMetadata(news.data.url);
        if (metadata.status === 500) {
            return {
                id: news.data.id,
                title: news.data.title,
                url: news.data.url,
                description : null,
                image: null,
                favicon: null, 
            };
        }
    
        return {
            id: news.data.id,
            title: news.data.title,
            url: news.data.url,
            description : metadata.description,
            image: metadata.image,
            favicon: metadata.favicon, 
        };
    }));

    return data;
}

// getNews()
// .then(r => console.log(r))
// .catch(e => console.error(e))