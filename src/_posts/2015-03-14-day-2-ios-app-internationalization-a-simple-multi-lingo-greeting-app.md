---
title: 'Day 2 &#8211; iOS App Internationalization &#8211; A Simple Multi-lingo Greeting App'
author: Audrey
layout: post
type: page-post-long-feature
excerpt: 'I wanted to start something that is related to 3D perspective with Sketch today but somehow I got interested in App Internationalization while watching a little WWDC video. So I decided to build a simple multi-lingo app to test some ideas.'
permalink: /2015/03/14/day-2-ios-app-internationalization-a-simple-multi-lingo-greeting-app/
categories:
  - Mobile Development
tags:
  - iOS Internationalization
  - Multi-lingo greeting
  - Swift
image:
    feature: '/assets/images/wp-content/uploads/2015/03/snapshortcn-416x675.png'
    credit: 
    creditlink: 
---
<div>
  I wanted to start something that is related to 3D perspective with Sketch today but somehow I got interested in App Internationalization while watching a little WWDC video. So I decided to build a simple multi-lingo app to test some ideas.
</div>

<div>
</div>

<div>
  I was excited about the possibilities of the app functions and got really excited. But I am also fully aware of my skills and knowledge level.
</div>

<div>
</div>

<div>
  <div class='et_post_video'>
  </div>
</div>

<div>
  <a href='https://github.com/vidaaudrey/002-Swift-Multilingo-Greeting' class='small-button smallorange'>Source Code</a>
</div>

<div>
  <b>Thoughts</b>
</div>

  * The App will not be complicated but enough to demonstrate the fundamentals of internationalization
  * Greetings in different languages should be fun
  * Maybe some audio greeting as well
  * There are many others things that I can do, but this is literally my first mini App with Swift. I should just focus on the core value of my project today which is to learn iOS internationalization basics

<div>
  <b> </b>
</div>

<div>
  <b>Objective </b>
</div>

  * Learn internationalization of Interface strings, programmatically generated strings, image assets, audio files
  * Learn how to handle translation files
  * Learn Sketch export to speed up development
  * Preview and debug in translated languages
  * How to process right-to-left language

<div>
</div>

<div>
  <b>Steps</b>
</div>

  1. A simple design in Sketch
  2. Setup Github
  3. Layout Storyboard, put together the basic App in English
  4. Add localized strings
  5. Process the translation file. Personally I found [Brightec.com][1] quite useful and handy. But with this project, it’s not necessary. All strings can be easily added via Xcode.
  6. Add localized images. Use the “Localized String” approach to localize images. (The asset image does not support localization so well).
  7. Programmatically switch language and region. First I thought it was too much trouble. Normally users can do it from the system setting. Later I found a solution in Stackoverflow.com which is to  get files from the respective language folders.
  8. Add localized audio files
  9. Refine Autolayout to support multiple devices
 10. Other use of NSLocalizedString & best practice  — > check next time

<div>
    <a href="/assets/images/wp-content/uploads/2015/03/sketch-design.png"><img class="size-full wp-image-689" src="/assets/images/wp-content/uploads/2015/03/sketch-design.png" alt="sketch design  (quite different from the final result )" width="750" height="1334" /></a>

    <a href="/assets/images/wp-content/uploads/2015/03/how-nice-sketch-support-folder-export.png"><img class="size-full wp-image-684" src="/assets/images/wp-content/uploads/2015/03/how-nice-sketch-support-folder-export.png" alt="how nice sketch support folder export" width="536" height="681" /></a>
    
 
  
    <a href="/assets/images/wp-content/uploads/2015/03/image-assets.png"><img class="size-full wp-image-682" src="/assets/images/wp-content/uploads/2015/03/image-assets.png" alt="Xcode manages image assets very nicely" width="1124" height="796" /></a>

  
    <a href="/assets/images/wp-content/uploads/2015/03/first-version-in-english.png"><img class="size-full wp-image-687" src="/assets/images/wp-content/uploads/2015/03/first-version-in-english.png" alt="first version in english" width="373" height="690" /></a>
 
  
    <a href="/assets/images/wp-content/uploads/2015/03/my-headach-in-landscape.png"><img class="size-full wp-image-683" src="/assets/images/wp-content/uploads/2015/03/my-headach-in-landscape.png" alt="my headache in landscape view" width="664" height="379" /></a>
 
  
    <a href="/assets/images/wp-content/uploads/2015/03/autolayout-and-constrains.png"><img class="size-full wp-image-688" src="/assets/images/wp-content/uploads/2015/03/autolayout-and-constrains.png" alt="autolayout and constrains" width="880" height="783" /></a>
  
  
    <a href="/assets/images/wp-content/uploads/2015/03/snapshortcn.png"><img class="size-full wp-image-686" src="/assets/images/wp-content/uploads/2015/03/snapshortcn.png" alt="App in my mother tongue " width="416" height="712" /></a>
  
  
    <a href="/assets/images/wp-content/uploads/2015/03/second-version-with-multi-lingo-support.png"><img class="size-full wp-image-685" src="/assets/images/wp-content/uploads/2015/03/second-version-with-multi-lingo-support.png" alt="second version with multi-lingo support" width="371" height="686" /></a>


<div>
  <b>Lesson Learned</b>
</div>

  * Autolayout is such a headache and I spent a lot of time adjusting different devices, landscape and portrait. I had to give up landscape option at the end. I can shift locations, but simply too much to manage the compact height. Next time if the project is easy, perhaps I can quietly sit down and adjust one by one.
  * Sketch made the export process like an easy breeze.
  * Somehow Xcode can not located the m4a file that I recorded with Quicktime player. Mp3 files are ok. Later I learned that m4a files don’t get automatically copied to Build Resources. Need to add manually.
  * In Xcode 6, you can actually export and import XLIFF (<a href="https://en.wikipedia.org/wiki/XLIFF" rel="nofollow">https://en.wikipedia.org/wiki/XLIFF</a>) files

<div>
</div>

<div>
  <b>Nice-to-have functions for the future version:</b>
</div>

  * Add right-to-left support // good to have with more complicated layout.
  * Show progress when playing the audio
  * Add an audio database with different audio samples.
  * Users can listen to a group of audio samples in one language
  * Allow users randomly submit language audios

<div>
</div>

<div>
  <b>Bug needs fix:</b>
</div>

  * Showing nil when adding additional ViewControllers.

<div>
</div>

<div>
  <strong>Further Reading </strong>
</div>

  * Internationalization and localization of Apps in Xcode 6 and Swift  <http://rshankar.com/internationalization-and-localization-of-apps-in-xcode-6-and-swift/>
  * How to record audio files in Mac: <http://www.mactip.net/how-to-record-sound-on-a-mac/>

<div>
</div>

 [1]: http://xliff.brightec.co.uk/form.php