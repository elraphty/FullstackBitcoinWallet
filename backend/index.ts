import express, {Application} from 'express';
import routes from './routes';

const app: Application = express();

// Router files
app.use('/', routes);

const PORT = process.env.PORT || 8000;
  
app.listen(PORT, ():void => {
    console.log(`Server Running here 👉 https://localhost:${PORT}`);
});