jsLPSolver
==========
Simple OOP javaScript library to solve linear programs, and mixed integer linear programs


##What Can I do with it?
You can solve problems that fit the following fact pattern like this one
from [this](http://math.stackexchange.com/questions/59429/berlin-airlift-linear-optimization-problem) site.

>On June 24, 1948, the former Soviet Union blocked all land and water routes through East Germany to Berlin. 
>A gigantic airlift was organized using American and British planes to supply food, clothing and other supplies 
>to more than 2 million people in West Berlin. 
>
>The cargo capacity was 30,000 cubic feet for an American plane and 20,000 cubic feet for a British plane. 
>To break the Soviet blockade, the Western Allies had to maximize cargo capacity, 
>but were subject to the following restrictions: No more than 44 planes could be used. The larger American planes required 16 
>personnel per flight; double that of the requirement for the British planes. The total number of personnel 
>available could not exceed 512. The cost of an American flight was $9000 and the cost of a British flight was $5000. 
>The total weekly costs could note exceed $300,000. 
>Find the number of American and British planes that were used to maximize cargo capacity.



##So How Would I Do This?
Part of the reason I built this library is that I wanted to do as little thinking / setup as possible
to solve the actual problem. Instead of tinkering with arrays to solve this problem, you would create a 
model in a JavaScript object, and solver it through the object's `solve` function; like this:

```javascript
var solver = new Solver,
  results,
  model = {
    "optimize": "capacity",
    "opType": "max",
    "constraints": {
        "plane": {"max": 44},
        "person": {"max": 512},
        "cost": {"max": 300000}
    },
    "variables": {
        "brit": {
            "capacity": 20000,
            "plane": 1,
            "person": 8,
            "cost": 5000
        },
        "yank": {
            "capacity": 30000,
            "plane": 1,
            "person": 16,
            "cost": 9000
        }
    },
};

results = solver.Solve(model);
console.log(results);
```

which should yield the following:
```
{feasible: true, brit: 24, yank: 20, result: 1080000}
```
##What If I Want Only Integers

Say you live in the real world and partial results aren't realistic, or are too messy.

>Steven manages a wood shop that makes money by charging people money to use its tools.
>The shop owner tells Steven that he has an extra $40,000 this year to spend on new equipment.
>After thinking of ways to get the new tools in the shop, Steven realizes that he only has 205 sqft
>to work with.
>
>The 3 pieces of equipment Steven is most interestd in are the press, the lathe, and the drill.
>A new drill will cost $8,000, take up 15 sqft, and yield about $100 in profit / week.
>A new lathe will only cost $4,000, make about $150 / wk in profit, but it takes up 30 sqft.
>Finally, Steven can get a new drill for $4,500 which takes up 14 sqft; and can expect about $80 / wk from it.
>
>What should Steven buy to maximize profit?

```javascript
 models.push({
     optimize: "profit",
     opType: "max",
     constraints: {
         space: {max: 205},
         price: {max: 40000}
     },
     variables: {
                 press: {space: 15, price: 8000, profit: 100},
                 lathe: {space: 30, price: 4000, profit: 150},
                 drill: {space: 14, price: 4500, profit: 80}
             },
     ints: {
         press: 1 ,lathe: 1 ,drill: 1
     }
 });

```
