const express = require('express')
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()


//port
const port =process.env.PORT ||5000

//middleware
app.use(cors());
app.use(express.json());

//
//

// const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.SECRET_KEY}@cluster0.asuxxr9.mongodb.net/?retryWrites=true&w=majority`;
const uri = "mongodb+srv://chocolateShop:6MIZFtQmEKolI5As@cluster0.asuxxr9.mongodb.net/?retryWrites=true&w=majority";
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

const chocolateCollection=client.db("chocolatesDB").collection('chocolates')

app.get('/chocolates',async(req,res)=>{
  const cursor =chocolateCollection.find();
        const users= await cursor.toArray();
        res.send(users);
})

app.get('/chocolates/:id',async(req,res)=>{
  const id=req.params.id;
  const query = { _id: new ObjectId(id) };
  const result= await chocolateCollection.findOne(query);
  res.send(result)

})

app.post('/chocolates',async(req,res)=>{
    const newChocolate=req.body;
    const result=await chocolateCollection.insertOne(newChocolate)
    res.send(result)
})
app.put('/chocolates/:id',async(req, res) => {
  const id=req.params.id;
  console.log(id)
  const user=req.body;
  const query = { _id: new ObjectId(id) };
  const options = { upsert: true };
  const updateUSer = {
   $set: {
     name:user.name,
     country:user.country,
     photo:user.photo,
     select:user.select
   },
 };
 const result= await chocolateCollection.updateOne(query, updateUSer,options)
 res.send(result);
})

app.delete('/chocolates/:id',async(req,res)=>{

     const id = req.params.id
      const query = { _id: new ObjectId(id) };
      const result=await chocolateCollection.deleteOne(query);
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


app.get('/',  (req, res)=> {
  res.send('hello world')
})

app.listen(port,()=>{
    console.log(`server listening on port ${port}`)
})