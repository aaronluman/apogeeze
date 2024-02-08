import express from 'express';
import bodyParser from 'body-parser';

import { connection } from './database/connection';
import { ListingQueries, ListingFilter } from './database/listing';
import { ListingService } from './service/listingService';

const listingRepository = new ListingQueries(connection);
const listingService = new ListingService(listingRepository);

const app = express();

const jsonParser = bodyParser.json();

app
    .get('/', async (req, res) => {
        listingRepository.list().then(result => res.json({listings: result}));
    })
    .post('/reprice', jsonParser, async (req, res) => {
        listingService.getBestMatches(req.body)
            .then(matches => listingService.reprice(req.body, matches))
            .then(result => res.json(result))
            .catch(error => {
                console.log(error);
                res.status(400).json({error: 'prices are too low'});
            });
    })
;

const port = Number(process.env.PORT || 8080);
app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening at localhost:${port}`);
});
