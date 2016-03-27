---
title: 'A Design Pattern Story in Swift – Chapter 17: Memento'
author: Audrey
layout: post
excerpt: 'A good snapshot stops a beautiful moment from running away. At some point, we’ll press the restore button and relive that moment again.'
permalink: /2015/07/15/a-design-pattern-story-in-swift-chapter-17-memento/
categories:
  - Mobile Development
  - Swift
tags:
  - Design Pattern
  - Memento
  - Swift
image:
  feature: '/assets/images/wp-content/uploads/2015/07/memento.jpg'
  credit: 
  creditlink: 
---
A good snapshot stops a beautiful moment from running away. At some point, we&#8217;ll press the restore button and relive that moment again.

> The memento pattern captures the complete state of an object into a memento that can be used to reset the object at a later date. It allows a complete reset of an object without the need to track and apply individual undo commands. –*  [Design Pattern in Swift][1]*

{% highlight swift %}//: Just a sign to show the class / struct is a memento, nothing special
protocol Memento {
}

//: The originator can create and restore game state
protocol Originator {
    func createMemento() -> Memento
    func applyMemento(memento: Memento)
}

//: a game state entry
struct GameStateEntry {
    var level: Int
    var weapon: String
    var points: Int
}

//: A GameState memento, which contains all the information the CheckPoint needed to restore the state
struct GameMemento: Memento {
    private let entries: [Int: GameStateEntry]
    private let nextId: Int
    private let totalPoints: Int
    init(checkPoint: CheckPoint){
        self.entries = checkPoint.entries
        self.nextId = checkPoint.nextId
        self.totalPoints = checkPoint.totalPoints
    }
    func apply(checkPoint: CheckPoint) {
        print("Restoring a game state to a checkpoint...")
        checkPoint.nextId = nextId
        checkPoint.totalPoints = totalPoints
        checkPoint.entries = entries
    }
}
//: A CheckPoint can create and restore game state
class CheckPoint: Originator {
    private var entries: [Int: GameStateEntry] = [:]
    private var totalPoints: Int  = 0
    private var nextId: Int = 0
    
    func addGameStateEntry(level: Int, weapon: String, points: Int) {
        let entry = GameStateEntry(level: level, weapon: weapon, points: points)
        entries[nextId++] = entry
        totalPoints += points
    }
    
    func createMemento() -> Memento {
        return GameMemento(checkPoint: self)
    }
    
    func applyMemento(memento: Memento) {
        guard let m = memento as? GameMemento  else { return }
        m.apply(self)
    }
    
    func printCheckPoint() {
        print("Printing checkPoint....")
        entries.sort {$0.0 &lt; $1.0}
            .map {
                print("Level: \($0.1.level)   Weapon: \($0.1.weapon)   Points: \($0.1.points) ")
        }
        print("Total Points: \(totalPoints)\n")
        
    }
}


//:Testing

let checkPoint = CheckPoint()
checkPoint.addGameStateEntry(0, weapon: "Fire Ball", points: 20)
checkPoint.addGameStateEntry(1, weapon: "Flood", points: 10)
checkPoint.printCheckPoint()
let memento = GameMemento(checkPoint: checkPoint)
checkPoint.addGameStateEntry(2, weapon: "Crusher", points: 30)
checkPoint.addGameStateEntry(4, weapon: "Flower", points: 30)
checkPoint.printCheckPoint()

checkPoint.applyMemento(memento)
checkPoint.printCheckPoint(){% endhighlight %}

[<img class="aligncenter size-full wp-image-1065" src="/assets/images/wp-content/uploads/2015/07/memento.png" alt="memento" width="374" height="286" />][2]

 [1]: http://www.apress.com/9781484203958
 [2]: /assets/images/wp-content/uploads/2015/07/memento.png