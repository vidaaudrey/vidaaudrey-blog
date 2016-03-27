---
title: 'A Design Pattern Story in Swift – Chapter 16: Object Pool'
author: Audrey
layout: post
excerpt: 'There is a MagicHouse where people can borrow magic objects. The house has a pool which manages the magic objects.'
permalink: /2015/07/14/a-design-pattern-story-in-swift-chapter-16-object-pool/
categories:
  - Mobile Development
  - Swift
tags:
  - Design Pattern
  - Object Pool
  - Swift
image:
  feature: '/assets/images/wp-content/uploads/2015/07/diamond.jpg'
  credit: 
  creditlink: 
---
<p>
  <span>There is a MagicHouse where people can borrow magic objects. The house has a pool which manages the magic objects.</span>
</p>

<div class="page" title="Page 138">
  <div class="layoutArea">
    <div class="column">
      <blockquote>
        <p>
          The object pool pattern manages a collection of reusable objects that are provided to calling components. A component obtains an object from the pool, uses it to perform work, and returns it to the pool so that it can be allocated to satisfy future requests. An object that has been allocated to a caller is not available for use by other components until it has been returned to the pool. &#8212;<em>  <a href="http://www.apress.com/9781484203958">Design Pattern in Swift</a></em>
        </p>
      </blockquote>
    </div>
  </div>
</div>

{% highlight swift %}struct MagicObject {
    let name: String
    let serialNumber: Int
    var occupier: [String] = []
    var borrowedCount: Int = 0
}

//: a basic pool which allows getting and returning any objects.
class Pool&lt;T> {
    private var data = [T]()
    private let arrayQ = dispatch_queue_create("arrayQ", DISPATCH_QUEUE_SERIAL)
    private let semaphore: dispatch_semaphore_t
    
    init(items: [T]) {
        data.reserveCapacity(data.count)
        for item in items {
            data.append(item)
        }
        // create a counter semaphore for the available items in the pool
        semaphore = dispatch_semaphore_create(items.count)
    }
    
    func getFromPool() -> T? {
        var result: T?
        // the semaphore count is decreased each time when the wait is called. If the count is 0, the function will block
        if dispatch_semaphore_wait(semaphore, DISPATCH_TIME_FOREVER) == 0 {
            if data.count > 0 {
                dispatch_sync(arrayQ, { () -> Void in
                    result = self.data.removeAtIndex(0)
                })
            }
        }
        return result
    }
    
    func returnToPool(item: T){
        dispatch_sync(arrayQ, { () -> Void in
            self.data.append(item)
            // increase the counter by 1
            dispatch_semaphore_signal(self.semaphore)
        })
    }
}

extension Int {
    func times(action: (Int)->()) {
        for i in 0..&lt;self {
            action(i)
        }
    }
}
class MagicHouse {
    private let pool: Pool&lt;MagicObject>
    static var sharedInstance = MagicHouse()
    static var magicDebtInfo:[(String, Int, String)] = []
    private init(){
        var magicObjects:[MagicObject] = []
        2.times{
            magicObjects.append(MagicObject(name: "Red Diamond", serialNumber: $0, occupier: [], borrowedCount: 0))
        }
        3.times{
            magicObjects.append(MagicObject(name: "Blue Heart", serialNumber: $0, occupier: [], borrowedCount: 0))
        }
        self.pool = Pool(items: magicObjects)
    }
    
    class func lendMagicObject(occupier: String) -> MagicObject? {
        var magicObject = sharedInstance.pool.getFromPool()
        if magicObject != nil {
            magicObject!.occupier.append(occupier)
            magicObject!.borrowedCount++
            magicDebtInfo.append((magicObject!.name, magicObject!.serialNumber, occupier))
            print("\(occupier) is borrowing \(magicObject!.name) #\(magicObject!.serialNumber)")
        }
        return magicObject
    }
    
    class func receiveMagicObject(obj: MagicObject) {
        magicDebtInfo = magicDebtInfo.filter{
            $0.0 != obj.name && $0.1 != obj.serialNumber
        }
        sharedInstance.pool.returnToPool(obj)
        print("\(obj.occupier.last!) returning \(obj.name) #\(obj.serialNumber)")
    }
    
    class func printReport(){
        print("\nShow Report: Magic House currently has \(sharedInstance.pool.data.count) magic object(s) in stock")
        (sharedInstance.pool.data as [MagicObject]).map{
            print("\($0.name) #\($0.serialNumber) \nBorrowed \($0.borrowedCount) time(s) by \($0.occupier)")
        }
       
        if magicDebtInfo.count > 0 {
            print("\nMagic Objects currently lent out:")
            magicDebtInfo.map{
                print("\($0.0) #\($0.1) by \($0.2)")
            }
        }
    }
}

//: Testing
var queue = dispatch_queue_create("workQ", DISPATCH_QUEUE_CONCURRENT)
var group = dispatch_group_create()

print("\n------Starting test...")

for i in 1 ... 7 {
    dispatch_group_async(group, queue, {() in
        var obj = MagicHouse.lendMagicObject("person #\(i)")
        if obj != nil {
            NSThread.sleepForTimeInterval(Double(rand() % 3))
            MagicHouse.receiveMagicObject(obj!)
        }
    })
}

dispatch_group_wait(group, DISPATCH_TIME_FOREVER)
let m1 = MagicHouse.lendMagicObject("William")
let m3 = MagicHouse.lendMagicObject("Tato")
MagicHouse.printReport(){% endhighlight %}

[<img class="aligncenter size-full wp-image-1060" src="/assets/images/wp-content/uploads/2015/07/object-pool.png" alt="object-pool" width="504" height="523" />][1]

&nbsp;

&nbsp;

&nbsp;

 [1]: /assets/images/wp-content/uploads/2015/07/object-pool.png