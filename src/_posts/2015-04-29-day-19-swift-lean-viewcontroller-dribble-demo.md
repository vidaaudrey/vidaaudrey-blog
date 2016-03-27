---
title: 'Day 19&#8230; Swift Lean ViewController &#8211;  Dribble Demo'
author: Audrey
layout: post
type: page-post-long-feature
excerpt: 'An experiment on how to separate the viewController from tableViewDataSource while at the same time reduce the tableView interaction code'
permalink: /2015/04/29/day-19-swift-lean-viewcontroller-dribble-demo/
categories:
  - Web Development
image:
  feature: '/assets/images/wp-content/uploads/2015/04/snapshot8.png'
  credit: 
  creditlink: 
---
<p>
  <span>Description: an experiment on how to separate the viewController from tableViewDataSource while at the same time reduce the tableView interaction code. </span><a href="https://github.com/vidaaudrey/019-Swift-Lean-ViewController-Dribble-Demo" target="_blank">Source Code</a>
</p>

<p>
  <a href="/assets/images/wp-content/uploads/2015/04/snapshot6.gif"><img class=" size-full wp-image-800 aligncenter" src="/assets/images/wp-content/uploads/2015/04/snapshot6.gif" alt="snapshot" width="375" height="683" /></a>
</p>

I started out with the wish to write a rounded UIView extension, which was quite easy to achieve. Somehow along the way I decided to revisit the previous Dribble code and make some improvement:

&#8211; a separate TableView DataSource handles the data manipulation and give feedback to the main ViewController when the user interaction is performed. The ViewController can then perform the corresponding view updates or other actions. In fact, almost all actions that triggered by user interaction can use the same function to call back the main ViewController:

{% highlight swift %}func tableViewCellActionHandler(item: AnyObject, indexPath: NSIndexPath, action: TableViewActionType) {
        switch action {
        case .Edit:
            println("editing")
        case .Favoriate:
            favShots.append(item as! Shot)
            println("faved")
            tableView.setEditing(false, animated: true)
        case .Save:
            if let cell = tableView.cellForRowAtIndexPath(indexPath) as? ShotTableViewCell {
                if let image = cell.shotImageView?.image {
                    Utils.saveImageToLibrary(image)
                    tableView.setEditing(false, animated: true) // imp
                }
            }
        case .DidSelect:
            println("selecting \(indexPath.row)")
        case .DidDeselect:
           tableView.deselectRowAtIndexPath(indexPath, animated: true) // call it to make sure it does deselect. (Sometime, it doesn't)
           println("deselected \(indexPath.row)")

        case .Delete:
            shots.removeAtIndex(indexPath.row)
        case .More:
            println("More")
        }
    }{% endhighlight %}

The TableView Action types are custom defined:

{% highlight swift %}public enum TableViewActionType: String {
    case Edit  = "Edit"
    case Save = "Save"
    case More = "More"
    case Favoriate = "Favoriate"
    case Delete = "Delete"
    case DidSelect = "DidSelect"
    case DidDeselect = "DidDeselect"
}{% endhighlight %}

&nbsp;

The rounded UIView extension which can be called easily with:  <span>userImageView</span><span>.</span><span>round</span><span>()</span>

{% highlight swift %}public extension UIView {
        public func round() {
        let width = bounds.width &lt; bounds.height ? bounds.width : bounds.height
        let mask = CAShapeLayer()
        mask.path = UIBezierPath(ovalInRect: bounds.rectByCentering(width, height: width)).CGPath
        self.layer.mask = mask
    }
}{% endhighlight %}