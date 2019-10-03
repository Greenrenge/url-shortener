import axios from 'axios'
export async function createShortUrl(link) {
    if (!link) throw Error('Please input the correct url')
    const shortenUrl = await axios.post(`/api`, {
        link
    })
    console.log('GREEN==> ', JSON.stringify(shortenUrl))
    return shortenUrl
}