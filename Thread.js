
/**
 * Run tasks periodically
 * 
 *     new Thread()
 *         .add( () => { console.log('example') })
 *         .start()
 * 
 * It will print 'example' to the console one per second.
 * You could define the time between executions:
 * 
 *     function time() { return new Date().getTime() }
 *     var initialTime = time()
 *     new Thread(2000)
 *         .add( () => { console.log( time() - initialTime )}) 
 *         .start()
 * 
 * You could add more than one task:
 * 
 *     var counter = 0
 *     new Thread()
 *         .add( () => { console.log(counter) })
 *         .add( () => { counter ++ })
 *         .start()
 * 
 * You could define the number of times to run the task:
 * 
 *     new Thread()
 *         .add( () => { console.log('One time only') })
 *         .count(1)
 *         .start()
 * 
 * The thread will run only this task once. Other tasks will run normally.
 * You could define something to run only when the task finish:
 * 
 *     var counter = 0
 *     new Thread()
 *         .add( () => { console.log(counter); counter ++ })
 *         .count(3)
 *         .onFinish( () => { console.log('The task runned 3 times') })
 *         .start()
 * 
 * And you could save the thread to use later
 * 
 *     const thread = new Thread()
 *         .add( () => { console.log('foo') })
 *         .start()
 * 
 *     anyCondition ? thread.stop() : thread.add( () => { console.log( 'foo 2') })
 *     
 * Enjoy.
 */
class Thread {
    #period
    #processes = []
    #state = 'running' | 'paused'
    #name = undefined

    /**
     * When an error occurs an object '{ task: The task where the error originated. , err: The error that occurred. }'
     * will be saved in the error array. If some task originates an error more than once, only the first occurence
     * will be saved.
     * Note: Once a task throws an error for the first time a message will be shown. It's important to name the thread
     * and the tasks for easily resolve issues.
     */
    errors = []

    /**
     * 
     * @param {Number} [period] - Time in milliseconds between task executions. Default: 1000
     */
    constructor(period = 1000) {
        this.#period = period
    }

    /**
     * Defines the thread period
     * @param {Number} period - Time in milliseconds between task executions.
     * @returns {Thread}
     */
    period(period) {
        this.#period = period
        return this
    }

    #execute(thread) { thread.run() }

    /**
     * Calls all tasks in the thread
     * @returns {Thread}
     */
    run() {
        this.#processes.map(process => {
            try {
                if ( !process.isFinished() ) {
                    process.run()
                }
            } catch (err) {
                let occurence;
                for (let i = 0; i < this.errors.length; i ++) {
                    if (this.errors[i].task === process.task) {
                        occurence = this.errors[i]
                    }
                }
                if (!occurence) {
                    this.errors.push({ task: process.task, err })
                    console.log(`${ this.#name ? `Thread '${this.#name}': `: ''} An error occurred${ process.name ? ` in the task: '${process.name}'` : ''} (${this.errors.length})`)
                }
            }
        })
        if ( this.#state === 'running' ) { setTimeout( () => { this.#execute(this) }, this.#period) }
    }

    #index(process) {
        return this.#processes.indexOf(process)
    }
    #removeProcess(process) {
        let index = this.#index(process)
        if ( index > -1 ) { this.#processes.splice(index, 1) }
    }
    #last() { return this.#processes[this.#processes.length-1] }

    /**
     * Starts the thread loop, calling all added tasks according to the defined period.
     * @returns {Thread}
     */
    start() {
        this.#state = 'running'
        this.run()
        return this
    }

    /**
     * Stops running all tasks. You could restart then all calling '.start()' again.
     * @returns {Thread}
     */
    stop() {
        this.#state = 'paused'
        return this
    }

    /**
     * Adds a task to run periodically.
     * @param {Function} task - Anything you want to run in the thread.
     * @returns {Thread}
     */
    add(task) {
        let process = {
            task,
            count: undefined,
            finish: () => { return },
            turn: 0,
            isFinished() {
                if ( process.count === undefined ) { return false }
                return ( process.turn >= process.count )
            },
            run: () => {
                process.turn++
                process.task()
                if (process.isFinished()) { process.finish() }
            },
        }
        this.#processes.push(process)
        return this
    }

    /**
     * Defines the number of times the thread will run the last added task.
     * @param {Number} times - Number of times the last added task should run.
     * @returns {Thread}
     */
    count(times) {
        let process = this.#last()
        if (process) {
            process.count = times
        }
        return this
    }

    /**
     * Adds a task to run only when the last added task completes the last round defined in the '.count()' method.
     * @param {Function} task Anything you want to run
     * @returns {Thread}
     */
    onFinish(task) {
        let process = this.#last()
        if (process) {
            process.finish = task
        }
        return this
    }

    /**
     * Removes a task from the thread
     * @param {Function} task - The task to remove
     * @returns {Thread}
     */
    remove(task) {
        this.#processes.map(process => {
            if (process.task === task) {
                this.#removeProcess(process)
            }
        })
        return this
    }

    /**
     * Before adding tasks: It names the tread.
     * After adding tasks: It names the last added task.
     * 
     * Note: When an error occurs a message will be shown with the name of the thread
     * in which it occurred (if defined) and also the name of the task where the error
     * originated (if defined)
     * @param {String} name - Whatever name you want to call it
     * @returns {Thread}
     */
    name(name) {
        let process = this.#last()
        if (!process || process.name) {
            this.#name = name
            return this
        }
        
        process.name = name
        return this
    }
}

module.exports  = Thread
