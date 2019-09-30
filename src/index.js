import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import CssBaseline from '@material-ui/core/CssBaseline'
import App from './components/App'

// render to element root
ReactDOM.render(
        <React.Fragment>
            <CssBaseline />
            <Router>
                <App />
            </Router>
        </React.Fragment>,
    document.getElementById('root')
)

