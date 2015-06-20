//importar dependências
var express = require('express');
var routes = require('./routes');
var tarefas = require('./routes/tarefas');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var csrf = require('csurf');
var errorHandler = require('errorhandler');
//driver pro mongodb
var mongoskin = require('mongoskin');
//conexão com o mongo
var db = mongoskin.db('mongodb://admin:admin@ds047622.mongolab.com:47622/todo-app', {safe:true});

var app = express();

//as tarefas serão chamadas em todas as requisições das middlewares (pontes entre banco e app)
app.use(function(req, res, next) {
  req.db = {};
  req.db.tarefas = db.collection('tarefas');
  next();
});
//define appname com esse nome
app.locals.appname = 'ToDo App';
app.locals.moment = require('moment');
//seta porta do servidor
app.set('port', process.env.PORT || 3000);
//onde estão os templates
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev')); //requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride());
//adiciona camada de proteção CSRF
app.use(cookieParser('CEAF3FA4-F385-49AA-8FE4-54766A9874F1'));
app.use(session({
  secret: '59B93087-78BC-4EB9-993A-A61FC844F6C9',
  resave: true,
  saveUninitialized: true
}));
app.use(csrf());
//stylesheets e templates com CSRF
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) {
  res.locals._csrf = req.csrfToken();
  return next();
});
//verifica se a tarefa existe
app.param('tarefa_id', function(req, res, next, tarefaId) {
  req.db.tarefas.findById(tarefaId, function(error, tarefa){
    if (error) return next(error);
    if (!tarefa) return next(new Error('Tarefa não encontrada.'));
    req.tarefa = tarefa;
    return next();
  });
});
//mapeamento de rotas
app.get('/', function(req,res){
  res.redirect('index');
});
app.get('/index', routes.index);
app.get('/tarefas', tarefas.list);
app.post('/tarefas', tarefas.marcaTodasCompletas)
app.post('/tarefas', tarefas.add);
app.post('/tarefas/:tarefa_id', tarefas.marcaCompleta);
app.post('/tarefas/del/:tarefa_id', tarefas.del);
app.get('/tarefas/completas', tarefas.completas);

app.all('*', function(req, res){
  res.status(404).send();
});

if ('development' == app.get('env')) {
  app.use(errorHandler());
}
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
