const express = require('express')
const cors = require('cors')
var jwt = require('jsonwebtoken');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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
        // const requestFoodsCollection = client.db("foodShareWebsite").collection("requestFood");
        const requestCollection = client.db("foodShareWebsite").collection("requestFoods");



        // jwt 
        app.post('/jwt',async(req,res)=>{
            const user = req.body;
            console.log(user)
            const token = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
            res.send(token)
        })



        // POST:> add food
        app.post("/addedFoods", async (req, res) => {

            const foodInfo = req.body;
            // console.log("Our Food" ,foodInfo)
            const result = await addedFoodsCollection.insertOne(foodInfo);
            res.send(result);

        })

        // POST:> add request food
        app.post("/requestFoods", async (req, res) => {
            const requestFoodInfo = req.body;
            console.log("Request Food", requestFoodInfo);
            const result = await requestCollection.insertOne(requestFoodInfo);
            res.send(result);
        });



        //GET:> load food item
        app.get('/addedFoods', async (req, res) => {
            try {
                const cursor = addedFoodsCollection.find()
                const result = await cursor.toArray();
                res.send(result);
            }
            catch (err) {
                res.send(err)
            }
        })
        //GET :> load single food
        app.get('/addedFoods/:id', async (req, res) => {
            try {

                const query = { _id: new ObjectId(req.params.id) }
                const result = await addedFoodsCollection.findOne(query)
                res.send(result)
            }
            catch (err) {
                console.log(err);
                res.send(err)
            }
        })
        // GET :> load request food
        app.get('/requestFoods', async (req, res) => {
            try {
                const cursor = requestCollection.find();
                const result = await cursor.toArray();
                res.send(result);
            } catch (err) {
                res.send(err);
            }
        });
        // GET :> load single request food
        app.get('/requestFoods/:id', async (req, res) => {
            try {
                const requestedId = req.params.id;
                console.log("Requested ID:", requestedId);
        
                const query = { _id: new ObjectId(requestedId) };
                console.log("Query:", query);
        
                const result = await requestCollection.findOne(query);
                console.log("Result:", result);
        
                res.send(result);
            } catch (err) {
                console.log(err);
                res.send(err);
            }
        });


        // Update a Food item
        app.put("/addedFoods/:id",async(req,res)=>{
          try{
            const id=req.params.id;
            // res.send(id)
            const query = { _id: new ObjectId(id) }
            const body = req.body;
            // console.log(body)
            const updateFood = {
                $set: {
                  ...body,
                },
              };
              const options = { upsert: true };

              const result = await addedFoodsCollection.updateOne(query,updateFood,options)
              res.send(result);

          }
          catch(err){res.send(err)}

        })
        // Update Request food status
        app.put('/requestFoods/:id', async (req, res) => {
            try {
              const id = req.params.id; // Get food item ID from the URL parameter
              
              // Find the food item by its ID and update its status to 'delivered'
              const filter = { _id: new ObjectId(id) };
              const update = { $set: { status: 'delivered' } };
          
              // Update the document in the collection
              const result = await requestCollection.updateOne(filter, update);
          
              if (result.modifiedCount > 0) {
                res.send({ message: 'Food status updated to delivered' });
              } else {
                res.status(404).send({ error: 'Food item not found' });
              }
            } catch (err) {
              res.status(500).send({ error: err.message });
            }
          });
          
          
              


        // Delete Add Food
        app.delete("/addedFoods/:id",async(req,res)=>{
            try{
                const id=req.params.id;
            // res.send(id)
            const query = { _id: new ObjectId(id) }
            const result= await addedFoodsCollection.deleteOne(query)
            res.send(result)
            }
            catch(err){res.send(err)}
        })
        // Delete request Food
        app.delete("/requestFoods/:id",async(req,res)=>{
            try{
                const id=req.params.id;
            console.log(id)
            const query = { _id: new ObjectId(id) }
            console.log(query)
            const result= await requestCollection.deleteOne(query)
            console.log(result)
            res.send(result)
            }
            catch(err){res.send(err)}
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