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

        $("#result").html( statement(invoice  , plays ) );
    });
});


//计算账单详情
function statement(invoice , plays){
    //format(23001/100)  结果 $230.01
    //临时变量实质上是鼓励你写长而复杂的函数
    //将临时变量替换为一个明确声明的函数
    //const format = new Intl.NumberFormat("en-Us" , {style : "currency" , currency : "USD" , minimumFractionDigits :2}).format;

    //拆分循环 移动变量到紧邻循环的位置
    //计算金额
    let totalAmount = 0;
    let result = 'Statement for '+invoice.customer+'<br/>';
    for(let pref of invoice.performances){
        result +=  playFor(pref).name + ':' + usd(amountFor(pref))  + " (" +  pref.audiences + ') seats <br/>';
        totalAmount += amountFor(pref);
    }

    //计算积分
    result += 'Amount owed is ' + usd(totalAmount ) + "<br/>";
    result += 'You earned ' + totalVolumCredits() + ' credits <br/>';
    return result;
}

//美元展示
function usd(aNumber){
   return new Intl.NumberFormat("en-Us" , {style : "currency" , currency : "USD" , minimumFractionDigits :2}).format(aNumber/ 100);
}

//计算总积分
function totalVolumCredits(){
    let volumeCredits = 0;
    for(let pref of invoice.performances){
        volumeCredits += volumeCreditsFor(pref);
    }
    return volumeCredits;
}

//计算积分
function volumeCreditsFor(aPerformances){
    let volumeCredits = 0;
    volumeCredits += Math.max(aPerformances.audiences - 30 , 0);
    if("comedy" == playFor(aPerformances).type){
        volumeCredits += Math.floor(aPerformances.audiences / 5);
    }
    return volumeCredits;
}

//计算金额
function amountFor(aPerformances ){
    let result = 0;

    switch (playFor(aPerformances).type) {
        case "tragedy" :
            result = 40000;
            if( aPerformances.audiences > 30 ){
                result += 1000 * (aPerformances.audiences - 30);
            }
            break;

        case "comedy" :
            result = 30000;
            if( aPerformances.audiences > 20){
                result += 10000 + 500 * (aPerformances.audiences - 20 );
            }
            result += 300 * aPerformances.audiences;
            break;
        default :
            throw new Error('unknown type ' + playFor(aPerformances).type);
    }
    return result;
}

function playFor(aPerformances){
    return plays[aPerformances.palyID]
}