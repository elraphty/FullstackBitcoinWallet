import express, {Application} from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import routes from './routes';
import dotenv from 'dotenv';
dotenv.config();

const app: Application = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Router files
app.use('/', routes);

const PORT = process.env.PORT || 8000;
  
app.listen(PORT, ():void => {
    console.log(`Server Running here 👉 https://localhost:${PORT}`);
});