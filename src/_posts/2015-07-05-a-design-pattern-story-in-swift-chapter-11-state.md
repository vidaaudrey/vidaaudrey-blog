---
title: 'A Design Pattern Story in Swift – Chapter 11: State'
author: Audrey
layout: post
excerpt: 'HouseOfFlower is hosting a betting sale. People can use a blue diamond to start a bet. If they win the bet, they’ll get one flower. The “FlowerHouseContext” is trying to keep a record of the business by using the four states: NoDiamond, HasDiamond, Sold, Soldout.'
permalink: /2015/07/05/a-design-pattern-story-in-swift-chapter-11-state/
categories:
  - Mobile Development
  - Swift
tags:
  - Design Pattern
  - State
  - Swift
image:
  feature: '/assets/images/wp-content/uploads/2015/07/flower.jpg'
  credit: 
  creditlink: 
---
<p>
  <span>HouseOfFlower is hosting a betting sale. People can use a blue diamond to start a bet. If they win the bet, they&#8217;ll get one flower. </span>The &#8220;FlowerHouseContext&#8221; is trying to keep a record of the business by using the four states: NoDiamond, HasDiamond, Sold, Soldout.
</p>

> <p>
>   The state pattern is used to alter the behaviour of an object as its internal state changes. The pattern allows the class for an object to apparently change at run-time. <a href="https://github.com/ochococo/Design-Patterns-In-Swift">From</a>
> </p>

&nbsp;

{% highlight swift %}class FlowerHouseContext: CustomStringConvertible {
    // need a special inital state, but really no use here
    private var state: State = NoDiamondState()
    private var numberOfFlowers: Int = 5
    private var gotDiamond = false
    private var wonBet = false
    private var totalReceivedDiamonds: Int = 0
    
    var description:String { return "--FlowerHouse: total flowers: \(numberOfFlowers)@, total diamonds:\(totalReceivedDiamonds)#"
    }
    
    func receiveDiamond(){
        if numberOfFlowers &lt;= 0 {
            state = SoldOutState()
            state.getFlower(self)
        } else {
            state.giveDiamond(self)
            state = HasDiamondState()
            gotDiamond = true
            totalReceivedDiamonds++
        }
    }

    func startBet(){
        if !gotDiamond {
            state.willGiveDiamond()
        } else {
            if arc4random_uniform(2) == 1 {
                wonBet = true
            } else {
                print("You lose the bet, no flowers")
                state = NoDiamondState()
                gotDiamond = false
            }
        }
    }
    
    func giveFlower(){
        if gotDiamond && wonBet {
            numberOfFlowers--
            state = SoldState()
            state.getFlower(self)
            print(description)
            state = NoDiamondState()
            gotDiamond = false
            wonBet = false
        } else {
            if let _ = state as? HasDiamondState {
                print("You'll need to start a bet to get a flower")
            } else {
                print(state.description)
            }
        }
    }
}

//: the context Parameter is not necessary here, but maybe for future usage.
protocol State: CustomStringConvertible {
    func willGiveDiamond()
    func giveDiamond(context: FlowerHouseContext)
    func startBet(context: FlowerHouseContext)
    func getFlower(context: FlowerHouseContext)
}


class NoDiamondState:State {
    var description:String {return "No diamond yet. Need to give one"}
    func willGiveDiamond(){
        print("You need to give a diamond to start the bet")
    }
    func giveDiamond(context: FlowerHouseContext) {
         print("You are giving a diamond")
    }
    func startBet(context: FlowerHouseContext) {
        print("Can't start bet without a diamond")
    }
    func getFlower(context: FlowerHouseContext) {
        print("Can't get flower without a diamond")
    }
}

class HasDiamondState:State {
    var description:String {return "You gave one diamond. Will start the bet"}
    func willGiveDiamond(){
        print("You already gave a diamond")
    }
    func giveDiamond(context: FlowerHouseContext) {
        print("You already gave a diamond")
    }
    func startBet(context: FlowerHouseContext) {
        print("The best is starting")
    }
    func getFlower(context: FlowerHouseContext) {
        print("No bet, no flower")
    }
}

class SoldState:State {
    var description: String {return "You won the bet, will give you a flower"}
    func willGiveDiamond(){
       print("You already gave a diamond")
    }
    func giveDiamond(context: FlowerHouseContext) {
        print("You already gave a diamond")
    }
    func startBet(context: FlowerHouseContext) {
        print("The bet is already over")
    }
    func getFlower(context: FlowerHouseContext) {
        print("you won the bed and you get one flower")
    }
}

class SoldOutState:State {
    var description:String {return "Sold out, come back later"}
    func willGiveDiamond(){
        print("Sold out, come back later")
    }
    func giveDiamond(context: FlowerHouseContext) {
        print("Sold out, come back later")
    }
    func startBet(context: FlowerHouseContext) {
        print("Sold out, come back later")
    }
    func getFlower(context: FlowerHouseContext) {
        print("Sold out, come back later")
    }
}

//:Testing
let context = FlowerHouseContext()
print(context)
context.receiveDiamond()
context.startBet()
context.giveFlower()
print("\n")

context.startBet()
context.receiveDiamond()
context.startBet()
context.giveFlower()

print("\n")

context.startBet()
context.giveFlower()

print("\n")
context.receiveDiamond()
context.giveFlower()
{% endhighlight %}

[<img class="aligncenter size-full wp-image-1027" src="/assets/images/wp-content/uploads/2015/07/state.png" alt="state" width="394" height="272" />][1]

 [1]: /assets/images/wp-content/uploads/2015/07/state.png