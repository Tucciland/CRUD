const firebird = require('node-firebird');
const express = require('express');
const bodyParser = require('body-parser')

const path = require('path');
const dbPath = 'C:/Users/user/Desktop/Tucci/Tucciland/CRUD/DUARTE_LANNA.FDB';

let app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');
app.use(express.static('views'));

var options = {};

options.host = '127.0.0.1';
// options.port = 3050;
options.database = dbPath;
options.user = 'SYSDBA';
options.password = 'masterkey';

app.listen(3000, () => {
    console.log('RODANDO SERVIDOR');
});

app.get('/', (req, res) => {
    firebird.attach(options, function(err, db) {
        db.query("SELECT * FROM PRODUTOS ORDER BY PRO_ID", function(err, result) {
            res.render('index', {resultado: result});
            db.detach();
        });
    });
});

app.post('/cadastrar-produto',(req, res)=>{
    let nome = req.body.nome
    let valor = req.body.valor
    let descr = req.body.descricao

    firebird.attach(options, function(err, db) {
        db.query('INSERT INTO PRODUTOS (PRO_NOME, PRO_VALOR, PRO_DESCRICAO) VALUES(?, ?, ?)', [nome, valor, descr], function(err, result) {
            if (err) throw err;
            db.detach();
            res.redirect(`/?timestamp=${Date.now()}`);
        });
    });
}) 

app.get('/produtos', (req, res) => {
    res.json({ nome: 'Coca cola' });
});

app.get('/editar-produto/:id', (req, res) => {
    const productId = req.params.id;
    firebird.attach(options, function(err, db) {
        db.query("SELECT * FROM PRODUTOS WHERE PRO_ID = ?", productId, function(err, result) {
            res.render('editar', { produto: result });
            console.log(result)
            db.detach(); // Mover esta linha para depois de res.render()
        });
    });
});

app.post('/editar-produto', (req, res) => {
    const idProduto = req.body.idEdit;
    const novoNome = req.body.nomeEdit;
    const novoValor = req.body.valorEdit;
    const novoDescr = req.body.descricaoEdit;

    firebird.attach(options, function(err, db) {
        db.query('UPDATE PRODUTOS SET PRO_NOME = ?, PRO_VALOR = ?, PRO_DESCRICAO = ? WHERE PRO_ID = ?', [novoNome, novoValor, novoDescr, idProduto], function(err, result) {
            if (err) throw err;
            db.detach();
            console.log(idProduto,novoValor,novoNome,novoDescr);
            res.redirect(`/?timestamp=${Date.now()}`);
        });
    });
});



app.get('/deletar-produto/:id', (req, res) => {
    const idDeletar = req.params.id;
    firebird.attach(options, function(err, db) {
        db.query('DELETE FROM PRODUTOS WHERE PRO_ID = ?', idDeletar, function(err, result) {
            if (err) throw err;
            db.detach();
            console.log('Produto Deletado');
            // Redireciona para a página inicial com um timestamp como parâmetro de consulta
            res.redirect(`/?timestamp=${Date.now()}`);
        });
    });
});