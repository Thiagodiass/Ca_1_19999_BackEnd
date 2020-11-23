
//initialization the express Web Application
var express = require('express')
//transfering the property of the function express to the constant app.
const app = express()
//giving the properties from MongoDb
const { MongoClient, ObjectId } = require("mongodb");
//Initialization the Url to access the database
const url = "mongodb+srv://ThiagoAdmin:Thi060741@cluster0.o3zpp.mongodb.net/Prison?retryWrites=true&w=majority";
//giving the properties to connect to the database
const client = new MongoClient(url, { useUnifiedTopology: true });
//The database to use in MongoDb
const dbName = "Prison"; 
//giving the properties to bodyParser
const bodyParser = require('body-parser')
//defining parameters to app.
app.use(bodyParser.urlencoded({ extended: false}))
//declare variable to interact if the database
let db;
//declare variable to interact if the database
let prisonerDb;
//home page route
run().catch(console.dir);
//Home page route
app.get('/',(req,res)=>{
    console.log(db)
    res.send("Welcome to the Prison")
})

//get prisioner from database
app.get('/prisoner',(req,res)=>{
    //function to find the prisoner just for the the firstname but i can change and choose the best way to find it.
    async function findPrisoner(){
        //initializate the constant with the name from the user and find if there are any prisoner    
        const foundPrisoner = await prisonerDb.findOne({firstName:"George"})
        //get the data from the prisoner
        res.json(foundPrisoner)
    };
    //calling the function findPrisoner
    findPrisoner();

})
//add prisoner for the database
app.post('/prisoner', (req, res)=>{
    //create a new Prisoner to the database
    let prisoner = new Prisoner(
        req.body.firstName, 
        req.body.age, 
        req.body.infraction, 
        req.body.cell,
        req.body.zone, 
        req.body.finishOfsentence, 
        req.body.startOfSentence, 
        req.body.solitaryConfinement, 
        req.body.goodBehaviour, 
        req.body.lastName, 
        req.body.physicalActivity
        )
    //Insert to the database    
    prisonerDb.insertOne(prisoner)
    //send OK to de screen 
    res.sendStatus(200)
})
// update data
app.put('/prisoner',(req,res)=>{
    //find Prisoner function
    async function findPrisoner(){
        //Error check
        try{
        //initializate the constant with the Id from the user and find if there are any prisoner    
        const foundPrisoner = await prisonerDb.findOne({"_id": ObjectId(req.body.id)})
        //check if there are any prisoner
        if(foundPrisoner !== null){
            //collect data from database
            let prisoner = new Prisoner(
                foundPrisoner.firstName,
                foundPrisoner.age,
                foundPrisoner.infraction,
                foundPrisoner.cell,
                foundPrisoner.zone,
                foundPrisoner.finishOfsentence,
                foundPrisoner.startOfSentence,
                foundPrisoner.solitaryConfinement,
                foundPrisoner.goodBehaviour,
                foundPrisoner.lastName,
                foundPrisoner.physicalActivity)
            //modify the data    
            prisoner.zone = req.body.zone;
            //check if there are any error    
            try{
                //send to the database id and the prisoner data modified
                const updateResult = await prisonerDb.updateOne({"_id":ObjectId(req.body.id)},
                {$set:prisoner})
            }
            //if there are any error going to show the error on the screen
            catch(err){
                console.log(err.stack)
            }
            //just showing that the data was successfull updated
            res.send("Zone Updated");
        }
        //if there are any error going to show that message
        else{
            res.send("Zone could not Updated");
        }
    }
    //if the input is incorrect or occur any error going to show this message 
    catch(err){
        res.send("Invalid Output")
    }
};
//calling the function findPrisoner
findPrisoner();
})

app.delete('/prisoner', (req, res) =>{
    //show message on the screen
    console.log('prisoner released');
    //showing the id that was insert
    console.log(req.body.id);
    //delete the prison from database
    prisonerDb.deleteOne({"_id":ObjectId(req.body.id)})
    //find Prisoner function
    async function findPrisoner(){
        //initializate the constant with the Id from the user and find if there are any prisoner    
        const foundPrisoner = await prisonerDb.findOne({"_id": ObjectId(req.body.id)})
        //check if they found any prisoner
        if(foundPrisoner !== null){
            //show the message on postman
            res.send("This prisoner already scape")
        }
        res.send("This prisoner was realeased")
    };
    //calling the function findPrisoner
    findPrisoner();
})

//function to get connection with the database
async function run(){
    try{
        //Asking for connection with the database
        await client.connect();
        //connect to the database
        db = client.db(dbName);
        //The database to use
        prisonerDb = db.collection("General");
        //start the application
        app.listen(3000);
    }
    //if have any error
    catch (err){
        console.log(err.stack);
    }
}
//initialization the prisoner form
class Prisoner{
    constructor(
        firstName,
        age,
        infraction,
        cell,
        zone,
        finishOfsentence, 
        startOfSentence,
        solitaryConfinement=false,
        goodBehaviour=false,
        lastName,
        physicalActivity=false)
        {
        this.firstName = firstName;
        this.age = age;
        this.infraction = infraction;
        this.cell = cell;
        this.zone = zone;
        this.finishOfsentence = finishOfsentence;
        this.startOfSentence = startOfSentence;
        this.solitaryConfinement = solitaryConfinement;
        this.goodBehaviour = goodBehaviour;
        this.lastName = lastName;
        this.physicalActivity = physicalActivity;
    }
    //this show on the screen the prisoner datas.
    printValues(){
        console.log(
            this.firstName, 
            this.lastName, 
            this.age, 
            this.infraction, 
            this.cell, 
            this.zone, 
            this.finishOfsentence, 
            this.startOfSentence,
            this.solitaryConfinement, 
            this.goodBehaviour, 
            this.physicalActivity
            );
    }
}