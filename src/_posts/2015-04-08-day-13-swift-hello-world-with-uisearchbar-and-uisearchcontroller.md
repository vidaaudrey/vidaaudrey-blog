---
title: 'Day 13&#8230; Swift &#8220;Hello, World&#8221; with UISearchBar and UISearchController'
author: Audrey
layout: post
type: page-post-long-feature
excerpt: 'A “Hello World” swift demo that shows greetings in different languages. The demo shows how to use UISearchController, UISearchBar and UISearchDisplay with UITableView and UICollectionView'
permalink: /2015/04/08/day-13-swift-hello-world-with-uisearchbar-and-uisearchcontroller/
categories:
  - Mobile Development
tags:
  - Material Design Color
  - Swift
  - UISearchBar
  - UISearchController
image:
    feature: '/assets/images/wp-content/uploads/2015/04/snapshot4.png'
    credit: 
    creditlink: 
---
<div>
  A “Hello World” swift demo that shows greetings in different languages. The demo shows how to use UISearchController, UISearchBar and UISearchDisplay with UITableView and UICollectionView.<a href="https://github.com/vidaaudrey/013-Hello-World-UISearchController-And-UISearchBar" target="_blank"> Source Code</a>
</div>

<div>
  <a href="/assets/images/wp-content/uploads/2015/04/snapshot2.gif"><img class=" size-full wp-image-770 aligncenter" src="/assets/images/wp-content/uploads/2015/04/snapshot2.gif" alt="snapshot" width="375" height="691" /></a> <a href="/assets/images/wp-content/uploads/2015/04/snapshot21.gif"><img class=" size-full wp-image-772 aligncenter" src="/assets/images/wp-content/uploads/2015/04/snapshot21.gif" alt="snapshot2" width="375" height="691" /></a> <a href="/assets/images/wp-content/uploads/2015/04/snapshot11.gif"><img class=" size-full wp-image-771 aligncenter" src="/assets/images/wp-content/uploads/2015/04/snapshot11.gif" alt="snapshot1" width="375" height="691" /></a> <a href="/assets/images/wp-content/uploads/2015/04/snapshort3.gif"><img class=" size-full wp-image-768 aligncenter" src="/assets/images/wp-content/uploads/2015/04/snapshort3.gif" alt="snapshort3" width="375" height="691" /></a>
</div>

<div>
</div>

<div>
  <strong>Features</strong>:
</div>

  * A new Material Design Color class called “MD”. (Use &#8220;**md.red[“P500”]**” to get the UIColor, and “**md.random()**” to get some random Material Design UIColor.
  * Separate DataSource and Delegate from UIViewController without compromising the UISearchController’s data update. Ref: GreetingNewViewController.swift

<div>
</div>

<div>
  <div>
    <strong>Takeaways</strong>:
  </div>
</div>

  * A search display controller “manages display of a search bar and a table view that displays the results of a search of data managed by another view controller.&#8221;
  * Remove UICollectionView top Padding: uncheck View Controller’s “Adjust Scroll View Insets&#8221;
  * Use “ resultSearchController.searchBar.becomeFirstResponder()” to set the TextField’s focus on the SearchBar.
  * Filter the data:filteredData = data.filter{ $0.language.lowercaseString.rangeOfString(searchController.searchBar.text) != nil }
  * Filter function does not work with multi-dimension array or dictionary yet. Be careful when to cast the data from AnyObject. Ref: GreetingNewViewController.swift
  * When working with UIViewController with separated datasource class, reloadData() will not work until you manually updated the datasource as well.

<div>
  <div>
    <strong>Links</strong>:
  </div>
  
  <ul>
    <li>
      <a href="http://en.wikipedia.org/wiki/Hello">Wikipedia’s Hello Greeting List</a>
    </li>
    <li>
      <a href="http://import.io">import.io</a> for converting the wiki data into JSON data
    </li>
    <li>
      <a href="https://github.com/lingoer/SwiftyJSON">SwiftyJSON</a> for making the JSON data processing like a breeze
    </li>
    <li>
      <a href="http://www.raywenderlich.com/76519/add-table-view-search-swift">Tut </a>on how to use UISearchBar with UITableView
    </li>
  </ul>
</div>