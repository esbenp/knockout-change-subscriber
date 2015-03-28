+(function($, ko){
    ko.mapping = ko.mapping || mapping;

    var ChangeSubscriber = function ChangeSubscriber(callback, comparisonProperty)
    {
        var _this = this;
        var comparisonProperty = comparisonProperty || null;
        var oldValue = copy(ko.unwrap(this));

        return this.subscribe(function(newValue){
            if (newValue instanceof Array) { 
                callback.apply(this, determineArrayChanges(newValue, oldValue, comparisonProperty));
            } else {
                callback(newValue, oldValue);
            }

            oldValue = copy(newValue);
        }); 
    }

    var convertObjectForComparison = function convertObjectForComparison(object, comparisonProperty)
    {
        return comparisonProperty === null ? JSON.stringify(object) : object[comparisonProperty];
    }

    var copy = function copy(variable)
    {
        if (variable instanceof Array) {
            return variable.slice();
        } else if (typeof variable === "object") {
            return $.extend(true, {}, variable);
        } else {
            return variable;
        }
    }

    var createComparisonHashTable = function createComparisonHashTable(array, comparisonProperty)
    {
        var hashTable = {};
        for(var i in array) {
            hashTable[convertObjectForComparison(array[i], comparisonProperty)] = array[i];
        }

        return hashTable;
    }

    var determineArrayChanges = function determineArrayChanges(newValue, oldValue, comparisonProperty)
    {
        var oldValueUnwrapped = unwrap(oldValue);
        var newValueUnwrapped = unwrap(newValue);

        // Need to find differences on an index basis for additions to keep observables
        var additionsIndex = findDifferenceIndexes(newValueUnwrapped, oldValueUnwrapped, comparisonProperty);
        var deletionsIndex = findDifferenceIndexes(oldValueUnwrapped, newValueUnwrapped, comparisonProperty);

        var additions = filterArrayByDifferenceIndex(newValue, additionsIndex);
        var deletions = filterArrayByDifferenceIndex(oldValue, deletionsIndex);

        return [additions, deletions];
    }

    var filterArrayByDifferenceIndex = function filterArrayByDifferenceIndex(array, differences)
    {
        var changes = [];
        for(var i in array) {
            if (differences[i] === false) {
                changes.push(array[i]);
            }
        }

        return changes;
    }

    var findDifference = function findDifference(a, b, comparisonProperty)
    {
        var hashTable = createComparisonHashTable(b, comparisonProperty);

        return _.filter(a, function(value){
            return !(convertObjectForComparison(value, comparisonProperty) in hashTable);
        });
    }

    var findDifferenceIndexes = function findDifferenceIndexes(a, b, comparisonProperty)
    {
        var indexes = {};
        var hashTable = createComparisonHashTable(b, comparisonProperty);

        for(var i in a) {
            indexes[i] = (convertObjectForComparison(a[i], comparisonProperty) in hashTable);
        }

        return indexes;
    }

    var isObservableArray = function isObservableArray(observable) {
        return 'push' in observable;
    }

    var unwrap = function unwrap(observable) {
        return ko.mapping.toJS(observable);
    }

    ko.subscribable.fn.changeSubscriber = ChangeSubscriber;

})(jQuery, ko);