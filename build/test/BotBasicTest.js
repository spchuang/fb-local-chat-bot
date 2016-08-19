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
    (0, _chai.expect)(fn).to.throw(Error);

    fn = function fn() {
      return _2.default.router();
    };
    (0, _chai.expect)(fn).to.throw(Error);
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90ZXN0L0JvdEJhc2ljVGVzdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOztBQUNBOzs7Ozs7QUFFQSxTQUFTLGdCQUFULEVBQTJCLFlBQU07QUFDL0IsS0FBRyxtQkFBSCxFQUF3QixZQUFNO0FBQzVCLFFBQUksS0FBSztBQUFBLGFBQU0sV0FBSSxRQUFKLENBQWEsS0FBYixFQUFvQixNQUFwQixDQUFOO0FBQUEsS0FBVDtBQUNBLHNCQUFPLEVBQVAsRUFBVyxFQUFYLENBQWMsS0FBZCxDQUFvQixLQUFwQjs7QUFFQSxTQUFLO0FBQUEsYUFBTSxXQUFJLE1BQUosRUFBTjtBQUFBLEtBQUw7QUFDQSxzQkFBTyxFQUFQLEVBQVcsRUFBWCxDQUFjLEtBQWQsQ0FBb0IsS0FBcEI7QUFDRCxHQU5EO0FBT0QsQ0FSRCIsImZpbGUiOiJCb3RCYXNpY1Rlc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2V4cGVjdH0gZnJvbSAnY2hhaSc7XG5pbXBvcnQgQm90IGZyb20gJy4uLyc7XG5cbmRlc2NyaWJlKCdCYXNpYyBCb3QgdGVzdCcsICgpID0+IHtcbiAgaXQoJ0JvdCByZXF1aXJlcyBpbml0JywgKCkgPT4ge1xuICAgIGxldCBmbiA9ICgpID0+IEJvdC5zZW5kVGV4dCgnMTIzJywgJ3RleHQnKTtcbiAgICBleHBlY3QoZm4pLnRvLnRocm93KEVycm9yKTtcblxuICAgIGZuID0gKCkgPT4gQm90LnJvdXRlcigpO1xuICAgIGV4cGVjdChmbikudG8udGhyb3coRXJyb3IpO1xuICB9KTtcbn0pO1xuIl19