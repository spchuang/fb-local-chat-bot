'use strict';

var _chai = require('chai');

var _testData = require('./testData');

var _testData2 = _interopRequireDefault(_testData);

var _ = require('../');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Basic server test', function () {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90ZXN0L0JvdFRlc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxTQUFTLG1CQUFULEVBQThCLFlBQU07QUFDbEMsS0FBRyxtQkFBSCxFQUF3QixZQUFNO0FBQzVCLFFBQUksS0FBSztBQUFBLGFBQU0sV0FBSSxRQUFKLENBQWEsS0FBYixFQUFvQixNQUFwQixDQUFOO0FBQUEsS0FBVDtBQUNBLHNCQUFPLEVBQVAsRUFBVyxFQUFYLENBQWMsS0FBZCxDQUFvQixLQUFwQjs7QUFFQSxTQUFLO0FBQUEsYUFBTSxXQUFJLE1BQUosRUFBTjtBQUFBLEtBQUw7QUFDQSxzQkFBTyxFQUFQLEVBQVcsRUFBWCxDQUFjLEtBQWQsQ0FBb0IsS0FBcEI7QUFDRCxHQU5EO0FBU0QsQ0FWRCIsImZpbGUiOiJCb3RUZXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtleHBlY3R9IGZyb20gJ2NoYWknO1xuaW1wb3J0IHRlc3REYXRhIGZyb20gJy4vdGVzdERhdGEnO1xuaW1wb3J0IEJvdCBmcm9tICcuLi8nO1xuXG5kZXNjcmliZSgnQmFzaWMgc2VydmVyIHRlc3QnLCAoKSA9PiB7XG4gIGl0KCdCb3QgcmVxdWlyZXMgaW5pdCcsICgpID0+IHtcbiAgICBsZXQgZm4gPSAoKSA9PiBCb3Quc2VuZFRleHQoJzEyMycsICd0ZXh0Jyk7XG4gICAgZXhwZWN0KGZuKS50by50aHJvdyhFcnJvcik7XG5cbiAgICBmbiA9ICgpID0+IEJvdC5yb3V0ZXIoKTtcbiAgICBleHBlY3QoZm4pLnRvLnRocm93KEVycm9yKTtcbiAgfSk7XG5cblxufSk7XG4iXX0=