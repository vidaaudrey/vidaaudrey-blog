---
title: Day 12-Swift-Word-Color-Lean-UIViewController
author: Audrey
layout: post
type: page-post-long-feature
excerpt: 'A simple demo that shows how to separate UITableViewDataSource and UICollectionViewDataSource from UIViewController.'
permalink: /2015/04/05/day-12-swift-word-color-lean-uiviewcontroller/
categories:
  - Mobile Development
tags:
  - Lean ViewController
  - Swift
  - UICollectionView
  - UITableView
image:
    feature: '/assets/images/wp-content/uploads/2015/04/snapshot11.png'
    credit: 
    creditlink: 
---
<div>
  A simple demo that shows how to separate UITableViewDataSource and UICollectionViewDataSource from UIViewController. <a href="https://github.com/vidaaudrey/012-Word-Color-Lean-UIViewController-UITableView-UICollectionView">Source Code</a>
</div>

<div>
  <a href="/assets/images/wp-content/uploads/2015/04/snapshot1.png"><img class=" size-full wp-image-752 aligncenter" src="/assets/images/wp-content/uploads/2015/04/snapshot1.png" alt="snapshot" width="380" height="691" /></a> <a href="/assets/images/wp-content/uploads/2015/04/snapshot2.png"><img class=" size-full wp-image-754 aligncenter" src="/assets/images/wp-content/uploads/2015/04/snapshot2.png" alt="snapshot2" width="383" height="694" /></a>
</div>

<div>
</div>

<div>
  <strong>Steps:</strong>
</div>

  * Create DataSource class which implement UITableViewDataSource (Add UITaleViewDelegate if needed)
  * Create the ViewController in the storyboard, add one prototype cell
  * Create a CustomTableViewCell class, link the prototype cell to the class and further config the cell
  * Add the ViewController class, initialize the UITableViewDataSource and assign it to the TableView in the storyboard