import express from 'express';
import { engine as handlebars } from 'express-handlebars';
import bodyParser from 'body-parser';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { formatarData, ifEquals } from '../helpers/helper.js';
import { router } from '../routes.js';

const app = express();

initializeApp({
  credential: cert("agendamentos-node-firebase-adminsdk-awqwe-85be525718.json")
})

const db = getFirestore()

app.engine("handlebars", handlebars({
    helpers: {
        formatarData,
        ifEquals
    }
}))
app.set("view engine", "handlebars")

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use(router);

// SERVIDOR
app.listen(8081, () => { console.log("\n\nhttp://localhost:8081\n\n") })

export { db };