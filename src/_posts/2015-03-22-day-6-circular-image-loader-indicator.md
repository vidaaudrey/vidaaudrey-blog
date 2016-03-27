---
title: 'Day 6 &#8211; Circular Image Loader Indicator'
author: Audrey
layout: post
type: page-post-long-feature
excerpt: 'A highly customizable progress animation control.'
permalink: /2015/03/22/day-6-circular-image-loader-indicator/
categories:
  - Mobile Development
image:
    feature: '/assets/images/wp-content/uploads/2015/03/Snapshot2.png'
    credit: 
    creditlink: 
---
<div>
  Description: A circular image downloading process indicator.
</div>

<div>
  Use: Create an UIImageView in storyboard and specify the class to be “CustomImageView&#8221;
</div>

<div>
</div>

<div>
  <a href="/assets/images/wp-content/uploads/2015/03/Snapshot.gif"><img class="alignnone size-full wp-image-721" src="/assets/images/wp-content/uploads/2015/03/Snapshot.gif" alt="Snapshot" width="375" height="670" /></a>
</div>

<div>
</div>

<div>
  <strong>Learn </strong>
</div>

  * Understand how to use NSURLSessionDelegate
  * Create a custom view
  * Animate custom view
  * Work with CAShapeLayer and CAGradientLayer

<div>
</div>

<div>
  <strong>Steps: </strong>
</div>

  * Follow and understand the [tutorial][1]
  * Replace the project’s image downloading library code. Ref [NSURLSession][2].
  * Add label indicator in the center to show the progress
  * Add gradient mask layer
  * Minor update on the rest of the code

<div>
</div>

<div>
  <strong>Takeaway:</strong>
</div>

  * When the CircularLoaderView is initiated, the frame of the view is not yet conformed to the constraints of the superview. So the drawing of the child  views (in this case, the circular ring and the text in the middle) can not be placed in the right position. It has to be inside the layoutSubviews( ) function.
  * When adding constraints programmatically, we have to be careful which one is the constraint&#8217;s receiver. e.g. addConstraint(NSLayoutConstraint(item: self, attribute: .CenterX, relatedBy: .Equal, toItem: progressLabel, attribute: .CenterX, multiplier: 1.0, constant: 0.0))
  * [Autolayout Guide][3]

<div>
  <a href="https://github.com/vidaaudrey/006-Circular-Image-Loader-Indicator" target="_blank">Source Code</a>
</div>

<div>
  Image Source:  <a href="http://hdw.datawallpaper.com">http://hdw.datawallpaper.com</a>
</div>

 [1]: http://www.raywenderlich.com/94302/implement-circular-image-loader-animation-cashapelayer
 [2]: https://developer.apple.com/library/prerelease/mac/documentation/Foundation/Reference/NSURLSession_class/index.html
 [3]: https://developer.apple.com/library/ios/documentation/UserExperience/Conceptual/AutolayoutPG/Introduction/Introduction.html