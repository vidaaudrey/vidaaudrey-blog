---
title: 'A Design Pattern Story in Swift – Chapter 15: Bridge'
author: Audrey
layout: post
excerpt: 'An IOT Bridge can handle different outgoing and incoming messages for the connected devices, regardless of the message format and the device types.'
permalink: /2015/07/13/a-design-pattern-story-in-swift-chapter-15-bridge/
categories:
  - Mobile Development
  - Swift
tags:
  - Bridge
  - Design Pattern
  - Swift
image:
  feature: '/assets/images/wp-content/uploads/2015/07/bridge-.jpg'
  credit: 
  creditlink: 

---
An IOT Bridge can handle different outgoing and incoming messages for the connected devices, regardless of the message format and the device types.

> <p>
>   <span>The bridge pattern is used to separate the abstract elements of a class from the implementation details, providing the means to replace the implementation details without modifying the abstraction.</span>
> </p>

{% highlight swift %}//: an IOT device can send two kinds of messages: IOTMessage which is the basic format, and EncryptIOTMessage which is encrypted message
protocol Message {
    var messageString: String { get }
    var contentToSend:String { get }
    func prepareMessage() -> String
}

struct IOTMessage: Message {
    var messageString: String
    var contentToSend: String {return prepareMessage()}
    func prepareMessage() -> String {
        return "Basic Message: \(messageString)"
    }
}
struct EncryptIOTMessage: Message {
    var messageString: String
    var contentToSend: String {return prepareMessage()}
    func prepareMessage() -> String {
        return "Encrypted Message: \(String(Array(messageString.characters.reverse())))"
    }
}


//: Since an IOT Device is connected, it can process outgoing and incoming messages
protocol IOTDevice: CustomStringConvertible {
    func processMessage(msg: Message, isIncomingMsg: Bool)
}

//: The base class for any kind of IOT devices
class Device: IOTDevice {
    var description: String { return "Basic Device returned, Error" }
    
    enum Devices {
        case WeigthScale
        case HumidityDetector
    }
    
    class func getDevice(deviceType: Devices) -> Device {
        switch deviceType {
        case .WeigthScale: return WeightScale()
        case .HumidityDetector: return HumidityDetector()
        }
    }
    func processMessage(msg: Message, isIncomingMsg: Bool) {
        fatalError("Something wrong!")
    }
}

//: A connected Weight Scale
class WeightScale: Device {
    override var description: String { return "Weight Scale" }
    override func processMessage(msg: Message, isIncomingMsg: Bool) {
        if isIncomingMsg {
            print("Incoming message:[\(msg.contentToSend)]")
        } else {
            print("Outgoing message: [\(msg.contentToSend)]")
        }
    }
}
//: A connected HumidityDetector
class HumidityDetector: Device {
    override var description: String { return "Humidity Detector" }
    override func processMessage(msg: Message, isIncomingMsg: Bool) {
        if isIncomingMsg {
            print("Incoming message:[\(msg.contentToSend)]")
        } else {
            print("Outgoing message:[\(msg.contentToSend)]")
        }
    }
}

//: Just a communication protocol, not important here
protocol IOTCommunication {
    var device:IOTDevice { get set }
    func processBridgeMessage(msg: Message, isIncomingMsg: Bool)
}

//: The bridge to handle the message processing of IOT devices
struct IOTBridge: IOTCommunication {
    var device: IOTDevice {
        didSet {
            print("\nset bridge device to:\(device.description)")
        }
    }

    internal func processBridgeMessage(msg: Message, isIncomingMsg: Bool) {
        device.processMessage(msg, isIncomingMsg: isIncomingMsg)
    }
    func sendMessage(msg: String, encrypted: Bool = false ){
        let msgStr = device.description + " " +  msg
        let iotMsg: Message = encrypted ? EncryptIOTMessage(messageString: msgStr) : IOTMessage(messageString: msgStr)
        processBridgeMessage(iotMsg, isIncomingMsg: false)
    }
    func receiveMessage(msg: String, encrypted: Bool = false) {
        let clearMsg = encrypted ? String(Array(msg.characters.reverse())) : msg
        var msgStr =  "\(device.description)  \(msg)"
        if encrypted {
            msgStr += "(decrypted: \(clearMsg))"
        }
        processBridgeMessage(IOTMessage(messageString: msgStr), isIncomingMsg: true)
    }

}

//: Testing 
print("Create the IOT bridge and set the device to Weight Scale")
var bridge = IOTBridge(device: WeightScale())
bridge.sendMessage("120lb")
bridge.receiveMessage("History Weigth: 110 lb Oct. 20, 2014")

bridge.device =  HumidityDetector()
bridge.sendMessage("91%")
bridge.receiveMessage("History Humidity: 45% Aug. 30, 2014, 98% Dec. 21, 2014")
bridge.sendMessage("45% Aug. 30, 2014", encrypted: true)
bridge.receiveMessage("4102 ,03 .guA %54 rotceteD ytidimuH", encrypted: true)
{% endhighlight %}

[<img class="aligncenter size-full wp-image-1056" src="/assets/images/wp-content/uploads/2015/07/bridge.png" alt="bridge" width="918" height="137" />][1][  
][2]

 [1]: /assets/images/wp-content/uploads/2015/07/bridge.png
 [2]: /assets/images/wp-content/uploads/2015/07/chain-of-responsbility1.png