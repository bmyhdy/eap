EapTools.namespace("eap.ui");

//card
eap.ui.Card = function(options, itemsHandler, buttonsHandler) {
    this._options = options;
    this._allColumns = ContentConfig.columnsConfig().getStaticColumns();
    this._unitColumn = EapTools.getIntOfDivision(this._allColumns, ContentData.userColumn);
    if (this._options.userColumn > this._allColumns) {
        layer.alert("设置列比最大列值12大，请重新设置！", 3);
        return;
    }
    if (!this._unitColumn) {
        layer.alert("所用最大列能被12整除，请重新设置！", 3);
        return;
    }
    this._items = new Array(); //列对象数组
    this._btns = new Array(); //按钮数组
    this._itemsHandler = itemsHandler;  //页面存放字段节点容器
    this._buttonsHandler = buttonsHandler; //按钮条节点容器
    this._dicts = options.dicts; //字段列表
    this._init(this._options); //初始化
};

eap.ui.Card.prototype._init = function(options) {
    var _self = this;
    //add items
    for (var i = 0; i < _self._options.items.length; i++) {
        var _selfItemObj = _self._options.items[i];
        if(ContentConfig.columnsConfig().getItemsType().input === _selfItemObj.type) {  //input
            _self._items.push(new eap.ui.Input(_selfItemObj, _self, i));
        } else if(ContentConfig.columnsConfig().getItemsType().radio === _selfItemObj.type) { //radio
            var dictObj = null;
            for (var j = 0; j < options.dicts.length; j++) {
                if (options.dicts[j].key === _selfItemObj.dict) {
                    dictObj = options.dicts[j].values;
                    break;
                }
            }
            if (dictObj) {
                _self._items.push(new eap.ui.Radio(_selfItemObj, _self, i, dictObj));
            } else {
                _self._items.push(new eap.ui.Input(_selfItemObj, _self, i));
            }
        } else if(ContentConfig.columnsConfig().getItemsType().checkbox === _selfItemObj.type) { //checkbox
            var dictObj = null;
            for (var j = 0; j < options.dicts.length; j++) {
                if (options.dicts[j].key === _selfItemObj.dict) {
                    dictObj = options.dicts[j].values;
                    break;
                }
            }
            if (dictObj) {
                _self._items.push(new eap.ui.CheckBox(_selfItemObj, _self, i, dictObj));
            } else {
                _self._items.push(new eap.ui.Input(_selfItemObj, _self, i));
            }
        }else if(ContentConfig.columnsConfig().getItemsType().textarea === _selfItemObj.type) { //textarea
            _self._items.push(new eap.ui.Textarea(_selfItemObj, _self, i));
        }else if(ContentConfig.columnsConfig().getItemsType().select === _selfItemObj.type) { //select
            var dictObj = null;
            for (var j = 0; j < options.dicts.length; j++) {
                if (options.dicts[j].key === _selfItemObj.dict) {
                    dictObj = options.dicts[j].values;
                    break;
                }
            }
            if (dictObj) {
                _self._items.push(new eap.ui.Select(_selfItemObj, _self, i, dictObj));
            } else {
                _self._items.push(new eap.ui.Input(_selfItemObj, _self, i));
            }
        }
    }
    //add btns
    for (var i = 0; i < _self._options.buttons.length; i++) {
        if (_self._options.buttons[i].type === ContentConfig.columnsConfig().getCardConfig()) {
            _self._btns.push(new eap.ui.Button(_self._options.buttons[i], _self, i));
        }
    }
    _self._installHtml();
};

//安装 html页面元素
eap.ui.Card.prototype._installHtml = function() {
    var _self = this;
    _self._installItems();
    _self._installButtons();
};

eap.ui.Card.prototype._installItems = function(){
    var _self = this;
    var itemArray = new Array();
    var itemsArray = new Array();
    var thisColumnCount = 0;
    //获取rows
    for (var i = 0; i < _self.getItems().length; i++) {
        var thisContainer = _self.getItems()[i].getContainer();
        if (itemArray == null) {
            itemArray = new Array();
        }
        itemArray.push(thisContainer);
        thisColumnCount +=  parseFloat(thisContainer.attr("count"));
        if (_self._allColumns === thisColumnCount) {
            itemsArray.push(itemArray);
            itemArray = null;
            thisColumnCount = 0;
        }
    }
    //安装items数据
    for(var i = 0; i < itemsArray.length; i++) {
        var thisRowObj = jQuery("<div class='row-fluid' name='card_row'></div>");
        var thisArray = itemsArray[i];
        for (var j = 0; j < thisArray.length; j++) {
            thisArray[j].appendTo(thisRowObj);
        }
        thisRowObj.appendTo(_self._itemsHandler);
    }
    itemsArray = null;
};

//安装按钮数据
eap.ui.Card.prototype._installButtons = function() {
    var _self = this;
    //安装buttons
    for (var j in ContentConfig.columnsConfig().getButtonGroup()) {
        var buttonGroup = jQuery("<div class='btn-group' group='" + j + "'></div>");
        //debugger;
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

//获取某个item对象
eap.ui.Card.prototype.getItem = function(key) {
    var _self = this;
    for (var i = 0; i < _self.getItems().length; i++) {
        var _thisObj = _self.getItems()[i];
        if (_thisObj.key === key) {
            return  _thisObj;
        }
    }
    return null;
};

//获取所有item对象
eap.ui.Card.prototype.getItems = function() {
    var _self = this;
    return _self._items;
};

//获取某个button对象
eap.ui.Card.prototype.getButton = function(key) {
    var _self = this;
    for (var i = 0; i < _self.getButtons().length; i++) {
        if (_self.getButtons()[i].key === key) {
            return  _self.getButtons()[i];
        }
    }
};

//获取全部按钮对象
eap.ui.Card.prototype.getButtons = function() {
    var _self = this;
    return _self._btns;
};

//input
eap.ui.Input = function(optionObj, _handler, index) {
    this._obj = null;
    this._container = null;
    this._label = null;
    this.key = optionObj.key;
    this._init(optionObj, _handler, index);
};

//初始化input
eap.ui.Input.prototype._init = function(optionObj, _handler, index) {
    var _self = this;
    var _column = optionObj.column;
    var _title = optionObj.label;
    var _isRequired = optionObj.isRequired;
    var _class = "span" + _column * _handler._unitColumn;
    /*if (EapTools.getIEBrowserVersion() != null && EapTools.getIEBrowserVersion() <= 8.0) {
        _class = "col-xs-" + _column * _handler._unitColumn;
    }*/
    _self._container = jQuery("<div class='" + _class + "' count='" + _column * _handler._unitColumn + "' key='" + _self.key + "'></div>");
    if (optionObj.isHidden) {
        _self._container.css({"display":"none"});
    }
    _self._label = jQuery("<label>" + _title + "</label>");
    if (_isRequired) {
        _self._isRequired = jQuery("<i style='color: red;' title='必填'>*</i>").appendTo(_self._label);
    }
    _self._label.appendTo(_self._container);
    _self._obj = jQuery("<input type='text' value='' style='width: 100%;'>").appendTo(_self._container);
};

//获取当前item的值
eap.ui.Input.prototype.getValue = function() {
    var _self = this;
    return _self._obj.val();
};

//设置当前item的值
eap.ui.Input.prototype.setValue = function(val) {
    var _self = this;
    _self._obj.val(val);
};

//获取当前item的jquery对象
eap.ui.Input.prototype.getObject = function() {
    var _self = this;
    return _self._obj;
};

//获取当前item的父容器jquery对象
eap.ui.Input.prototype.getContainer= function() {
    var _self = this;
    return _self._container;
};

//获取单签item的label显示值
eap.ui.Input.prototype.getLabel = function() {
    var _self = this;
    return _self._label;
};

//设置当前item可用
eap.ui.Input.prototype.enable = function() {
    var _self = this;
    _self._obj.attr("disabled ", false);
};

//设置当前item不可用
eap.ui.Input.prototype.unable = function() {
    var _self = this;
    _self._obj.attr("disabled ", true);
};

//Button组件
eap.ui.Button = function(options, _handler, index) {
    this._obj = null;
    this.key = options.key;
    this._group = options.group;
    this._value = options.value;
    this._icon = options.icon;
    this._type = options.type;
    this._parentHandler = _handler; //父句柄
    this._init(options, _handler, index);
};

//初始化按钮组件
eap.ui.Button.prototype._init = function(options, _handler, index) {
    var _self = this;
    _self._obj = jQuery("<button type='button' class='btn btn-default' key='" + _self.key + "'></button>");
    _self._obj.append("<i class='icon-" +_self._icon + "'></i>" + _self._value);
};

//获取button的显示文本值
eap.ui.Button.prototype.getValue = function() {
    var _self = this;
    return _self._value;
};

eap.ui.Button.setGroup = function(group) {
    if (!ContentConfig.getGroup()[group]) {  //分组存在
        layer.alert("您说选择的分组不存在，请从选！", 3);
        return;
    }
    var _self = this;
    _self._parentHandler._buttonsHandler.find("div").each(function(){
        if (jQuery(this).attr("group") === group) {
            _self.getObject().appendTo(jQuery(this));
            _self._group = group;
        }
    });
};

//获取按钮所在的组
eap.ui.Button.prototype.getGroup = function() {
    var _self = this;
    return _self._group;
};

//获取按钮jquery对象
eap.ui.Button.prototype.getObject = function() {
    var _self = this;
    return _self._obj;
};

//设置显示文字
eap.ui.Button.prototype.setValue = function(value) {
    var _self = this;
    var oldHtml = _self.getObject().html();
    _self.getObject().html(oldHtml.replace(_self.getValue(), value));
    _self._value = value;
};

//设置按钮的显示图标
eap.ui.Button.prototype.setIcon = function(icon) {
    var _self = this;
    _self.getObject().removeClass("glyphicon-" + _self.getIcon());
    _self.getObject().addClass("glyphicon-" + icon);
    _self._icon = icon;
};

//获取按钮的显示图标icon
eap.ui.Button.prototype.getIcon = function() {
    var _self = this;
    return _self._icon;
};

//radio
eap.ui.Radio = function(options, _handler, index, dictObj) {
    this.key = options.key;
    this._container = null;
    this._label = null;
    this._obj = null;
    this._style = options.style;
    this._default = options["default"];
    this._dict = options.dict;
    this._init(options, _handler, index, dictObj);
};

//初始化
eap.ui.Radio.prototype._init = function(options, _handler, index, dictObj){
    var _self = this;
    var _column = options.column;
    var _isRequired = options.isRequired;
    var _class = "span" + _column * _handler._unitColumn;
    _self._container = jQuery("<div class='" + _class + "' count='" + _column * _handler._unitColumn + "' key='" + _self.key + "'></div>");
    if (options.isHidden) {
        _self._container.css({"display":"none"});
    }
    var _self = this;
    _self._obj = jQuery("<div style='width: 100%; height: 26px;margin-top: -8px;'></div>");
    _self._installDict(dictObj);
    _self._label = jQuery("<label>" + options.label + "</label>");
    if (_isRequired) {
        _self._isRequired = jQuery("<i style='color: red;' title='必填'>*</i>").appendTo(_self._label);
    }
    _self._label.appendTo(_self._container);
    _self._obj.appendTo(_self._container);
};

eap.ui.Radio.prototype._installDict = function(dictObj) {
    var _self = this;
    for (var i in dictObj) {
        var radioInputArray = new Array();
        radioInputArray.push("<label class='radio inline'>");
        radioInputArray.push("<input type='radio' name='" + _self.getDict() + "'"," ", "value= ", i);
        if (i === this._default) {
            radioInputArray.push(" checked='true'>");
        } else {
            radioInputArray.push(">");
        }
        radioInputArray.push("<span class='radio-span'>", dictObj[i], "</span>", "</label>");
        _self._obj.append(radioInputArray.join(""));
    }
};

//获取字典编码
eap.ui.Radio.prototype.getDict = function() {
    var _self = this;
    return _self._dict;
};

//替换字典编码
eap.ui.Radio.prototype.setDict = function(dict) {
    var _self = this;
    _self._dict = dict;
    for (var i = 0; i < _self._parentHandler._dicts.length; i++) {
        var thisDictObj = _self._parentHandler._dicts[i];
        if (thisDictObj.key === dict) {
            _self._installDict(thisDictObj.values);
        }
    }
};

//获取当前item的值
eap.ui.Radio.prototype.getValue = function() {
    var _self = this;
    return jQuery("input[name='" + _self.getDict() + "']:checked", _self.getObject()).val();

};

//设置当前item的值
eap.ui.Radio.prototype.setValue = function(val) {
    var _self = this;
    jQuery("input[name='" + _self.getDict() + "'][value='" + val + "']").attr("checked",true);
};

//获取当前item的jquery对象
eap.ui.Radio.prototype.getObject = function() {
    var _self = this;
    return _self._obj;
};

//获取当前item的父容器jquery对象
eap.ui.Radio.prototype.getContainer= function() {
    var _self = this;
    return _self._container;
};

//获取单签item的label显示值
eap.ui.Radio.prototype.getLabel = function() {
    var _self = this;
    return _self._label;
};

//设置当前item可用
eap.ui.Radio.prototype.enable = function() {
    var _self = this;
    _self._container.attr("disabled ", false);
};

//设置当前item不可用
eap.ui.Radio.prototype.unable = function() {
    var _self = this;
    _self._container.attr("disabled ", true);
};

//checkBox
eap.ui.CheckBox = function(options, _handler, index, dictObj) {
    this.key = options.key;
    this._container = null;
    this._label = null;
    this._obj = null;
    this._style = options.style;
    this._default = options["default"];
    this._dict = options.dict;
    this._parentHandler = _handler; //父句柄
    this._init(options, _handler, index, dictObj);

};

//初始化
eap.ui.CheckBox.prototype._init = function(options, _handler, index, dictObj){
    var _self = this;
    var _column = options.column;
    var _isRequired = options.isRequired;
    var _class = "span" + _column * _handler._unitColumn;
    _self._container = jQuery("<div class='" + _class + "' count='" + _column * _handler._unitColumn + "' key='" + _self.key + "'></div>");
    if (options.isHidden) {
        _self._container.css({"display":"none"});
    }
    var _self = this;
    _self._obj = jQuery("<div style='width: 100%; height: 26px;margin-top: -8px;'></div>");
    _self._installDict(dictObj);
    _self._label = jQuery("<label>" + options.label + "</label>");
    if (_isRequired) {
        _self._isRequired = jQuery("<i style='color: red;' title='必填'>*</i>").appendTo(_self._label);
    }
    _self._label.appendTo(_self._container);
    _self._obj.appendTo(_self._container);
};

eap.ui.CheckBox.prototype._installDict = function(dictObj) {
    var _self = this;
    for (var i in dictObj) {
        var radioInputArray = new Array();
        radioInputArray.push("<label class='checkbox inline'>");
        radioInputArray.push("<input type='checkbox' name='" + _self.getDict() + "'"," ", "value=", i);
        if (i === this._default) {
            radioInputArray.push(" checked='true'>");
        } else {
            radioInputArray.push(">");
        }
        radioInputArray.push("<span class='checkbox-span'>", dictObj[i], "</span>", "</label>");
        _self._obj.append(radioInputArray.join(""));
    }
};

//获取当前item的值
eap.ui.CheckBox.prototype.getValue = function() {
    var _self = this;
    var val = new Array();
    jQuery("input[name='" + _self.getDict() + "']:checked", _self.getObject()).each(function(){
        val.push(jQuery(this).val());
    });
    return val.join(",");
};

//设置当前item的值
eap.ui.CheckBox.prototype.setValue = function(val) {
    var _self = this;
    if (typeof val === "string") {  //数字，已逗号分隔
        var valArray = val.split(",");
        for (var i = 0; i < valArray.length; i++) {
            jQuery("input[name='" + _self.getDict() + "'][value='" + valArray[i] + "']").attr("checked",true);
        }
    } else if (typeof val === "array") {
        for (var i = 0; i < val.length; i++) {  //数组形式
            jQuery("input[name='" + _self.getDict() + "'][value='" + val[i] + "']").attr("checked",true);
        }
    }

};

//获取字典code
eap.ui.CheckBox.prototype.getDict = function() {
    var _self = this;
    return _self._dict;
};

eap.ui.CheckBox.prototype.setDict = function(dict) {
    var _self = this;
    _self._dict = dict;
    for (var i = 0; i < _self._parentHandler._dicts.length; i++) {
        var thisDictObj = _self._parentHandler._dicts[i];
        if (thisDictObj.key === dict) {
            _self._installDict(thisDictObj.values);
        }
    }
};

//获取当前item的jquery对象
eap.ui.CheckBox.prototype.getObject = function() {
    var _self = this;
    return _self._obj;
};

//获取当前item的父容器jquery对象
eap.ui.CheckBox.prototype.getContainer= function() {
    var _self = this;
    return _self._container;
};

//获取单签item的label显示值
eap.ui.CheckBox.prototype.getLabel = function() {
    var _self = this;
    return _self._label;
};

//设置当前item可用
eap.ui.CheckBox.prototype.enable = function() {
    var _self = this;
    _self._container.attr("disabled ", false);
};

//设置当前item不可用
eap.ui.CheckBox.prototype.unable = function() {
    var _self = this;
    _self._container.attr("disabled ", true);
};

eap.ui.Textarea = function(options, _handler, index) {
    this._obj = null;
    this._container = null;
    this._label = null;
    this.key = options.key;
    this._init(options, _handler, index);
};

eap.ui.Textarea.prototype._init = function(options, _handler, index) {
    var _self = this;
    var _column = options.column;
    var _title = options.label;
    var _isRequired = options.isRequired;
    var _class = "span" + _column * _handler._unitColumn;
    /*if (EapTools.getIEBrowserVersion() != null && EapTools.getIEBrowserVersion() <= 8.0) {
        _class = "col-xs-" + _column * _handler._unitColumn;
    }*/
    _self._container = jQuery("<div class='" + _class + "' count='" + _column * _handler._unitColumn + "' key='" + _self.key + "'></div>");
    if (options.isHidden) {
        _self._container.css({"display":"none"});
    }
    _self._label = jQuery("<label>" + _title + "</label>");
    if (_isRequired) {
        _self._isRequired = jQuery("<i style='color: red;' title='必填'>*</i>").appendTo(_self._label);
    }
    _self._label.appendTo(_self._container);
    _self._obj = jQuery("<textarea type='text'style='width: 100%;' rows='3'></textarea>").appendTo(_self._container);
};

//获取当前item的值
eap.ui.Textarea.prototype.getValue = function() {
    var _self = this;
    return _self._obj.text();
};

//设置当前item的值
eap.ui.Textarea.prototype.setValue = function(val) {
    var _self = this;
    _self._obj.text(val);
};

//获取当前item的jquery对象
eap.ui.Textarea.prototype.getObject = function() {
    var _self = this;
    return _self._obj;
};

//获取当前item的父容器jquery对象
eap.ui.Textarea.prototype.getContainer= function() {
    var _self = this;
    return _self._container;
};

//获取单签item的label显示值
eap.ui.Textarea.prototype.getLabel = function() {
    var _self = this;
    return _self._label;
};

//设置当前item可用
eap.ui.Textarea.prototype.enable = function() {
    var _self = this;
    _self._obj.attr("disabled ", false);
};

//设置当前item不可用
eap.ui.Textarea.prototype.unable = function() {
    var _self = this;
    _self._obj.attr("disabled ", true);
};

//下拉选择
eap.ui.Select = function (options, _handler, index, dictObj) {
    this.key = options.key;
    this._container = null;
    this._label = null;
    this._obj = null;
    this._style = options.style;
    this._default = options["default"];
    this._dict = options.dict;
    this._parentHandler = _handler; //父句柄
    this._init(options, _handler, index, dictObj);
};

//初始化
eap.ui.Select.prototype._init = function(options, _handler, index, dictObj) {
    var _self = this;
    var _column = options.column;
    var _isRequired = options.isRequired;
    var _class = "span" + _column * _handler._unitColumn;
    _self._container = jQuery("<div class='" + _class + "' count='" + _column * _handler._unitColumn + "' key='" + _self.key + "'></div>");
    if (options.isHidden) {
        _self._container.css({"display":"none"});
    }
    var _self = this;
    _self._obj = jQuery("<div style='width: 100%;'></div>");
    _self._installDict(dictObj);
    _self._label = jQuery("<label>" + options.label + "</label>");
    if (_isRequired) {
        _self._isRequired = jQuery("<i style='color: red;' title='必填'>*</i>").appendTo(_self._label);
    }
    _self._label.appendTo(_self._container);
    _self._obj.appendTo(_self._container);
};

eap.ui.Select.prototype._installDict = function(dictObj) {
    var _self = this;
    var radioInputArray = new Array();
    radioInputArray.push("<select name='---选择---' class='card-select'>");
    radioInputArray.push("<option value=''>---</option>");
    for (var i in dictObj) {
        radioInputArray.push("<option value='" + i + "'");
        if (i === this._default) {
            radioInputArray.push(" selected='selected'>", dictObj[i],"</option>");
        } else {
            radioInputArray.push(">", dictObj[i], "</option>");
        }
    }
    radioInputArray.push("</select>");
    _self._obj.append(radioInputArray.join(""));
    radioInputArray = null;
};

//获取当前item的值
eap.ui.Select.prototype.getValue = function() {
    var _self = this;
    var val = new Array();
    jQuery("input[name='" + _self.getDict() + "']:checked", _self.getObject()).each(function(){
        val.push(jQuery(this).val());
    });
    return val.join(",");
};

//设置当前item的值
eap.ui.Select.prototype.setValue = function(val) {
    var _self = this;
    //TODO
};

//获取字典code
eap.ui.Select.prototype.getDict = function() {
    var _self = this;
    return _self._dict;
};

eap.ui.Select.prototype.setDict = function(dict) {
    var _self = this;
    _self._dict = dict;
    for (var i = 0; i < _self._parentHandler._dicts.length; i++) {
        var thisDictObj = _self._parentHandler._dicts[i];
        if (thisDictObj.key === dict) {
            _self._installDict(thisDictObj.values);
        }
    }
};

//获取当前item的jquery对象
eap.ui.Select.prototype.getObject = function() {
    var _self = this;
    return _self._obj;
};

//获取当前item的父容器jquery对象
eap.ui.Select.prototype.getContainer= function() {
    var _self = this;
    return _self._container;
};

//获取单签item的label显示值
eap.ui.Select.prototype.getLabel = function() {
    var _self = this;
    return _self._label;
};

//设置当前item可用
eap.ui.Select.prototype.enable = function() {
    var _self = this;
    _self._container.attr("disabled ", false);
};

//设置当前item不可用
eap.ui.Select.prototype.unable = function() {
    var _self = this;
    _self._container.attr("disabled ", true);
};