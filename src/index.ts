import express from 'express';

const app = express();

app.get('/', (req, res) => {
    res.json({hello: 'world'});
});

const port = Number(process.env.PORT || 8080);
app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening at localhost:${port}`);
});
