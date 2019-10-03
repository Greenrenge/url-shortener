import { TextField, Button, Grid, Divider, Chip } from '@material-ui/core'
import React from 'react'
import { SaveAlt } from '@material-ui/icons'
import { createShortUrl } from '../helpers/url-generator'

// const mockApi = (link) => new Promise((resolve, reject) => {
//     if (!link) {
//         reject(Error('please input the correct url'))
//     }
//     setTimeout(() => resolve('https://tiny/1234'), 3000)
// })

class ShortenForm extends React.Component {
    state = {
        link: '',
        shortenUrl: '',
        loading: false,
        errorMsg: ''
    }

    async shortenHandler() {
        this.setState({
            ...this.state,
            loading: true
        })
        try {
            const url = await createShortUrl(this.state.link)
            this.setState({
                link: this.state.link,
                shortenUrl: url,
                loading: false,
                errorMsg: ''
            })
        } catch (err) {
            this.setState({
                link: this.state.link,
                shortenUrl: '',
                loading: false,
                errorMsg: err.message
            })
        }
    }
    render() {
        return <React.Fragment>
            <Grid container spacing={2}>
                <Grid item md={8}>
                    <TextField
                        id="url"
                        label="Destination URL"
                        style={{ margin: 8 }}
                        placeholder="please insert url.."
                        helperText="ex. https://www.google.co.th"
                        fullWidth
                        margin="normal"
                        value={this.state.link || undefined}
                        variant="filled"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={e => this.setState({ ...this.state, link: e.target.value })}
                    />
                </Grid>
                <Grid item md={4}>
                    <Button variant="contained" color="primary" className={this.props.classes.button} onClick={this.shortenHandler.bind(this)}>
                        <SaveAlt className={this.props.classes.leftIcon} />
                        Shorten
                        </Button>
                </Grid>
            </Grid>
            <Divider variant="middle" className={this.props.classes.divider} />
            <h2>{
                this.state.loading
                    ?
                    "Loading ...."
                    : this.state.errorMsg
                        ?
                        `${this.state.errorMsg}`
                        : this.state.shortenUrl}
            </h2>
        </React.Fragment>

    }
}

export default ShortenForm