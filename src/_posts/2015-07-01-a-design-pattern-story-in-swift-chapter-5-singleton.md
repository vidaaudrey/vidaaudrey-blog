---
title: 'A Design Pattern Story in Swift – Chapter 5: Singleton'
author: Audrey
layout: post
excerpt: 'Long before the seven kingdoms were created, there was a pen – a pen that can write stories into realities. In the vast universe, there is only one pen of this kind.'
permalink: /2015/07/01/a-design-pattern-story-in-swift-chapter-5-singleton/
categories:
  - Mobile Development
  - Swift
tags:
  - Design Pattern
  - Singleton
  - Swift 2.0
image:
  feature: '/assets/images/wp-content/uploads/2015/07/universe-1080x675.jpg'
  credit: 
  creditlink: 
---
<p>
  <span> Long before the seven kingdoms were created, there was a pen &#8211; a pen that can write stories into realities. In the vast universe, there is only one pen of this kind. </span>
</p>

{% highlight swift %}final class StoryPen: CustomStringConvertible {
    static let sharedInstance = StoryPen()
    private var storyBook:[String] = []
    var description: String {return "The Story Pen"}
    private init(){
       StoryTeller.sharedInstance.tell("The Story Pen came to exist")
    }
    func addAStory(story: String){
        storyBook.append(story)
    }
    func showStoryBook(){
        storyBook.map{StoryTeller.sharedInstance.tell($0)}
    }
    
}

final class StoryTeller {
    static let sharedInstance = StoryTeller(name: "August")
    var name: String
    private init(name: String){
        self.name = name
        print("The Story Teller \(name)is born and he tells stories to the world. Here it goes...")
    }
    func tell(story: String){
        print(story)
    }
}


enum StoryType{
    case Love
    case Peace
    case Log
}
func storify(storyType: StoryType = .Log, subject: CustomStringConvertible, content: String){
    
    switch storyType {
    case .Log: StoryPen.sharedInstance.addAStory("\(subject.description) // \(content)")
    case .Peace: StoryPen.sharedInstance.addAStory("A Story about Peace and \(subject.description)// \(content)")
    case .Love: StoryPen.sharedInstance.addAStory("A Story about Love and \(subject.description)// \(content)")
    }
}
protocol Kindom: CustomStringConvertible {
    var name: String { get }
}

final class KindomOfDemon:Kindom {
    static let sharedInstance = KindomOfDemon(name: "The Kindom of Demon")
    var name: String
    var description: String { return self.name }
    private init(name: String){
        self.name = name
        storify(subject: self, content: " created")
    }
}
final class KindomOfGod:Kindom {
    static let sharedInstance = KindomOfDemon(name: "The Kindom of God")
    var name: String
    var description: String { return self.name }
    private init(name: String){
        self.name = name
        storify(subject: self, content: "created")
    }
}
final class KindomOfFairy:Kindom {
    static let sharedInstance = KindomOfFairy(name: "The Kindom of Fairy")
    var name: String
    var description: String { return self.name }
    private init(name: String){
        self.name = name
        storify(subject: self, content: "created")
    }
}
final class KindomOfHell:Kindom {
    static let sharedInstance = KindomOfHell(name: "The Kindom of Hell")
    var name: String
    var description: String { return self.name }
    private init(name: String){
        self.name = name
        storify(subject: self, content: "created")
    }
}
final class KindomOfMonster:Kindom {
    static let sharedInstance = KindomOfMonster(name: "The Kindom of Monster")
    var name: String
    var description: String { return self.name }
    private init(name: String){
        self.name = name
        storify(subject: self, content: "created")
    }
}
final class KindomOfHuman:Kindom {
    static let sharedInstance = KindomOfHuman(name: "The Kindom of Human")
    var name: String
    var description: String { return self.name }
    private init(name: String){
        self.name = name
        storify(subject: self, content: "created")
    }
}

//: Testing
KindomOfGod.sharedInstance
KindomOfFairy.sharedInstance
KindomOfMonster.sharedInstance
KindomOfHell.sharedInstance
KindomOfDemon.sharedInstance
KindomOfHuman.sharedInstance

StoryPen.sharedInstance.showStoryBook(){% endhighlight %}

[<img class="aligncenter size-full wp-image-988" src="/assets/images/wp-content/uploads/2015/07/Singleton.png" alt="Singleton" width="543" height="119" />][1]

<p>

 [1]: /assets/images/wp-content/uploads/2015/07/Singleton.png