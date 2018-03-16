/** Configurações do AWS*/

var AWS = require('aws-sdk');

let awsConfig = {
    "region": "us-east-2",
    "endpoint": "http://dynamodb.us-east-2.amazonaws.com",
    "accessKeyId":"coloque o seu accessKeyId aqui",
    "secretAccessKey": "coloque o seu secrect key aqui"
}

AWS.config.update(awsConfig);
let docClient = new AWS.DynamoDB.DocumentClient();


/** Configurações do servidor node.js */
var express = require('express');
var app = express();
var port = 8080;

app.set('view engine', 'ejs');

app.get('/', function(req, res){
    res.render("main.ejs");
});

app.get('/read', function(req, res){

    if(req.query.email){
    let fetchOneByKey = function(){
        var params = { 
            TableName: "users", 
            Key: { "email_id": req.query.email}};
        

        docClient.get(params, function (err, data){
            if(err){
                console.log("Error:",JSON.stringify(err, null, 2));
            } else {
                
                res.send(""+
                        "<b>Nome:"+ data.Item.nome+" <br>"+
                        "<b>Email:"+ data.Item.email_id+"</b><br>"+
                        "<img src="+data.Item.imagem+">"
                    );
            }
        });
    }
    fetchOneByKey();
} else {
    res.render("readpage.ejs",{"Titulo":"Consultar dados de usuario:"});
}
});

app.get('/write', function(req, res){
    if(req.query.nome && req.query.email && req.query.imagem){
    let save = function(){
        var input = {
            "nome":req.query.nome,
            "email_id": req.query.email,
            "imagem": req.query.imagem,
        };
    
        var params = {
            TableName: "users",
            Item: input
        }
    
        docClient.put(params, function(err, data){
            if(err){
                console.log("Error:", JSON.stringify(err, null, 2));
            } else {
                res.send("Dados enviados!");
            }
        });
    }
    
    save();
    } else {
        res.render("writepage.ejs",{"Titulo":"Enviar dados de usuario:"});
    }
})

app.get('/delete', function(req, res){
    let remove = function(){
        
    var params = {
        TableName: "users",
        Key: { "email_id": req.query.email}};

        docClient.delete(params, function(err, data){
            if(err){
                console.log(err);
            }else{
                res.send("O usuario "+req.query.email+" foi deletado!");
            }
        });
    }

    remove();
    
});



app.listen(port);
console.log("Servidor rodando na porta:", port);
