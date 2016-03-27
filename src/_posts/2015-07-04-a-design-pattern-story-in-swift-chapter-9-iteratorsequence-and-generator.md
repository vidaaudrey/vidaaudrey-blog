---
title: 'A Design Pattern Story in Swift – Chapter 9: Iterator(Sequence and Generator)'
author: Audrey
layout: post
excerpt: 'There is a restaurant with two kinds of menus: one for their VIP guests and one for customers who just want average fastfood. The two menus are in different format and one waitress has to be able to process both menus, in a simple way.'
permalink: /2015/07/04/a-design-pattern-story-in-swift-chapter-9-iteratorsequence-and-generator/
categories:
  - Mobile Development
  - Swift
tags:
  - Design Pattern
  - Iterator
  - Swift 2.0
image:
  feature: '/assets/images/wp-content/uploads/2015/07/ancient-food.jpg'
  credit: 
  creditlink: 
---
<p>
  <span> There is a restaurant with two kinds of menus: one for their VIP guests and one for customers who just want average fastfood. The two menus are in different format and one waitress has to be able to process both menus, in a simple way.</span>
</p>

> <p>
>   Iterator provides a way to access the elements of an aggregate object sequentially without exposing its underlying representation. <em> &#8212; HeadFirst</em>
> </p>

{% highlight swift %}struct MenuItem: CustomStringConvertible{
    let name: String
    let price: Int
    let isVegetable: Bool
    var description: String {
        let vegi = isVegetable ? "Vegi" : ""
        return  "\(name): (\(price)#) \(vegi) \n"  }
}

//: helper protocols. Hashable and Equatable is necesary for storing MenuItem in a Set
extension MenuItem: Hashable, Equatable{
    var hashValue: Int {
        return name.hashValue ^ price.hashValue
    }
}
func ==(lhs:MenuItem, rhs:MenuItem) -> Bool {
    return lhs.name == rhs.name
}


protocol PrettyDescription: CustomStringConvertible {
    var prettyDescription: String { get }
}

//: provide default implementation to describe the elements of the sequence. As the PrettyDescription inherit CustomStringConvertible, we can safely downcast the sequence elements to CustomStringConvertible
extension PrettyDescription where Self: protocol &lt;SequenceType> {
    var prettyDescription: String {
        var temStr = "\nMenu Items:\n"
        self.map{temStr += ($0 as! CustomStringConvertible).description} 
        return temStr
    }
}

//: how next element is generated from a MenuItem Array
struct MenuGeneratorFromArray: GeneratorType {
    let menuItems:[MenuItem]
    var index = 0
    mutating func next() -> MenuItem? {
        return index &lt; menuItems.count ? menuItems[index++] : nil
    }
}

//: how next element is generated from a MenuItem Set
struct MenuGeneratorFromSet: GeneratorType {
    let menuItems:Set&lt;MenuItem>
    var index = 0
    mutating func next() -> MenuItem? {
        return index &lt; (menuItems.count) ? menuItems[advance(menuItems.startIndex, index++)] : nil
    }
}

//: The VIPMenu using Array
struct VIPMenu:SequenceType, PrettyDescription {
    var menuItems:[MenuItem] = []
    var description: String { return "VIP Menu" + prettyDescription }
    func generate() -> MenuGeneratorFromArray {
        return MenuGeneratorFromArray(menuItems: menuItems, index: 0)
    }
    func underestimateCount() -> Int { return menuItems.count }
    
    init(){
        addItem("Tiran Goose", price: 10)
        addItem("Fairy Cake", price: 13)
        addItem("Heaven Grass", price: 4, isVegetable: true)
        print("VIPMenu Created")
    }
    mutating func addItem(name: String, price: Int, isVegetable:Bool = false){
        let item = MenuItem(name: name, price: price, isVegetable: isVegetable)
        menuItems.append(item)
    }
}

//: The FastfoodMenu using Set
class FastfoodMenu: SequenceType, PrettyDescription {
    var menuItems = Set&lt;MenuItem>()
    var description: String { return "Fastfood Menu" + prettyDescription }
    var nextIndex = -1
    func generate() -> MenuGeneratorFromSet {
        return MenuGeneratorFromSet(menuItems: menuItems, index: 0)
    }
    func underestimateCount() -> Int { return menuItems.count }
    
    init(){
        addItem("Cheese Cake", price: 10)
        addItem("Lettus", price: 4, isVegetable: true)
        addItem("Ham", price: 13)
        print("FastfoodMenu Created")
    }
    func addItem(name: String, price: Int, isVegetable:Bool = false){
        let item = MenuItem(name: name, price: price, isVegetable: isVegetable)
        menuItems.insert(item)
    }
}

//: Every waitress has two menus at hand and they can print the menus
class Waitress {
    let vipMenu: VIPMenu
    let fastfoodMenu: FastfoodMenu
    init(vipMenu: VIPMenu, fastfoodMenu: FastfoodMenu){
        self.vipMenu = vipMenu
        self.fastfoodMenu = fastfoodMenu
        print("Waitress with two menus created")
    }
    func printMenu() {
        print("\nWaitress is printing the menu")
        let menus:[CustomStringConvertible] = [vipMenu, fastfoodMenu]
        menus.map{print($0)}
    }
}


//:Testing
var vipMenu = VIPMenu()
var fastfoodMenu = FastfoodMenu()

let waitress = Waitress(vipMenu: vipMenu, fastfoodMenu: fastfoodMenu)
waitress.printMenu()
{% endhighlight %}

[<img class="aligncenter size-full wp-image-1013" src="/assets/images/wp-content/uploads/2015/07/iterator.png" alt="iterator" width="238" height="249" />][1]

 [1]: /assets/images/wp-content/uploads/2015/07/iterator.png