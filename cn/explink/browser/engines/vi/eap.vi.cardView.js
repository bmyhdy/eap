/**
 * Created with JetBrains WebStorm.
 * User: hdy
 * Date: 14-12-28
 * Time: 下午8:30
 * To change this template use File | Settings | File Templates.
 */
EapTools.namespace("eap.vi");

//card
eap.vi.Card = function(options, itemsHandler, buttonsHandler, dataObj) {
    this._options = options;
    this._itemsHandler = itemsHandler;
    this._buttonsHandler = buttonsHandler;
    this._dataObj = dataObj;
    this._init();
};

//初始化
eap.vi.Card.prototype._init = function() {
    var _self = this;
    var cardObj = new eap.ui.Card(this._options, this._itemsHandler, this._buttonsHandler);
    for (var j in _self._dataObj) {
        var thisObj = cardObj.getItem(j);
        if (j === thisObj.key) {
            thisObj.setValue(_self._dataObj[j]);
        }
    }
};