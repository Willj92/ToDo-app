describe('Calculadora', function() {
			it('Deveria retornar 5 quando for passado 1 e 4.', function() {
				var numero1 = 1;
				var numero2 = 4;

				var resultado = 1+4;

				resultado.should.be.a.Number;
				resultado.should.be.equal(6);
			});
    });
