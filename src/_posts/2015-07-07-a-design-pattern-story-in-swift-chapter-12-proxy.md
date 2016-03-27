---
title: 'A Design Pattern Story in Swift – Chapter 12: Proxy'
author: Audrey
layout: post
excerpt: 'Life is too short to do everything by ourselves, so we often let others do things for us. When the good people of the village need their own cat pets, they go to different proxies. The proxies would then do some god-knows-what kind of trick and get the villagers some cats.'
permalink: /2015/07/07/a-design-pattern-story-in-swift-chapter-12-proxy/
categories:
  - Mobile Development
  - Swift
tags:
  - Design Pattern
  - Protection Proxy
  - Proxy
  - Remote Proxy
  - Swift
  - Virtual Proxy
image:
  feature: '/assets/images/wp-content/uploads/2015/07/cats.jpg'
  credit: 
  creditlink: 
---
Life is too short to do everything by ourselves, so we often let others do things for us.

When the good people of the village need their own cat pets, they go to different proxies. The proxies would then do some god-knows-what kind of trick and get the villagers some cats.

First, it&#8217;s the entry-level Simple Cat Proxy called &#8211; &#8220;SimpleCatRequestProxy&#8221;. You request a cat and he&#8217;ll get a cat from the remote cat house.

{% highlight swift %}protocol SimpleCatRequest {
    func getCat(url: String, name: String) -> Cat?
}

//: Use CatRequestProxy to get cat photo from a remote place
class SimpleCatRequestProxy: SimpleCatRequest {
    private let semaphore = dispatch_semaphore_create(0)
    func getCat(url: String, name: String) -> Cat? {
        print("Trying to get \(name) from the SimpleCatProxy")
        var cat: Cat?
        guard let url: NSURL = NSURL(string:url) else { return nil }
        let task = NSURLSession.sharedSession().dataTaskWithURL(url) {
            (data, _, _) -> Void in
            cat = Cat(name: name, image: UIImage(data: data!))
            print("Got \(name) from remote \n")
            dispatch_semaphore_signal(self.semaphore)
        }
        task?.resume()
        dispatch_semaphore_wait(self.semaphore, DISPATCH_TIME_FOREVER)
        return cat
    }
}
//: Creating the proxy and get a cat from the proxy
let simpleCatProxy = SimpleCatRequestProxy()
let cat = simpleCatProxy.getCat(Config.RandomCatURL, name: "Cat Ada")
cat?.view{% endhighlight %}

[<img class="aligncenter size-full wp-image-1030" src="/assets/images/wp-content/uploads/2015/07/remote.png" alt="remote" width="744" height="298" />][1]The next is the Clone (cache) Cat Proxy. He will create a local clone once he got a cat from the remote cat house. When others request the cat, he will first look at his cloned list. If the clone exists, he will return a clone. If not, he will get the cat from the remote cat house.

{% highlight swift %}class ClonedCatRequestProxy: SimpleCatRequest {
    private let semaphore = dispatch_semaphore_create(0)
    private let queue = dispatch_queue_create("remoteCatQ", DISPATCH_QUEUE_SERIAL)
    private var clonedCats:[String : Cat] = [:]
    
    func getCat(url: String, name: String) -> Cat? {
        print("Trying to get \(name) from the ClonedCatProxy")
        var cat: Cat?
        dispatch_sync(queue) { () -> Void in
            if let clonedCat = self.clonedCats[name] {
                cat = clonedCat
                print("We already got \(name). No need to get remotely")
            } else {
                guard let url: NSURL = NSURL(string:url) else { return }
                let task = NSURLSession.sharedSession().dataTaskWithURL(url) {
                    (data, _, _) -> Void in
                     cat = Cat(name: name, image: UIImage(data: data!))
                    self.clonedCats[name] = cat
                    print("Got \(name) from remote \n")
                    dispatch_semaphore_signal(self.semaphore)
                }
                task?.resume()
                dispatch_semaphore_wait(self.semaphore, DISPATCH_TIME_FOREVER)
            }
        }
        return cat
    }
}

let cloneCatProxy = ClonedCatRequestProxy()
let catBebe = cloneCatProxy.getCat(Config.RandomCatURL, name: "Cat Bebe")
let catDodo = cloneCatProxy.getCat(Config.RandomCatURL, name: "Cat Dodo")
let catDidi = cloneCatProxy.getCat(Config.RandomCatURL, name: "Cat Didi")

let catDidiClone = cloneCatProxy.getCat(Config.RandomCatURL, name: "Cat Dodo")
catBebe?.view

catDodo?.view
catDidiClone?.view

catDidi?.view{% endhighlight %}

<img class="aligncenter size-full wp-image-1035" src="/assets/images/wp-content/uploads/2015/07/cached.png" alt="cached" width="774" height="874" /> The third one is Batch (Virtual) Cat Proxy. When people request cats, he simply writes down their requests and later fetch the cats from remote cat house in a big batch.

{% highlight swift %}protocol BatchCatRequest {
    init(url: String, numberOfCats: Int)
    func getCat(name: String, callback: (String: Cat) -> Void)
    func execute()
}

class BatchCatRequestProxy: BatchCatRequest {
    let url: String
    var batchedCatRequest:[String: (Cat) -> Void] = [:]
    
    required init(url: String, numberOfCats: Int = 1){
        self.url = url
    }
    func getCat(name: String, callback: (String: Cat)  -> Void) {
        batchedCatRequest[name] = callback
    }
    func execute() {
        guard let url: NSURL = NSURL(string:url) else { return }
        
        let task = NSURLSession.sharedSession().dataTaskWithURL(url) {
            (data, _, _) -> Void in
            print("\n Trying to get \(self.batchedCatRequest.keys.array) from the BatchCatProxy")
            for (name, callback) in self.batchedCatRequest {
                let cat = Cat(name: name, image: UIImage(data: data!))
                callback(cat)
                print("Got \(name) from remote \n")
            }
        }
        task?.resume()
    }
}

let batchCatProxy = BatchCatRequestProxy(url: Config.RandomCatURL)
batchCatProxy.getCat("Xixi1"){
    $0.view
    
}

batchCatProxy.getCat("DongDong1") { (cat) -> Void in
    cat.view!
}
batchCatProxy.execute(){% endhighlight %}

[<img class="aligncenter size-full wp-image-1034" src="/assets/images/wp-content/uploads/2015/07/batchProxydefer.png" alt="batchProxy(defer)" width="778" height="1066" />][2]

The first Batch Cat Proxy always retrieves the same cats remotely but people want different cats. So they go to the batch unique cat proxy, who keeps a number of different options of cats.

{% highlight swift %}class BatchUniqueCatRequestProxy: BatchCatRequest {
    var catURLs:[String] = []
    var batchedCatRequest:[String: (Cat) -> Void] = [:]
    
    required init(url: String, numberOfCats: Int){
        let fullURL = "\(url)\(numberOfCats)"
        self.catURLs = getCatURLs(fullURL)
    }
    func getCat(name: String, callback: (String: Cat)  -> Void) {
        batchedCatRequest[name] = callback
    }
    func execute() {
        if catURLs.count > 0 && batchedCatRequest.count > 0 && catURLs.count > batchedCatRequest.count {
            var i = 0
             print("\n Trying to get \(self.batchedCatRequest.keys.array) from the BatchUniqueCatProxy")
            for (name, callback) in self.batchedCatRequest {
                guard let url: NSURL = NSURL(string:self.catURLs[i]) else { return }
                print("")
                let task = NSURLSession.sharedSession().dataTaskWithURL(url) {
                    (data, _, _) -> Void in
                    let cat = Cat(name: name, image: UIImage(data: data!))
                    print("Got \(name) from remote \n")
                    callback(cat)
                }
                i++
                task?.resume()
            }
        }
    }
    
    private func getCatURLs(url: String) -> [String] {
        var urls:[String] = []
        do {
            let str = try String(contentsOfURL: NSURL(string: url)!, encoding: NSUTF8StringEncoding)
            let xml1 = SWXMLHash.parse(str)
            let images = xml1["response"]["data"]["images"]["image"].all
            
            for image in images {
                if let str:String = image["url"].element?.text {
                    let url = str.stringByReplacingOccurrencesOfString("\n",withString: "").stringByReplacingOccurrencesOfString(" ", withString: "")
                    urls.append(url)
                }
            }
        } catch {
            print("error getting the cat urls ")
        }
         return urls
    }
}
{% endhighlight %}

[<img class="aligncenter size-full wp-image-1031" src="/assets/images/wp-content/uploads/2015/07/batchUnique.png" alt="batchUnique" width="895" height="676" />][3]

The last one is the Secure(Protection) Proxy.  He is always quite serious and have to check everybody&#8217;s &#8220;passcode&#8221; before giving them any cats.

{% highlight swift %}class UserAuthentication {
    var user:String?;
    var authenticated:Bool = false;
    
    private init() {
        // do nothing - stops instances being created
    }
    
    func authenticate(user:String, pass:String) {
        if (pass == "secret") {
            self.user = user;
            self.authenticated = true;
            print("user authenticated")
        } else {
            self.user = nil;
            self.authenticated = false;
            print("user not authenticated")
        }
    }
    
   static let sharedInstance: UserAuthentication = UserAuthentication()
}
//:ControlAccessProxy 
class SecuredCatRequestProxy: BatchCatRequest {
    private let wrapperObject: BatchCatRequest
    required init(url: String, numberOfCats: Int = 1){
        wrapperObject = BatchCatRequestProxy(url: url)
    }
    func getCat(name: String, callback: (String: Cat) -> Void) {
        wrapperObject.getCat(name, callback: callback)
    }
    func execute() {
        if UserAuthentication.sharedInstance.authenticated {
            wrapperObject.execute()
        } else {
            print("Can't get cat if you are not authorized")
            fatalError("Can't get cat if you are not authorized")
        }
    }
}



let secureProxy = SecuredCatRequestProxy(url: Config.RandomCatURL)
secureProxy.getCat("XixiSecure"){
    $0.view
}

UserAuthentication.sharedInstance.authenticate("Jane", pass: "secret")
secureProxy.execute(){% endhighlight %}

[<img class="aligncenter size-full wp-image-1032" src="/assets/images/wp-content/uploads/2015/07/secure.png" alt="secure" width="848" height="595" />][4]

The rest of the code:

{% highlight swift %}import Foundation
import UIKit
import XCPlayground
XCPSetExecutionShouldContinueIndefinitely(true)

func getCat(state:CatNames, caption: String) -> UIView{
    let image = UIImage(named: state.rawValue)
    return getCatView(image!, caption: caption)
}
func getCatView(image: UIImage, caption: String) -> UIView {
    let view = UIView(frame: CGRectMake(0, 0, 400, 300))
    view.clipsToBounds = true
    let labelView = UILabel(frame: CGRectMake(0, 10, 400, 100))
    labelView.text = caption
    labelView.numberOfLines = 0
    labelView.lineBreakMode = NSLineBreakMode.ByWordWrapping
    labelView.font = labelView.font.fontWithSize(30)
    labelView.textColor = UIColor.redColor()
    labelView.textAlignment = NSTextAlignment.Center
    let imageView = UIImageView(image: image)
    imageView.frame = view.frame
    imageView.contentMode = UIViewContentMode.ScaleAspectFit
    view.addSubview(imageView)
    view.addSubview(labelView)
    return view
    
}

struct Cat:CustomStringConvertible {
    let name: String
    var image: UIImage?
    var description: String {
        let str = image == nil ? "Still requesting" : "Got it"
        return "\(name) (\(str))"
    }
    var view: UIView? {
        let tempImage = image ?? UIImage(named: "catPlaceholder.jpg")
        return getCatView(tempImage!, caption: name)
    }
}
struct Config{
    static let RandomCatURL = "http://thecatapi.com/api/images/get?format=src&type=gif"
    static let RandomCatGroupURLPrefix = "http://thecatapi.com/api/images/get?format=xml&results_per_page="
}
enum CatNames:String {
    case Bored = "bored.jpg"
    case Happy = "happy.jpg"
    case PlaceHolder = "catPlaceholder.jpg"
}
{% endhighlight %}

&nbsp;

&nbsp;

> The proxy pattern is used to provide a surrogate or placeholder object, which references an underlying object. The proxy provides the same public interface as the underlying subject class, adding a level of indirection by accepting requests from a client object and passing these to the real subject object as necessary. &#8212; ***Gang Of Four* **

More info:

> **Remote Proxy** – Represents an object locally which belongs to a different address space. Think of an ATM implementation, it will hold proxy objects for bank information that exists in the remote server.
> 
> **Virtual Proxy** – In place of a complex or heavy object, use a skeleton representation. When an underlying image is huge in size, just represent it using a virtual proxy object and on demand load the real object. You know that the real object is expensive in terms of instantiation and so without the real need we are not going to use the real object. Until the need arises we will use the virtual proxy.
> 
> **Protection Proxy** – Are you working on an MNC? If so, we might be well aware of the proxy server that provides us internet by restricting access to some sort of websites like public e-mail, social networking, data storage etc. The management feels that, it is better to block some content and provide only work related web pages. Proxy server does that job. This is a type of proxy design pattern. &#8212; *Wiki*

Ref: [Design Pattern in Swift][5]  
Cat API: <http://thecatapi.com/>

 [1]: /assets/images/wp-content/uploads/2015/07/remote.png
 [2]: /assets/images/wp-content/uploads/2015/07/batchProxydefer.png
 [3]: /assets/images/wp-content/uploads/2015/07/batchUnique.png
 [4]: /assets/images/wp-content/uploads/2015/07/secure.png
 [5]: www.apress.com/9781484203958