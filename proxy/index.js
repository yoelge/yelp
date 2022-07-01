import express, {raw} from "express";
import {default as fetch,Headers} from "node-fetch";
import cors from "cors"
import bodyParser from "body-parser";

const app = express();
app.use(cors());
app.use(bodyParser.raw({
    type() {
        return true;
    }
}))

const port = 3001;

app.post('/', async (req, res) => {
    try {
        const proxyReqHeaders = new Headers();
        proxyReqHeaders.set("Content-Type", "application/json");
        proxyReqHeaders.set("Accept", "application/json");
        proxyReqHeaders.set("Authorization", req.headers["authorization"] ?? "");
        const proxyResp = await fetch("https://api.yelp.com/v3/graphql", {
            method: req.method,
            headers: proxyReqHeaders,
            body: req.body,
        });
        const data = await proxyResp.json();
        res.setHeader('Content-Type', proxyResp.headers.get("content-type") ?? 'application/json');
        res.setHeader('Cache-Control', proxyResp.headers.get("cache-control") ?? "max-age=0");
        res.status(200).end(JSON.stringify(data));
    } catch (error) {
        res.status(405).end(JSON.stringify(error));
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
