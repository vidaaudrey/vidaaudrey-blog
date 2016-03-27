---
title: 'A Design Pattern Story in Swift – Chapter 20: Mediator'
author: Audrey
layout: post
type: page-post-plain
excerpt: 'Artists paint, musicians compose, different jobs for different pros.  It’s not easy for a person to find a pro directly to do a job without some sort of agent in the middle, and even harder for a pro to find a client among all the people.'
permalink: /2015/07/18/a-design-pattern-story-in-swift-chapter-20-mediator/
categories:
  - Mobile Development
  - Swift
tags:
  - Design Pattern
  - Mediator
  - Swift

image:
      feature: '/assets/images/wp-content/uploads/2015/07/ca-1024x675.jpg'
      credit: 
      creditlink: 
---
<div class="page" title="Page 414">
  <div class="layoutArea">
    <div class="column">
      <p>
        <span> Artists paint, musicians compose, different jobs for different pros.  It&#8217;s not easy for a person to find a pro directly to do a job without some sort of agent in the middle, and even harder for a pro to find a client among all the people.  A command mediator (aka. command dispatch center) takes all the burden away. It can process task according to the task requirement such as:</span>
      </p>
      
      <ul>
        <li class="p1">
          Group task will be sent to all the pros who can do the jobs
        </li>
        <li class="p1">
          Normal task will be sent to the appropriate pros and get their quotations
        </li>
        <li class="p1">
          Once the user has chosen the pro based on the quotations, the mediator will send the task to the chosen pro
        </li>
        <li class="p1">
          Upon getting the work back from the pro, the mediator will send the work to the customer for confirmation
        </li>
      </ul>
      
      <p>
        The mediator pattern simplifies peer-to-peer communication between objects by introducing a mediator object that acts as a communications broker between the objects. Instead of having to keep track of and communicate with of all of its peers individually, an object just deals with the mediator.  <em><a href="http://www.apress.com/9781484203958">Design Pattern in Swift</a></em>
      </p>
      
      {% highlight swift %}typealias CommandBlock = CommandPeer -> Any
enum ProType: String {
    case Artist = "Artist"
    case Musician = "Musician"
    case PartyPlanner = "Party Planner"
    case Other = "Other skills"
    case None = "No registered skills"
}
enum TaskStatus: String {
    case S0_Created = "Task Created"
    case S1_Submited = "Task Submitted"
    case S2_BroadCasted = "Task sent to pros"
    case S3_QuoteGathered = "Gathered quotes from pros"
    case S4_ProChosen = "Customer has chosen the pro to work with"
    case S5_SendToPro = "Task Center has sent the task to the pro"
    case S6_ProFinished = "Pro has finished the task"
    case S7_CustomConfirmWork = "Customer has confirmed the finished work"
    case Unknown = "Some unknown state"
}
// To make it simply, a customer and a pro are both command peers. They can initiate a task as a customer or finish a task as a pro.
protocol CommandPeer: CustomStringConvertible {
    var name:String { get }
    var tasks:[Task] { get set }
    var works:[Task] { get set }
    var isPro: Bool { get }
    var proType: ProType { get }

    func choosePro(var task: Task) -> Task
    func confirmWork(var task: Task) -> Task
    func submitQuote(task: Task) -> (name: String, price: Int, message: String)
    func finishTask(var task: Task) -> (task:Task, result: Any?)
}

// All that is needed to make a task a command, leaving for possibilities of different tasks and different task mediators.  If I use class implementation, the commandMediator just need to use the command protocol to talk, instead of the concrete task. But I used struct for concret task. As a result, the mediator is coupled with the task struct implementation.
protocol Command {
    var id: Int { get }
    var name: String { get }
    var proType: ProType { get }
    var isGroupTask: Bool { get set }
    var startBy:String { get set }
    var finishedBy: String { get set }
    var status: TaskStatus { get set }
    var quotes: [(name:String, price: Int, message: String)] { get set }
    var function:CommandBlock { get }
    func execute(peer: CommandPeer) -> Any
}

// commandMediator is kind of a task dispatch center. When the center receives tasks, it will look at the task configuration:
// * Group task -> Send to every registered pro who can do the task and get the work back 
// * Regular task  -> Check status of the task
// *** - Submited -> Send the task to the pros who can do the task and get their quotation
// *** - ProChosen -> Send the task to the chosen pros and get the final work, then send the work to the customer for confirmation
// For simplicity reason, a lof of things are left behind, such as what if the customer did not approve the work? Can I always expect work being returned from a pro? Can the pro be more proactive and submit their work at their own time? How do we track payment, can we keep only one copy of the task... Well, too many cases @_@
class CommandMediator {
    private var peers = [String:CommandPeer]()

    func registerPeer(peer:CommandPeer) {
        peers[peer.name] = peer
    }

    func unregisterPeer(peer:CommandPeer) {
        peers.removeValueForKey(peer.name)
    }
    // the core control logic, evaluate the task configuration and process accordingly.
    func dispatchCommand(caller:CommandPeer, task:Task) -> Any? {
        var result: Any?
        // this task will be execute by everyone who can do the work
        if task.isGroupTask {
            result = sendTaskToChosenProAndGetWork(caller, task: task, isGroupTask: true)
        } else {
            switch task.status {
            case .S1_Submited: result = sendTaskAndGatherQuotes(caller, task: task)
            case .S4_ProChosen: result = sendTaskToChosenProAndGetWork(caller, task: task)
            case .Unknown:  print("Something unknow, check the status")
            default: print("do nothing, check later.....!")
            }
        }
        return result
    }

    private func sendTaskAndGatherQuotes(caller: CommandPeer, var task: Task) -> Task {
        var quotes:[(name: String, price: Int, message: String)] = []
        for peer in peers.values {
            if (peer.name != caller.name) && peer.isPro && (peer.proType == task.proType) {
                quotes.append(peer.submitQuote(task))
            }
        }
        task.quotes = quotes
        task.status = TaskStatus.S3_QuoteGathered
        return task
    }
    private func sendTaskToChosenProAndGetWork(caller: CommandPeer, var task: Task, isGroupTask: Bool = false) -> (task:Task, result: Any?) {
        var fullResult:(Task, Any?) = (task, nil)
       // task.status = TaskStatus.S6_ProFinished
        var groupResult:[Any?] = []

        var groupNames:String = ""
         if !isGroupTask {
            let choosenProName = task.quotes[0].name
            for peer in peers.values {
                if peer.name == choosenProName {
                    fullResult = peer.finishTask(task)
                }
            }
         } else {
             for peer in peers.values {
                if (peer.name != caller.name) && peer.isPro && (peer.proType == task.proType) {
                    groupResult.append(peer.finishTask(task).result)
                    groupNames += "\(peer.name) , "
                }
            }
        }
        if groupResult.count > 0 {
            task.finishedBy = groupNames
            fullResult = (task, groupResult)
        }
        return fullResult
    }
}


func ==(lhs: Task, rhs: Task) -> Bool {
    return lhs.id == rhs.id
}

// Command implementation as Task
struct Task: Command, CustomStringConvertible {
    static var idCount = 1
    let id: Int
    let name: String
    var price: Int
    let function: CommandBlock
    let proType: ProType
    var finishedBy: String = ""
    var startBy: String = ""
    var isGroupTask: Bool
    var quotes: [(name:String, price: Int, message: String)] = []
    var status: TaskStatus { didSet { print(status.rawValue) } } 
    var description: String {
        return "\nCurrent Task Info: #\(id)\n --name: \(name) - \(proType.rawValue) job\n --started by: \(startBy) \n --finished by: \(finishedBy)\n --current status: \(status.rawValue)\n --quotations: \(quotes) \n"
    }

    init(name: String,price: Int, proType: ProType = .Artist, isGroupTask:Bool = false, function: CommandBlock){
        self.id = Task.idCount++
        self.name = name
        self.function = function
        self.proType = proType
        self.status = .S0_Created
        self.price = price
        self.isGroupTask = isGroupTask
    }
    func execute(peer: CommandPeer) -> Any {
        if peer.proType == self.proType {
            print("Passing pro \(peer.name) the job...")
            return function(peer)
        } else {
            return "Got no work from pro"
        }
    }

}
// CommandPeer implementation as a User, who can be a customer and a pro at the same time
class User: CommandPeer {
    var name: String
    let mediator: CommandMediator
    var tasks:[Task]
    var works:[Task]
    var isPro: Bool = true
    var proType: ProType
    var description: String {
        return "\(name) - \(proType.rawValue)\nTasks: \(tasks.map{$0.name}).  Works:\(works.map{$0.name})\n"
    }
    init(name: String, mediator: CommandMediator, isPro: Bool = true, proType: ProType = .None){
        self.name = name
        self.mediator = mediator
        tasks = []
        works = []
        self.isPro = isPro
        self.proType = proType
        mediator.registerPeer(self)
    }

    func sendTaskToGroupAndGetFinalWork(var task: Task) -> (task: Task, result: Any?){
        task.isGroupTask = true
        tasks.append(task)
        return mediator.dispatchCommand(self, task: task) as! (Task, Any?)
    }
    func sendTaskAndGetTaskWithQuotes(var task: Task) -> Task {
        task.startBy = name
        task.status = TaskStatus.S1_Submited
        tasks.append(task)
        return mediator.dispatchCommand(self, task: task) as! Task
    }

    func choseProAndGetFinalWork(var task: Task) -> (task: Task, result: Any?){
        task.status = TaskStatus.S4_ProChosen
        return mediator.dispatchCommand(self, task: task) as! (Task, Any?)
    }

    // function for customer: choose pro and confirm work. Mediator only sends task back if there is at least one quotation.
    func choosePro(var task: Task) -> Task{
        // assume customer is business, only randomly choose one quote
        let index = arc4random_uniform(UInt32(task.quotes.count))
        task.quotes = [task.quotes[Int(index)]]
        print("Choose the pro\(task.quotes[0])")
        task.status = TaskStatus.S4_ProChosen
        task.finishedBy = task.quotes[0].name
        return task
    }

    func confirmWork(var task: Task) -> Task{
        let index = tasks.indexOf {$0.id == task.id}
        task.status = .S7_CustomConfirmWork
        if index != nil {
            tasks[index!] = task
        }
        return task
    }

    // function for pro: submit quotes and finish task
    func submitQuote(task: Task) -> (name: String, price: Int, message: String) {
        let quote = task.price * (Int(arc4random_uniform(3)) + 1)
        let message = "Some random message for the customer: choose me..."
        return (name, quote, message)
    }

    // let's assume a pro always finishes the job and give back the result now. Deal with bad pros later
    func finishTask(var task: Task) -> (task:Task, result: Any?){
        let result = task.execute(self)
        task.finishedBy = name
        task.status = TaskStatus.S6_ProFinished
        self.works.append(task)
        return (task, result)
    }

}

// Testing. Create some tasks and users
let partyTask = Task(name: "Host a Party of the Century", price: 2000000, proType: .PartyPlanner) { peer in
    print("\(peer.name) is doing the job")
    print("Inviting people...")
    return "Final work: the greatest party ever..."
}
let partyTask1 = Task(name: "Host a Party of the Next Century", price: 2220000, proType: .PartyPlanner) { peer in
    print("\(peer.name) is doing the job")
    print("Inviting people...")
    return "Final work: the greatest party ever...."
}
let musicTask = Task(name: "Write A Mountain-Moving Song", price: 80000000, proType: .Musician) { peer in
    print("\(peer.name) is doing the job...")
    print("Composing ♭♮♯♯♮♭♭♫♬♩♪...")
    return "Final work: a beautiful song"
}
let paintTask = Task(name: "The Finest Paint Collection", price: 2010000, proType: .Artist, isGroupTask: true) { peer in
    print("\(peer.name) is doing the job...")
    print("Painting...")
    return "Final work: Paint Work"
}

let mediator = CommandMediator()
let u1 = User(name: "The Queue ", mediator: mediator)
var u2 = User(name: "Michelangelo", mediator: mediator, proType: .Artist)
let u3 = User(name: "Johannes", mediator: mediator, proType: .Musician)
let u6 = User(name: "Ludwig", mediator: mediator, proType: .Musician)
let u4 = User(name: "Eugène", mediator: mediator, proType: .Artist)
let u5 = User(name: "Josh", mediator: mediator, proType: .PartyPlanner)
let tasks = [partyTask, paintTask, musicTask, partyTask1]
for task in tasks {
    if task.isGroupTask {
        print("\nSending a task called [\(task.name)]  that require a GROUP to finish....")
        let groupResults = u1.sendTaskToGroupAndGetFinalWork(task)
        print("The final work: \(groupResults.1)")
    } else {
        print("\nCreating a task called [\(task.name)] that require a single pro to finish ...")
        let taskWithQuotes = u1.sendTaskAndGetTaskWithQuotes(task)
        print(taskWithQuotes)
        print("Getting finished work and task....")
        let taskFinishedByProAndWork = u1.choseProAndGetFinalWork(taskWithQuotes)
        print("The final work: \(taskFinishedByProAndWork.1)")
        u1.confirmWork((taskFinishedByProAndWork.0))
    }
}


let users = [u1, u2, u3, u4, u5, u6]
users.map{print("\($0.description)")}
{% endhighlight %}
      
      <p>
        <a href="/assets/images/wp-content/uploads/2015/07/mediator.png"><img class="aligncenter size-full wp-image-1077" src="/assets/images/wp-content/uploads/2015/07/mediator.png" alt="mediator" width="746" height="970" /></a>
      </p>
      
      <p>
        Upon seeing the tasks, I can&#8217;t help wonder: don&#8217;t we all serve the pleasure of the queue?
      </p>
    </div>
  </div>
</div>