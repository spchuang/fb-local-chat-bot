'use strict';

var _chai = require('chai');

var _ = require('../');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Basic Bot test', function () {
  it('Bot requires init', function () {
    var fn = function fn() {
      return _2.default.sendText('123', 'text');
    };
    (0, _chai.expect)(fn).to.throw(Error);z;

    fn = function fn() {
      return _2.default.router();
    };
    (0, _chai.expect)(fn).to.throw(Error);
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90ZXN0L0JvdEJhc2ljVGVzdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOztBQUNBOzs7Ozs7QUFFQSxTQUFTLGdCQUFULEVBQTJCLFlBQU07QUFDL0IsS0FBRyxtQkFBSCxFQUF3QixZQUFNO0FBQzVCLFFBQUksS0FBSztBQUFBLGFBQU0sV0FBSSxRQUFKLENBQWEsS0FBYixFQUFvQixNQUFwQixDQUFOO0FBQUEsS0FBVDtBQUNBLHNCQUFPLEVBQVAsRUFBVyxFQUFYLENBQWMsS0FBZCxDQUFvQixLQUFwQixFQUEyQjs7QUFFM0IsU0FBSztBQUFBLGFBQU0sV0FBSSxNQUFKLEVBQU47QUFBQSxLQUFMO0FBQ0Esc0JBQU8sRUFBUCxFQUFXLEVBQVgsQ0FBYyxLQUFkLENBQW9CLEtBQXBCO0FBQ0QsR0FORDtBQU9ELENBUkQiLCJmaWxlIjoiQm90QmFzaWNUZXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtleHBlY3R9IGZyb20gJ2NoYWknO1xuaW1wb3J0IEJvdCBmcm9tICcuLi8nO1xuXG5kZXNjcmliZSgnQmFzaWMgQm90IHRlc3QnLCAoKSA9PiB7XG4gIGl0KCdCb3QgcmVxdWlyZXMgaW5pdCcsICgpID0+IHtcbiAgICBsZXQgZm4gPSAoKSA9PiBCb3Quc2VuZFRleHQoJzEyMycsICd0ZXh0Jyk7XG4gICAgZXhwZWN0KGZuKS50by50aHJvdyhFcnJvcik7elxuXG4gICAgZm4gPSAoKSA9PiBCb3Qucm91dGVyKCk7XG4gICAgZXhwZWN0KGZuKS50by50aHJvdyhFcnJvcik7XG4gIH0pO1xufSk7XG4iXX0=