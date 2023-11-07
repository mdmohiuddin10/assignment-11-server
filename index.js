const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;

// middleway
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3gsgkud.mongodb.net/?retryWrites=true&w=majority`;

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const foodCollection = client.db('foodCharity').collection('allfood')
    const requestCollection = client.db('foodCharity').collection('requestfood')


    // food collection
    app.post('/allfood', async (req, res) => {
      const newProduct = req.body;
      console.log(newProduct);
      const result = await foodCollection.insertOne(newProduct)
      res.send(result)

    })

    app.get('/allfoods', async (req, res) => {
      const curser = foodCollection.find()
      const result = await curser.toArray()
      res.send(result)
    })

    app.get('/allfoods/:id', async (req, res) => {
      const id = req.params.id;
      const qurey = { _id: new ObjectId(id) }
      const result = await foodCollection.findOne(qurey)
      res.send(result)
    })

    // request collection
    app.post('/requestFood', async (req, res) => {
      const newProduct = req.body;
      // console.log(newProduct);
      const result = await requestCollection.insertOne(newProduct)
      res.send(result)
    })

    app.get('/requestFood', async (req, res) => {
      console.log(req.query);
      let query = {};
      if (req.query?.userEmail) {
        query = { email: req.query.userEmail }
      }
      const result = await requestCollection.find(query).toArray();
      res.send(result)
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('server is running')
})

app.listen(port, () => {
  console.log(`food server is running on port ${port}`);
})