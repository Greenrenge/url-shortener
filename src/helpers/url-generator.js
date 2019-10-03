import { APP_URL } from '../config'
import axios from 'axios'
export async function createShortUrl(link) {
    if (!link) throw Error('Please input the correct url')
    const shortenUrl = await axios.post(`${APP_URL}/api`, {
        link
    })
    return shortenUrl
}