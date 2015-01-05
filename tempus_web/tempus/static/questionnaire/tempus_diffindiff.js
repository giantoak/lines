$(function () {
	var myQuestionaire = $.ay.questionnaire($('#questionnaire'), {resetHiddenFields: true}),
		
		fieldsetA = myQuestionaire.addFieldset(function (parent) { return parent.find('fieldset').eq(0); }), //The initial question about a comparison group
		fieldsetB = myQuestionaire.addFieldset(function (parent) { return parent.find('fieldset').eq(1); }), // Event date selection
		fieldsetC = myQuestionaire.addFieldset(function (parent) { return parent.find('fieldset').eq(2); }), // Dummy field for results of event date adding
		fieldsetD = myQuestionaire.addFieldset(function (parent) { return parent.find('fieldset').eq(3); }),
		fieldsetE = myQuestionaire.addFieldset(function (parent) { return parent.find('fieldset').eq(4); }),
		fieldsetF = myQuestionaire.addFieldset(function (parent) { return parent.find('fieldset').eq(4); }),
		
		inputA = fieldsetA.addInput(function (parent) { console.log('inputA addInput to fieldset called'); return parent.find('input'); }),
		inputB = fieldsetB.addInput(function (parent) { return parent.find('input'); }),
		inputC = fieldsetC.addInput(function (parent) { return parent.find('input'); }),
		inputD = fieldsetD.addInput(function (parent) { return parent.find('input'); });
//These inputs are defined statically at the beginning. 
	
	fieldsetB.createRoute().link(inputA, function (val) {
        console.log('link from a to b created'); 
        console.log('val is given as ' + val);
        if (val === "1"){
            console.log(fieldsetB)

        };
        return val === "1"; });
    //These routes return specific values which can feed in check marks,
    //but also execute arbitrary code when checked... though the code
    //executes anyway...
	fieldsetC.createRoute().link(inputB, function (val) { return val === "1"; });
	fieldsetD.createRoute().link(inputC, function (val) { return val === "1"; });
	
	fieldsetE.createRoute().link(inputA, function (val) { return val === "0"; })
	fieldsetE.createRoute().link(inputB, function (val) { return val === "0"; });
	fieldsetE.createRoute().link(inputD, function (val) { return val !== false; });
    fieldsetF.createRoute().link(inputB, function (val) { return val !== false; });
	
	myQuestionaire.update();
});
