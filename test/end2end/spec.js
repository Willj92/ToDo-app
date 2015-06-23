var should = require('should');
var url = "http://pi7-todoapp.herokuapp.com/";
var novaTarefa = "nova";

describe('ToDo App', function() {
    beforeEach(function() {
        browser.ignoreSynchronization = true;
        browser.get(url);
    });

    it('Deve abrir a página Lista ToDo', function() {
        browser.driver.findElement(by.linkText('Lista ToDo')).click();
        browser.getCurrentUrl().then(function(urlLista) {
            should(urlLista).containEql('tarefas');
        });
    });

    it('Deve adicionar uma nova tarefa', function() {
        browser.get(url + 'tarefas');
        browser.driver.findElement(by.id('nome')).sendKeys(novaTarefa);
        browser.driver.findElement(by.id('add')).click();
        expect(element.all(by.css('.name span')).last().getText()).toContain(novaTarefa);
    });

    // it('Deve adicionar a última tarefa criada na lista de completas', function() {
    //     element.all(by.css('.action input')).last().click();
    // });

    // it('Deve abrir a página completas e verificar se a última adicionada confere', function() {
    //     browser.get(url + 'completas');
    //     expect(element.all(by.css('.item span')).last().getText()).toContain(novaTarefa);
    // });
});
