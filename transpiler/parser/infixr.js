var symbol = require('./symbol');
var helpers = require('./helperFunctions');
var expression = require('./expression');
var original_symbol = require('./original_symbol');

var infixr = function(obj, id, bp, led) {
  var s = symbol(obj, original_symbol, id, bp);
  s.led = led || function(left) {
      delete this.value;
      this.type = "BinaryExpression";
      this.operator = this.value;
      if(this.operator === "||") {
        this.type = "LogicalExpression";
      }
      if(left.type === "IDENTIFIER") {
        left.type = "Identifier";
        left.name = left.value;
        delete left.value;
      } else if(left.type === "literal" && helpers.isNum(left.value)) {
        left.type = "Literal";
        left.raw = left.value;
        if (left.value.indexOf('.') === -1) {
          left.value = parseFloat(left.value);
        } else {
          left.value = parseInt(left.value);
        }
      } else if (left.type === "literal" && helpers.isBool(left.value)) {
        // TODO type boolean
      } else if (left.type === "literal") {
        // Fall-through for type string
        left.type = "Literal";
        left.raw = '"' + left.value + '"';
      }
      this.left = left;
      this.right = expression(obj, bp - 1);
      return this;
    };
  return s;
};

module.exports = infixr;