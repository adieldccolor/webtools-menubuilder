/* =CalculatorFix: first calc */
function dosumMortgageCalc()
{
    var calc = $("#calcMortgage");

    var _IR = calc.find("#IR");//
    var _YR = calc.find("#YR"); //
    var _YRvalue = _YR.val();
    var _PI = calc.find("#PI"); //
    var _MT = calc.find("#MT"); //
    var _MI = calc.find("#MI"); //
    var _LA = calc.find("#LA"); //
    var _AT = calc.find("#AT"); //
    var _AI = calc.find("#AI"); //
    var _MP = calc.find("#MP"); //

    var mi = _IR.val() / 1200;
    var base = 1;
    var mbase = 1 + mi;

    for (i=0; i< _YRvalue * 12; i++)
    {
        base = base * mbase
    }

    _PI.val(floor(_LA.val() * mi / (1 - (1 / base))) || 0);
    _MT.val(floor(_AT.val() / 12));
    _MI.val(floor(_AI.val() / 12));

    var dasum = _LA.val() * mi / (1 - (1 / base)) + _AT.val() / 12 + _AI.val() / 12;

    _MP.val(floor(dasum)||0);
}





/* =CalculatorFix: second calc */
function dosumIncome()
{
    var calc = $("#calcIncome");
    var form = {
        mortAmt: { value: calc.find("#mortAmt").val() },
        numYears: { value: calc.find("#numYears").val() },
        propTax: { value: calc.find("#propTax").val() },
        debt: { value: calc.find("#debt").val() },
        mortRate: { value: calc.find("#mortRate").val() }
    };

    if (( trim(form.mortAmt.value) != "" && trim(form.numYears.value) != "" && trim(form.propTax.value) != "" &&
        trim(form.debt.value) != "" && trim(form.mortRate.value) != ""))
    {
        var tmp1,tmp2, tmp3, tmp4, tmp5, tmp6 ,tmp7, tmp8, tmp9, tmp10, tmp11, tmp12, tmp13, tmp14, tmp15

        tmp1 = parseFloat(form.mortAmt.value);
        if (isNaN(tmp1)) tmp1=0;
        tmp2 = parseFloat(form.numYears.value);
        if (isNaN(tmp2)) tmp2=0;
        tmp3 = parseFloat(form.mortRate.value);
        if (isNaN(tmp3)) tmp3=0;
        tmp4 = parseFloat(form.propTax.value);
        if (isNaN(tmp4)) tmp4=0;
        tmp5 = parseFloat(form.debt.value);
        if (isNaN(tmp5)) tmp5=0;
        tmp6 = 0;

        tmp7 = tmp4/12;
        tmp8= tmp5;
        tmp9 = tmp3/1200;
        tmp10= tmp2 * 12;
        tmp11 = (1 + tmp9);
        for (i=1; i < tmp10; i++) {
            tmp11 = tmp11 * (1 + tmp9);
        }
        tmp12  = tmp1 * tmp11 * tmp9 / (tmp11 - 1);
        tmp13 = tmp12 + tmp7 + tmp8;
        tmp14= (tmp12 + tmp7) / 0.28;
        tmp15 = tmp13 / 0.35;

        if (tmp14 > tmp15) {
            tmp6 = 12 * tmp14;
        } else {
            tmp6 = 12 * tmp15;
        }

        calc.find("#mortPay").val(round(tmp12) || 0);
        calc.find("#totalPay").val(round(tmp13) || 0);
        calc.find("#reqdSal").val(round(tmp6) || 0);
    }
}








/* =CalculatorFix: third calc */

function dosumHowMuchPayments()
{   frm = $("#calcHowMuchPayments");
    var mi = frm.find("#IR").val() / 1200;
    var counter = 1;
    var mcounter = 1 + mi;
    for (i=0; i<frm.find("#YR").val() * 12; i++)
    {
        counter = counter * mcounter
    }
    frm.find("#PI").val(round(frm.find("#LA").val() * mi / ( 1 - (1/counter)))||0);
    frm.find("#MT").val(round(frm.find("#AT").val() / 12));
    frm.find("#MI").val(round(frm.find("#AI").val() / 12));
    var dasum = frm.find("#LA").val() * mi / (1 - (1 / counter)) + frm.find("#AT").val() / 12 + frm.find("#AI").val() / 12;
    frm.find("#MP").val(round(dasum)||0);
}









function dosumHowMuchDownPayment()
{
    var frm = document.all;
    var tmp1, tmp2, tmp3, tmp4, tmp5, tmp6, tmp7, tmp8, tmp9, tmp10
    tmp1 = parseFloat(frm.home.value);

    if (isNaN(tmp1)) tmp1=0;
    tmp2 = parseFloat(frm.dp_percent.value);
    if (isNaN(tmp2)) tmp2=0;

    tmp3 = parseFloat(frm.rate.value);

    if (isNaN(tmp3)) tmp3=0;
    tmp4 = parseFloat(frm.close_points.value);
    if (isNaN(tmp4)) tmp4=0;
    tmp5 = parseFloat(frm.term.value);

    if (isNaN(tmp5)) tmp5=0;
    tmp6 = parseFloat(frm.tax.value);

    if (isNaN(tmp6)) tmp6=0;
    tmp7 = parseFloat(frm.insurance.value);

    if (isNaN(tmp7)) tmp7=0;
    frm.mortgage.value = round(tmp1 - ((tmp2 / 100) * tmp1));

    tmp8 = parseFloat(frm.mortgage.value);

    if (isNaN(tmp8)) tmp8=0;
    frm.dp_amount.value = round(tmp1 * (tmp2 / 100));

    tmp9 = parseFloat(frm.dp_amount.value);
    if (isNaN(tmp9)) tmp9=0;
    frm.mo_tax.value = round(tmp6 / 12);

    tmp10 = parseFloat(frm.mo_tax.value);
    if (isNaN(tmp10)) tmp10=0;
    frm.mo_ins.value = round(tmp7 / 12);

    tmp11 = parseFloat(frm.mo_ins.value);
    if (isNaN(tmp11)) tmp11=0;
    frm.points.value = round((tmp4 / 100) * tmp8);

    frm.close_cost.value = round(990 + (.01 * tmp8));

    frm.prepaids.value = round(((.015 * tmp8) * .8333) + (.0035 * tmp8));


    frm.mo_pmt.value = round(getPayment(tmp8, tmp3, tmp5));

    frm.totPmt.value = round(eval(frm.mo_pmt.value) + tmp10 + tmp11);
    frm.totalCash.value = round(tmp9 + eval(frm.points.value) + eval(frm.close_cost.value) + eval(frm.prepaids.value));


    frm.apr.value = getAPR(tmp5, tmp3, tmp8, frm.mo_pmt.value);

}

















function dosumInterest()
{

    var amnt=0;
    var rate=0;
    var years=0;
    var pmnt=0;
    var pmntl=0;
    var pmntnum=0;

    amnt= eval(document.all.ioc_amnt.value);
    rate = eval (document.all.ioc_rate.value);
    years = eval (document.all.ioc_years.value);

    pmnt=(rate/1200)*amnt;
    pmntl=pmnt*years*12;
    pmntnum=years*12;
    pmnt=pmnt*100;pmnt=(Math.floor(pmnt))/100;
    pmntl=pmntl*100;pmntl=(Math.floor(pmntl))/100;

    document.all.MonthlyPayment.value=(pmnt||0);//Monthly Payment
    document.all.TotalOfPayments.value=(pmntl||0);//Total of All Payments
    document.all.NumberOfPayments.value=(pmntnum||0);//Number of Payments
}

