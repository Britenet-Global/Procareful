import { Controller, ParseArrayPipe, Query, Req, Sse, UseGuards } from '@nestjs/common';
import { interval, map, merge, Observable, startWith } from 'rxjs';
import { IsAuthenticated } from 'src/admin/auth/guard/check.authentication.guard';
import { TUserReq } from 'src/common/types';
import { EmitNotificationsService } from './emit-notifications.service';
import { ENotificationTitle, TMessageEvent } from './types';
import { ApiOkResponse, ApiProduces } from '@nestjs/swagger';
import { TEventDataDto } from './dto';
import { NotificationEventTitlePipe } from './validations/NotificationEventTitlePipe';

@Controller('admin/caregiver/notifications')
export class NotificationsController {
  constructor(private readonly emitNotificationsService: EmitNotificationsService) {}

  @Sse('subscribe')
  @UseGuards(IsAuthenticated)
  @ApiProduces('text/event-stream')
  @ApiOkResponse({ description: 'OK', type: TEventDataDto })
  handleNotification(
    @Req() { user: { userId } }: TUserReq,
    @Query('title', new ParseArrayPipe({ items: String, separator: ',' }), new NotificationEventTitlePipe())
    title: ENotificationTitle[],
  ): Observable<TMessageEvent> {
    const events$ = this.emitNotificationsService.consumeEvents(title, userId);

    const heartbeat$ = interval(30000).pipe(
      startWith(0),
      map(() => ({ data: JSON.stringify({ type: 'ping' }) }) as TMessageEvent),
    );

    return merge(events$, heartbeat$);
  }
}
