var chai = require('chai');
var expect = chai.expect;
var request = require('request');

describe('api/v1/users', function(){
  describe('GET', function(){
    it('should find a user', function(done){
      request.get({
        url: 'http://localhost:8080/api/v1/users/54350205cbe9aac41e1b4903',
        proxy: null // no proxy for local address
      }, function(err, res, body){
        if ( !err && res.statusCode == 200 ){
          var json = null;
          var parse = function(){
            json = JSON.parse(body);
          };
          // returned data should be correct JSON
          expect(parse).to.not.throw(SyntaxError);
          // TODO: make test data
          expect(json).to.deep.equal({
            _id: "54350205cbe9aac41e1b4903",
            username: "neonaleon",
            avatarURL: "//placehold.it/128x128",
            firstname: "Peon",
            lastname: "Ho",
            role: "プログラマ",
            profile: ""
          });
          done();
        }
      });
    });
  });
});