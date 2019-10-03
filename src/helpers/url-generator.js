import axios from 'axios'
export async function createShortUrl(link) {
    if (!link) throw Error('Please input the correct url')
    const { shorten_url: shortenUrl } = await axios.post(`/api`, {
        link
    })
    return shortenUrl
}