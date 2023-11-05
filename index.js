const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express()
const port = process.env.PORT || 5000;



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ojnnavp.mongodb.net/?retryWrites=true&w=majority`;

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

    await client.connect();

    const addedFoodsCollection = client.db("foodShareWebsite").collection("addedFoods");
    // POST:> add food
app.post("/addedFoods",async(req,res)=>{
  
        const foodInfo =req.body;
        console.log("Our Food" ,foodInfo)
        const result = await addedFoodsCollection.insertOne(foodInfo);
        res.send(result);
    
})
    // Connect the client to the server	(optional starting in v4.7)

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





//middleware
app.use(cors());
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Food Sharing Website is running')
})

app.listen(port, () => {
  console.log(`FoodShare Website is running on port ${port}`)
})