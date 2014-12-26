EapTools.namespace("eap.ui");

//card
eap.ui.Card = function(options) {
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
        } else if(ContentConfig.columnsConfig().getItemsType().checkbox === _selfItemObj.type) { //radio
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
        }else if(ContentConfig.columnsConfig().getItemsType().textarea === _selfItemObj.type) { //select
            _self._items.push(new eap.ui.Textarea(_selfItemObj, _self, i));
        }/* else if(ItemsType.select === _selfItemObj.type) { //select
         _self._items.push(new explink.ui.select(_selfItemObj, _self, i));
         } else if(ItemsType.radio === _selfItemObj.type) { //radio
         _self._items.push(new explink.ui.Radio(_selfItemObj, _self, i));
         } else if(ItemsType.checkbox === _selfItemObj.type) { //check
         _self._items.push(new explink.ui.checkbox(_selfItemObj, _self, i));
         } else if(ItemsType.textarea === _selfItemObj.type) { //textarea
         _self._items.push(new explink.ui.textarea(_selfItemObj, _self, i));
         }else { //input
         _self._items.push(new explink.ui.Input(_selfItemObj, _self, i));
         }*/
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
        thisRowObj.appendTo(jQuery("div[id='card_container']"));
    }
    itemsArray = null;
};

//安装按钮数据
eap.ui.Card.prototype._installButtons = function() {
    var _self = this;
    //安装buttons
    for (var j in ContentConfig.columnsConfig().getButtonGroup()) {
        var buttonGroup = jQuery("<div class='btn btn-group' group='" + j + "'></div>");
        //debugger;
        for (var i = 0; i < _self.getButtons().length; i++) {
            var thisButtonObj = _self.getButtons()[i];
            var thisBtnGroup = thisButtonObj.getGroup();
            if (j === thisBtnGroup) { //同组添加
                thisButtonObj.getObject().appendTo(buttonGroup);
            }
        }
        buttonGroup.appendTo(jQuery("div[id='card_btn_bar']"));
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
    var _class = "col-lg-" + _column * _handler._unitColumn;
    if (!EapTools.getIEBrowserVersion("8.0", true)) {
        _class = "col-xs-" + _column * _handler._unitColumn;
    }
    _self._container = jQuery("<div class='" + _class + "' count='" + _column * _handler._unitColumn + "' key='" + _self.key + "'></div>");
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
    //<button type="button" class="btn btn-default btn-lg">
    //<span class="glyphicon glyphicon-star"></span> Star
    //</button>
    this._obj = null;
    this.key = options.key;
    this._group = options.group;
    this._value = options.value;
    this._icon = options.icon;
    this._type = options.type;
    this._init(options, _handler, index);
};

//初始化按钮组件
eap.ui.Button.prototype._init = function(options, _handler, index) {
    var _self = this;
    _self._obj = jQuery("<button type='button' class='btn-default' key='" + _self.key + "'></button>");
    _self._obj.append("<span class='glyphicon glyphicon-" + _self._icon+ "'></span> " + _self._value);
};

//获取button的显示文本值
eap.ui.Button.prototype.getValue = function() {
    var _self = this;
    return _self._value;
};

/*eap.ui.Button.setGroup = function(group) {
    if (!ContentConfig.getGroup()[group]) {  //分组存在
        layer.alert("您说选择的分组不存在，请从选！", 3);
        return;
    }
    var _self = this;
    _self._group = group;
};*/

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

/*eap.ui.Button.prototype.setValue = function(value) {
    var _self = this;
    _self._value = value;

};*/

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
    this._init(options, _handler, index, dictObj);
};

//初始化
eap.ui.Radio.prototype._init = function(options, _handler, index, dictObj){
    var _self = this;
    var _column = options.column;
    var _isRequired = options.isRequired;
    var _class = "col-lg-" + _column * _handler._unitColumn;
    if (!EapTools.getIEBrowserVersion("8.0", true)) {
        _class = "col-xs-" + _column * _handler._unitColumn;
    }
    _self._container = jQuery("<div class='" + _class + "' count='" + _column * _handler._unitColumn + "' key='" + _self.key + "'></div>");
    if (_self._style === ContentConfig.columnsConfig().getRadioStyles()["popular"]) {  //流行模式
        _self._obj = jQuery("<div class='btn-group' data-toggle='buttons' style='width: 100%;'></div>");
        for (var i in dictObj) {
            var thisRadioLabelArray = new Array();
            thisRadioLabelArray.push("<label style='height:26px;' class='btn btn-" + (options.icon || 'default'));
            if (i === this._default) {
                thisRadioLabelArray.push(" active'>");
            } else {
                thisRadioLabelArray.push("'>");
            }
            thisRadioLabelArray.push("<input type='radio' name='" + options.dict + "'");
            thisRadioLabelArray.push(" id='" + options.dict + "_" + i + "' autocomplete='off' value='" + i + "'>");
            thisRadioLabelArray.push(dictObj[i] + "</label>");
            _self._obj.append(thisRadioLabelArray.join(""));
        }
    } else if (_self._style === ContentConfig.columnsConfig().getRadioStyles()["default"]) {   //默认
        _self._obj = jQuery("<div style='width: 100%; height: 26px;'></div>");
        for (var i in dictObj) {
            var radioInputArray = new Array();
            radioInputArray.push("<label style='margin-right:10px;'>");
            radioInputArray.push("<input type='radio' name='" + options.dict + "'"," ", "value=", i);
            if (i === this._default) {
                radioInputArray.push(" checked='true'>");
            } else {
                radioInputArray.push(">");
            }
            radioInputArray.push(dictObj[i], "</label>");
            _self._obj.append(radioInputArray.join(""));
        }
    }
    _self._label = jQuery("<label>" + options.label + "</label>");
    if (_isRequired) {
        _self._isRequired = jQuery("<i style='color: red;' title='必填'>*</i>").appendTo(_self._label);
    }
    _self._label.appendTo(_self._container);
    _self._obj.appendTo(_self._container);
};

//获取当前item的值
eap.ui.Radio.prototype.getValue = function() {
    var _self = this;
    if (_self._style === ContentConfig.columnsConfig().getRadioStyles()["popular"]) {  //流行
        _self._obj.find("label").each(function(){
            if (jQuery(this).hasClass("active")) {
                return jQuery(this).find("input").eq(0).val();
            }
        });
    }else if (_self._style === ContentConfig.columnsConfig().getRadioStyles()["default"]) {

    }

};

//设置当前item的值
eap.ui.Radio.prototype.setValue = function(val) {
    var _self = this;
    _self._obj.find("label").each(function(){
        if (jQuery(this).find("input").eq(0).val() === val) {
            jQuery(this).addClass("active");
        } else {
            if(jQuery(this).hasClass("active")) {
                jQuery(this).removeClass("active");
            }
        }
    });
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
    this._init(options, _handler, index, dictObj);

};

//初始化
eap.ui.CheckBox.prototype._init = function(options, _handler, index, dictObj){
    var _self = this;
    var _column = options.column;
    var _isRequired = options.isRequired;
    var _class = "col-lg-" + _column * _handler._unitColumn;
    if (!EapTools.getIEBrowserVersion("8.0", true)) {
        _class = "col-xs-" + _column * _handler._unitColumn;
    }
    _self._container = jQuery("<div class='" + _class + "' count='" + _column * _handler._unitColumn + "' key='" + _self.key + "'></div>");
    if (_self._style === ContentConfig.columnsConfig().getRadioStyles()["popular"]) {  //流行模式
        _self._obj = jQuery("<div class='btn-group' data-toggle='buttons' style='width: 100%;'></div>");
        for (var i in dictObj) {
            var thisRadioLabelArray = new Array();
            thisRadioLabelArray.push("<label style='height:26px;' class='btn btn-" + (options.icon || 'default'));
            if (i === this._default) {
                thisRadioLabelArray.push(" active'>");
            } else {
                thisRadioLabelArray.push("'>");
            }
            thisRadioLabelArray.push("<input type='checkbox' name='" + options.dict + "'");
            thisRadioLabelArray.push(" id='" + options.dict + "_" + i + "' autocomplete='off' value='" + i + "'>");
            thisRadioLabelArray.push(dictObj[i] + "</label>");
            _self._obj.append(thisRadioLabelArray.join(""));
        }
    } else if (_self._style === ContentConfig.columnsConfig().getRadioStyles()["default"]) {   //默认
        _self._obj = jQuery("<div style='width: 100%; height: 26px;'></div>");
        for (var i in dictObj) {
            var radioInputArray = new Array();
            radioInputArray.push("<label style='margin-right:10px;'>");
            radioInputArray.push("<input type='checkbox' name='" + options.dict + "'"," ", "value=", i);
            if (i === this._default) {
                radioInputArray.push(" checked='true'>");
            } else {
                radioInputArray.push(">");
            }
            radioInputArray.push(dictObj[i], "</label>");
            _self._obj.append(radioInputArray.join(""));
        }
    }
    _self._label = jQuery("<label>" + options.label + "</label>");
    if (_isRequired) {
        _self._isRequired = jQuery("<i style='color: red;' title='必填'>*</i>").appendTo(_self._label);
    }
    _self._label.appendTo(_self._container);
    _self._obj.appendTo(_self._container);
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
    var _class = "col-lg-" + _column * _handler._unitColumn;
    if (!EapTools.getIEBrowserVersion("8.0", true)) {
        _class = "col-xs-" + _column * _handler._unitColumn;
    }
    _self._container = jQuery("<div class='" + _class + "' count='" + _column * _handler._unitColumn + "' key='" + _self.key + "'></div>");
    _self._label = jQuery("<label>" + _title + "</label>");
    if (_isRequired) {
        _self._isRequired = jQuery("<i style='color: red;' title='必填'>*</i>").appendTo(_self._label);
    }
    _self._label.appendTo(_self._container);
    _self._obj = jQuery("<textarea type='text'style='width: 100%;'></textarea>").appendTo(_self._container);
};

//获取当前item的值
eap.ui.Textarea.prototype.getValue = function() {
    var _self = this;
    return _self._obj.val();
};

//设置当前item的值
eap.ui.Textarea.prototype.setValue = function(val) {
    var _self = this;
    _self._obj.val(val);
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
