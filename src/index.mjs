import oExpress from "express";

const app = oExpress();

//middleware - funktion som anropas när vissa api requests hanteras
app.use(oExpress.json());

const PORT = process.env.PORT || 3006;

const mockUsers = [
    { id: 1, userName: "eva", displayName: "Eva" },
    { id: 2, userName: "jack", displayName: "Jack" },
    { id: 3, userName: "stan", displayName: "Stan" },
    { id: 4, userName: "alice", displayName: "Alice" },
    { id: 5, userName: "bob", displayName: "Bob" },
    { id: 6, userName: "charlie", displayName: "Charlie" },
    { id: 7, userName: "dave", displayName: "Dave" },
    { id: 8, userName: "eve", displayName: "Eve" },
    { id: 9, userName: "mallory", displayName: "Mallory" },
    { id: 10, userName: "trent", displayName: "Trent" }
];

/*
HTTP-requests basics: GET POST PUT PATCH DELETE
*/

//GET

//     path , request handler       
app.get("/", (_request, _response) => {
    //ex 1
    _response.status(201).send('Hello world!')
});

//query strings and query params ex. http://localhost:3006/api/users?filter=userName&value=h 

app.get("/api/users", (_request, _response) => {
    //hämtar filter och value ur query objektet
    const {query: {filter, value},} = _request; 

    
    if(filter && value){
        return _response.send( //skickar i en array av det som matchar value
            mockUsers.filter((user) => user[filter].includes(value))
        );
    }
    //om värdena är undefined
    return  _response.send(mockUsers);
});

app.get("/api/products", (_request, _response) => {
    _response.send([{id: 1, name: "chick breast", price: "12.99"}])
});

//route parameters
app.get("/api/users/:id", (_request, _response)=> {
    console.log(_request.params);
    //omvanla till siffra
    const parsedId = parseInt(_request.params.id);

    //hänglen och livrem visar att användaren angett något annat än siffror
    if(isNaN(parsedId)) {
        return _response.status(400).send('Bad Request, 400')
    };

    const findUser = mockUsers.find((user) => user.id === parsedId);
    if (!findUser) return _response.status(404).send('404 Page not found');
    return _response.send(findUser);
});

//POST 
//      samma route, men annan metod
app.post("/api/users", (_request, _response) => {
    console.log(_request.body)

    //destructure request body (se thunder client)
    const {body} = _request;

    //skapa ny användare med id osv
    const newUser = { id: mockUsers[mockUsers.length - 1].id +1, ...body};
    mockUsers.push(newUser);
    return _response.status(201).send(newUser);
})

//PUT - uppdaterar hela resursen
/*
VIKTIGT: när en put-reqest hanteras måste alla egenskaper och värden
inkluderas: { "userName": "jackson", "displayName": "Jack" }

fel: {userName: "jackson"} - kommer skriva över all tidigare data
*/
app.put("/api/users/:id", (_request, _response) => {
    //deconstruct body från req och id ur params ur req
    const {
        body, 
        params: {id}} 
        = _request;

    //NaN
    const parsedId = parseInt(id); //bad request
    if(isNaN(parsedId)) return _response.sendStatus(400);

    const findUserIndex = mockUsers.findIndex(
        (user) => user.id === parsedId
    );

    //findIndex() returnerar -1 om index inte hittas - error
    if(findUserIndex === -1) return _response.sendStatus(404);

    //uppdaterar rätt user baserat på index
    mockUsers[findUserIndex] = {
        //behåller id
        id: parsedId,
        //spreadar body (det som skickas i put-requesten)
        ...body
    }
    return _response.sendStatus(200);
});

//PATCH - uppdaterar viss (partial) befintlig data
app.patch("/api/users/:id", (_request, _response) => {
    //deconstruct body från req och id ur params ur req
    const {
        body, 
        params: {id}} 
        = _request;

    //NaN
    const parsedId = parseInt(id); //bad request
    if(isNaN(parsedId)) return _response.sendStatus(400);

    const findUserIndex = mockUsers.findIndex(
        (user) => user.id === parsedId
    );

    //findIndex() returnerar -1 om index inte hittas - error
    if(findUserIndex === -1) return _response.sendStatus(404);

    /*
    iom spread av båda gamla och nya datan överskrids bara de specificerade
    key/values som anges t.ex: {"displayName: "Gerald"}
    ==> då ändras bara displayName och allt annat är oförändrat
    */
    mockUsers[findUserIndex] = {
        //spread allt
        ...mockUsers[findUserIndex],
        //spread body
        ...body
    }
    return _response.sendStatus(200);
});

//DELETE
app.delete("/api/users/:id", (_request, _response) => {
    //brukar inte deconstruct en payload/reqest.body när man raderar

    //deconstruct id ur params ur request
    const {
        params: {id}
    } = _request;

    //NaN - undersäker bad request
    const parsedId = parseInt(id); //bad request
    if(isNaN(parsedId)) return _response.sendStatus(400);

    //hitta anändarens index baserat på id
    const findUserIndex = mockUsers.findIndex(
        (user) => user.id === parsedId
    );

    //findIndex() returnerar -1 om index inte hittas - error
    if(findUserIndex === -1) return _response.sendStatus(404);

    //radera användare ur vår array (splice - tar bort mellan index num, num)
    mockUsers.splice(findUserIndex, 1);
    return _response.sendStatus(200);
});


app.listen(PORT, () => {
    console.log(`Running on port: ${PORT}`)
});

