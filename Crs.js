const { MongoClient, ObjectId } = require("mongodb");

const mongodb = require("mongodb");

const uri = `mongodb+srv://barroso:datab777@twt.h4usxxj.mongodb.net/?retryWrites=true&w=majority&appName=Twt`;

const client = new MongoClient(uri, { useNewUrlParser: true });

//MongoDB 🡹

const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const { render } = require('ejs');

var app = express();
app.use(express.static('./public'));
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


var server = http.createServer(app);
server.listen(80);

console.log("Servidor rodando....");

app.get("/", function (requisicao, resposta) {
    resposta.redirect("./cadastro.html");

})

app.post("/cdtr_user", function (requisicao, resposta) {

    const db_login = requisicao.body.cdtr_user;
    const db_senha = requisicao.body.cdtr_senha;

    client.db("SiteCarros").collection("users").insertOne
        ({
            db_login: requisicao.body.cdtr_user,
            db_senha: requisicao.body.cdtr_senha
        })

    console.log(db_login, db_senha)

})

app.post("/login_user", function (requisicao, resposta) {

    var login = requisicao.body.login_user;
    var senha = requisicao.body.login_senha;

    client.db("SiteCarros").collection("users").findOne({ db_login: login })
        .then(user => {
            if (user) {
                if (senha == user.db_senha) {
                    console.log('Login bem-sucedido:', login);
                    resposta.render("loginresp.ejs", { mensagem: "Login com sucesso!", login });
                } else {
                    console.log('Falha no login: senha incorreta para', login);
                    resposta.render("loginresp.ejs", { mensagem: "Login ou senha incorretos" });
                }
            }
        });
    console.log(login, senha)

})

app.post("/carro_cdtr", function (requisicao, resposta) {

    const db_marca = requisicao.body.marca;
    const db_modelo = requisicao.body.modelo;
    const db_ano = requisicao.body.ano;
    const db_quantidade = requisicao.body.qtd_car;

    client.db("SiteCarros").collection("carros").insertOne
        ({
            db_marca: requisicao.body.marca,
            db_modelo: requisicao.body.modelo,
            db_ano: requisicao.body.ano,
            db_imagem: requisicao.body.url,
            db_quantidade: requisicao.body.qtd_car
        })

    console.log(db_marca, db_modelo, db_ano, db_quantidade)

})

app.post("/carro_atl", function (requisicao, resposta) {

    client.db("SiteCarros").collection("carros").updateOne(
        {
            db_marca: requisicao.body.marca_old,
            db_modelo: requisicao.body.modelo_old,
            db_ano: requisicao.body.ano_old,
            db_quantidade: requisicao.body.qtd_old
        },
        {
            $set: {
                db_marca: requisicao.body.marca_atl,
                db_modelo: requisicao.body.modelo_atl,
                db_ano: requisicao.body.ano_atl,
                db_quantidade: requisicao.body.qtd_atl
            }
        })

});

app.post("/carro_rmv", function (requisicao, resposta) {

    const marca = requisicao.body.marca_rmv;
    const modelo = requisicao.body.modelo_rmv;
    const ano = requisicao.body.ano_rmv;
    const quantidade = requisicao.body.qtd_car_rmv;

    client.db("SiteCarros").collection("carros").deleteOne(

        {
            db_marca: requisicao.body.marca_rmv,
            db_modelo: requisicao.body.modelo_rmv,
            db_ano: requisicao.body.ano_rmv,
            db_quantidade: requisicao.body.qtd_rmv
        })
});

app.get("/redireciona_cmpr", function (req, resp) {
    client.db("SiteCarros").collection("carros").find().toArray(function (err, items) {
        resp.render('compra.ejs', { carros: items });
    });
});

app.post("/compra_carro_atl", function (requisicao, resposta) {
    const carroId = requisicao.body.id;

    client.db("SiteCarros").collection("carros").findOne(

        function (err, carro) {

            if (carro.db_quantidade > 0) {
                const novaQuantidade = carro.db_quantidade - 1;

                client.db("SiteCarros").collection("carros").updateOne(
                    { _id: new ObjectId(carroId) },
                    { $set: { db_quantidade: novaQuantidade } },
                );

            } else {
                client.db("SiteCarros").collection("carros").updateOne(
                    { $set: { db_quantidade: "Esgotado" } },
                );;
            }
        }
    );
});

