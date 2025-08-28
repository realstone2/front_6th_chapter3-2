import { Notifications, Repeat } from '@mui/icons-material';

import { Event } from '../types';

interface EventStatusIconsProps {
  event: Event;
  isNotified: boolean;
}

export const EventStatusIcons = ({ event, isNotified }: EventStatusIconsProps) => (
  <>
    {isNotified && <Notifications fontSize="small" />}
    {event.repeat.type !== 'none' && <Repeat fontSize="small" data-testid="repeat-icon" />}
  </>
);
