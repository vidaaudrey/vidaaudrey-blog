---
title: 'A Design Pattern Story in Swift – Chapter 6: Command'
author: Audrey
layout: post
excerpt: 'If you command wisely, you’ll be obeyed cheerfully.  — Thomas Fuller'
permalink: /2015/07/03/a-design-pattern-story-in-swift-chapter-6-command/
categories:
  - Mobile Development
  - Swift
tags:
  - Command
  - Design Pattern
  - Swift 2.0
image:
  feature: '/assets/images/wp-content/uploads/2015/07/nap-1080x675.png'
  credit: 
  creditlink: 
---
<p>
  <span>If you command wisely, you&#8217;ll be obeyed cheerfully.<span class="Apple-converted-space">  </span>&#8212; <em>Thomas Fuller</em></span>
</p>

<div class="page" title="Page 393">
  <div class="layoutArea">
    <div class="column">
      <p>
        The command pattern is used to encapsulate details of how to invoke a method on an object in a way that allows the method to be invoked at a different time or by a different component. (<em>Design Pattern in Swift)</em>
      </p>
      
      {% highlight swift %}protocol Command {
    func execute(receiver: Any)
}

//: A generic command can handle different kind of commands
class GenericCommand&lt;T>: Command {
    private var instruction: T -> Void
    init(instruction: T -> Void){
        self.instruction = instruction
    }
    func execute(receiver: Any) {
        guard let safeReceiver = receiver as? T else {
            fatalError("Receiver is not an expected type")
        }
        instruction(safeReceiver)
    }
    class func createCommand(instruction: T -> Void) -> Command {
        return GenericCommand(instruction: instruction)
    }
}

protocol LatestCommand {
    func executeLatestCommand(receiver: Any)
}

//: A commandWrapper manages the execution of multiple commands or the lastest command
class CommandWrapper: Command, LatestCommand {
    private let commands: [Command]
    private var remainingCommands:[Command]
    init(commands: [Command]){
        self.commands = commands
        self.remainingCommands = commands
    }
    func execute(receiver: Any) {
        print("will excute all commands for \(receiver)")
        commands.map{$0.execute(receiver)}
        
    }
    func executeLatestCommand(receiver: Any){
        print("will execute the lastest command for \(receiver)")
        remainingCommands.removeLast().execute(receiver)
        print("\(remainingCommands.count) commands left.")
    }
}

class PeopleStandByCommand: Command {
    func execute(receiver: Any) {
        print("All people standby")
    }
}
class PrepareWeaponCommand: Command {
    func execute(receiver: Any) {
        print("Weapons are ready")
    }
}

class PrepareResourcesCommand: Command {
    func execute(receiver: Any) {
        print("All resources are ready")
    }
}

//: An operation that has manages the preparation of the war. It creates multiple commands which will be executed at runtime
class PrepareForWarOperation:CustomStringConvertible {
    private var commands:[Command] = []
    private var queue = dispatch_queue_create("arrayQueue", DISPATCH_QUEUE_SERIAL)
    var name: String
    var description: String { return name }
    init(kindom: String){
        print("PrepareForWar Operation for \(kindom) is created")
        self.name = kindom
        prepareEverything()
    }
    func notifyPeople(people: String){
        print("Notified \(people) about the war")
    }
    
    func prepareEverything(){
        addCommand(PrepareForWarOperation.notifyPeople, people: "people of \(name)")
        commands.append(PrepareResourcesCommand())
        commands.append(PrepareWeaponCommand())
        commands.append(PeopleStandByCommand())
    }

    private func addCommand(action: PrepareForWarOperation -> String -> Void, people: String){
        dispatch_sync(queue) { () -> Void in
            self.commands.append(GenericCommand.createCommand({ prep  in
                action(prep)(people)
            }))
        }
    }
    func getACommandWrap() -> protocol &lt;Command,LatestCommand>? {
            var command: protocol &lt;Command,LatestCommand>?
            dispatch_sync(queue) { () -> Void in
                command = CommandWrapper(commands: self.commands)
            }
            return command
    }
}
//: Testing
let p1 = PrepareForWarOperation(kindom: "Daria")
let commands = p1.getACommandWrap()
commands?.executeLatestCommand(p1)
commands?.execute(p1)
print("\n")

let p2 = PrepareForWarOperation(kindom: "Secila")
print("Use the same operation commands for another kindom called Secila")
commands?.execute(p2){% endhighlight %}
      
      <p>
        &nbsp;
      </p>
      
      <p>
        <a href="/assets/images/wp-content/uploads/2015/07/com.png"><img class="aligncenter size-full wp-image-998" src="/assets/images/wp-content/uploads/2015/07/com.png" alt="com" width="459" height="245" /></a>
      </p>
    </div>
  </div>
</div>