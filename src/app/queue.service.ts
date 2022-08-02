import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class QueueService<T> {
  private queue: {[id: string]: (()=>Promise<any>)[]} = {};
  private results: {[id: string]: any[]} = {};
  private isRunning: {[id: string]: boolean} = {};

  async execute(id: string, promisable: () => Promise<T>): Promise<T[]> {
    if (!this.queue[id]) {
      this.queue[id] = [promisable];
      this.results[id] = [];
      this.isRunning[id] = false;
    } else {
      this.queue[id].push(promisable);
    }

    return new Promise<T[]>(async (resolve, reject) => {
      let i = 0;
      if (!this.isRunning[id]) {
        console.log('run the queue', id);
        await this.run(id);
        console.log('result', this.results[id]);
        resolve(this.results[id]);
      } else {
        while (this.isRunning[id]) {
          console.log('ku menunggu');
          await sleep(100);
        }
        resolve(this.results[id]);
      }
    });
  }

  private async run(id: string, i = 0): Promise<any> {
    this.isRunning[id] = true;
    await this.queue[id][i]().then(data => {
      console.log('resolved', id, i, data);
      this.results[id][i] = data;
    });
    if (this.queue[id][i + 1] !== undefined) {
      return await this.run(id, i + 1);
    } else {
      delete this.queue[id];
      this.isRunning[id] = false;
      return Promise.resolve();
    }
  }
}

export async function sleep(duration: number) {
  const p = new Promise<void>((accept) => {
    setTimeout(() => accept(), duration);
  });
  await p;
}