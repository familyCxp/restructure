var plays_json = '{ "hamlet"  : {\"name\" : \"Hamlet\" , \"type\" : \"tragedy\"} , ' +
                   '  "as-like" : {\"name\" : \"As You Like It\" , \"type\" : \"comedy\"} , ' +
                   '  "othello" : {\"name\" : \"Othello\" , \"type\" : \"tragedy\"} } ';


var invoice_json = '{ "customer" : "BigCo" , ' +
                   '  "performances" : [ ' +
                                        '{ \"palyID\" : \"hamlet\" , \"audiences\" : \"55\"} ,' +
                                        '{ \"palyID\" : \"as-like\" , \"audiences\" : \"35\"} ,' +
                                        '{ \"palyID\" : \"othello\" , \"audiences\" : \"40\"}  ] }';
var plays = JSON.parse(plays_json);
var invoice = JSON.parse(invoice_json);
$(function(){
    $(".result").bind("click" , function () {

        $("#result").html( htmlStatement(invoice  , plays ) );
    });
});

//编写一个html版本的对账单
function htmlStatement(invoce , plays){
    return renderHtml( createStatementData(invoice , plays));
}

function renderHtml(data){
    let result = '<h1>Statement for '+data.customer+'</h1><br/>';
    result += '<table>';
    result += '<tr><th>play</th><th>seats</th><th>costs</th></tr>';
    for(let pref of data.performances){
        result += '<tr><td>'+pref.play.name+'</td><td>'+pref.audiences+'</td><td>'+usd(pref.amount)+'</td></tr>';
    }
    result += '</table>';
    result += '<p>Amount owed is <em>'+data.totalAmount+'</em></p>';
    result += '<p>You earned <em>'+data.totalVolumeCredits+'</em> credits</p>';
    return result;
}

function statement(invoice , plays){
    return renderPlainText(createStatementData(invoice , plays));
}

//计算账单详情
function renderPlainText(data) {
    //format(23001/100)  结果 $230.01
    //临时变量实质上是鼓励你写长而复杂的函数
    //将临时变量替换为一个明确声明的函数
    //const format = new Intl.NumberFormat("en-Us" , {style : "currency" , currency : "USD" , minimumFractionDigits :2}).format;

    //拆分循环 移动变量到紧邻循环的位置
    //此处处理与打印详单相关的逻辑
    let result = 'Statement for ' + data.customer + '<br/>';
    for (let pref of data.performances) {
        result += pref.play.name + ':' + usd(pref.amount) + " (" + pref.audiences + ') seats <br/>';
    }

    //计算相关的逻辑由一组函数来支持
    //计算金额
    result += 'Amount owed is ' + usd(data.totalAmount) + "<br/>";
    //计算积分
    result += 'You earned ' + data.totalVolumeCredits + ' credits <br/>';
    return result;
}


//美元展示
function usd(aNumber) {
    return new Intl.NumberFormat("en-Us", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2
    }).format(aNumber / 100);
}