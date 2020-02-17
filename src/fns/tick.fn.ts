/**
 * tick adds a task to the javaScript task queue, which executes after all other
 * synchronous code and microTasks, etc. complete.
 */

export const tick = (f: () => any) => setTimeout(f, 0)
