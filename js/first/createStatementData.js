//演出计算器类  顶层作用域
class PerFormanceCalculator{
    constructor(aPerformance , aPlay){
        this.aPerformance = aPerformance;
        this.aPlay = aPlay;
    }

    //计算单个金额
    get amount() {
        let result = 0;
        switch (this.aPlay.type) {
            case "tragedy" :
                result = 40000;
                if (this.aPerformance.audiences > 30) {
                    result += 1000 * (this.aPerformance.audiences - 30);
                }
                break;

            case "comedy" :
                result = 30000;
                if (this.aPerformance.audiences > 20) {
                    result += 10000 + 500 * (this.aPerformance.audiences - 20);
                }
                result += 300 * this.aPerformance.audiences;
                break;
            default :
                throw new Error('unknown type ' + this.aPlay.type);
        }
        return result;
    }

    //计算单个积分
    get volumeCredits() {
        let result = 0;
        result += Math.max(this.aPerformance.audiences - 30, 0);
        if ("comedy" == this.aPlay.type) {
            result += Math.floor(this.aPerformance.audiences / 5);
        }
        return result;
    }
}

//创建数据对象
function createStatementData(invoice , plays){
    const statamentData = {};
    statamentData.customer = invoice.customer;
    statamentData.performances = invoice.performances.map(enrichPerformance);
    statamentData.totalAmount = totalAmount(statamentData);
    statamentData.totalVolumeCredits = totalVolumCredits(statamentData);
    return statamentData;

    //返回参数的浅副本  作为中转数据结构
    function enrichPerformance(aPerformance){
        const calculator = new PerFormanceCalculator(aPerformance , playFor(aPerformance));
        const result = Object.assign({} , aPerformance);
        //将单个对象的计算结果设置成字段属性 避免二次计算获取
        result.play = calculator.aPlay;
        result.amount = calculator.amount;
        result.volumeCredits = calculator.volumeCredits;
        return result;
    }

    function playFor(aPerformances) {
        return plays[aPerformances.palyID]
    }

    //计算单个金额
    function amountFor(aPerformances) {
        /*let result = 0;

        switch (aPerformances.play.type) {
            case "tragedy" :
                result = 40000;
                if (aPerformances.audiences > 30) {
                    result += 1000 * (aPerformances.audiences - 30);
                }
                break;

            case "comedy" :
                result = 30000;
                if (aPerformances.audiences > 20) {
                    result += 10000 + 500 * (aPerformances.audiences - 20);
                }
                result += 300 * aPerformances.audiences;
                break;
            default :
                throw new Error('unknown type ' + aPerformances.play.type);
        }
        return result;*/
        return new PerFormanceCalculator(aPerformances , playFor(aPerformances)).amount;
    }


    //计算单个积分
    function volumeCreditsFor(aPerformances) {
        let result = 0;
        result += Math.max(aPerformances.audiences - 30, 0);
        if ("comedy" == aPerformances.play.type) {
            result += Math.floor(aPerformances.audiences / 5);
        }
        return result;
    }

    //计算总金额
    function totalAmount(data) {
        /*let result = 0;
        for (let pref of data.performances) {
            result += pref.amount;
        }
        return result;*/
        //管道(reduce)写法 lambda
        return data.performances.reduce((total , p) => total+ p.amount , 0 );

    }

    //计算总积分
    function totalVolumCredits(data) {
        /*let result = 0;
        for (let pref of data.performances) {
            result += pref.volumeCredits;
        }
        return result;*/
        //管道(reduce)写法 lambda
        return data.performances.reduce((total , p ) => total + p.volumeCredits , 0);
    }
}