import { TestBed, waitForAsync } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { QueueService, sleep } from './queue.service';

describe('QueueService', () => {
  let queueService: QueueService<any>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    queueService = TestBed.inject(QueueService);
  });

  it('should create', () => {
    expect(QueueService).toBeTruthy();
  });


  it('should return correct oder', async () => {
    queueService.execute('1', fetch('https://jsonplaceholder.typicode.com/posts')).then((values) => console.log('received posts', values));
    console.log('posts requested')
    queueService.execute('1', fetch('https://jsonplaceholder.typicode.com/comments')).then((values) => console.log('received comments', values));
    console.log('comments requested')
    queueService.execute('1', fetch('https://jsonplaceholder.typicode.com/albums')).then((values) => console.log('received albums', values));
    console.log('albums requested')

    queueService.execute('2', fetch('https://jsonplaceholder.typicode.com/todos')).then((values) => console.log('received todos', values));
    console.log('todos requested')
    queueService.execute('2', fetch('https://jsonplaceholder.typicode.com/photos')).then((values) => console.log('received photos', values));
    console.log('photos requested')
    queueService.execute('2', fetch('https://jsonplaceholder.typicode.com/users')).then((values) => console.log('received users', values));
    console.log('users requested')
  });
});
