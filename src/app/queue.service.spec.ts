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


  it('run single queue, should return correct oder', async () => {
    let order: string[] = [];
    queueService.execute('1', () => new Promise<object>((resolve, reject) => {
      setTimeout(() => resolve({value: 'A-1'}), Math.random()*1000)
      })).then((values) => {
      console.log('received A-1', values);
      order.push('A-1');
    });
    console.log('A-1 requested');
    queueService.execute('1', () => new Promise<object>((resolve, reject) => {
      setTimeout(() => resolve({value: 'A-2'}), Math.random()*1000)
      })).then((values) => {
      console.log('received A-2', values);
      order.push('A-2');
    });
    console.log('A-2 requested');
    await queueService.execute('1', () => new Promise<object>((resolve, reject) => {
      setTimeout(() => resolve({value: 'A-3'}), Math.random()*1000)
      })).then((values) => {
        console.log('received A-3', values);
        order.push('A-3');
      });
    console.log('A-3 requested and waited');

    expect(order).toEqual(['A-1', 'A-2', 'A-3']);

    queueService.execute('2', () => new Promise<object>((resolve, reject) => {
      setTimeout(() => resolve({value: 'B-1'}), Math.random()*1000)
      }));
    console.log('B-1 requested');
    queueService.execute('2', () => new Promise<object>((resolve, reject) => {
      setTimeout(() => resolve({value: 'B-2'}), Math.random()*1000)
      }));
    console.log('B-2 requested');
    const orderB = await queueService.execute('2', () => new Promise<object>((resolve, reject) => {
      setTimeout(() => resolve({value: 'B-3'}), Math.random()*1000)
      }));
    console.log('B-3 requested and waited');

    expect(orderB).toEqual([{value: 'B-1'}, {value: 'B-2'}, {value: 'B-3'}]);

  });

  it('run multiple queue, should return correct oder on each queue', async () => {
    let orderC: string[] = [];
    queueService.execute('1', () => new Promise<object>((resolve, reject) => {
      setTimeout(() => resolve({value: 'C-1'}), Math.random()*1000)
      })).then((values) => {
      console.log('received C-1', values);
      orderC.push('C-1');
    });
    console.log('C-1 requested');

    queueService.execute('2', () => new Promise<object>((resolve, reject) => {
      setTimeout(() => resolve({value: 'D-1'}), Math.random()*1000)
      }));
    console.log('D-1 requested');

    queueService.execute('2', () => new Promise<object>((resolve, reject) => {
      setTimeout(() => resolve({value: 'D-2'}), Math.random()*1000)
      }));
    console.log('D-2 requested');

    queueService.execute('1', () => new Promise<object>((resolve, reject) => {
      setTimeout(() => resolve({value: 'C-2'}), Math.random()*1000)
      })).then((values) => {
      console.log('received C-2', values);
      orderC.push('C-2');
    });
    console.log('C-2 requested');

    queueService.execute('1', () => new Promise<object>((resolve, reject) => {
      setTimeout(() => resolve({value: 'C-3'}), Math.random()*1000)
      })).then((values) => {
        console.log('received C-3', values);
        orderC.push('C-3');
      });
    console.log('C-3 requested and waited');

    const orderD = await queueService.execute('2', () => new Promise<object>((resolve, reject) => {
      setTimeout(() => resolve({value: 'D-3'}), Math.random()*1000)
      }));
    console.log('D-3 requested and waited');

    expect(orderD).toEqual([{value: 'D-1'}, {value: 'D-2'}, {value: 'D-3'}]);
    
    setTimeout(() => {
      expect(orderC).toEqual(['C-1', 'C-2', 'C-3']);
    }, 1000);
  });
});
