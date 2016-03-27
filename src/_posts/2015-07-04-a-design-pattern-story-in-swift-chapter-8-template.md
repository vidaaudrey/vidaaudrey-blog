---
title: 'A Design Pattern Story in Swift – Chapter 8: Template'
author: Audrey
layout: post
type: page-post-long-feature
excerpt: 'There is very little difference between magic and art. It’s an act to create something from nothing.'
permalink: /2015/07/04/a-design-pattern-story-in-swift-chapter-8-template/
categories:
  - Mobile Development
  - Swift
tags:
  - Design Pattern
  - Swift 2.0
  - Template
image:
  feature: '/assets/images/wp-content/uploads/2015/07/magic-potion.jpg'
  credit: 
  creditlink: 
---
<p>
  <span>There is very little difference between magic and art. It&#8217;s an act to create something from nothing. </span>
</p>

> <p>
>   <span> The template method pattern is a behavioral design pattern that defines the program skeleton of an algorithm in a method, called template method, which defers some steps to subclasses. &#8211; Wiki</span>
> </p>

<pre class="lang:swift decode:true " title="Template">protocol MagicRecipe {
    var isDarkMagic: Bool { get }
    func makeMagic()
    func addSpecialIngredience()
    func testMagic()
}

//: create the template for making the Magic Recipe. All whiteMagic needs to be tested before being released.
extension MagicRecipe {
    final func makeMagic(){
        print("Starting the magic-making process...")
        addSpecialIngredience()
        if !isDarkMagic {
           testMagic()
        }
        let magicType = isDarkMagic ? "Dark Magic" : "White Magic"
        print("A new \(magicType) is created! \n")
    }
}

//: The magic recipe for getting love
 class MagicRecipeForLove: MagicRecipe {
    var isDarkMagic: Bool
    var name: String
    var description: String { return name }
    init(isDarkMagic: Bool = false, name: String){
        self.isDarkMagic = isDarkMagic
        self.name = name
        print("Creating the magic: \(name)")
    }
    func addSpecialIngredience() {
        let ingredience = isDarkMagic ? "black diamond" : "red diamond"
        print("Adding \(ingredience) as special ingredience")
    }
    func testMagic() {
        print("testMagicing \(name)")
    }
}

//: Sleep Magic is always bad (dark magic)
 class MagicRecipeForSleep: MagicRecipe {
    var isDarkMagic: Bool { return true }
    var name: String
    var description: String { return name }
    init(name: String){
        self.name = name
        print("Creating the magic: \(name)")
    }
    func addSpecialIngredience() {
        print("Adding tears from the black witch as special ingredience")
    }
    func testMagic() {
        print("testMagicing \(name)")
    }
}


let l1 = MagicRecipeForLove(name: "Long Lasting Love")
l1.makeMagic()
let l2 = MagicRecipeForLove(isDarkMagic: true, name: "Crazy Stupid Love")
l2.makeMagic()
let s1 = MagicRecipeForSleep(name: "Sleeping in Emptiness")
s1.makeMagic()
let s2 = MagicRecipeForSleep(name: "Sleeping and Dreaming")
s2.makeMagic()</pre>

[<img class="aligncenter size-full wp-image-1006" src="http://audreyli.me/wp-content/uploads/2015/07/template.png" alt="template" width="390" height="275" />][1]

 [1]: http://audreyli.me/wp-content/uploads/2015/07/template.png