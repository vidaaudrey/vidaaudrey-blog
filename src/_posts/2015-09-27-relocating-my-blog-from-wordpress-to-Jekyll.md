---
layout: post
type: page-post-plain
title:  Relocating My Blog from Wordpress to Jekyll
categories: Jekyll

---

*A wise lady recently told me to write, always. I am not good at writing, but I am going to try anyway.*
###
-----
In this post, I am going to use different markup tags and format to show what styles are built in this new [Jekyll](http://jekyllrb.com) blog. 
My last blog entry was on July 18th, which was about 2 months ago. In the past 2 months, I've spent some time trying to learn some front-end development skills and had two client projects. Although I love iOS, web development comes more handy and useful in the day-to-day life. And I feel fortunate that I'll be attending Makersquare in early November for an intensive 3 months' training program. 
<!--more-->

### Background 
My precourse for the school will begin next week, so I spent last two days trying to relocate my blog from Wordpress to Jekyll, which I hope will give me more flexibility to do experiments on various front-end development topics. 

### Learnings from this relocation 
* Definitely love Jekyll. It's much simpler than Wordpress and integration with Github is perfect. Moreover, I no longer need to pay for the hosting fee. 
* Powerful template system. Don't repeat yourself. 
* Support for both HTML and markup. I never really used markup except for Github before. But I definitely will try to learn more. It's much less cluttered than HTML. 

### Tools used 
* SASS. Strictly speaking, SCSS, even I like SASS more, the conversion between existing CSS to SASS is much more work. 
* Bootstrap. I've struggled whether I should use any framework in the beginning since my blog is very minimalistic and Jekyll comes with a great built-in support for a styling. But I went ahead and dropped Bootstrap in anyhow after some consideration for two reasons. First, it will greatly help speed up my development. Second, I'll definitely need it for some future experiments. 
* Yeoman Generator - Jekyllized. [Generator-jekyllrb](https://github.com/robwierzbowski/generator-jekyllrb) is the most popular Jekyll generator in Yeoman, and I've loved it at first, especially the support for Compass, CoffeeScript, HTML5 Boilerplate Template makes it very attractive for a beginner like me. But I had hard time getting it work properly. And somehow, I've developed a preference on Gulp over Grunt so I end up using [Generator-jekyllized](https://github.com/sondr3/generator-jekyllized). I had to do some minor tweaks to make it work as the way I intended, and overall, I am pretty happy with Jekyllized. Other benefits of using Jekyllized:
    * Complete setup including layouts, config, 404, RSS Feed, posts and an example page. 
    + Support for related posts 
    1. Syntax highlighting 

### Cheatsheet for Styling 
* Jekyll has a directory `_posts` which contains all the blog posts. 
* Styles:
    *  ^superscript: `^superscript`
    *  _underline_: `_underline_`
    *  ==highlight==: `==highlight==` 
    - ** bold **:  `<strong>`.
    - * italicize *:  `<em>`.
    - Abbreviations, like <abbr title="HyperText Markup Language">HTML</abbr> use`<abbr>`, with an optional `title` attribute for the full phrase.
    - Citations, like <cite>&mdash; Mark otto</cite> uses `<cite>`.
    - <del>Deleted</del> uses `<del>` and <ins>inserted</ins> text: `<ins>`.
    - Superscript <sup>text</sup> uses `<sup>` and subscript <sub>text</sub> uses `<sub>`.
    * `> Winter is coming`

> Winter is coming. 

* syntax highlighting 

{% highlight js %}
console.log('Hello, this is Audrey');
{% endhighlight %}


{% gist vidaaudrey/d5a1ad6bb4b0d61c8a01 %}
    
[^1]: Relocating My Blog from Wordpress to Jekyll
