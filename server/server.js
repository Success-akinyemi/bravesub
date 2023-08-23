import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
//import connect from './database/connection.js'


import router from './router/route.js'

const app = express();


/**midleware */
app.use(express.json())
app.use(cors());
app.use(morgan('tiny'));
app.disable('x-powered-by');
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });
//http://127.0.0.1:5173

const port = process.env.PORT || 9000;

/**HTTP get request */
app.get('/', (req, res) => {
    res.status(201).json('Home GET Request')
})


/**API Routes */
app.use('/api/', router)
import './database/connection.js'




/**Start the server */
app.listen(port, () => {
    console.log(`server connected to http://localhost:${port}`)
})

