---
title: 'Day 5 &#8211; Circular Progress Loader Animation'
author: Audrey
layout: post
type: page-post-long-feature
excerpt: 'A highly customizable progress animation control.'
permalink: /2015/03/22/day-5-circular-progress-loader-animation/
categories:
  - Mobile Development
image:
  feature: '/assets/images/wp-content/uploads/2015/03/snapshot4.png'
  credit: 
  creditlink: 
---
A highly customizable progress animation control.

[<img class=" size-full wp-image-710 aligncenter" src="/assets/images/wp-content/uploads/2015/03/snapshot4.png" alt="snapshot" width="363" height="612" />][1] [<img class=" size-full wp-image-711 aligncenter" src="/assets/images/wp-content/uploads/2015/03/snapshot0.gif" alt="snapshot0" width="412" height="721" />][2] [  
][3] [<img class=" size-full wp-image-713 aligncenter" src="/assets/images/wp-content/uploads/2015/03/snapshot2.gif" alt="snapshot2" width="412" height="721" />][4] [<img class=" size-full wp-image-714 aligncenter" src="/assets/images/wp-content/uploads/2015/03/snapshot3.gif" alt="snapshot3" width="412" height="721" />][5]

&nbsp;

&nbsp;

Use below code to programmatically create and customize the view, all parameters except the first &#8220;frame&#8221; can be nil.

progressView = ProgressView(frame: rect, labelTextColor: UIColor.whiteColor(), labelFontSize: 30, labelFontName: nil, circleStrokeColors: colors, circleFillColor: nil, circleLineWidth: 15, strokeStartValue: nil, strokeEndValue:nil, loadText: &#8220;Load View&#8221;, loadingText: &#8220;Loading&#8221;, endLoadingText: &#8220;Done&#8221;)  
view.addSubview(progressView)  
progressView.animateProgressView()

<a href="https://github.com/vidaaudrey/005-Circular-Progress-Loader-Animation" target="_blank">Source Code</a>

Code reference from &#8220;<a href="http://zappdesigntemplates.com/cashapelayer-to-create-a-custom-progressbar/" target="_blank">Use CAShapeLayer to create a custom progress bar in iO</a><a href="http://zappdesigntemplates.com/cashapelayer-to-create-a-custom-progressbar/" target="_blank">S</a>&#8220;

 [1]: /assets/images/wp-content/uploads/2015/03/snapshot4.png
 [2]: /assets/images/wp-content/uploads/2015/03/snapshot0.gif
 [3]: /assets/images/wp-content/uploads/2015/03/snapshot1.gif
 [4]: /assets/images/wp-content/uploads/2015/03/snapshot2.gif
 [5]: /assets/images/wp-content/uploads/2015/03/snapshot3.gif