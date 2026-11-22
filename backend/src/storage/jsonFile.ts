import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'

/** Сховище масиву записів у одному JSON-файлі (замість СУБД). */
export class JsonFile<T> {
  constructor(private readonly filePath: string) {}

  async read(): Promise<T[]> {
    try {
      const raw = await readFile(this.filePath, 'utf-8')
      const parsed: unknown = JSON.parse(raw)
      if (!Array.isArray(parsed)) {
        throw new Error(`Файл ${this.filePath} має містити JSON-масив`)
      }
      return parsed as T[]
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        await this.write([])
        return []
      }
      throw error
    }
  }

  /** Запис через тимчасовий файл + rename, щоб не отримати напівзаписаний JSON. */
  async write(items: T[]): Promise<void> {
    await mkdir(path.dirname(this.filePath), { recursive: true })
    const tmpPath = `${this.filePath}.tmp`
    await writeFile(tmpPath, JSON.stringify(items, null, 2), 'utf-8')
    await rename(tmpPath, this.filePath)
  }
}
