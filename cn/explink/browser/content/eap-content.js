var ContentData = {
    "userColumn":6,
    //……你的操作表，规则(role)
    "title":"预付款冲正",
    "items":[{
        "type":"input",
        "label":"标题",
        "column":6,
        "isRequired":true,
        "key":"title"
    },{
        "type":"select",
        "label":"类型",
        "column":3,
        "isRequired":false,
        "key":"type",
        "dict":"type_dict",
        "default":"dd"
    },{
        "type":"radio",
        "label":"是否",
        "column":3,
        "isRequired":false,
        "key":"is_exit",
        "dict":"exit_type",
        "default":"y",
        //"style":"default",
        "style":"popular",
        "icon":"default"
        //"icon":"primary"
    },{
        "type":"input",
        "label":"年龄",
        "column":3,
        "isRequired":true,
        "key":"age"
    },{
        "type":"input",
        "label":"名字",
        "column":3,
        "isRequired":true,
        "key":"name"
    },{
        "type":"input",
        "label":"地址",
        "column":3,
        "isRequired":true,
        "key":"addre"
    },{
        "type":"input",
        "label":"金额",
        "column":2,
        "isRequired":false,
        "key":"money"
    },{
        "type":"input",
        "label":"个数",
        "column":2,
        "isRequired":false,
        "key":"count"
    },/*{
        "type":"input",
        "label":"单价",
        "column":2,
        "isRequired":false,
        "key":"price"
    },*/{
        "type":"checkbox",
        "label":"选择类型",
        "column":2,
        "isRequired":false,
        "key":"check_type",
        "dict":"type_dict",
        "default":"dd",
        //"style":"default",
        "style":"popular",
        "icon":"default"
        //"icon":"primary"
    },{
        "type":"textarea",
        "label":"备注",
        "column":6,
        "isRequired":false,
        "key":"memo"
    }],
    "dicts":[{
        "key":"type_dict",
        "values":{
            "dd":"当当",
            "jd":"京东",
            "ymx":"亚马逊"
        }
    },{
        "key":"exit_type",
        "values":{
            "y":"是",
            "n":"否"
        }
    }],
    "buttons":[{
        "key":"add",
        "icon":"plus",
        "value":"新增",
        "type":"list",
        "group":"default"
    },{
        "key":"modify",
        "icon":"floppy-disk",
        "value":"保存",
        "type":"card",
        "group":"default"
    },{
        "key":"drop",
        "icon":"minus",
        "value":"删除",
        "type":"list",
        "group":"default"
    },{
        "key":"query",
        "icon":"eye-open",
        "value":"查看",
        "type":"list",
        "group":"search"
    },{
        "key":"download",
        "icon":"inbox",
        "value":"导出",
        "type":"list",
        "group":"exp"
    }]
};
var ContentConfig = {
    "columnsConfig":function(){
        return {
            "getStaticColumns" : function() {
                return 12;
            },
            "getItemsType" : function() {
                return {
                    "input":"input",
                    "select":"select",
                    "radio":"radio",
                    "checkbox":"checkbox",
                    "textarea":"textarea",
                    "button":"button"
                };
            },
            "getButtonGroup":function(){
                return{
                    "default":"default",
                    "search":"search",
                    "exp":"exp",
                    "other":"other"
                }
            },
            "getCardConfig":function(){
                return "card";
            },
            "getListConfig":function() {
                return "list";
            },
            "getRadioStyles":function() {
                return {
                    "popular" : "popular",
                    "default" : "default"
                }
            },
            "getCheckBoxStyles":function() {
                return {
                    "popular" : "popular",
                    "default" : "default"
                }
            }
        };
    }
};