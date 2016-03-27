---
title: 'A Design Pattern Story in Swift- Chapter 1: Strategy'
author: Audrey
layout: post
excerpt: 'Once upon a time, there was a girl living happily in the deep forrest. She did not know where she came, nor where she is suppose to be. The only unfamiliar memory she had is that many years ago, before she could wake up from the cold and molded stone, she heard a distance whisper, saying “home, home, this is your home”.

'
permalink: /2015/06/09/a-design-pattern-story-chapter-1-strategy/
categories:
  - Mobile Development
image:
  feature: '/assets/images/wp-content/uploads/2015/06/animal.jpg'
  credit: 
  creditlink: 
---
> Happy families are all alike; every unhappy family is unhappy in its own way. &#8211; Leo Tolstoy&#8217;s

Once upon a time, there was a girl living happily in the deep forrest. She did not know where she came, nor where she is suppose to be. The only unfamiliar memory she had is that many years ago, before she could wake up from the cold and molded stone, she heard a distance whisper, saying “home, home, this is your home”.

She was terrified of the world when she woke up. Everything is so strange, so unspeakably complicated. And worst of all, there was even no language in her head that can explain what she is going through.

She stood up and started to walk, then she noticed something different which helped her understand the world a little better: a lot of moving creatures were afraid of her!

Rabbits jumped away.  
Birds flied away.  
Squirrels climbed up the trees.  
Hedgehog put their heads under the shells…

{% highlight swift %}class Creature {
    let name:String
    var escapeStrategy: EscapeStrategy
    init(name: String, escapeStrategy: EscapeStrategy){
        self.name = name
        self.escapeStrategy = escapeStrategy
    }
    func performEscape() {
        escapeStrategy.executeEscapePlan()
        println("\(name) successfully escaped")
    }
}


protocol EscapeStrategy {
    func executeEscapePlan()
}

class EscapeByFlying: EscapeStrategy {
    func executeEscapePlan() {
        println("I escaped by flying")
    }
}
class EscapeByJumping: EscapeStrategy {
    func executeEscapePlan() {
        println("I escaped by jumping")
    }
}
class EscapeByClimbing: EscapeStrategy {
    func executeEscapePlan() {
        println("I escaped by climbing")
    }
}

class Rabbit: Creature {
    init(name: String) {
        super.init(name: name, escapeStrategy: EscapeByJumping())
    }
}

class Squirrel: Creature {
    init(name: String) {
        super.init(name: name, escapeStrategy: EscapeByClimbing())
    }
}
// don't know the name of the bird yet
class Bird: Creature {
    init(name: String) {
        super.init(name: name, escapeStrategy: EscapeByFlying())
    }
}

// Testing Code 
let rabbit = Rabbit(name: "Miss Rabbit　Ｒ")
let squirrel = Squirrel(name: "Mr. Squirrel S")
let bird = Bird(name: "Madam. Bird B")
rabbit.performEscape()
squirrel.performEscape()
bird.performEscape(){% endhighlight %}

Output:

[<img class=" size-full wp-image-885 alignnone" src="/assets/images/wp-content/uploads/2015/06/Screen-Shot-2015-06-09-at-8.39.59-PM.png" alt="Screen Shot 2015-06-09 at 8.39.59 PM" width="291" height="102" />][1]

“Ha, I have the power to expel creatures!” She felt a current of great excitement going through her body and she continued walking.

Animals spoke in the background, &#8220;yes, we all escape. You got it. But we do it differently.&#8221;

P.S.

> The Strategy Pattern defines a family of algorithms, encapsulates each one and makes them interchangeable. Strategy lets the algorithm vary independently from clients that use it. &#8212; HeadFirst

 [1]: /assets/images/wp-content/uploads/2015/06/Screen-Shot-2015-06-09-at-8.39.59-PM.png