---
title: 'Day 14&#8230; Five Ways to Pass Data in iOS and UITabBarController'
author: Audrey
layout: post
type: page-post-plain
excerpt: 'A demo that shows five ways to pass data between ViewControllers, including Segues in Storyboard, Delegate Pattern, Passing Blocks, Key-value Observation and NSNotification'
permalink: /2015/04/10/day-14-five-ways-to-pass-data-in-ios-and-uitabbarcontroller/
categories:
  - Mobile Development
tags:
  - Data Passing
  - PaintCode
  - Swift
  - UITabBarController
image:
    feature: '/assets/images/wp-content/uploads/2015/04/snapshot0.png'
    credit: 
    creditlink: 
---
<div>
  A demo that shows five ways to pass data between ViewControllers, including Segues in Storyboard, Delegate Pattern, Passing Blocks, Key-value Observation and NSNotification. <a href="https://github.com/vidaaudrey/014-Five-Ways-To-Pass-Data-In-iOS-And-UITabBarController">Source Code</a>
</div>

<div>
</div>

<div>
  Besides showing the data passing mechanism, other functions includes:
</div>

  * Use PaintCode to draw the icons in the TabBar and UIView
  * Explore PaintCode’s frame function and  scale the icons to different sizes
  * Generate image using template mode and dynamically change the image / icon color
  * Extended UIColor so it can be initiated with UIColor(color: UIColor, alpha: CGFloat)
  * Explore TabBar and UITabBarController, including custom icon, system icon, badge, and “More” icon
  *  Keep consistent UIView in different orientation

<div>
  <a href="/assets/images/wp-content/uploads/2015/04/snapshot3.gif"><img class=" size-full wp-image-777 aligncenter" src="/assets/images/wp-content/uploads/2015/04/snapshot3.gif" alt="snapshot" width="382" height="695" /></a>
</div>

<div>
  <a href="/assets/images/wp-content/uploads/2015/04/snapshot0.png"><img class=" size-full wp-image-778 aligncenter" src="/assets/images/wp-content/uploads/2015/04/snapshot0.png" alt="snapshot0" width="663" height="395" /></a>
</div>

<div>
  <a href="/assets/images/wp-content/uploads/2015/04/snapshot5.png"><img class=" size-full wp-image-776 aligncenter" src="/assets/images/wp-content/uploads/2015/04/snapshot5.png" alt="snapshot" width="371" height="667" /></a>
</div>

<div>
</div>

<div>
</div>

<div>
</div>

<div>
  <strong>Takeaways:</strong>
</div>

  *  use viewDidLayoutSubviews to redraw the UIView

<div>
  override func viewDidLayoutSubviews() {
</div>

<div>
       super.viewDidLayoutSubviews()
</div>

<div>
       iconView.frame = view.bounds
</div>

<div>
       iconView.setNeedsDisplay()
</div>

<div>
  }
</div>

  * Use image.tintColor to redraw image with different UIColor
  * Use UIApplication.sharedApplication().keyWindow?.tintColor to set global TintColor
  * Use CGColorGetComponents(color.CGColor) to get the corresponding RGB value of the CGColor
  * Use SegmentedControl’s valueChanged event to trigger Action