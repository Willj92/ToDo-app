var assert = require("assert");

describe('Array', function(){
  describe('#indexOf()', function(){
    it('deve retornar -1 quando o valor não está presente', function(){
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    });
  });
});
