---
title: 'A Design Pattern Story in Swift &#8211; Chapter 2: Observer'
author: Audrey
layout: post
excerpt: 'In the deep forest, there is a beautiful witch who was born with the power to tell the past and future. In the beginning she was just a little girl in a nearby village. She knows everyone and whenever she sees danger in the future, she would warn the person. But soon she realized there are simply too many people to warn, and some of which don’t even want any help.'
permalink: /2015/06/29/a-design-pattern-story-in-swift-chapter-two-observer/
categories:
  - Mobile Development
  - Swift
tags:
  - Observer Pattern
  - Swift
image:
  feature: '/assets/images/wp-content/uploads/2015/06/pic.jpg'
  credit: 
  creditlink: 
---
<p>
  <span>In the deep forest, there is a beautiful witch who was born with the power to tell the past and future. In the beginning she was just a little girl in a nearby village. She knows everyone and whenever she sees danger in the future, she would warn the person. But soon she realized there are simply too many people to warn, and some of which don&#8217;t even want any help.</span>
</p>

<p>
  <span>So she told the good people of the village that if they want to know her update, they can tune in to listen to her music station and they shall know the message from the music.</span>
</p>

{% highlight swift %}//: Define the message  for the all parties
enum WitchMessageType: String {
    case IsChrystalBadLuck = "Bad_Luck"
    case IsChrystalGoodLuck = "Good_Luck"
    case StationCreated = "Station_Created"
    case StationDestroyed = "Station_Destroyed"
}
class WitchMessage {
    let type: WitchMessageType
    let data: Any?
    init(type: WitchMessageType, data: Any?) {
        self.type = type
        self.data = data
    }
}


//: the Good Witch will tell everybody the name of the person she tells fortune for. Bad witch may not.
class GoodWitchMessage: WitchMessage {
    var name: String
    var isBadLuck: Bool { return self.type == WitchMessageType.IsChrystalBadLuck }
    
    init(name: String, type: WitchMessageType, data: Any?){
        self.name = name
        super.init(type: type, data: data)
    }
}

// People who listen to her music station are observers
protocol Observer {
    var name:String { get }
    func notify(witchMessage: WitchMessage)
}


extension CustomStringConvertible where Self: Observer {
    var description: String { return self.name }
}


protocol Station {
    func addObserver(observers: Observer...)
    func removerObserver(observer: Observer)
}


class BaseStation: Station, CustomStringConvertible {
    private var observers: [Observer] = []
    var description: String { return "I am a Station and my observers are: \(observers)" }
    private var orderedQueue = dispatch_queue_create("orQ", DISPATCH_QUEUE_CONCURRENT)
    
    //: She can only add or remove one person at a time
    func addObserver(observers: Observer...) {
        dispatch_barrier_sync(orderedQueue) {
            observers.map { self.observers.append($0) }
        }
    }
    
    
    func removerObserver(observer: Observer) {
        dispatch_barrier_sync(orderedQueue) { () -> Void in
            self.observers.filter{ $0.name == observer.name}
            print("removed observer \(observer.name)")
        }
    }
    func sendNotificationToAll(witchMessage: WitchMessage) {
        dispatch_sync(orderedQueue) { () -> Void in
            self.observers.map{ $0.notify(witchMessage) }
        }
    }
}

class WitchStation: BaseStation {
    
    func checkCrystalBall(name: String) -> Bool {
        var messageType = WitchMessageType.IsChrystalGoodLuck
        
        if RandomYesOrNoGeneratorByInt.random() {
            print("Witch Tell: Good luck ahead")
        } else {
            messageType = WitchMessageType.IsChrystalBadLuck
            print("Witch Tell: Bad luck ahead")
        }
        
        sendNotificationToAll(GoodWitchMessage(name: name, type: messageType, data: nil))
        return messageType == WitchMessageType.IsChrystalGoodLuck
    }
}

//: all that listen to her messages
class Villager: Observer {
    var name: String
    init(name: String){
        self.name = name
    }
    func notify(witchMessage: WitchMessage) {
        print("Villager \(name) got notified")
        guard let message = witchMessage as? GoodWitchMessage else {
            print("This message might come from the Bad Witch")
            return
        }
        print("Message for \(message.name). Is Bad Luck? \(witchMessage.type)")
    }
    
    func logMyFortune(fortune: String) {
        print("Log: \(fortune)")
    }
}

class AlarmSystem: Observer {
    var name: String
    init(name: String){
        self.name = name
    }
    func notify(witchMessage: WitchMessage) {
        print("\(name) got notified")
        guard let message = witchMessage as? GoodWitchMessage else {
            print("This message might come from the Bad Witch")
            return
        }
        if witchMessage.type == WitchMessageType.IsChrystalBadLuck  {
            print("Something unfortunate will happen to \(message.name). An alarm is being sent out")
        }
    }
}

class Hero: Observer {
    var name: String
    init(name: String){
        self.name = name
    }
    func notify(witchMessage: WitchMessage) {
        print("Hero got notified")
        if witchMessage.type == WitchMessageType.IsChrystalBadLuck {
            saveTheUnfortunate()
        }
    }
    func saveTheUnfortunate() {
        print("A hero will come to save you")
    }
}

//: Test the system
let jane = Villager(name: "Jane")
let alarm = AlarmSystem(name: "Alarm System")
let jack = Hero(name: "Hero Jack")

let witchStation = WitchStation()
witchStation.addObserver(jane, alarm, jack)
print(witchStation.description)
print("--check luck for Nicole ---")
witchStation.checkCrystalBall("Nicole")

print("---check luck for Mia --")
witchStation.checkCrystalBall("Mia"){% endhighlight %}

&nbsp;

[<img class="aligncenter size-full wp-image-962" src="/assets/images/wp-content/uploads/2015/06/Observer-Pattern.png" alt="Observer Pattern" width="489" height="227" />][1]

&nbsp;

[Image][2]

 [1]: /assets/images/wp-content/uploads/2015/06/Observer-Pattern.png
 [2]: https://hdwallpapers.cat/do_not_listen_to_him_forest_girl_fruit_hd-wallpaper-1852331/