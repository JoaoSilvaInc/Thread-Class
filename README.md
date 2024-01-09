### This class will allows you make Javascript threads in a simple way. How simple? Well, you can do it in a single line of code (not counting the import):

  new Thread().add( () => { console.log("Didn't I tell you?") }).start()

### This code will print 'Didn't I tell you?' to the console once a second. If you want change the period to once every 2 seconds for example, you'll only need to pass 2000 as a constructor parameter:

  new Thread(2000).add( () => { console.log('This task is running once every 2 seconds') }).start()

### You can also save the thread and use later:

  var counter = 1
  const printCounter = () => {
    console.log(counter)
    counter ++
  }

  const thread = new Thread().add(printCounter)

  function skyIsBlue() { return true } // May be false depending of the wheather and time of day

  if (skyIsBlue()) { thread.remove(printCounter) }
  
### Don't worry about possible erros in your tasks. The thread will catch and save them in the error array:

  const thread = new Thread().name('Foo Thread').add( () => { consooooole.log('foo') }).name('Foo task').start()
  console.log(thread.errors)
  
### The console will show: 
  Task: 'Foo Thread': An error ocurred in the task: 'Foo task' (1)
  [
    {
      task: [Function (anonymous)],
      err: ReferenceError: consooooole is not defined
          at Object.task (C:\index.js:6:46)
          at Object.run (C:\index.js\Thread.js:159:25)
          at C:\index.js\Thread.js:96:29
          at Array.map (<anonymous>)
          at Thread.run (C:\index.js\Thread.js:93:25)
          at Thread.start (C:\index.js\Thread.js:129:14)
          at Object.<anonymous> (C:\index.js\test.js:10:1)
          at Module._compile (node:internal/modules/cjs/loader:1275:14)
          at Module._extensions..js (node:internal/modules/cjs/loader:1329:10)
    }
]

### And you will easily resolve the issue.
