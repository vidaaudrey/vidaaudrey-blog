---
title: 'Day 18 - Swift Currency Converter'
author: Audrey
layout: post
excerpt: 'A currency converter'
type: page-post-long-feature
permalink: /2015/04/29/018-swift-currency-converter/
categories:
  - Mobile Development
image:
    feature: '/assets/images/wp-content/uploads/2015/04/snapshot9.png'
    credit: 
    creditlink: 
---
<div>
  <b>Description</b>: a currency converter.<a href="https://github.com/vidaaudrey/018-Swift-Currency-Converter" target="_blank"> Source Code</a>
</div>

<div>
  <strong>Features</strong>:
</div>

  * Simultaneously  update the target currency among while typing
  * Add interested countries to the watch list
  * Extensible (can add custom currency, inspired by [Chris Eidhof][1]).
  * Encapsulate currency converting process in the CurrencyConverter Class which can be used as:

{% highlight swift %}
 converter = CurrencyConverter(updateTimeInterval:2, exchangeRateUpdatedHandler: exchangeRateUpdatedHandler)
{% endhighlight %}

&nbsp;

<div>
</div>

<div>
</div>

<div>
  <a href="/assets/images/wp-content/uploads/2015/04/snapshot7.gif"><img class="aligncenter size-full wp-image-810" src="/assets/images/wp-content/uploads/2015/04/snapshot7.gif" alt="snapshot" width="376" height="669" /></a>
</div>

<div>
</div>

<div>
  <a href="/assets/images/wp-content/uploads/2015/04/snapshot9.png"><img class=" size-full wp-image-809 aligncenter" src="/assets/images/wp-content/uploads/2015/04/snapshot9.png" alt="snapshot" width="369" height="662" /></a>
</div>

<div>
</div>

<div>
</div>

<div>
  Links:
</div>

  * [Swift CSV][2]
  * [Currency API][3]

 [1]: http://www.objc.io/issue-16/power-of-swift.html
 [2]: https://github.com/naoty/SwiftCSV
 [3]: http://fixer.io/