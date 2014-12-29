/**
 * Created with JetBrains WebStorm.
 * User: hdy
 * Date: 14-12-28
 * Time: 下午8:30
 * To change this template use File | Settings | File Templates.
 */
EapTools.namespace("eap.vi");

//list
eap.vi.List = function(options, gridHandler, buttonHandler, listHandler, pageHandler, pageCountHandler) {
    this._options = options;
    this._gridHandler = gridHandler;
    this._buttonHandler =buttonHandler;
    this._listHandler = listHandler;
    this._pageHandler = pageHandler;
    this._pageCountHandler = pageCountHandler;
    this._init();
};

//初始化
eap.vi.List.prototype._init = function() {
    var _self = this;
    var myGrid = new eap.ui.Grid(_self._options, _self._gridHandler, _self._buttonHandler, _self._listHandler,
        _self._pageHandler, _self._pageCountHandler);
    for(var i = 0; i < myGrid.getGridBody().getRows().length; i++) {
        var rowObj = myGrid.getGridBody().getRows()[i];
        rowObj.getObject().unbind("dblclick").bind("dblclick", function(){
            location.href = "eap-card-data.html";
        });
    }
};
