import axios from 'axios'
export async function createShortUrl(link) {
    if (!link) throw Error('Please input the correct url')
    const res = await axios.post(`/api`, {
        link
    })
    const { shorten_url: shortenUrl } = res.data
    return shortenUrl
}