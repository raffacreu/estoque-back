/** CRUD
 *  POST => Inserir um dado
 *  GET => Buscar um dado
 *  PUT => Alterar um dado
 *  DELETE => Deletar um dado
 */

/**
 * Body => Sempre que eu quiser enviar dados para minha aplicação
 * Params => /product/1283761273687635
 * Query => /product?id=1283761273687635value=2197318
 */

const express = require("express");
const {randomUUID} =require("crypto");
const { request } = require("http");
const fs  = require("fs");

const app = express();
app.use(express.json())

let products = [];
fs.readFile("products.json", "utf8", (err, data) => {
    if(err){
        console.log(err)
    }else{
        products = JSON.parse(data);
    }
});

app.post("/products", (resquest, response) => {
    //nome e preço => name e price
    
const { name, price } = resquest.body;

const product = {
        name,
        price,
        id: randomUUID(),
    }
    products.push(product);

    productFile()
    return response.json(product)
});

app.get("/products", (resquest, response) => {
    return response.json(products);
});

app.get("/products/:id", (resquest, response) => {
    const {id} = resquest.params;
    const product = products.find((product) => product.id === id);
    return response.json(product);
});

app.put("/products/:id", (request, response) => {
    const {id} = request.params;
    const { name, price } = request.body;

    const productIndex = products.findIndex((product) => product.id === id);
    products[productIndex] = {
        ...products[productIndex],
        name,
        price,
    }

    productFile()
    return response.json({ message: "Produto alterado com sucesso"})
});

app.delete("/products/:id", (request, response) => {
    const {id} = request.params;
    const productIndex = products.findIndex((product) => product.id === id);

    products.splice(productIndex, 1);

    productFile();

    return response.json({ 
        message: "Produto removido com sucesso!"
    })
});

function productFile() {
    fs.writeFile("products.json", JSON.stringify(products), (err) => {
        if(err) {
            console.log(err);
        }else{
            console.log("Produto inserido com sucesso!")
        }
    })
}

app.listen(4002,  () => console.log('Servidor está rodando na porta 4002'));

