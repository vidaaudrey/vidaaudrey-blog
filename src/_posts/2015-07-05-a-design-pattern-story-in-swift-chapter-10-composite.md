---
title: 'A Design Pattern Story in Swift – Chapter 10: Composite'
author: Audrey
layout: post
excerpt: 'There is a MagicConference and all kinds of characters can participate by purchasing SinglePass or GroupPass.'
permalink: /2015/07/05/a-design-pattern-story-in-swift-chapter-10-composite/
categories:
  - Mobile Development
  - Swift
tags:
  - Composite
  - Design Pattern
  - Swift
image:
  feature: '/assets/images/wp-content/uploads/2015/07/pass.jpg'
  credit: 
  creditlink: 
---
<p>
  <span>There is a MagicConference and all kinds of characters can participate by purchasing SinglePass or GroupPass.</span>
</p>

> <p>
>   The composite pattern is used to create hierarchical, recursive tree structures of related objects where any element of the structure may be accessed and utilized in a standard manner.  <em><a href="https://github.com/ochococo/Design-Patterns-In-Swift">From</a></em>
> </p>

{% highlight swift %}protocol Pass:CustomStringConvertible{
    var name: String { get }
    var price: Int { get }
    var countNumber: Int { get }
}

struct SinglePass: Pass {
    let name: String
    let price: Int
    var countNumber: Int { return 1 }
    var description: String { return "\(name) (Single Pass \(price)#)" }
}
struct GroupPass: Pass {
    let name: String
    var passes:[Pass]
    var countNumber: Int {
        return passes.map{$0.countNumber}.reduce(0, combine: +)
    }
    var description: String {
        var str = "\(name) (Group Pass \(price)#)"
        str += passes.map{$0.name}.reduce("", combine: {$0 + "\n" + $1})
        return str + "\n"
    }
    var price: Int {
        return passes.map{$0.price}.reduce(0, combine: +)
    }
    mutating func addPass(pass: Pass){
        passes.append(pass)
    }
}

//: The ConfHost oversees the conference, including total passes, total number of participants, costs, etc.
class ConfHost{
    private var passes: [Pass] = []
    init(passes: Pass...){
        self.passes = passes
    }
    func printParticipantList(){
        passes.map{print($0.description)}
    }
    var totalPrice: Int {
        return passes.map{$0.price}.reduce(0, combine: +)
    }
    var totalNumberOfParticipants: Int {
        return passes.map{$0.countNumber}.reduce(0, combine: +)
    }
    
    func getConfOverview(){
        print("MagicConf has sold \(passes.count) passes for \(totalNumberOfParticipants) participants")
        printParticipantList()
        print("Total Revenue: \(totalPrice)#")
    }
    
}

//: Just a helper extension
extension Int {
    func times(action: (Int)->()) {
        for i in 0..&lt;self {
            action(i)
        }
    }
}
//: Adding 7 dwarfs
var dwarfGroup = GroupPass(name: "Dwarf Group", passes: [])
7.times { dwarfGroup.addPass(SinglePass(name: "Dwarf # \($0)", price: 10))}

let singleP1 = SinglePass(name: "Cinderela", price: 12)
let singleP2 = SinglePass(name: "SnowWhite", price: 10)
let singleP3 = SinglePass(name: "The Wicked Witch", price: 10)

let groupP1 = GroupPass(name: "Beauty Group", passes: [singleP1, singleP2])

let confHost = ConfHost(passes: groupP1, singleP3, dwarfGroup)
confHost.getConfOverview(){% endhighlight %}

[<img class="aligncenter size-full wp-image-1021" src="/assets/images/wp-content/uploads/2015/07/composite.png" alt="composite" width="354" height="240" />][1]

 [1]: /assets/images/wp-content/uploads/2015/07/composite.png