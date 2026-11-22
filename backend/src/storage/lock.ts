let queue: Promise<unknown> = Promise.resolve()

/**
 * Виконує операції з файлами строго по черзі, щоб паралельні запити
 * не перезаписували дані одне одного (read-modify-write).
 * Не можна викликати withLock всередині іншого withLock.
 */
export function withLock<T>(task: () => Promise<T>): Promise<T> {
  const run = queue.then(task)
  queue = run.catch(() => undefined)
  return run
}
