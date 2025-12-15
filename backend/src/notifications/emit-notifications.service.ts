import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { filter, map, merge, Observable } from 'rxjs';
import { ENotificationTitle, TEventData, TMessageEvent } from './types';
import { uuid } from 'uuidv4';

@Injectable()
export class EmitNotificationsService {
  constructor(private eventEmitter: EventEmitter2) {}
  emitEvent = <T>(eventName: string, data: T): void => {
    this.eventEmitter.emit(eventName, data);
  };

  consumeEvents(eventNames: ENotificationTitle[], userId: number): Observable<TMessageEvent> {
    const observables = eventNames.map(
      (eventName) =>
        new Observable<TEventData>((observer) => {
          const handler = (eventData: TEventData): void => observer.next(eventData);

          this.eventEmitter.on(eventName, handler);

          return () => {
            this.eventEmitter.off(eventName, handler);
          };
        }),
    );

    return merge(...observables).pipe(
      filter((eventData) => {
        return eventData.adminId == userId;
      }),
      map((eventData) => {
        return { data: JSON.stringify(eventData) } as TMessageEvent;
      }),
    );
  }

  emitRoleUpdatedEvent(adminId: number, role: string): void {
    this.emitEvent(ENotificationTitle.ROLE_UPDATED, { adminId, role });
  }

  emitCarePlanChangedEvent(adminId: number): void {
    const uniqueId = uuid();
    this.emitEvent(ENotificationTitle.NEW_CARE_PLAN_CHANGED, {
      adminId,
      id: uniqueId,
      title: ENotificationTitle.NEW_CARE_PLAN_CHANGED,
    });
  }
}
