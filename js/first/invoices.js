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
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = 'Statement for '+invoice.customer+'<br/>';
    //format(23001/100)  结果 $230.01
    const format = new Intl.NumberFormat("en-Us" , {style : "currency" , currency : "USD" , minimumFractionDigits :2}).format;

    for(let pref of invoice.performances){
        //const play = playFor(pref);
        let thisAmount = amountFor(pref , playFor(pref));

        //add colume credits
        volumeCredits += Math.max(pref.audiences - 30 , 0);
        //add extra credit for every ten comedy attendees 每十位喜剧参加者加上额外学分
        if("comedy" == playFor(pref).type){
            volumeCredits += Math.floor(pref.audiences / 5);
        }

        //print line for this order
        result +=  playFor(pref).name + ':' + format(thisAmount / 100)  + " (" +  pref.audiences + ') seats <br/>';
        totalAmount += thisAmount;
    }

    result += 'Amount owed is ' + format(totalAmount / 100) + "<br/>";
    result += 'You earned ' + volumeCredits + ' credits <br/>';
    return result;
}

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