---
title: 'A Design Pattern Story in Swift  &#8211; Chapter 4:  Factory'
author: Audrey
layout: post
excerpt: 'We all have our special weapons. And we fight for what we believed in.'
permalink: /2015/07/01/a-design-pattern-story-in-swift-chapter-4-factory/
categories:
  - Mobile Development
  - Swift
tags:
  - Design Pattern
  - Factory
  - Swift 2.0
image:
  feature: '/assets/images/wp-content/uploads/2015/07/ancient-god.jpg'
  credit: 
  creditlink: 
---
<p>
  <span>We all have our special weapons. And we fight for what we believed in. </span>
</p>

{% highlight swift %}enum PersonType{
    case God
    case Knight
    case Wizard
    case Dwarf
    case Poet
}

protocol Personable {
    var personType: PersonType { get }
    var name: String { get }
    var weapon: Weapon? { get set}
}

class Person: Personable, CustomStringConvertible {
    var personType: PersonType
    var name: String
    var weapon: Weapon?
    var description: String {
        return name + (weapon == nil ? " - no weapon \n" : " - Weapon: \(weapon!.name) (price: \(weapon!.price)#) \n")
    }
    
    init(personType: PersonType,name: String, weapon: Weapon?){
        self.name = name
        self.personType = personType
        self.weapon = weapon
    }
}
//: HouseOfWeapon is a new family that has rised since the first war in the seven kindom. They are the only place where people can get their weapons.
protocol Weapon {
    var name: String { get }
    var price: Int { get set }
    func fight()
}

struct Sword: Weapon {
    var name: String
    var price: Int
    func fight() {
        print("fight with sword")
    }
}
struct Pen: Weapon {
    var name: String
    var price: Int
    func fight() {
        print("fight with pen")
    }
}
struct Magic: Weapon {
    var name: String
    var price: Int
    func fight() {
        print("fight with magic")
    }
}
struct Hammer: Weapon {
    var name: String
    var price: Int
    func fight() {
        print("fight with hammer")
    }
}

//: In the beginning, people would randomly drop at the HouseOfWeapon and ask for their weapon of choice. The choices sometimes turn out to be terribly wrong and people would come back to demand for exchanges. There is no system

//: LordOfWeapon is the head of HouseOfWeapon and he has the knowledge of what kind of weapon should be create for what kind of person.
class LordOfWeapon {
    class func weaponMatch(person: Person) -> Weapon {
        switch person.personType {
        case .Dwarf: return Hammer(name: "Hammer", price: 10)
        case .God, .Wizard: return Magic(name: "Magic", price: 20)
        case .Knight: return Sword(name: "Sword", price: 15)
        case .Poet: return Pen(name: "Pen", price: 25)
        }
    }
}

//: create a group of people
let knight = Person(personType: PersonType.Knight, name: "Knight William", weapon: nil)
let dwarf = Person(personType: PersonType.Dwarf, name: "Dwarf Jim", weapon: nil)
let poet = Person(personType: PersonType.Poet, name: "Poet Shelly", weapon: nil)
let god = Person(personType: PersonType.God, name: "God of Music", weapon: nil)
var group:[Person] = [knight, dwarf, poet, god]

print("----------People Group Created---------")
print(group.map{$0.description})

group = group.map({ (var p) -> Person in
    p.weapon = LordOfWeapon.weaponMatch(p)
    return p
})
print("----------Weapon Added---------")
print(group.map{$0.description})

//:## Now, the new LordOfCoin want to reset the price of the weapons

class LordOfCoin {
    class func adjustWeaponPrice( person: Person) -> Int  {
        guard person.weapon != nil else { return 0 }
        switch person.personType {
        case .Dwarf: return 1
        case .God,; .Wizard: return  50
        case; .Knight: return 5
        case; .Poet: return  -20
        }
    }
}

print("\n----------LordOfCoin adjusted the price of weapons ---------")
group = group.map({ (var p) -> Person in
    p.weapon?.price += LordOfCoin.adjustWeaponPrice(p)
    return p
})
print(group.map{$0.description})


//: The problem is that both LordOfCoin and LordOfWeapon are doing the same kind of checking for person's type. Can they outsource this work to someone else? Perhaps a RuleBook? Say a universalWeaponMatch rule
func universalWeaponMatch(var person: Personable) -> Personable {
    if person.weapon == nil {
        var weapon: Weapon
        switch person.personType {
        case .Dwarf: weapon =  Hammer(name: "Hammer", price: 10)
        case .God, .Wizard: weapon = Magic(name: "Magic", price: 20)
        case .Knight: weapon = Sword(name: "Sword", price: 15)
        case .Poet: weapon = Pen(name: "Pen", price: 25)
            
        }
        person.weapon = weapon
    }
    return person
}

//: The LordOfWeapon refers the 'universalWeaponMatch' to create the right weapon for each person
class LordOfWeaponAdvanced {
    class func weaponMatch(person: Personable) -> Weapon? {
        return universalWeaponMatch(person).weapon
    }
}

//: CoinOfWeapon refers the 'universalWeaponMatch' to check and adjust the weapon price.
class LordOfCoinAdvanced {
    class func getWeaponPrice(person: Personable) -> Int? {
        return universalWeaponMatch(person).weapon?.price
    }
    class func adjustWeaponPrice(var person: Personable) -> Personable {
        //: equip the person with weapon
        person = universalWeaponMatch(person)
        guard person.weapon != nil else { return person }
        // Fav Poet and give them free weapons
        if person.weapon!.price > 0 && person.personType == .Poet {
            print("Through the 'universalWeaponMatch' book, LordOfCoinAdvanced adjusted the weapon price for \(person.name) from \(person.weapon!.price)# to 0# ")
            person.weapon!.price = 0
        }
        return person
    }
}

print("\n---------- 'universalWeaponMatch' book is created ---------")
LordOfCoinAdvanced.adjustWeaponPrice(group[2])
print(group[2] )
{% endhighlight %}

[<img class="aligncenter size-full wp-image-981" src="/assets/images/wp-content/uploads/2015/07/factory-1.png" alt="factory 1" width="797" height="355" />][1]

Rework on the code, add weapon factories and let them decide the weapon details.

{% highlight swift %}enum PersonType{
    case God
    case Knight
    case Wizard
    case Dwarf
    case Poet
}

enum WeaponType {
    case Sword
    case Magic
    case Pen
    case Hammer
}


//: We all have our special weapons. And we fight for what we believed in.
protocol Personable {
    var personType: PersonType { get }
    var name: String { get }
    var weapon: Weapon? { get set}
    var skillLevel: Int { get set}
}

class Person: Personable, CustomStringConvertible {
    var personType: PersonType
    var name: String
    var weapon: Weapon?
    var skillLevel: Int
    var description: String {
        return name + (weapon == nil ? " - no weapon \n" : " - Weapon: \(weapon!.name) (price: \(weapon!.price)#) \n")
    }
    init(personType: PersonType,name: String, weapon: Weapon?, skillLevel: Int  = 0){
        self.name = name
        self.personType = personType
        self.weapon = weapon
        self.skillLevel = skillLevel
    }
}


protocol Weapon {
    var name: String { get }
    var price: Int { get set }
    var powerLevel: Int { get }
    
    func fight()
}
struct Sword: Weapon {
    var name: String
    var price: Int
    var powerLevel: Int
    func fight() {
        print("fight with sword")
    }
}
struct Pen: Weapon {
    var name: String
    var price: Int
    var powerLevel: Int
    func fight() {
        print("fight with pen")
    }
}
struct Magic: Weapon {
    var name: String
    var price: Int
    var powerLevel: Int
    func fight() {
        print("fight with magic")
    }
}
struct Hammer: Weapon {
    var name: String
    var price: Int
    var powerLevel: Int
    func fight() {
        print("fight with hammer")
    }
}


//: Previously the "universalWeaponMatch" takes over the responsibility for creating the matching weapon for each person. But as the amount of weapon grows, the matching book exploded and became hard to manage.
//: In general, the HouseOfWeapon makes 3 kinds weapons:
//: * WeaponFromTheSouth: good for entry level, flexbile
//: * WeaponFromTheNorth: requires heavy mastery, very powerful
//: * WeaponFromTheVast: a mix of materials from everywhere, can be very weak or very powerful. Hard to expect the result

protocol WeaponFactory {
    func makeAWeapon(weaponType: WeaponType) -> Weapon
}

class WeaponFactoryFromTheNorth:WeaponFactory {
     func makeAWeapon(weaponType: WeaponType) -> Weapon {
        switch weaponType {
        case .Hammer: return Hammer(name: "Hammer from North", price: 100, powerLevel: 90)
        case .Magic: return Magic(name: "Magic from North", price: 100, powerLevel: 80)
        case .Pen: return Pen(name: "Pen from North", price: 90, powerLevel: 99)
        case .Sword: return Sword(name: "Sword from North", price: 70, powerLevel: 65)
        }
    }
}

class WeaponFactoryFromTheSouth:WeaponFactory {
    func makeAWeapon(weaponType: WeaponType) -> Weapon {
        switch weaponType {
        case .Hammer: return Hammer(name: "Hammer from South", price: 100, powerLevel: 1)
        case .Magic: return Magic(name: "Magic from South", price: 10, powerLevel: 18)
        case .Pen: return Pen(name: "Pen from South", price: 9, powerLevel: 9)
        case .Sword: return Sword(name: "Sword from South", price: 7, powerLevel: 5)
        }
    }
}
class WeaponFactoryFromTheVast:WeaponFactory {
    func makeAWeapon(weaponType: WeaponType) -> Weapon {
        switch weaponType {
        case .Hammer: return Hammer(name: "Hammer from Vast", price: 80, powerLevel: 99)
        case .Magic: return Magic(name: "Magic from Vast", price: 30, powerLevel: 1)
        case .Pen: return Pen(name: "Pen from Vast", price: 9, powerLevel: 67)
        case .Sword: return Sword(name: "Sword from Vast", price: 78, powerLevel: 2)
        }
    }
}

//: the 'universalWeaponMatchAdvanced' checks the person's skill level first and send the order to one of the three Weapon Factories to make the weapon. It doesn't need to care about the details of each weapon (price, name...). It's not their business anyway.
func universalWeaponMatchAdvaned(var person: Personable) -> Personable {
    var weaponFactory: WeaponFactory
    switch person.skillLevel {
        case 0...20: weaponFactory = WeaponFactoryFromTheSouth()
        case; 21...100: weaponFactory = WeaponFactoryFromTheNorth();
        default: weaponFactory = WeaponFactoryFromTheVast()
    }
    
    if person.weapon == nil {
        var weapon: Weapon
        switch person.personType {
        case .Dwarf: weapon =  weaponFactory.makeAWeapon(WeaponType.Hammer)
        case .God,; .Wizard: weapon = weaponFactory.makeAWeapon(WeaponType.Magic)
        case; .Knight: weapon = weaponFactory.makeAWeapon(WeaponType.Sword)
        case; .Poet: weapon = weaponFactory.makeAWeapon(WeaponType.Pen)
        }
        person.weapon = weapon
    }
    return person
}

class LordOfWeapon {
    class func weaponMatch(person: Personable) -> Weapon? {
        return universalWeaponMatchAdvaned(person).weapon
    }
}

//: Testing
print("----------Created a group of people ---------")
let knight = Person(personType: PersonType.Knight, name: "Knight William", weapon: nil, skillLevel: 56)
let dwarf = Person(personType: PersonType.Dwarf, name: "Dwarf Jim", weapon: nil, skillLevel: 99)
let poet = Person(personType: PersonType.Poet, name: "Poet Shelly", weapon: nil, skillLevel: 142)
let god = Person(personType: PersonType.God, name: "God of Music", weapon: nil, skillLevel: 1)
var group:[Person] = [knight, dwarf, poet, god]

print(group.map{$0.description})
print("----------Add Weapon to each person according to their skill level ---------")
group.map{LordOfWeapon.weaponMatch($0)}
print(group.map{$0.description})


//:## Now, the new LordOfCoin want to reset the price of the weapons. He is also responsible for calculating the tax for each person's weapon

class LordOfCoin {
    class func calculateWeaponCostAfterTax(person: Personable) -> Int {
        if person.weapon == nil { return 0 }
        else { return universalWeaponMatchAdvaned(person).weapon!.price * 2 }
    }
    class func adjustWeaponPrice( person: Person) -> Int  {
        guard person.weapon != nil else { return 0 }
        switch person.personType {
        case .Dwarf: return 1
        case .God, .Wizard: return  50
        case .Knight: return 5
        case .Poet: return  20
        }
    }
}

print("\n----------LordOfCoin adjusted the price of weapons ---------")
group = group.map({ (var p) -> Person in
    p.weapon?.price += LordOfCoin.adjustWeaponPrice(p)
    return p
})
print(group.map{$0.description})
print("\n----------LordOfCoin calculate the total cost after tax ---------")
let totalCost = group.map{LordOfCoin.calculateWeaponCostAfterTax($0)}.reduce(0, combine: +)
let totalCostBeforeTax = group.map{$0.weapon!.price}.reduce(0, combine: +)
print("total cost after tax: \(totalCost)#  (before tax: \(totalCostBeforeTax)#)\n"){% endhighlight %}

[<img class="aligncenter size-full wp-image-982" src="/assets/images/wp-content/uploads/2015/07/factory-2.png" alt="factory 2" width="530" height="358" />][2]

<p>

 [1]: /assets/images/wp-content/uploads/2015/07/factory-1.png
 [2]: /assets/images/wp-content/uploads/2015/07/factory-2.png'