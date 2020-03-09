"object"!=typeof JSON&&(JSON={}),function(){"use strict";var rx_one=/^[\],:{}\s]*$/,rx_two=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,rx_three=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,rx_four=/(?:^|:|,)(?:\s*\[)+/g,rx_escapable=/[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,rx_dangerous=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta,rep;function f(t){return t<10?"0"+t:t}function this_value(){return this.valueOf()}function quote(t){return rx_escapable.lastIndex=0,rx_escapable.test(t)?'"'+t.replace(rx_escapable,function(t){var e=meta[t];return"string"==typeof e?e:"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+t+'"'}function str(t,e){var r,n,o,u,f,a=gap,i=e[t];switch(i&&"object"==typeof i&&"function"==typeof i.toJSON&&(i=i.toJSON(t)),"function"==typeof rep&&(i=rep.call(e,t,i)),typeof i){case"string":return quote(i);case"number":return isFinite(i)?String(i):"null";case"boolean":case"null":return String(i);case"object":if(!i)return"null";if(gap+=indent,f=[],"[object Array]"===Object.prototype.toString.apply(i)){for(u=i.length,r=0;r<u;r+=1)f[r]=str(r,i)||"null";return o=0===f.length?"[]":gap?"[\n"+gap+f.join(",\n"+gap)+"\n"+a+"]":"["+f.join(",")+"]",gap=a,o}if(rep&&"object"==typeof rep)for(u=rep.length,r=0;r<u;r+=1)"string"==typeof rep[r]&&(o=str(n=rep[r],i))&&f.push(quote(n)+(gap?": ":":")+o);else for(n in i)Object.prototype.hasOwnProperty.call(i,n)&&(o=str(n,i))&&f.push(quote(n)+(gap?": ":":")+o);return o=0===f.length?"{}":gap?"{\n"+gap+f.join(",\n"+gap)+"\n"+a+"}":"{"+f.join(",")+"}",gap=a,o}}"function"!=typeof Date.prototype.toJSON&&(Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null},Boolean.prototype.toJSON=this_value,Number.prototype.toJSON=this_value,String.prototype.toJSON=this_value),"function"!=typeof JSON.stringify&&(meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},JSON.stringify=function(t,e,r){var n;if(indent=gap="","number"==typeof r)for(n=0;n<r;n+=1)indent+=" ";else"string"==typeof r&&(indent=r);if((rep=e)&&"function"!=typeof e&&("object"!=typeof e||"number"!=typeof e.length))throw new Error("JSON.stringify");return str("",{"":t})}),"function"!=typeof JSON.parse&&(JSON.parse=function(text,reviver){var j;function walk(t,e){var r,n,o=t[e];if(o&&"object"==typeof o)for(r in o)Object.prototype.hasOwnProperty.call(o,r)&&(void 0!==(n=walk(o,r))?o[r]=n:delete o[r]);return reviver.call(t,e,o)}if(text=String(text),rx_dangerous.lastIndex=0,rx_dangerous.test(text)&&(text=text.replace(rx_dangerous,function(t){return"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)})),rx_one.test(text.replace(rx_two,"@").replace(rx_three,"]").replace(rx_four,"")))return j=eval("("+text+")"),"function"==typeof reviver?walk({"":j},""):j;throw new SyntaxError("JSON.parse")})}();

var expressionsArray = [];
var expressionObj = {
        "Sample Expression 1": "time*500",
        "Sample Expression 2": "temp = transform.position;\rif(temp[0] > 500) {\r[temp, temp*5]\r} else {\r[temp*5, temp]\r}",
    };

var expressionFile = File("~/Desktop/expressions.pref");
if(!expressionFile.exists) {
        expressionFile.open("w");
        expressionFile.write(JSON.stringify(expressionObj));
        expressionFile.close();
    } else {
        expressionFile.open("r");
        expressionObj = JSON.parse(expressionFile.read());
        expressionFile.close();
        }
    
for(var k in expressionObj) {
    expressionsArray.push(k);
    }

var mainWindow = new Window("palette", "Expression Locker", undefined);
mainWindow.orientation = "column";

var groupOne = mainWindow.add("group", undefined, "groupOne");
groupOne.orientation = "column";
var dd = groupOne.add("dropdownlist", undefined, expressionsArray);
dd.selection = 0;
dd.size = [220, 25];
var displayText = groupOne.add("statictext", undefined, expressionObj[expressionsArray[0]], {multiline: true});
displayText.size = [300, 100];

var groupTwo = mainWindow.add("group", undefined, "groupTwo");
groupTwo.orientation = "row";
var saveButton = groupTwo.add("button", undefined, "Save");
var applyButton = groupTwo.add("button", undefined, "Apply");

mainWindow.center();
mainWindow.show();

dd.onChange = function() {
    displayText.text = expressionObj[expressionsArray[dd.selection.index]];
    }

var newName;

saveButton.onClick = function() {
    if(app.project.activeItem == null || !(app.project.activeItem instanceof CompItem)) {
        alert("Please select a comp");
            return false;
        }
    if(app.project.activeItem.selectedLayers.length != 1) {
            alert("Please select a layer");
            return false;
        }
    if(app.project.activeItem.selectedLayers[0].selectedProperties.length != 1) {
            alert("Please select a property with an expression applied");
            return false;
        }
    if(!(app.project.activeItem.selectedLayers[0].selectedProperties[0].expressionEnabled)) {
        alert("Please select a property with an expression applied");
        return false;
        }
    newName = prompt ("Choose a name for your preset", "Expression Name", "Naming Prompt");
    
    if(newName) {
    expressionObj[newName] = app.project.activeItem.selectedLayers[0].selectedProperties[0].expression;
    expressionFile.open("w");
    expressionFile.write(JSON.stringify(expressionObj));
    expressionFile.close();
    refreshDD();
    }
    }

function refreshDD() {
        dd.removeAll();
        for(var i in expressionObj) {
            dd.add("item", i);
            }
        dd.selection = 0;
    }

applyButton.onClick = function() {
    if(app.project.activeItem == null || !(app.project.activeItem instanceof CompItem)) {
        alert("Please select a comp");
            return false;
        }
    if(app.project.activeItem.selectedLayers.length != 1) {
            alert("Please select a layer");
            return false;
        }
    if(app.project.activeItem.selectedLayers[0].selectedProperties.length < 1) {
            alert("Please select a property at least 1 property to apply the expression to");
            return false;
        }
    
    for(var q = 0; q < app.project.activeItem.selectedLayers[0].selectedProperties.length; q++) {
        app.project.activeItem.selectedLayers[0].selectedProperties[q].expression = expressionObj[expressionsArray[dd.selection.index]];
        }
    }