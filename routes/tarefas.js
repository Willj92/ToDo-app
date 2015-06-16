//lista as tarefas incompletas
exports.list = function(req, res, next){
  req.db.tarefas.find({completa: false}).toArray(function(error, tarefas){
    if (error) return next(error);
    res.render('tarefas', {
      title: 'Lista ToDo',
      tarefas: tarefas || []
    });
  });
};
//adiciona uma tarefa conferindo se digitou o nome
exports.add = function(req, res, next){
  if (!req.body || !req.body.name) return next(new Error('Nome não fornecido!'));
  req.db.tarefas.save({ //salva a tarefa atribuindo nome, data e incompleta
    name: req.body.name,
    dataCriada: new Date(),
    completa: false
  }, function(error, tarefa){ //verifica erros
    if (error) return next(error);
    if (!tarefa) return next(new Error('Falha ao salvar!'));
    console.info('Adicionada %s com id=%s', tarefa.name, tarefa._id); //log
    res.redirect('/tarefas'); //redireciona pra tela de tarefas
  })
};

//marcar todas as tarefas como completas
exports.marcaTodasCompletas = function(req, res, next) {
  if (!req.body.todas_prontas || req.body.todas_prontas !== 'true') return next(); //checagem extra
  req.db.tarefas.update({
    completa: false
  }, {$set: {
    dataCompletada: new Date(),
    completa: true
  }}, {multi: true}, function(error, count){
    if (error) return next(error);
    console.info('Marcada %s tarefa(s) completas.', count);
    res.redirect('/tarefas');
  })
};

//rota das tarefas completas
exports.completas = function(req, res, next) {
  req.db.tarefas.find({completa: true}).toArray(function(error, tarefas) {
    res.render('tarefas_completas', {
      title: 'completa',
      tarefas: tarefas || []
    });
  });
};
//marca uma tarefa como completa pelo seu id
exports.marcaCompleta = function(req, res, next) {
  if (!req.body.completa) return next(new Error('Parâmetro está faltando!'));
  var completa = req.body.completa === 'true'; //string, e não bool
  req.db.tarefas.updateById(req.tarefa._id, {$set: {dataCompletada: completa ? new Date() : null, completa: completa}}, function(error, count) {
    if (error) return next(error);
    if (count !==1) return next(new Error('Algo deu errado!'));
    console.info('Marcada tarefa %s com id=%s completa.', req.tarefa.name, req.tarefa._id);
    res.redirect('/tarefas');
  })
};
//deleta uma tarefa pelo id
exports.del = function(req, res, next) {
  req.db.tarefas.removeById(req.tarefa._id, function(error, count) {
    if (error) return next(error);
    if (count !==1) return next(new Error('Algo deu errado!'));
    console.info('Excluida tarefa %s com id=%s completa.', req.tarefa.name, req.tarefa._id);
    res.status(204).send(); //tudo ok, não precisa redirecionar
  });
};
