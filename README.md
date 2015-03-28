# knockout-change-subscriber

A small subscribable extension to keep track of changes to an observable

# Why not subscribe(observable, null, 'arrayChange')?

The native array change subscribe function does not work well with computed arrays nor normal observables.

I.e. neither of these will work
```javascript
var observable = ko.observable();
var observableArray = ko.observableArray();
var computedObservableArray() = ko.computed(function(){
  return observableArray();
}, this, "arrayChange");

observable.subscribe(function(changes){
  // never executes
}, null, "arrayChange");

observableArray.subscribe(function(changes){
  // works
}, null, "arrayChange");

computedObservableArray.subscribe(function(changes){
  // never fires
}, null, "arrayChange");
```

# Dependencies

* jQuery >= 1.1.4 (used for $.extend)
* underscore.js ~1.8.2 (used for _.filter)
* bower-knockout-mapping ~2.5.0 (or just knockout-mapping)
* knockout.js >= 3.0.0

# Installation
Can be installed via bower package

```
bower install --save knockout-change-subscriber
```
... or by cloning the repository

```
git clone git@github.com:esbenp/knockout-change-subscriber.git
```
... or by grabbing a zip of the latest release

# Small example

See examples directory for more

```javascript
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
```

# License
Copyright © 2015 Esben Petersen & Contributors

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at: http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
