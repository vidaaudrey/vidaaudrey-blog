---
title: 'A Design Pattern Story in Swift – Chapter 19: Flyweight'
author: Audrey
layout: post
excerpt: 'It’s hard to get things done without a system to share and prioritize.  There are thousands of soldiers in the army, but only few of them are commanders. How can we quickly go through all the soldiers to find the commanders, their ranks, and how much power the army has together?'
permalink: /2015/07/17/a-design-pattern-story-in-swift-chapter-19-flyweight/
categories:
  - Mobile Development
  - Swift
tags:
  - Design Patter
  - Flyweight
  - Swift
image:
  feature: '/assets/images/wp-content/uploads/2015/07/army1.jpg'
  credit: 
  creditlink: 
---
<div class="page" title="Page 333">
  <div class="layoutArea">
    <div class="column">
      <p>
        It&#8217;s hard to get things done without a system to share and prioritize.  There are thousands of soldiers in the army, but only few of them are commanders. How can we quickly go through all the soldiers to find the commanders, their ranks, and how much power the army has together?
      </p>
      
      <blockquote>
        <p>
          The flyweight pattern shares common data objects between multiple calling components.  It reduces the amount of memory needed to create the data objects required by the calling components and the amount of work required to create them. The impact of implementing the pattern increases with the number of calling components that share the data.  <em><a href="http://www.apress.com/9781484203958">Design Pattern in Swift</a> (The code is also referred by the book)</em>
        </p>
      </blockquote>
    </div>
  </div>
</div>

{% highlight swift %}
struct Soldier{
    let name: String
    let id: Int
    var rank: Int
    var hashValue: Int { return name.hashValue }
}

func == (lhs: Soldier, rhs: Soldier) -> Bool {
    return lhs.id == rhs.id && lhs.name == rhs.name
}

extension Dictionary {
    init(setupFunc: (() -> [(Key, Value)])){
        self.init()
        for item in setupFunc() {
            self[item.0] = item.1
        }
    }
}

protocol Flyweight {
    subscript(id: Int) -> Soldier? { get set }
    var totalPower: Int { get }
    var numberOfCommanders: Int { get }
}

//: There are thousands of soldiers in the army, most of which are lower level soldiers, but some are commanders with higher rank
//: extrinsic holds all soldiers, intrinsic represent those who are commanders (who's rank has been updated to higher level).

class ArmyFlyweight: Flyweight {
    private let extrinsicArmy: [Int: Soldier]
    private var intrinsicArmy: [Int: Soldier]
    private let queue = dispatch_queue_create("dataQ", DISPATCH_QUEUE_CONCURRENT)
    
    init(soldiers: [Int: Soldier]) {
        self.extrinsicArmy = soldiers
        self.intrinsicArmy = [:]
    }
    
    subscript(id: Int) -> Soldier? {
        get {
            var result: Soldier?
            dispatch_sync(queue) { () -> Void in
                guard let soldier = self.intrinsicArmy[id] else {
                    result =  self.extrinsicArmy[id]
                    return
                }
                result = soldier
            }
            return result
        }
        set(newSoldier) {
            if newSoldier != nil {
                dispatch_sync(queue) { () -> Void in
                    self.intrinsicArmy[id] = newSoldier
                }
            }
        }
    }
    
    // each of the soldier's power = rank * rank, initial rank for soliders is 0.
    var totalPower: Int {
        var result = 0
        dispatch_sync(queue) { () -> Void in
            result = self.intrinsicArmy.values.map{$0.rank * $0.rank}.reduce(0, combine: +)
        }
        return result
    }
    var numberOfCommanders: Int {
        var result = 0
        dispatch_sync(queue) { () -> Void in
            result = self.intrinsicArmy.count
        }
        return result
    }
    
}


class FlyweightFactory {
    static var numberOfSoldiers: Int = 10 {
        didSet {
            print("Set the total number of soldiers to be \(numberOfSoldiers)")
        }
    }
    class func createFlyweight() -> Flyweight {
        return ArmyFlyweight(soldiers: extrinsicArmy)
    }
    
    private class var extrinsicArmy: [Int: Soldier] {
        get {
            struct singletonWrapper {
                static let singleton = Dictionary&lt;Int, Soldier>(
                    setupFunc: { () in
                        var results:[(Int, Soldier)] = []
                        for i in 0..&lt;FlyweightFactory.numberOfSoldiers {
                            results.append(i, Soldier(name: "Sol#\(i)", id: i, rank: 0))
                        }
                        return results
                    }
                    
                )
            }
            return singletonWrapper.singleton
        }
    }
}

class Army: CustomStringConvertible {
    private var soldiers: Flyweight
    init(){
        soldiers = FlyweightFactory.createFlyweight()
        print("Army created!")
    }
    var description: String {
        return "Total soldiers: \(FlyweightFactory.numberOfSoldiers). Total commanders: \(numberOfCommanders). Total Power:\(totalPower) \n"
    }
    func setRankBySoldier(var soldier: Soldier, newRank: Int){
        print("Setting \(soldier.name)'s rank to be \(newRank)")
        soldier.rank = newRank
        soldiers[soldier.id] = soldier
    }
    func getSoliderById(id: Int) -> Soldier? {
        return soldiers[id]
    }
    
    func setRankById(id: Int, newRank: Int){
        if var oldSoldier = soldiers[id] {
            print("Setting \(oldSoldier.name)'s rank to be \(newRank)")
            oldSoldier.rank = newRank
            soldiers[oldSoldier.id] = oldSoldier
        } else {
            print("Failed! Trying to set rank to an unknown soldier whose id is \(id)")
        }
    }
    func getCommanderNames() -> String {
        print("Trying to get commanders' names")
        guard let s = soldiers as? ArmyFlyweight else { return "Failed to get commanders' names" }
        return s.intrinsicArmy.values.map{$0.name}.reduce(""){ $0 + "  " + $1}
    }
    var totalPower: Int { return soldiers.totalPower }
    var numberOfCommanders: Int { return soldiers.numberOfCommanders }
}

//: Testing
let totalNumberOfSoldiers = 20000
FlyweightFactory.numberOfSoldiers = totalNumberOfSoldiers
let army1 = Army()
print(army1.description)
let sol1 = army1.getSoliderById(2)

for i in 1...10 {
    army1.setRankById(Int(arc4random_uniform(24000)) , newRank: Int(arc4random_uniform(10)) + 1)
}

army1.setRankBySoldier(sol1!, newRank: 4)
print(army1.description)
print(army1.getCommanderNames())

print("\n\n")'
{% endhighlight %}

[<img class="aligncenter size-full wp-image-1074" src="/assets/images/wp-content/uploads/2015/07/Flyweight.png" alt="Flyweight" width="647" height="326" />][1]

 [1]: /assets/images/wp-content/uploads/2015/07/Flyweight.png