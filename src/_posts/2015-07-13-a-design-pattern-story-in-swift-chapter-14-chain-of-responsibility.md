---
title: 'A Design Pattern Story in Swift – Chapter 14: Chain Of Responsibility'
author: Audrey
layout: post
excerpt: 'There is a dancing festival every year. Gods, Fairies and some other VIPs are in the guest list. There are also some unwelecomed walk-ins. Each of the guest type would have different host to receive and host them, except the walk-ins would have no hosts.'
permalink: /2015/07/13/a-design-pattern-story-in-swift-chapter-14-chain-of-responsibility/
categories:
  - Mobile Development
  - Swift
tags:
  - Chain Of Responsibility
  - Design Pattern
  - Swift
image:
  feature: '/assets/images/wp-content/uploads/2015/07/festival.jpg'
  credit: 
  creditlink: 
---
<p>
  <span>There is a dancing festival every year. Gods, Fairies and some other VIPs are in the guest list. There are also some unwelecomed walk-ins. Each of the guest type would have different host to receive and host them, except the walk-ins would have no hosts. </span>
</p>

> <p>
>   <span> The chain of responsibility pattern is used to process varied requests, each of which may be dealt with by a different handler.</span>
> </p>

{% highlight swift %}enum GuestType {
    case VIP
    case God
    case Fairy
    case Unwelcomed
}
<h2>
  <h2></h2>
</h2>
struct Guest {
    let guestType: GuestType
    let name: String
}

class Host{
    var nextHost: Host?
    required init(){}
    
    func host(guest: Guest, handled: Bool = false) -> Bool {
        if nextHost != nil {
            return nextHost!.host(guest, handled: handled)
        } else if !handled {
            print("End of the chain. No host available for \(guest.name)\n")
        }
        return handled
    }
    
    class func createChain() -> Host?{
        let host = VIPHost()
        host.nextHost = GodHost()
        host.nextHost?.nextHost = FairyHost()
        return host
    }
}

class FairyHost: Host {
    override func host(guest: Guest, var handled: Bool) -> Bool {
        if guest.guestType == .Fairy {
            print("\(guest.name) is handled by FairyHost\n")
            handled = true
        }
        return super.host(guest, handled: handled)
    }
}

class GodHost: Host {
    override func host(guest: Guest, var handled: Bool) -> Bool {
        if guest.guestType == .God {
            print("\(guest.name) is handled by GodHost\n")
            handled = true
        }
        return super.host(guest, handled: handled)
    }
}

class VIPHost: Host {
    var totalGuests = 0
    var vipGuests = 0
    override func host(guest: Guest, var handled: Bool) -> Bool {
        totalGuests++
        if guest.guestType == .VIP {
            print("\(guest.name) is handled by VIPHost")
            handled = true
            vipGuests++
            print("Currently \(vipGuests) VIP out of \(totalGuests) guests\n")
        }
        return super.host(guest, handled: handled)
    }
}

//: Testing 
let guests = [Guest(guestType: .Fairy, name: "Tinkle Fairy"),
              Guest(guestType: .God, name: "God of Thunder"),
              Guest(guestType: .VIP, name: "VIP Tor"),
              Guest(guestType: .Unwelcomed, name: "Satan"),
              Guest(guestType: .VIP, name: "VIP Helen")]


if let hostChain = Host.createChain() {
    for guest in guests {
        hostChain.host(guest)
    }
}{% endhighlight %}

[<img class="aligncenter size-full wp-image-1049" src="/assets/images/wp-content/uploads/2015/07/chain-of-responsbility.png" alt="chain-of-responsbility" width="326" height="169" />][1]

 [1]: /assets/images/wp-content/uploads/2015/07/chain-of-responsbility.png