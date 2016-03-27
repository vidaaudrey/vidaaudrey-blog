---
title: 'A Design Pattern Story in Swift – Chapter 7: Adaptor &#038; Facade'
author: Audrey
layout: post
type: page-post-long-feature
excerpt: 'We all have our innermost dream. Sometimes it becomes true, sometimes it doesn’t. When you see the tears in my eyes, that’s because my dream is broken. Fate often has its own play. We never know for sure.'
permalink: /2015/07/04/a-design-pattern-story-in-swift-chapter-7-adaptor-facade/
categories:
  - Mobile Development
  - Swift
tags:
  - Adaptor
  - Design Pattern
  - Facade
  - Swift 2.0
image:
  feature: '/assets/images/wp-content/uploads/2015/07/arya-stark.png'
  credit: 
  creditlink: 
---
<p>
  <span>We all have our innermost dream. Sometimes it becomes true, sometimes it doesn&#8217;t.</span>
</p>

<p>
  <span>When you see the tears in my eyes, that&#8217;s because my dream is broken. </span>
</p>

<p>
  <span>Fate often has its own play. We never know for sure.</span>
</p>

<p>
  {% highlight swift %}
  //: we all have dreams
protocol Dreamful{
    func dream()
}
//: we all express our emotions
protocol Expressful {
    func expressEmotion()
}

protocol Aged {
    var age: Int { get }
}
protocol DreamRealizable {
    var isDreamRealized: Bool { get set}
}

//: some arbitrary class that we can't change (assume)
class LittlePrince{
    var princeAge = 102
    var isDreamRealized = true
    func seeFlower(){
        print("Prince's dream is to see my flowers everyday")
    }
}

class Angel {
     var isDreamRealized = true
    var angelAge = 121
    func fall(){
        print("Angel's dream is to fall on the earth and experience life")
    }
}

class AryaStark {
    var isDreamRealized = false
    var humanAge = 13
    func revenge(){
        print("Arya's dream is to take revenge for the Stalk Family")
    }
}

//: just a convenient extension so that the arbitrary class of people can express themselves
extension LittlePrince: Expressful{
    func expressEmotion(){
        if isDreamRealized {
            print("Little Prince is quite happy")
        } else {
            print("Little Prince is very sad")
        }
    }
}
extension AryaStark: Expressful{
    func expressEmotion(){
        if isDreamRealized {
            print("Arya is quite happy")
        } else {
            print("Arya is very sad")
        }
    }
}
extension Angel: Expressful{
    func expressEmotion(){
        if isDreamRealized {
            print("Angel is quite happy")
        } else {
            print("Angel is very sad")
        }
    }
}


//: The core adaptor. Even Arbitrary, we are all people with dreams
class PersonWithDreamAdapter: Aged, Dreamful, CustomStringConvertible{
    private let person: AnyObject
    var age: Int {
        if person.isKindOfClass(LittlePrince) { return (person as! LittlePrince).princeAge }
        else if person.isKindOfClass(AryaStark) { return(person as! AryaStark).humanAge }
        else { return (person as! Angel).angelAge }
    }
    
    var description: String {
        if person.isKindOfClass(LittlePrince) { return "I am a prince and I am \(age) years' old" }
        else if person.isKindOfClass(AryaStark)  { return "I am AryaStark and I am \(age) years' old" }
        else  { return "I am an angel and I am \(age) years' old" }

    }
    init(person: AnyObject){
        print("Adapting \(person)")
        if person.isKindOfClass(LittlePrince) || person.isKindOfClass(AryaStark) || person.isKindOfClass(Angel) {
            self.person = person
        } else {
            fatalError("Unexpected type of person")
        }
    }
    
    func dream() {
        if person.isKindOfClass(LittlePrince) { (person as! LittlePrince).seeFlower()}
        else if person.isKindOfClass(AryaStark) {(person as! AryaStark).revenge() }
        else if person.isKindOfClass(Angel) { (person as! Angel).fall() }
    }
}


//: The GodOfDreamsFacade can manage everybody's dreams in a batch
class GodOfDreamsFacade{
    let prince: LittlePrince
    let angel: Angel
    let arya: AryaStark
    init(prince: LittlePrince, angel: Angel, arya: AryaStark){
        self.prince = prince
        self.angel = angel
        self.arya = arya
        
    }
    func checkDreamState(){
        print("-----checking everybody's dreams-----")
        prince.seeFlower()
        angel.fall()
        arya.revenge()
        expressEmotion()
       
    }
    func crushDreams(){
        print("-----GodOfDreamsFacade is crushing everybody's dreams-----")
        prince.isDreamRealized = false
        angel.isDreamRealized = false
        arya.isDreamRealized = false
        expressEmotion()
    }
    
    private func expressEmotion() {
        prince.expressEmotion()
        angel.expressEmotion()
        arya.expressEmotion()
    }
    
}

//: Testing the adaptor
print("\n Using Adapter")
let prince = LittlePrince()
let s1 = PersonWithDreamAdapter(person: prince)
let arya = AryaStark()
let angel = Angel()
print(s1)
s1.dream()
let s2 = PersonWithDreamAdapter(person: arya)
print(s2)
s2.dream()
let s3 = PersonWithDreamAdapter(person: angel)
print(s3)
s3.dream()

//: Testing the facade
print("\n Using Facade")
let facade = GodOfDreamsFacade(prince: prince, angel: angel, arya: arya)
facade.checkDreamState()
facade.crushDreams()
{% endhighlight %}
  
  <p>
    <a href="/assets/images/wp-content/uploads/2015/07/adaptor-facade.png"><img class="aligncenter size-full wp-image-1001" src="/assets/images/wp-content/uploads/2015/07/adaptor-facade.png" alt="adaptor facade" width="413" height="330" /></a>
  </p>