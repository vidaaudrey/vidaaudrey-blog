---
title: Day 23.. Swift Movie App
author: Audrey
layout: post
type: page-post-long-feature
excerpt: 'A simple movie app that demonstrate how to get JSON data and dynamically create the corresponding class. '
permalink: /2015/05/12/day-23-swift-movie-app/
categories:
  - Mobile Development
image:
  feature: '/assets/images/wp-content/uploads/2015/05/snapshot3.png'
  credit: 
  creditlink: 
---
**Description:** a simple movie app that demonstrate how to get JSON data and dynamically create the corresponding class. [Source Code][1]

[<img class="aligncenter size-full wp-image-839" src="/assets/images/wp-content/uploads/2015/05/snapshot3.png" alt="snapshot" width="372" height="667" />][2]

{% highlight swift %}class Movie: NSObject {
    var id: Int = 0
    var originalTitle = ""
    var releaseDate = ""
    var posterPath = ""
    var title = ""
    var voteAverage:Float = 0
    var voteCount:Int = 0
    func getPosterURL() -> String {
        return ALFrameworkConfig.TMDBImageURL + posterPath
    }
    
}{% endhighlight %}

&nbsp;

{% highlight swift %}import UIKit
import ALFramework

class ViewController: UIViewController {

    @IBOutlet weak var tableView: UITableView!
    var dataSource:TableViewDataSource!
    var movies:[Movie] = []
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        dataSource = TableViewDataSource(items: movies, cellIdentifier: "cell", cellActionHandler: nil, configureBlock: { (cell, item) -> () in
            if let actualCell = cell as? MovieTableViewCell {
                actualCell.configCells(item as! Movie)
            }
        })
        tableView.dataSource = dataSource
        tableView.delegate = dataSource
        
        let url = ALFrameworkConfig.TMDBURLPopular + ALFrameworkConfig.TMDBKey
        ALUtils.getJSONObjectFromURL(url, callback: { (jsonData) -> Void in
            
            if let jsonArr = jsonData["results"] as? NSArray {
                for jsonDictData in jsonArr {
                    if let jsonDict = jsonDictData  as? NSDictionary {
                        // dynamically create movie class
                        let movie  = Movie.fromJSON(jsonDict)
                        self.movies.append(movie)
                    }
                    self.dataSource.items = self.movies
                    self.tableView.reloadData()
                }
                
            }
        })
        
    }

}{% endhighlight %}

**Links:**

  * [Swift + Objc = Magic][3]
  * [Movie Data ][4]

 [1]: https://github.com/vidaaudrey/023-Popular-Movies
 [2]: /assets/images/wp-content/uploads/2015/05/snapshot3.png
 [3]: https://www.weheartswift.com/swift-objc-magic/
 [4]: http://docs.themoviedb.apiary.io/#reference/movies/moviepopular/get