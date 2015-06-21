process.env.NODE_ENV = process.env.NODE_ENV || 'test';

var should = require("should");
var math = require('../utilities/matematica');

describe('Array', function() {
    describe('Math, somar', function() {
        it('deve retornar 3 quando o valor passado for 1 e 2', function() {
            (math.somar(1, 2)).should.be.equal(3);
        });
        it('deve retornar -1 quando o valor passado for 1 e -2', function() {
            (math.somar(1, -2)).should.be.equal(-1);
        });
        it('deve retornar 0 quando o valor passado for 0 e 0', function() {
            (math.somar(0, 0)).should.be.equal(0);
        });
    });
});
