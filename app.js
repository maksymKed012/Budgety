var BudgetDataModel = (function () {

    var TransactionType = {
        INCOME : 0,
        EXPENSE : 1
    };

    var ID = 0;

    var Transaction = function (type, id, description, value) {
        this.type = type;
        this.id  = id;
        this.description = description;
        this.value = value;
    }

    Transaction.prototype = function() {

    }

    var aBudgetTransactions = [];

    return {
        getAllTransactionsByType : function (type) {
            var retArr = [];
            for (transaction in aBudgetTransactions) {
                if (transaction.type === type) {
                    retAtt.push(transaction);
                }
            }
            return retArr;
        },

        addTransaction : function (type, desc, val) {
            aBudgetTransactions.push(new Transaction(type, ID++, desc, val));
        }
    }

})();

var BudgetViewController = (function () {

    var DOMStrings = {
        inputType : '.add__type',
        inputDescription : '.add__description',
        inputValue : '.add__value'

    };

    var onKeyDown = function (event) {
        if(event.keyCode == 13 || event.which == 13) {
            console.log('enter was pressed');
        }
    }

    var onAddItemClicked = function (event) {
        console.log('add item  clicked');
    }

    var getHTMLForListEntryExpense = function() {
        return  '<div class="item clearfix" id="expense-0"><div class="item__description">Apartment rent</div>'
                '<div class="right clearfix"><div class="item__value">- 900.00</div><div class="item__percentage">'
                '21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline">'
                '</i></button></div></div></div>';
    }

    var getHTMLForListEntryIncome = function () {
        return '<div class="item clearfix" id="income-0">'
                '<div class="item__description">Salary</div>'
                '<div class="right clearfix">'
                '<div class="item__value">+ 2,100.00</div>'
                '<div class="item__delete">'
                '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>'
                '</div>'
                '</div>';
    }

    


    return {
        addEventListenerForControl : function (event, control, listener) {
            if(control == null){
                document.addEventListener(event, listener);
            } else {
                document.querySelector(control).addEventListener(event, listener);
            }
        },

        getInputValueFromControl : function(control) {
            var value = 0;
            if(control != 0) {
                value = document.querySelector(control).value;
            }

            return value;
        },

        getInputBudgetEntry : function () {
            return {
                type : this.getInputValueFromControl('.add__type'),
                description : this.getInputValueFromControl('.add__description'),
                value : this.getInputValueFromControl('.add__value')
            };
        },

        getDOMStrings : function () {
            return DOMStrings;
        },

        addListItem : function () {
            var htmlString = getHTMLForListEntryExpense();
            htmlString.replace('%id%', )
        }
    }

})();

var BudgetController = (function (BudgetDataModel, BudgetViewController) {

    var DOMStrings = BudgetViewController.getDOMStrings();

    var addBudgetEntry = function () {
        var budgetEntry = BudgetViewController.getInputBudgetEntry();
        BudgetDataModel.addTransaction(budgetEntry.type, budgetEntry.description, budgetEntry.value);
        console.log(budgetEntry);
    }

    return {
        init : function () {
            BudgetViewController.addEventListenerForControl('click', '.add__item', this.addBudgetEntry);
            BudgetViewController.addEventListenerForControl('keyDown', '', this.addBudgetEntry);
        }
    };

})();


BudgetController.init();