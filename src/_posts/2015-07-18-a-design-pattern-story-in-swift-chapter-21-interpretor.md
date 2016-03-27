---
title: 'A Design Pattern Story in Swift – Chapter 21: Interpretor'
author: Audrey
layout: post
permalink: /2015/07/18/a-design-pattern-story-in-swift-chapter-21-interpretor/
categories:
  - Mobile Development
  - Swift
tags:
  - Design Pattern
  - Interpretor
  - Swift
image:
    feature: '/assets/images/wp-content/uploads/2015/07/co-1080x675.jpg'
    credit: 
    creditlink: 
---

An interpreter translate our plain language expression into information and find out what we need. Here we have a  Unit Interpretor (Conversion Context) who does very diverse interpretation jobs.
<!--more-->

{% highlight swift %}

enum UnitType: String {
    case Gallon = "Gallon"
    case Pint = "Pint"
    case Cup = "Cup"
    case USD = "USD"
    case RMB = "RMB"
    case EURO = "EURO"
    case Meter = "Meter"
    case Unkonwn = "Unknown"
    init(str: String) {
        switch str {
            case "Gallon", "Gallons", "gallons": self = .Gallon
            case "Pint", "Pints", "pints": self = .Pint
            case "Cup", "Cups", "cups": self = .Cup
            case "USD", "usd", "Usd": self = .USD
            case "EURO", "euro", "Euro": self = .EURO
            case "RMB", "rmb", "Rmb": self = .RMB
        default: self = .Unkonwn
        }
    }
}

protocol Expression {
    func getUnit(quantity: Double, targetUnit: String) -> Double
}
class Gallon: NSObject, Expression {
    func getUnit(quantity: Double, targetUnit: String) -> Double {
        let targetUnitType = UnitType(str: targetUnit)
        switch targetUnitType {
        case .Gallon: return quantity
        case .Pint: return quantity * 8
        case .Cup: return quantity * 16
        default:
            print("conversion not supported")
            return -1 // just saying it's a wrong number
        }
    }
}
class Pint: NSObject, Expression {
    func getUnit(quantity: Double, targetUnit: String) -> Double {
        let targetUnitType = UnitType(str: targetUnit)
        switch targetUnitType {
        case .Gallon: return quantity * 0.125
        case .Pint: return quantity
        case .Cup: return quantity * 2
        default:
            print("conversion not supported")
            return -1
        }
        
    }
}
class USD: NSObject, Expression {
    func getUnit(quantity: Double, targetUnit: String) -> Double {
        let targetUnitType = UnitType(str: targetUnit)
        switch targetUnitType {
        case .USD: return quantity
        case .EURO: return quantity * 0.92
        case .RMB: return quantity * 6.21
        default:
            print("conversion not supported")
            return -1
        }
        
    }
}

class RMB: NSObject, Expression {
    func getUnit(quantity: Double, targetUnit: String) -> Double {

        let targetUnitType = UnitType(str: targetUnit)
        switch targetUnitType {
        case .USD: return quantity * 0.16
        case .EURO: return quantity * 0.15
        case .RMB: return quantity
        default:
            print("conversion not supported")
            return -1
        }
    }
}

struct AppConfig {
    static let AppName = "interpretor"
}
// The context to translate a sentence into related command and get the result.
class ConversionContext {
    static let sharedInstance = ConversionContext()
    private func getTargetQuantity(fromConversion: String, toConversion: String, quantity: Double) -> Double {
        if fromConversion != "" {
            let classStr = UnitType(str: fromConversion).rawValue
            guard let anyObjecType : AnyObject.Type = NSClassFromString("\(AppConfig.AppName).\(classStr)")
                else {
                    if classStr == "EURO" || classStr == "Cup" {
                        return -1
                    } else {
                        return -3
                    }
            }
            let nsObjecType : NSObject.Type = anyObjecType as! NSObject.Type
            
            guard let object = nsObjecType() as? Expression else {return -4 }
            return  object.getUnit(quantity, targetUnit: toConversion)
        
        }
        return -2
    }
    func getConversionFromInput(input:String) -> String {
        let partsOfQues = input.componentsSeparatedByString(" ")
        let fromConversion = partsOfQues[1]
        let toConversion = partsOfQues[3]
        let quantity = Double(partsOfQues[0])!
        
        let targetQuantity = getTargetQuantity(fromConversion, toConversion: toConversion, quantity: quantity)
        switch targetQuantity {
        case -1: return "Currently we only support conversion from RMB, USD, Gallon and Pint. \(fromConversion) is not supported"
        case -3: return "We can't recognize your input yet. Try something like RMB, rmb, Gallon, Gallons..."
        case -2: return "Sorry, we couldn't identify the source conversion. Try something like [ 10 Gallons to Pints ]"
        case -4: return "Couldn't convert. The object we created doesn't conform with Expression protocol"
        case let x where x >= 0 :  return "\(partsOfQues[0]) \(partsOfQues[1]) equals \(targetQuantity) \(partsOfQues[3])"
        default: return "Some other unknow error happened "
        }
    }
}

func getOutput(input: String) -> String {
    print("Getting user input:[ \(input) ]")
    let context = ConversionContext.sharedInstance
    return context.getConversionFromInput(input)
}

// Testing. User inputs a sentence and the conversionContext will translate it
let userInput = [
    "10 Gallons is Pints",
    "231 Gallo is Pints",
    "32.11 Pints in Gallon",
    "2001.99 USD to RMB",
    "984.2323 rmb in EURO",
    "23 Euro in RMB"
]
userInput.map{ print("Output: [ \(getOutput($0)) ] \n") }
{% endhighlight %}

[<img class="aligncenter size-full wp-image-1086" src="/assets/images/wp-content/uploads/2015/07/interpretor.png" alt="interpretor" width="693" height="290" />][1]

<p>

 [1]: /assets/images/wp-content/uploads/2015/07/interpretor.png