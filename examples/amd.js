requirejs.config({
    baseUrl: '../bower_components',
    paths: {
        dist: "../dist",
        jquery: "jquery/dist/jquery",
        knockout: "knockout/dist/knockout",
        "knockout-change-subscriber": "../dist/knockout-change-subscriber",
        "knockout-mapping": "bower-knockout-mapping/dist/knockout.mapping",
        underscore: "underscore/underscore"
    },
    shim: {

    }
});

requirejs(["knockout-change-subscriber"], function(ko){
    
    var observable = ko.observable("Observable 1");
    var observableArray = ko.observableArray([
        {id: ko.observable(2), name: ko.observable("Test")}
    ]);
    var computedObservable = ko.computed(function(){
        return observable();
    }, this);
    var computedObservableArray = ko.computed(function(){
        return observableArray();
    }, this);

    observable.changeSubscriber(function(newValue, oldValue){
        console.log("observable", newValue, oldValue);
    });

    observableArray.changeSubscriber(function(additions, deletions){
        console.log("observableArray", additions, deletions);
    });

    computedObservable.changeSubscriber(function(newValue, oldValue){
        console.log("computedObservable change", newValue, oldValue);
    });

    computedObservableArray.changeSubscriber(function(additions, deletions){
        console.log("computedObservableArray change", additions, deletions);
    });

    observable("Yo");
    observableArray.push({id: ko.observable(3), name: ko.observable("Yo")});
    observableArray.remove(function(entry){
        return entry.id() === 2;
    });
    
});