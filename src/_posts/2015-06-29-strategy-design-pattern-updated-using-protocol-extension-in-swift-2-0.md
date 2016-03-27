---
title: Strategy Design Pattern Updated Using Protocol Extension in Swift 2.0
author: Audrey
layout: post
excerpt: 'I came across the Protocol-Oriented programming concept recently and I found it quite fascinating, so I decided to rewrite my previous story with protocols and value-based approaches.'
permalink: /2015/06/29/strategy-design-pattern-updated-using-protocol-extension-in-swift-2-0/
categories:
  - Swift
tags:
  - Design Pattern
  - Strategy
  - Swift 2.0
image:
  feature: '/assets/images/wp-content/uploads/2015/06/Strategy-Pattern-in-Swift-2.0.png'
  credit: 
  creditlink: 
---
I came across the Protocol-Oriented programming concept recently and I found it quite fascinating, so I decided to rewrite my previous story with protocols and value-based approaches.

The first thing I need to do is layout all the requirements:

  * I want to model all the creatures in the world including animals and plants.
  * Basically all creatures have names. The difference between animals and plants is whether they can move, generally speaking.
  * All the moving animals have their own &#8216;Escape Strategy&#8217;. But how do they execute their strategies varies.

  {% highlight swift %}
  //: Create the base protocol 'Creature'
public protocol Creature: CustomStringConvertible {
    static var entityName: String { get }
    var name: String { get }
    var canMove: Bool { get }
}

//: Protocol 'Animal' inherit from 'Creature' protocol and it has a 'escapeStrategy', can 'performEscape'
public protocol Animal: Creature {
    var escapeStrategy: EscapeStrategy { get }
    func performEscape()
}
//: 'Plant' also conforms to 'Creature' protocol
public protocol Plant: Creature {
}

//: It's a wonder that we can actually extend a protocol and have it carry out the default implementation of other protocols. This case, all animals can 'performEscape'
extension Animal {
    public func performEscape(){
        print("\(name) about to execute a Escape Plan")
        escapeStrategy.executeEscapePlan()
        print("\(name) successfully escaped")
    }
}

//: Here is the key. All animals have 'EscapeStrategy', but how they implement will be different. Have a protocol enables the runtime execution to be different
public protocol EscapeStrategy {
    func executeEscapePlan()
}

public class EscapeByFlying: EscapeStrategy {
    public func executeEscapePlan() {
        print("Escape by flying")
    }
     public init() {}
}

public class EscapeByRunning: EscapeStrategy {
   public func executeEscapePlan() {
        print("Escape by running")
    }
    public init() {}
}
public class EscapeByOther: EscapeStrategy {
   public func executeEscapePlan() {
        print("Mysteriously escape")
    }
     public init() {}
}

//: All animals can move
extension Moveable where Self: Animal {
    public var canMove: Bool { return true }
}
{% endhighlight %}

&nbsp;

The next step is to write some concrete struct / class to actually conform to the protocols. The power of protocol inheritance and composition makes it quite easy and flexible to do so.

{% highlight swift %}//: Cat
public struct Cat: Animal, Moveable {
    public static var entityName: String { return "Cat" }
    public var name: String
    
    public static func randomMove() { print("I am moving randomly") }
    public var movingSpeed = 12.1
    
    public var escapeStrategy: EscapeStrategy
    
    public init(name: String, movingSpeed: Double, escapeStrategy: EscapeStrategy){
        self.name = name
        self.movingSpeed = movingSpeed
        self.escapeStrategy = escapeStrategy
    }
    
}
//:Rose
public struct Rose: Plant {
    public static var entityName: String { return "Rose" }
    public var name: String
    public var canMove: Bool { return false }
    
    public init(name: String){
        self.name = name
    }
}


public protocol Aged {
    var age: Int { get }
}

public protocol FullyNamed {
    var fullName: String { get }
}
//: 'Person' also confirms to 'Animal' protocol 
public struct Person: Animal, FullyNamed, Moveable, Aged {
    public static var entityName: String { return "Person" }
    public var name: String
    
    public var fullName: String
    
    public static func randomMove() { print("I am moving randomly") }
    public var movingSpeed = 15.1
    
    public var age: Int { return 20 }
    
    public var escapeStrategy: EscapeStrategy
    
    public init(name: String, fullName:String,  movingSpeed: Double, escapeStrategy: EscapeStrategy){
        self.name = name
        self.fullName = fullName
        self.movingSpeed = movingSpeed
        self.escapeStrategy = escapeStrategy
    }
}

//: protocol composition 
public func showCreatureAge(creature: protocol &lt;Creature, Aged>) {
    print("\(creature.name) is \(creature.age) years\' old")
}{% endhighlight %}

Finally test the code:

{% highlight swift %}var rose = Rose(name: "Pretty Rose Flower")
var person = Person(name: "Mia", fullName: "Mia Zhu", movingSpeed: 2121, escapeStrategy: EscapeByFlying() )
var cat = Cat(name: "Kitty", movingSpeed: 10, escapeStrategy: EscapeByRunning())

var creatures:[Creature] = [cat, rose, person]
creatures.filter { $0 is Animal}.map{ ($0 as! Animal).performEscape()}{% endhighlight %}

[<img class=" size-full wp-image-957 aligncenter" src="/assets/images/wp-content/uploads/2015/06/Strategy-Pattern-in-Swift-2.0.png" alt="Strategy Pattern in Swift 2.0" width="305" height="119" />][1]

 [1]: /assets/images/wp-content/uploads/2015/06/Strategy-Pattern-in-Swift-2.0.png