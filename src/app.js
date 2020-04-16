//Import Section
const path = require('path')
const express = require('express')
const hbs = require('hbs')
const app = express()
require('../db/mongodb')
const customerRouter = require('../routes/customerRoutes')
const port = process.env.PORT || 3000

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))


app.use(express.json()) // for parsing application/json
app.use(customerRouter)

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Andrew Mead',
        errorMessage: 'Page not found.'
    })
})

app.listen(port,()=>
{
    console.log('Hello Node Server. You are running' )
})
