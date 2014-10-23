var chai = require('chai');
var assert = chai.assert; // assert for TDD style, http://chaijs.com/api/assert/
var expect = chai.expect; // expect for BDD style, http://chaijs.com/api/bdd/

// TDD
describe('Array', function(){
  describe('#indexOf()', function(){
    it('should return -1 when the value is not present', function(){
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    });
    it('should return 2 when the value is 3', function(){
      assert.equal(2, [1,2,3].indexOf(3));
    });
  });

  describe('#pop()', function(){
    it('should return 3 when popped', function(){
      assert.equal(3, [1,2,3].pop());
    });
  });
});

// BDD
describe('A POJO', function(){
  it('should have property - value pair', function(){
    expect({ foo: 'baz' }).to.have.property('foo').and.that.equal('baz');
  });
});