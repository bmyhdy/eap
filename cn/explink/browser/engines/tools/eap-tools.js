var EapTools = {
    "namespace": function(path){
        var arr = path.split(".");
        var ns = "";
        for(var i=0;i<arr.length;i++){
            if(i>0) ns += ".";
            ns += arr[i];
            eval("if(typeof(" + ns + ") == 'undefined') " + ns + " = new Object();");
        }
    },
    "getIntOfDivision":function(staticColumn, useColumn) {   //获取两个数商的整数部分
        if (typeof staticColumn !== "number" || typeof useColumn !== "number") {
            layer.alert('参数类型不合法，请输入数字类型参数！',3);
            return null;
        }
        if (useColumn === 0) {
            layer.alert('除数不能为0！',3);
            return null;
        }
        return Math.floor(staticColumn / useColumn);
    },
    "getIEBrowserVersion":function(version, isLg) { //判断浏览器是否为某个版本， islg参数为true表示IE version+
        var browser = navigator.appName
        var b_version = navigator.appVersion
        var version = b_version.split(";");
        var trim_Version = version[1].replace(/[ ]/g,"");
        if (browser == "Microsoft Internet Explorer") {
            if (!isLg) {
               trim_Version === "MSIE" + version ? true : false;
            } else {
                if (parseFloat(version > parseFloat(trim_Version.replace("MSIE", "")))) {
                    return true;
                }
            }
            return false;
        }
        return true;
    }
}; //new Object();