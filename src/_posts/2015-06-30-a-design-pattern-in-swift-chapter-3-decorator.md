---
title: 'A Design Pattern Story in Swift  &#8211; Chapter 3: Decorator'
author: Audrey
layout: post
excerpt: 'There is a powerful sorcerer in town. He sells magic potions and only charges them for blue diamonds. Blue diamond is a special kind of currency in the magic world and people are born with certain amount of that. The sorcerer would give old customers or his favorite customers different discounts.'
permalink: /2015/06/30/a-design-pattern-in-swift-chapter-3-decorator/
categories:
  - Mobile Development
  - Swift
tags:
  - Decorator
  - Design Pattern
  - Swift
image:
  feature: '/assets/images/wp-content/uploads/2015/06/magicmagic.jpg'
  credit: 
  creditlink: 
---
There is a powerful sorcerer in town. He sells magic potions and only charges them for blue diamonds. Blue diamond is a special kind of currency in the magic world and people are born with certain amount of that. The sorcerer would give old customers or his favorite customers different discounts.

{% highlight swift %}class MagicSale {
    let name: String
    let price: Int
    var totalPrice: Int { return price }
    var description: String { return name }
    init(name: String, price: Int) {
        self.name = name
        self.price = price
    }
    
}

//: Sale for all kinds of magic accessories
class MagicDecoratorSale: MagicSale {
    private let wrapperMagicSale: MagicSale
    init(magicSale: MagicSale){
        wrapperMagicSale = magicSale
        super.init(name: magicSale.description, price: magicSale.totalPrice)
    }
}

//: Discounts
class DiscountDecoratorSale: MagicSale {
    private let wrapperMagicSale: MagicSale
    var discountAmount: Int { return 0 }
    init(magicSale: MagicSale, totalDiscountAmount: Int = 0 ){
        wrapperMagicSale = magicSale
        super.init(name: magicSale.description, price: magicSale.totalPrice)
    }
    
    func totalDiscounts() -> Int {
        var total = 1
        guard let discounter = wrapperMagicSale as? DiscountDecoratorSale else {
             return total
        }
        total += discounter.totalDiscounts()
        return total
    }
}

//: For added power options
class PowerDecoratorSale: MagicSale {
    private let wrapperMagicSale: MagicSale
    private let powerOptions: [PowerOption]
    enum PowerOption {
        case Fly
        case Teleport
        case Invisible
    }
    init(magicSale: MagicSale, powerOptions: PowerOption... ){
        wrapperMagicSale = magicSale
        self.powerOptions = powerOptions
        super.init(name: magicSale.description, price: magicSale.totalPrice)
    }
    override var description: String {
        var des = super.description
        for option in powerOptions {
            switch option {
            case .Fly: des += " Flying Power  "
            case .Invisible: des += " Invisible Power"
            case .Teleport: des += " Teleport Power"
            }
        }
        return des
    }
    override var totalPrice: Int {
        var pri = wrapperMagicSale.totalPrice
        for option in powerOptions {
            switch option {
            case .Fly: pri += 2
            case .Invisible: pri += 3
            case .Teleport: pri += 4
            }
        }
        return pri
    }
    
}

//: Discount for favorite customers
class CustomerFavDiscountSale: DiscountDecoratorSale {
    override var totalPrice: Int { return super.totalPrice - discountAmount }
    override var discountAmount: Int { return 2 }
    override var description: String {return "\(super.description) // Fav Discount"}
}
//: Discount for important customers
class CustomerPriorityDiscountSale: DiscountDecoratorSale {
    override var totalPrice: Int { return super.totalPrice - discountAmount }
    override var discountAmount: Int { return 1 }
    override var description: String {return "\(super.description) // Priorty Discount"}
}


//: Add Sprite as the magic accessory
class MagicSaleWithSprite: MagicDecoratorSale {
    override var description: String { return "\(super.description) + Sprite" }
    override var totalPrice: Int { return super.totalPrice + 2 }
}
//: Add MagicStarterKit as the magic accessory
class MagicSaleWithMagicStarterKit: MagicDecoratorSale {
    override var description: String { return "\(super.description) + MagicStarterKit" }
    override var totalPrice: Int { return super.totalPrice + 1 }
}


//: keep track of the purchases of a customer
class MagicPurchase: CustomStringConvertible {
    let name: String
    var magicPurchases: [MagicSale] = []
    init(name: String){
        self.name = name
    }
    func addPurchase(magicSale: MagicSale) {
        self.magicPurchases.append(magicSale)
        print("\(magicSale.description) added: \(magicSale.totalPrice)# [\(magicSale.name): \(magicSale.price)#] ")
    }
    
    var description: String {
        return "\(name)'s Magic Purchases:\(magicPurchases)"
    }
    func printReceipt(){
        print("\n  Receipt: \n\(name)'s Magic Purchases:")
   
        var totalDiscountTimes = 0
        let totalPriceFinal =  magicPurchases.map{
            print( "\($0.description) : \($0.totalPrice) #" )
            if let d1 =  $0 as? DiscountDecoratorSale {
                totalDiscountTimes += d1.totalDiscounts()
            }
            return $0.totalPrice
        }.reduce(0, combine: +)

        print("Total Price after discount: \(totalPriceFinal ) # ")
        print("\(totalDiscountTimes) discounts in total\n")
    }
}

//: Test
let loveWithSprite = MagicSaleWithSprite(magicSale: MagicSale(name: "Love Potion", price: 5))
let randomFavDiscountForSleep =  CustomerFavDiscountSale(magicSale: MagicSale(name: "Sleep Potion", price: 3))
let disguise = MagicSale(name: "Disguise Potion", price: 10)

let ariaPurchase = MagicPurchase(name: "Aria")
ariaPurchase.addPurchase(loveWithSprite)
ariaPurchase.addPurchase(randomFavDiscountForSleep)
ariaPurchase.addPurchase(disguise)
ariaPurchase.printReceipt(){% endhighlight %}

[<img class="aligncenter size-full wp-image-970" src="/assets/images/wp-content/uploads/2015/06/Decorator.png" alt="Decorator" width="457" height="201" />][1]

 [1]: /assets/images/wp-content/uploads/2015/06/Decorator.png