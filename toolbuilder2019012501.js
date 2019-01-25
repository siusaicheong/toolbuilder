/*Tranxtech ToolBuilder 2.1 (29 April 2015) | This work is licensed under CC BY-SA 3.0.*/
var setup, drawData, handleQueryResponse;

function check(v, d) {
    if (typeof v !== "undefined") return v;
    else return d
}

function addStyle(style) {
    if (style === "") return "";
    else return "style='" + style + "' "
}

function getUI(main) {
    var newLine = '<div style="height: 10px; overflow: hidden;"></div>';
    var lblInstructions = "<div class='paragraph' " + addStyle(main.instructions_style) + ">" + main.instructions + "</div>";
    var txtInput = '<input class="wsite-input wsite-search-element-input" type="text" placeholder="' + main.input_hint + '" ' + addStyle(main.input_style) + 'data-tranxid="txtInput" data-tranxinstant = "' + main.instantsearch + '"/>';
    var btnSearch = "";
    var btnStartRecognition = "";
    var btnClear = "";
    if (main.buttons_theme == "true") {
        if (main.searchbutton_show ==
            "true") btnSearch = '<a class="wsite-button wsite-button-small wsite-button-highlight" data-tranxid=\'btnSearch\'><span class="wsite-button-inner">' + main.searchbutton + "</span></a>";
        btnStartRecognition = '<a class="wsite-button wsite-button-small wsite-button-highlight" data-tranxid=\'btnStartRecognition\'><span class="wsite-button-inner">' + "Start Recognition" + "</span></a>";
        if (main.clearbutton_show == "true") btnClear = '<a class="wsite-button wsite-button-small wsite-button-highlight" data-tranxid=\'btnClear\'><span class="wsite-button-inner">' +
            main.clearbutton + "</span></a>"
    } else {
        if (main.searchbutton_show == "true") btnSearch = "<button " + addStyle(main.buttons_style) + "data-tranxid='btnSearch'>" + main.searchbutton + "</button>";
        btnStartRecognition = "<button " + addStyle(main.buttons_style) + "data-tranxid='btnStartRecognition'>Start Recognition</button>";
        if (main.clearbutton_show == "true") btnClear = "<button " + addStyle(main.buttons_style) + "data-tranxid='btnClear'>" + main.clearbutton + "</button>"
    }
    var divMessage = "";
    if (main.message_show == "true") divMessage = "<div data-tranxid='divMessage' " +
        addStyle(main.message_style) + "align='center'>" + main.message_ready + "</div>";
    var divOutput = "<div " + addStyle(main.output_style) + "data-tranxid='divOutput'></div>";
    return "<div align='" + main.align + "'>" + lblInstructions + newLine + txtInput + newLine + btnSearch + btnClear + newLine + divMessage + newLine + divOutput + "</div>"
}

function getQuery(columns, searchEncoded, mode, sensitivity) {
    var temp = "";
    for (var i = 0; i < columns.length; i++) {
        var columnName = String.fromCharCode(65 + i);
        if (sensitivity != "true" && mode != 3) columnName = "lower(" + columnName + ")";
        if (mode === 0) temp = temp + "(" + columnName + ' = "' + searchEncoded + '") ';
        else if (mode == 1) temp = temp + "(" + columnName + ' contains "' + searchEncoded + '") ';
        else if (mode == 2) temp = temp + '("' + searchEncoded + '" contains ' + columnName + ") ";
        else if (mode == 3) temp = temp + "(" + columnName + ') "' + columns[i] + '"';
        if (i < columns.length -
            1)
            if (mode === 0 || mode == 1 || mode == 2) temp = temp + "or ";
            else if (mode == 3) temp = temp + ", "
    }
    return temp
}

function getValue(input) {
    var startIndex = input.content.indexOf(input.start);
    var temp = "";
    if (startIndex != -1) {
        startIndex = startIndex + input.start.length;
        var endIndex = input.content.indexOf(input.end, startIndex);
        if (endIndex != -1) temp = input.content.substring(startIndex, endIndex)
    }
    return temp
}

function drawMultimedia(input) {
    var temp = "";
    var link = getValue({
        start: "link{",
        end: "}",
        content: input
    });
    var src = getValue({
        start: "show{",
        end: "}",
        content: input
    });
    console.log(link);
    console.log(src);
    return "<a href='" + link + "'><img style='max-width:50%;height:auto;' src='" + src + "'></a>"
}

function drawOutput(data, mode) {
    var temp_i = "";
    var heading = "";
    var value = "";
    if (mode == "2") {
        for (i = 0; i < data.getNumberOfRows(); i++) {
            var temp_d = "";
            for (d = 0; d < data.getNumberOfColumns(); d++) {
                value = data.getValue(i, d);
                if (value !== "null")
                    if (value.indexOf("func:") === 0) temp_d = temp_d + "<td>" + drawMultimedia(value) + "</td>";
                    else temp_d = temp_d + "<td>" + value + "</td>"
            }
            temp_i = temp_i + "<tr>" + temp_d + "</tr>"
        }
        var temp_h = "";
        for (k = 0; k < data.getNumberOfColumns(); k++) temp_h = temp_h + "<th>" + data.getColumnLabel(k) + "</th>";
        temp_i = "<table id='tblOutput'>" +
            "<thead><tr>" + temp_h + "</tr></thead><tbody>" + temp_i + "</tbody></table>"
    } else if (mode == "3") {
        for (i = 0; i < data.getNumberOfRows(); i++) {
            var temp_r = "";
            for (j = 0; j < data.getNumberOfColumns(); j++) {
                value = data.getValue(i, j);
                if (value !== "null")
                    if (value.indexOf("func:") === 0) temp_r = temp_r + "<tr style='border: 1px solid #ebebeb'><th>" + data.getColumnLabel(j) + "</th><td style='border: 1px solid #ebebeb'>" + drawMultimedia(value) + "</td></tr>";
                    else temp_r = temp_r + "<tr style='border: 1px solid #ebebeb'><th>" + data.getColumnLabel(j) +
                        "</th><td style='border: 1px solid #ebebeb'>" + value + "</td></tr>"
            }
            temp_i = temp_i + "<tr><th><br/></th><td><br/></td></tr>" + temp_r
        }
        temp_i = "<table id='tblOutput' >" + temp_i + "</table>"
    } else
        for (i = 0; i < data.getNumberOfRows(); i++) {
            var temp_j = "";
            for (j = 0; j < data.getNumberOfColumns(); j++) {
                console.log("label: " + data.getColumnLabel(j));
                value = data.getValue(i, j);
                if (value !== "null")
                    if (value.indexOf("func:") === 0) temp_j = temp_j + data.getColumnLabel(j) + ": " + drawMultimedia(value) + "<br/>";
                    else temp_j = temp_j + data.getColumnLabel(j) + ": " + value +
                        "<br/>"
            }
            temp_i = temp_i + temp_j + "<br/>"
        }
    
    
    
    return temp_i
}

function f(para) {
    inc("https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js", function() {
        $(document).ready(function() {
            var main = {};
            main.source = "1BtZDWosi3OLz-i5wsZedk_5mcNXmZnQ9pejuqMeyZEU";
            main.align = "center";
            main.columns = ["English", "Chinese"];
            main.output_mode = "4";
            main.search_mode = "exact";
            main.casesensitive = "true";
            main.instantsearch = "false";
            main.instructions = "Type and search here (Chinese or English) <br/> \u8acb\u5728\u6b64\u8f38\u5165\u8981\u641c\u5c0b\u7684\u6587\u5b57\uff08\u4e2d\u6587\u6216\u82f1\u6587\uff09";
            main.instructions_style =
                "";
            main.input_hint = "Search";
            main.input_style = "";
            main.buttons_theme = "true";
            main.buttons_style = "";
            main.searchbutton = "Search \u641c\u5c0b";
            main.clearbutton = "Clear \u6e05\u9664";
            main.searchbutton_show = "true";
            main.clearbutton_show = "true";
            main.message_show = "true";
            main.message_searching = "Status: Please wait... <br/> \u72c0\u614b\uff1a\u8acb\u7a0d\u5019......";
            main.message_style = "";
            main.message_ready = "Status: Ready <br/> \u72c0\u614b\uff1a\u6e96\u5099\u5c31\u7dd2";
            main.message_empty = "Status: Please provide the expression(s) to be searched <br/> \u72c0\u614b\uff1a\u8acb\u63d0\u4f9b\u8981\u641c\u5c0b\u7684\u5b57\u8a5e\u8a9e\u53e5";
            main.message_noresults = "Status: Sorry! No results have been found. The following (if any) are the last search results for your reference. <br/> \u72c0\u614b\uff1a\u62b1\u6b49\uff01\u67e5\u7121\u8cc7\u6599\u3002\u4ee5\u4e0b\uff08\u5982\u6709\u7684\u8a71\uff09\u662f\u4e0a\u6b21\u7684\u641c\u5c0b\u7d50\u679c\uff0c\u4ee5\u4f9b\u53c3\u8003\u3002";
            main.output_style = "";
            if (typeof para == "undefined") console.log("Default values are used.");
            else {
                main.source = check(para.source, main.source);
                main.align = check(para.align,
                    main.align);
                main.columns = check(para.columns, main.columns);
                main.output_mode = check(para.output_mode, main.output_mode);
                main.search_mode = check(para.search_mode, main.search_mode);
                main.casesensitive = check(para.casesensitive, main.casesensitive);
                main.instantsearch = check(para.instantsearch, main.instantsearch);
                main.instructions = check(para.instructions, main.instructions);
                main.instructions_style = check(para.instructions_style, main.instructions_style);
                main.input_hint = check(para.input_hint, main.input_hint);
                main.input_style =
                    check(para.input_style, main.input_style);
                main.buttons_theme = check(para.buttons_theme, main.buttons_theme);
                main.buttons_style = check(para.buttons_style, main.buttons_style);
                if (main.buttons_style !== "") main.buttons_theme = "false";
                main.searchbutton = check(para.searchbutton, main.searchbutton);
                main.clearbutton = check(para.clearbutton, main.clearbutton);
                main.searchbutton_show = check(para.searchbutton_show, main.searchbutton_show);
                main.clearbutton_show = check(para.clearbutton_show, main.clearbutton_show);
                main.message_show =
                    check(para.message_show, main.message_show);
                main.message_searching = check(para.message_searching, main.message_searching);
                main.message_style = check(para.message_style, main.message_style);
                main.message_ready = check(para.message_ready, main.message_ready);
                main.message_empty = check(para.message_empty, main.message_empty);
                main.message_noresults = check(para.message_noresults, main.message_noresults);
                main.output_style = check(para.output_style, main.output_style)
            }
            drawData = function() {
                $("[data-tranxid='divMessage']").html(main.message_searching);
                var search = $("[data-tranxid='txtInput']").val();
                if (search === "" || search === "") $("[data-tranxid='divMessage']").html(main.message_empty);
                else {
                    var searchEncoded = "";
                    if (main.casesensitive == "true") searchEncoded = encodeURIComponent(search);
                    else searchEncoded = encodeURIComponent(search.toLowerCase());
                    var q = "";
                    if (main.search_mode == "exact") q = "select * where " + getQuery(main.columns, searchEncoded, 0, main.casesensitive) + "label " + getQuery(main.columns, "", 3);
                    else q = "select * where " + getQuery(main.columns, searchEncoded,
                        1, main.casesensitive) + "or " + getQuery(main.columns, searchEncoded, 2, main.casesensitive) + "label " + getQuery(main.columns, "", 3);
                    console.log(q);
                    var query = new google.visualization.Query("https://docs.google.com/spreadsheets/d/" + main.source + "/gviz/tq?tq=" + q + "&tqx=reqId:1&pref=2&pli=1");
                    query.send(handleQueryResponse)
                }
            };
            handleQueryResponse = function(response) {
                if (response.isError()) {
                    alert("Error in query: " + response.getMessage() + " " + response.getDetailedMessage());
                    return
                }
                var data = response.getDataTable();
                var length =
                    data.getNumberOfRows();
                if (length === 0) $("[data-tranxid='divMessage']").html(main.message_noresults);
                else {
                    $("[data-tranxid='divMessage']").html(main.message_ready);
                    if (main.output_mode == "1") {
                        var output = new google.visualization.Table($("[data-tranxid='divOutput']")[0]);
                        output.draw(data, {
                            showRowNumber: true
                        })
                    } else {
                        var output_withHighlighting = drawOutput(data, main.output_mode);
                        var s = $("[data-tranxid='txtInput']").val();
                        altExps = [(s.charAt(0).toUpperCase() + string.slice(1)),(s.charAt(0).toLowerCase() + string.slice(1))];
                        for(var i=0;i<altExps.length;i++){
                            output_withHighlighting = output_withHighlighting.split(altExps[i]).join("<span style='background-color:yellow'>"+altExps[i]+"</span>");
                        }
                        $("[data-tranxid='divOutput']").html(output_withHighlighting);
                    }
                }
            };
            setup = function() {
                var existingContent = $("[data-tranxid='main']").html();
                var newContent = getUI(main);
                $("[data-tranxid='main']").html(existingContent +
                    newContent)
            };
            setup();
            $("[data-tranxinstant='true']").on("input", function() {
                drawData()
            });
            $("[data-tranxid='btnSearch']").click(function() {
                drawData()
            });
            $("[data-tranxid='btnClear']").click(function() {
                $("[data-tranxid='txtInput']").val("")
            });
            $("[data-tranxid='btnStartRecognition']").click(function() {
                recognizer.start()
            });
        })
    })
}

function inc(fn, ol) {
    ol();
};
