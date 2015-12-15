var app = angular.module('app', []);

app.controller('CalculatorController', function($scope){
    $scope.resultDisplay = '0';
    $scope.currentInput = '';
    $scope.inputCount = 0; //max is 2
    $scope.numResult = 0; //calculated result
    $scope.numValueOne = 0; //1st parameter for calc
    $scope.numValueTwo = 0; //2nd parameter for calc
    $scope.currentOperationIndex = -1; //index for current operation is last element
    $scope.isDecimal = false; //check for decimal sign
    $scope.isNegative = false; //check for negative sign

    //reset all values (not resultDisplay)
    $scope.initValues = function(){
        $scope.currentInput = '';
        $scope.inputCount = 0;
        $scope.numResult = 0;
        $scope.numValueOne = 0;
        $scope.numValueTwo = 0;
        $scope.currentOperationIndex = -1;
        $scope.isDecimal = false;
        $scope.isNegative = false;
    }

    //display current input/result on result-box
    $scope.outputResult = function(){
        $scope.numResult = Number($scope.currentInput);

        //exceptional notation for long results
        if($scope.currentInput.length <= 13){
            $scope.resultDisplay = $scope.numResult.toLocaleString('en');
        } else {
            $scope.resultDisplay = $scope.numResult.toExponential(9);
        }

        //default output as 0
        if($scope.resultDisplay == ''){
            $scope.resultDisplay = '0';
        }
    }

    //different operations
    $scope.operations = {

        "+": {
            sign: "+",
            type: "operator",
            operation: function(a, b){
                return a + b;
            }
        },
        "-": {
            sign: "-",
            type: "operator",
            operation: function(a, b){
                return a - b;
            }
        },
        "*": {
            sign: "*",
            type: "operator",
            operation: function(a, b){
                return a * b;
            }
        },
        "/": {
            sign: "/",
            type: "operator",
            operation: function(a, b){
                return a / b;
            }
        },
        "%": {
            sign: "%",
            type: "operator",
            operation: function(a, b){
                return a % b;
            }
        },
        // clear current input and result, decimal points and negative transformation.
        "C": {
            sign: "C",
            type: "input-processor",
            operation: function(){
                $scope.initValues();
                $scope.resultDisplay = '0';
            }
        },
        ".": {
            sign: ".",
            type: "input-processor",
            operation: function(){
                //cannot add more than 1 decimal point
                if(!$scope.isDecimal){
                    $scope.currentInput += '.';
                    $scope.isDecimal = true;
                    //Remove duplicated decimal points
                    $scope.currentInput = $scope.currentInput.replace('..','.');
                }
            }
        },
        "+/-": {
            sign: "+/-",
            type: "input-processor",
            operation: function(){
                //if input is positive, turn it into negative
                if(!$scope.isNegative && $scope.currentInput != ''){
                    $scope.currentInput = ('-' + $scope.currentInput);
                    $scope.isNegative = true;
                }
                else{ //remove negative sign
                    $scope.currentInput = $scope.currentInput.replace('-', '');
                    $scope.isNegative = false;
                }
            }
        }
    };

    //check if input value is too long
    $scope.checkInputLength = function(){
        if($scope.currentInput.length >= 11){
            alert("The max length is 11");
            return true;
        }
        return false;
    }

    //adding digit to current value when clicked and display to result box
    $scope.clickNum = function(num){
        if($scope.checkInputLength()){
            return;
        }
        $scope.currentInput += num;
        $scope.outputResult()
    }

    /* operation click - 1. current value is valueOne; same the current operation; user input valueTwo after
    *                    2. current input should be processed by selection operation
    *                    3. decimal should be at the end of current input
    *                    4. negative num should be at very beginning of current input*/

    $scope.clickOperation = function(operation){
        //if user click operator more than once, save current input as ValueOne
        if($scope.currentInput == ''){
            $scope.currentInput = $scope.resultDisplay;
        }

        switch($scope.operations[operation].type){
            case 'operator':
                if($scope.inputCount == 0){
                    $scope.numValueOne = Number($scope.currentInput);
                } else {
                    $scope.numValueTwo = Number($scope.currentInput);
                }
                //result cache for current input
                $scope.currentInput = '';
                $scope.inputCount++;

                //result inputCount. (support only 2 parameters (valueOne + valueTwo)
                if($scope.inputCount >= 2){
                    $scope.numInputcount = 0;
                }
                $scope.currentOperationIndex = operation;
                break;
            case 'input-processor':
                //execute selected operation to process
                $scope.operations[operation].operation();
                $scope.outputResult();
                break;
        }
    };

    //calculate result based on current operation and inputs - numValueOne + numValueTwo
    $scope.calculate = function(){
        //if currentOperationIndex is not yet defined
        if($scope.currentOperationIndex == null || $scope.currentOperationIndex == ''){
            return;
        }

        //use compute the result based on operations and input & currentOperationIndex is to find selected operation
        var currentOperation = $scope.operations[$scope.currentOperationIndex];

        //if current operation is not yet defined
        if(currentOperation == null){
            return;
        }
        //save current input to numValueTwo
        $scope.numValueTwo = Number($scope.currentInput);

        //compute the result
        $scope.numResult = currentOperation.operation($scope.numValueOne, $scope.numValueTwo);
        $scope.currentInput = $scope.numResult.toString();
        $scope.outputResult();
        $scope.record();

        //save numResult as valueOne for next calc
        $scope.currentInput = $scope.numResult.toString();
        $scope.isNegative = $scope.numResult < 0
        $scope.isDecimal = $scope.currentInput.indexOf('.') > -1;
        $scope.inputCount = 0;
    }

    $scope.record = function(){
        console.log($scope.numValueOne + " " +
                    $scope.operations[$scope.currentOperationIndex].sign + " " +
                    $scope.numValueTwo + " = " +
                    $scope.numResult);
    }



});