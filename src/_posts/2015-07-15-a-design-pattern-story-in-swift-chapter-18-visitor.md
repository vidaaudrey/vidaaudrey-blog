---
title: 'A Design Pattern Story in Swift – Chapter 18: Visitor'
author: Audrey
layout: post
excerpt: 'It was Confucius who said isn’t it great when friends visit from distant places. 子曰， “有朋自远方来，不亦乐乎”'
permalink: /2015/07/15/a-design-pattern-story-in-swift-chapter-18-visitor/
categories:
  - Mobile Development
  - Swift
tags:
  - Design Pattern
  - Swift
  - Visitor
image:
  feature: '/assets/images/wp-content/uploads/2015/07/door-682x675.jpg'
  credit: 
  creditlink: 
---
<p>
  <span> It was Confucius who said isn&#8217;t it great when friends visit from distant places. </span><span>子曰，</span><span> “</span><span>有朋自远方来，不亦乐乎</span><span>” </span>
</p>


> <p>
>   <span>The visitor pattern allows new algorithms to operate on collections of heterogeneous objects without needing to modify or subclass the collection class. It&#8217;s similar to the strategy pattern. &#8212; <em><a href="http://www.apress.com/9781484203958">Design Pattern in Swift</a></em></span>
> </p>

&nbsp;

{% highlight swift %}protocol Person {
    func accept(visitor: Visitor)
}

protocol Visitor {
    func visit(person: Dwarf)
    func visit(person: Maiden)
    func visit(person: Knight)
    
}

struct Dwarf: Person {
    let name: String
    let expectedAge: Int
    func accept(visitor: Visitor) {
        visitor.visit(self)
    }
}

struct Maiden: Person {
    let name: String
    let expectedAge: Int
    func accept(visitor: Visitor) {
        visitor.visit(self)
    }
}
struct Knight: Person {
    let name: String
    let expectedAge: Int
    let skillLevel: Int
    func accept(visitor: Visitor) {
        visitor.visit(self)
    }
}

struct People: Person {
    let group: [Person]
    func accept(visitor: Visitor) {
        group.map{ $0.accept(visitor) }
    }
}
//: A healthProVisitor can increase each person's age by different amount of years
class HealthProVisitor: Visitor {
    var totalExpectedAgeOld = 0
    var totalExpectedAge = 0
    func visit(person: Dwarf) {
        totalExpectedAgeOld += person.expectedAge
        totalExpectedAge += person.expectedAge + 1
    }
    func visit(person: Knight) {
        totalExpectedAgeOld += person.expectedAge
        totalExpectedAge += person.expectedAge + 5
    }
    func visit(person: Maiden) {
        totalExpectedAgeOld += person.expectedAge
        totalExpectedAge += person.expectedAge + 10
    }
}

//: a prettyNameVisitor can form memoriable names for others to remember
class PrettyNameVisitor: Visitor {
    var names: [String] = []
    func visit(person: Maiden) {
        names.append("Pretty Maiden \(person.name)")
    }
    func visit(person: Knight) {
        names.append("Knight \(person.name) with \(person.skillLevel) level of skills")
    }
    func visit(person: Dwarf) {
        names.append("A plain dwarf named \(person.name) ")
    }
}

//: Testing 
print("Created a group of people Helen (32), Joe (99), Eleot(45)...")
let people = People(group: [Maiden(name: "Helen", expectedAge: 32),
        Dwarf(name: "Joe", expectedAge: 99),
        Knight(name: "Eleot", expectedAge: 32, skillLevel: 45)
    ])

let healthProVisitor = HealthProVisitor()
let prettyNameVisitor = PrettyNameVisitor()
print("The healthProVisitor is visiting the group...")
people.accept(healthProVisitor)
print("Before visit, total expected age:\(healthProVisitor.totalExpectedAgeOld)")
print("After visit, total expected age:\(healthProVisitor.totalExpectedAge)\n")
print("The prettyNameVisitor is visiting the group...")
people.accept(prettyNameVisitor)
print("After visit, people's names: \(prettyNameVisitor.names) \n")


class InsuranceVisitor: Visitor {
    var salesRecord:[String: Bool] = [:]
    func visit(person: Dwarf) {
        salesRecord[person.name] = getQualification(person.expectedAge)
    }
    func visit(person: Knight) {
         salesRecord[person.name] = getQualification(person.expectedAge)
     }
    func visit(person: Maiden) {
         salesRecord[person.name] = getQualification(person.expectedAge)
    }
    
    private func getQualification(expectedAge: Int) -> Bool {
        return expectedAge > 45
    }
}


//: Testing
print("A new visitor, the insurance guy! Let's see what's his sales record say after the visit")
let insuranceVisitor = InsuranceVisitor()
people.accept(insuranceVisitor)
insuranceVisitor.salesRecord.map{
    print("\($0.0), is eligiable for insurance?: \($0.1)")
}{% endhighlight %}

[<img class="aligncenter size-full wp-image-1070" src="/assets/images/wp-content/uploads/2015/07/visitor.png" alt="visitor" width="792" height="195" />][1]

 [1]: /assets/images/wp-content/uploads/2015/07/visitor.png