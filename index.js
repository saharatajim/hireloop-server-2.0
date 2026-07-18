const express = require('express');
const cors = require('cors')
const app = express()
require('dotenv').config()

app.use(cors())
app.use(express.json())

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGODB_URI
const port = 5000


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    const db = client.db("hireloopdb");
    const jobsCollection = db.collection("jobs"
    )
    const companyCollection=db.collection("company")

    app.get('/api/jobs', async (req, res) => {
      const query = {};

      if (req.query.companyId) {
        query.companyId = req.query.companyId;
      }
      if (req.query.status) {
        query.status = req.query.status;
      }

      const cursor = jobsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post('/api/jobs', async (req, res) => {

      const job = req.body
      const result = await jobsCollection.insertOne(job)
      res.send(result)

    })
    //company
      app.get('/api/my/companies', async (req, res) => {
      const query = {};

      if (req.query.recruiterUniqueId) {
        query.recruiterUniqueId = req.query.recruiterUniqueId;
      }
      if (req.query.recruiterMail) {
        query.recruiterMail = req.query.recruiterMail;
      }

      const cursor = companyCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post('/api/companies', async (req, res) => {

      const company = req.body
      const result = await companyCollection.insertOne(company)
   res.send(result)
    })

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})