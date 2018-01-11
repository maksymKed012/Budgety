var TransactionType = {
    INCOME : 0,
    EXPENSE : 1
};


var BudgetDataModel = (function () {

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
        addTransaction : function (type, desc, val) {
            var transaction = new Transaction(type, ID++, desc, val);
            aBudgetTransactions.push(transaction);
            return transaction;
        },

        calculateBudget : function () {
            return this.calculateTotal(TransactionType.INCOME) - this.calculateTotal(TransactionType.EXPENSE);
        },

        getAllTransactionsByType : function (type) {
            var retArr = [];
            for (transaction of aBudgetTransactions) {
                if (transaction.type === type) {
                    retArr.push(transaction);
                }
            }
            return retArr;
        },

        calculateTotal : function (type) {
            var transactions = this.getAllTransactionsByType(type);
            var sum = 0;
            transactions.forEach(function(curr){
                sum += curr.value;
            });
    
            return sum;
        },

        deleteTransaction : function(id) {
            var indexes = aBudgetTransactions.map(function(current) {
                return current.id;
            });

            var index = indexes.indexOf(id);
            if (index !== -1){
                aBudgetTransactions.splice(index, 1);    
            }
        },

        getTransActionByID : function (id) {
            for(transaction of aBudgetTransactions) {
                if(transaction.id === id) {
                    return transaction;
                }
            }
        }

    }

})();

var BudgetViewController = (function () {

    var DOMStrings = {
        inputType : '.add__type',
        inputDescription : '.add__description',
        inputValue : '.add__value',
        expensesContainer : '.expenses__list',
        incomesContainer: '.income__list',
        budgetLabel : '.budget__value',
        incomeLabel : '.budget__income--value',
        expenseLabel : '.budget__expenses--value',
        percentageLabel : '.budget__expenses--percentage',
        container : '.container'
    };

    var onKeyDown = function (event) {
        if(event.keyCode == 13 || event.which == 13) {
            console.log('enter was pressed');
        }
    }

    var onAddItemClicked = function (event) {
        console.log('add item  clicked');
    }

    var getHTMLForListEntryIncome = function() {
        return'<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
    }

    var getHTMLForListEntryExpense = function () {
        return '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
    }

    var getHTMLForTransaction = function (transaction) {
        if(transaction === TransactionType.INCOME) {
            return getHTMLForListEntryIncome();
        } else {
            return getHTMLForListEntryExpense();
        }
    }

    


    return {
        addEventListenerForControl : function (event, control, listener) {
            if(control === ''){
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
                type : this.getInputValueFromControl('.add__type') === 'inc' ? 0 : 1,
                description : this.getInputValueFromControl('.add__description'),
                value : parseFloat(this.getInputValueFromControl('.add__value'))
            };
        },

        getDOMStrings : function () {
            return DOMStrings;
        },

        addListItem : function (object, transaction) {
            var element = transaction === TransactionType.INCOME ? DOMStrings.incomesContainer : DOMStrings.expensesContainer;
            var html = getHTMLForTransaction(transaction);
            html = html.replace('%id%', object.id);
            html = html.replace('%value%', object.value);
            html = html.replace('%description%', object.description);

            document.querySelector(element).insertAdjacentHTML('beforeEnd', html); 
        },

        clearFields : function() {
             
           var fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);
           
           var fieldsArr = Array.prototype.slice.call(fields);

           fieldsArr.forEach(function(current, index, array) {
               current.value = "";
           });

           fieldsArr[0].focus();
        },

        displayBudget : function (obj) {
            
            document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMStrings.incomeLabel).textContent = obj.income;
            document.querySelector(DOMStrings.expenseLabel).textContent = obj.expenses;
            document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage > 0 ? 
            obj.percentage : '---';
        }
    }

})();

var BudgetController = (function (BudgetDataModel, BudgetViewController) {

    var DOMStrings = BudgetViewController.getDOMStrings();

    var updateBudget = function() {

        var budgetObj = {
            budget : BudgetDataModel.calculateBudget(),
            percentage : (this.budget > 0 ? BudgetDataModel.calculateTotal(TransactionType.EXPENSE) / 
            BudgetDataModel.calculateTotal(TransactionType.INCOME) * 100 : -1),
            expenses : BudgetDataModel.calculateTotal(TransactionType.EXPENSE),
            income : BudgetDataModel.calculateTotal(TransactionType.INCOME)
        };

        BudgetViewController.displayBudget(budgetObj);
    };

    return {
        init : function () {
            BudgetViewController.addEventListenerForControl('click', '.add__btn', this.addBudgetEntry);
            BudgetViewController.addEventListenerForControl('keyDown', '', this.addBudgetEntry);
            BudgetViewController.displayBudget({
                budget:0, percentage: -1, expenses : 0, income : 0
            });

            BudgetViewController.addEventListenerForControl('click', DOMStrings.container, this.deleteBudgetEntry );
        },

        addBudgetEntry : function () {
            var budgetEntry = BudgetViewController.getInputBudgetEntry();
            if(budgetEntry.description !== '' && !isNaN(budgetEntry.value) && budgetEntry.value > 0)
            {
                var transaction = BudgetDataModel.addTransaction(budgetEntry.type, budgetEntry.description, budgetEntry.value);
                BudgetViewController.addListItem(transaction, transaction.type);
                BudgetViewController.clearFields();
                updateBudget();
                console.log(budgetEntry);
            }
        },

        deleteBudgetEntry : function (event) {
            var itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
            var itemSplit = itemID.split('-');
            var itemID = itemSplit[1];
            var itemType = itemSplit[0];

            BudgetDataModel.deleteTransaction(parseInt(itemID));
            
            updateBudget();
        }
    };

})(BudgetDataModel, BudgetViewController);

BudgetController.init();