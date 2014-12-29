EapTools.namespace("eap.ui");

//grid
eap.ui.Grid = function(options, gridHandler, buttonHandler, listHandler, pageHandler, pageCountHandler) {
    this._options = options;
    this._gridHandler = gridHandler;
    this._buttonsHandler = buttonHandler;
    this._listHandler = listHandler;
    this._pageHandler = pageHandler;
    this._pageCountHandler = pageCountHandler;
    this._headCheckBox = jQuery("<input type='checkbox' name='grid_head_checkbox'id='grid_head_checkbox'>");
    this._buttons = new Array();
    this._head = new Array();
    this._body = null;
    this._init();
};

//grid-初始化
eap.ui.Grid.prototype._init = function(){
    var _self = this;
    //渲染buttons
    var buttonsArray = _self._options.buttons;
    for (var i = 0; i < buttonsArray.length; i++) {
        if (_self._options.buttons[i].type === ContentConfig.columnsConfig().getListConfig()) {
            _self._buttons.push(new eap.ui.GridButtons(_self._buttonsHandler, buttonsArray[i]));
        }
    }
    //渲染表头
    var itemsArray = _self._options.items;
    for (var i = 0; i < itemsArray.length; i++) {
        var thisItem = itemsArray[i];
        if (thisItem.list_show) { //列表显示
            _self._head.push(new eap.ui.GridHead(thisItem, _self._listHandler));
        }
    }
    _self._installButtons();  //安装按钮
    _self._installHead(); //安装head

    //渲染body
    _self._body = new eap.ui.GridBody(this._options.dataList, _self);
};

//get gridHeadCheckBox
eap.ui.Grid.prototype.getHeadCheckBox = function() {
  var _self = this;
  return _self._headCheckBox;
};

//安装buttons
eap.ui.Grid.prototype._installButtons = function() {
    var _self = this;
    //安装buttons
    for (var j in ContentConfig.columnsConfig().getButtonGroup()) {
        var buttonGroup = jQuery("<div class='btn-group' group='" + j + "'></div>");
        for (var i = 0; i < _self.getButtons().length; i++) {
            var thisButtonObj = _self.getButtons()[i];
            var thisBtnGroup = thisButtonObj.getGroup();
            if (j === thisBtnGroup) { //同组添加
                thisButtonObj.getObject().appendTo(buttonGroup);
            }
        }
        if (buttonGroup.html()) {
            buttonGroup.appendTo(_self._buttonsHandler);
        }
    }
};

//安装grid head
eap.ui.Grid.prototype._installHead = function() {
    var _self = this;
    var checkBoxTh = jQuery("<th style='width: 10px'></th>");
    //绑定事件
    _self.getHeadCheckBox().click(function() {
        if (jQuery(this).is(":checked")) {
            jQuery("input[name='grid_body_checkbox']").attr("checked", true);
        } else {
            jQuery("input[name='grid_body_checkbox']").prop("checked", false);
        }
    });
    _self.getHeadCheckBox().appendTo(checkBoxTh);
    var xhHaoTh = jQuery("<th style='width: 35px;' class='grid-index grid-table-cursor'>序号</th>");
    var th_tr = jQuery("<tr id='grid_head_tr'></tr>");
    checkBoxTh.appendTo(th_tr);
    xhHaoTh.appendTo(th_tr);
    for (var i = 0; i < _self._head.length; i++) {
        _self._head[i].getObject().appendTo(th_tr);
    }
    th_tr.appendTo(this._listHandler);
};

//grid-获取按钮条
eap.ui.Grid.prototype.getButtons = function() {
    var _self = this;
    return _self._buttons;
};


//grid-获取某个按钮
eap.ui.Grid.prototype.getButton = function(key) {
    var _self = this;
    for (var i = 0; i < _self.getButtons().length; i++) {
        if (_self.getButtons()[i].getKey() === key) {
            return  _self.getButtons()[i];
        }
    }
};

//grid-获取列表头
eap.ui.Grid.prototype.getGridHead = function() {
    var _self = this;
    return _self._head;
};

//获取头部末个对象
eap.ui.Grid.prototype.getGridHeadItem = function(key) {
    var _self = this;
    for (var i = 0; i < _self.getGridHead().length; i++) {
        if (_self.getGridHead()[i].getKey() === key) {
            return _self.getGridHead()[i];
        }
    }
};

//grid-获取列表体
eap.ui.Grid.prototype.getGridBody = function() {
    var _self = this;
    return _self._body;
};

//grid-分页对象
eap.ui.Grid.prototype.getPagination = function() {

};

//------------------------------------------

//Buttons
eap.ui.GridButtons = function(_buttonHandler, option) {
    this._handler = _buttonHandler;
    this._key =  option.key;
    this._value = option.value;
    this._group = option.group;
    this._obj = null;
    this._init();
};

//Buttons-初始化
eap.ui.GridButtons.prototype._init = function() {
    var _self = this;
    _self._obj = jQuery("<button type='button' class='btn btn-default' key='" + _self._key + "'></button>");
    _self._obj.append("<i class='icon-" +_self._icon + "'></i>" + _self._value);

};

//获取button的显示文本值
eap.ui.GridButtons.prototype.getValue = function() {
    var _self = this;
    return _self._value;
};

eap.ui.GridButtons.setGroup = function(group) {
    if (!ContentConfig.getGroup()[group]) {  //分组存在
        layer.alert("您说选择的分组不存在，请从选！", 3);
        return;
    }
    var _self = this;
    _self._handler.find("div").each(function(){
        if (jQuery(this).attr("group") === group) {
            _self.getObject().appendTo(jQuery(this));
            _self._group = group;
        }
    });
};

//获取按钮所在的组
eap.ui.GridButtons.prototype.getGroup = function() {
    var _self = this;
    return _self._group;
};

//获取按钮jquery对象
eap.ui.GridButtons.prototype.getObject = function() {
    var _self = this;
    return _self._obj;
};

//设置显示文字
eap.ui.GridButtons.prototype.setValue = function(value) {
    var _self = this;
    var oldHtml = _self.getObject().html();
    _self.getObject().html(oldHtml.replace(_self.getValue(), value));
    _self._value = value;
};

//设置按钮的显示图标
eap.ui.GridButtons.prototype.setIcon = function(icon) {
    var _self = this;
    _self.getObject().removeClass("glyphicon-" + _self.getIcon());
    _self.getObject().addClass("glyphicon-" + icon);
    _self._icon = icon;
};

//获取按钮的显示图标icon
eap.ui.GridButtons.prototype.getIcon = function() {
    var _self = this;
    return _self._icon;
};

//set key
eap.ui.GridButtons.prototype.setKey = function(key) {
  var _self = this;
  _self.getObject().attr("key", key);
};

//获取key
eap.ui.GridButtons.prototype.getKey = function() {
  var _self = this;
    return _self._key;
};

//------------------------------------------

//GridHead
eap.ui.GridHead = function(option, listHandler) {
    this._key = option.key;
    if (option.list_show) {
        if (option.list_hidden_data) {
            this._obj = jQuery("<th key='" + this._key + "' class='grid-table-cursor' style='display:none;'></th>");
        }  else {
            this._obj = jQuery("<th key='" + this._key + "' class='grid-table-cursor'></th>");
        }
        this._icon = jQuery("<i></i>");
        this._label = option.label;
        this._init();
    } else {
        return;
    }
};

//GridHead-初始化
eap.ui.GridHead.prototype._init = function() {
    var _self = this;
    _self.getObject().unbind("click").bind("click", function() {
       _self._changeIcon();
       //TODO
    });
    _self.getObject().html(_self.getLabel());
    this._icon.appendTo(_self.getObject());
};

//获取key
eap.ui.GridHead.prototype.setKey = function(key) {
    var _self = this;
    _self.getObject().attr("key", key);
    _self._key = key;
};

//获取key
eap.ui.GridHead.prototype.getKey = function() {
    var _self = this;
    return _self._key;
};

//修改value
eap.ui.GridHead.prototype.setLabel = function(val) {
    var _self = this;
    _self.getObject().html("");
    _self.getObject().html(_self.getValue());
    _self._icon.appendTo(_self.getObject());
    _self._label = val;
};

//获取value
eap.ui.GridHead.prototype.getLabel = function() {
    var _self = this;
    return _self._label;
};

//修改宽度
eap.ui.GridHead.setWidth = function(width) {
    var _self = this;
    _self.getObject().css({"width":width});
};

//获取宽度
eap.ui.GridHead.prototype.getWidth = function() {
    var _self = this;
    return _self.getObject().width();
};

//获取当前对象
eap.ui.GridHead.prototype.getObject = function() {
    var _self = this;
    return _self._obj;
};

//改变图标样式
eap.ui.GridHead.prototype._changeIcon = function() {
    var _self = this;
    if (_self._icon.hasClass("icon-arrow-up")) {
        _self._icon.removeClass("icon-arrow-up");
        _self._icon.addClass("icon-arrow-down");
    } else if (_self._icon.hasClass("icon-arrow-down")) {
        _self._icon.removeClass("icon-arrow-down");
        _self._icon.addClass("icon-arrow-up");
    } else {
        _self._icon.addClass("icon-arrow-up");
    }
};

//-------------------------------------------

//GridBody
eap.ui.GridBody = function(dataList, handler) {
    this._rows = new Array();
    this._cols = new Array();
    this._obj = null;
    this._parentHandler = handler;
    this._dataList = dataList;
    this._init();
};

//GridBody-初始化
eap.ui.GridBody.prototype._init = function() {
    var _self = this;
    var colArray = new Array();
    for (var i = 0 ; i < _self._dataList.length; i++) {
        if (i === 0) {
            var thisDataObj = _self._dataList[i];
            for (var j in thisDataObj) {
                colArray.push(j);
            }
        }
        _self._rows.push(new eap.ui.GridRow(_self._dataList[i], _self._dataList[i][_self.getPkCode()], _self._parentHandler._options.items, i));
    }
    _self._installRow();
    _self._installCol(colArray);
};

//安装cell
eap.ui.GridBody.prototype._installCol = function(colArray) {
    var _self = this;
    for (var i = 0; i < colArray.length; i++) {
        _self._cols.push(new eap.ui.GridColumn(colArray[i], _self.getRows()));
    }
};

//安装row
eap.ui.GridBody.prototype._installRow = function() {
    var _self = this;
    for (var i = 0; i < _self.getRows().length; i++) {
        var thisRowObj = _self.getRows()[i];
        thisRowObj.getObject().appendTo(_self._parentHandler._listHandler);
    }
};

//获取主键字段值
eap.ui.GridBody.prototype.getPkCode = function() {
    var _self = this;
    for (var i = 0; i < _self._parentHandler._options.items.length; i++) {
        if (_self._parentHandler._options.items[i].isPkCode) {
            return  _self._parentHandler._options.items[i].key;
        }
    }
};

//GridBody-获取列表行对象
eap.ui.GridBody.prototype.getRows = function() {
    var _self = this;
    return _self._rows;
};

//GridBody-获取列表指定行对象
eap.ui.GridBody.prototype.getRow = function(index){
    var _self = this;
    for (var i = 0; i < _self.getRows().length; i++) {
        if (_self.getRows()[i].getIndex() === index) {
            return _self.getRows()[i];
        }
    }
};

//GridBody-获取列表列对象
eap.ui.GridBody.prototype.getColumns = function() {
    var _self = this;
    return _self._cols;
};

//GridBody-获取列表指定列对象
eap.ui.GridBody.prototype.getColumn = function(key) {
    var _self = this;
    for (var i = 0; i < _self.getColumns().length; i++) {
        if (_self.getColumns()[i].getKey() === key) {
            return _self.getColumns()[i];
        }
    }
};

//----------------------------------------

//GridRow
eap.ui.GridRow = function(trData, index ,items, xh) {
    this._obj = jQuery("<tr index='" + index + "'></tr>");
    this._trData = trData;
    this._row = new Array();
    this._key = index;
    this._index = index;
    this._items = items;
    this._init(xh);
};

//获取索引
eap.ui.GridRow.prototype.getIndex = function() {
    var _self = this;
    return _self._index;
};

//获取listUrl
eap.ui.GridRow.prototype._getItemIsConf = function(key, pro) {
    var _self = this;
    for (var i = 0; i < _self._items.length; i++) {
        if (_self._items[i].key === key) {
            return  _self._items[i][pro];
        }
    }
};

//GridRow-初始化
eap.ui.GridRow.prototype._init = function(xh) {
    var _self = this;
    for (var i in _self._trData) {
        var cell = {
            "key":i,
            "row":_self._index,
            "value":_self._trData[i],
            "col":i,
            "isListUrl":_self._getItemIsConf(i, "isListUrl"),
            "list_show":_self._getItemIsConf(i, "list_show"),
            "list_hidden_data":_self._getItemIsConf(i, "list_hidden_data")
        }
        _self._row.push(new eap.ui.GridCell(cell, _self.getObject()));
    }
    //添加数据
    jQuery("<td><input type='checkbox' name='grid_body_checkbox' index='" + _self.getIndex() + "'></td>")
        .appendTo(_self.getObject());
    jQuery("<td class='grid-index'>" + (xh + 1) + "</td>").appendTo(_self.getObject());
    for (var i = 0; i < _self.getRow().length; i++) {
        _self.getRow()[i].getObject().appendTo(_self.getObject());
    }
    //绑定事件
    //TODO in list View
};

//getObj
eap.ui.GridRow.prototype.getObject = function() {
    var _self = this;
    return _self._obj;
};

//获取row
eap.ui.GridRow.prototype.getRow = function() {
    var _self = this;
    return _self._row;
};

//get cell
eap.ui.GridRow.prototype.getCol = function(col) {
    var _self = this;
    for (var i = 0; i < _self.getRow().length; i++) {
        if (_self.getRow()[i].getCol() === col) {
            return  _self.getRow()[i];
        }
    }
};

//----------------------------------------

//GridColumn
eap.ui.GridColumn = function(key, rows) {
    this._col = new Array();
    this._init(key, rows);
    this._key = key;
};

//GridColumn-初始化
eap.ui.GridColumn.prototype._init = function(col, rows) {
    var _self = this;
    for (var j = 0; j < rows.length; j++) {
        var thisRow = rows[j];
        for (var i= 0; i < thisRow.getRow().length; i++) {
           var thisCol = thisRow.getRow()[i];
           if (thisCol.getCol() === col) {
              this._col.push(thisCol);
           }
        }
    }
};

//获取col
eap.ui.GridColumn.prototype.getColumn = function() {
    var _self = this;
    return _self._col;
};

//获取key
eap.ui.GridColumn.prototype.getKey = function() {
    var _self = this;
    return _self._key;
};

// GridCell
eap.ui.GridCell = function(tdData, _parentHandler) {
    this._obj = jQuery("<td></td>");
    this._value = tdData.value;
    this._key = tdData.key;
    this._row = tdData.row;
    this._col = tdData.col;
    this._isListUrl = tdData.isListUrl;
    this._list_show =  tdData.list_show;
    this._list_hidden_data = tdData.list_hidden_data;
    this._init(_parentHandler);
};

//初始化
eap.ui.GridCell.prototype._init = function(_parentHandler) {
    var _self = this;
    _self.getObject().attr("key", _self._key);
    _self.getObject().attr("row", _self._row);
    _self.getObject().attr("col", _self._col);
    if (_self._list_show) {
        if (_self._list_hidden_data) {
            _self.getObject().css({"display":"none"});
        }
        if (_self._isListUrl) { //列表单击事件
            var aUrl = jQuery("<a href='javascript:void(0);'>" + _self._value + "</a>");
            aUrl.unbind("click").bind("click", function() {
                _parentHandler.dblclick();
            });
            aUrl.appendTo(_self.getObject());
        } else {
            _self.getObject().html(_self._value);
        }
    } else {
        return;
    }
};

//获取对象
eap.ui.GridCell.prototype.getObject = function() {
    var _self = this;
    return _self._obj;
};

//设置值
eap.ui.GridCell.prototype.setValue = function(val) {
    var _self = this;
    _self.getObject().html(val);
    _self._value = val;
};

//获取值
eap.ui.GridCell.prototype.getValue = function() {
    var _self = this;
    return _self._value;
};

//获取key
eap.ui.GridCell.prototype.setKey = function(key) {
    var _self = this;
    _self.getObject().attr("key", key);
    _self._key = key;
};

//设置key值
eap.ui.GridCell.prototype.getKey = function() {
    var _self = this;
    return _self._key;
};

//set col
eap.ui.GridCell.prototype.setCol = function(col) {
    var _self = this;
    _self.getObject().attr("col", col);
    _self._col = col;
};

//get col
eap.ui.GridCell.prototype.getCol = function(){
    var _self = this;
    return _self._col;
};

//----------------------------------------

//Pagination
eap.ui.Pagination = function() {

};

//Pagination-初始化
eap.ui.Pagination.prototype._init = function() {

};