import {
  Notifications,
  ChevronLeft,
  ChevronRight,
  Delete,
  Edit,
  Close,
  Repeat,
} from '@mui/icons-material';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

import { useCalendarView } from './hooks/useCalendarView.ts';
import { useEventForm } from './hooks/useEventForm.ts';
import { useEventOperations } from './hooks/useEventOperations.ts';
import { useNotifications } from './hooks/useNotifications.ts';
import { useSearch } from './hooks/useSearch.ts';
// import { Event, EventForm, RepeatType } from './types';
import { Event, EventForm, RepeatType } from './types';
import { RepeatSettings } from './components/RepeatSettings';
import { EventStatusIcons } from './components/EventStatusIcons';
import { CalendarView } from './components/CalendarView';
import { categories, weekDays, notificationOptions } from '../md/constants/index.ts';
import { formatDate } from './utils/dateUtils';
import { findOverlappingEvents } from './utils/eventOverlap';
import { getTimeErrorMessage } from './utils/timeValidation';

function App() {
  const {
    title,
    setTitle,
    date,
    setDate,
    startTime,
    endTime,
    description,
    setDescription,
    location,
    setLocation,
    category,
    setCategory,
    isRepeating,
    setIsRepeating,
    repeatType,
    setRepeatType,
    repeatInterval,
    setRepeatInterval,
    repeatEndDate,
    setRepeatEndDate,
    notificationTime,
    setNotificationTime,
    startTimeError,
    endTimeError,
    editingEvent,
    setEditingEvent,
    handleStartTimeChange,
    handleEndTimeChange,
    resetForm,
    editEvent,
  } = useEventForm();

  const { events, saveEvent, deleteEvent } = useEventOperations(Boolean(editingEvent), () =>
    setEditingEvent(null)
  );

  const { notifications, notifiedEvents, setNotifications } = useNotifications(events);
  const { view, setView, currentDate, holidays, navigate } = useCalendarView();
  const { searchTerm, filteredEvents, setSearchTerm } = useSearch(events, currentDate, view);

  const [isOverlapDialogOpen, setIsOverlapDialogOpen] = useState(false);
  const [overlappingEvents, setOverlappingEvents] = useState<Event[]>([]);

  const { enqueueSnackbar } = useSnackbar();

  const addOrUpdateEvent = async () => {
    if (!title || !date || !startTime || !endTime) {
      enqueueSnackbar('필수 정보를 모두 입력해주세요.', { variant: 'error' });
      return;
    }

    if (startTimeError || endTimeError) {
      enqueueSnackbar('시간 설정을 확인해주세요.', { variant: 'error' });
      return;
    }

    const eventData: Event | EventForm = {
      id: editingEvent ? editingEvent.id : undefined,
      title,
      date,
      startTime,
      endTime,
      description,
      location,
      category,
      repeat: {
        type: isRepeating ? repeatType : 'none',
        interval: repeatInterval,
        endDate: repeatEndDate || undefined,
      },
      notificationTime,
    };

    const overlapping = findOverlappingEvents(eventData, events);
    if (overlapping.length > 0) {
      setOverlappingEvents(overlapping);
      setIsOverlapDialogOpen(true);
    } else {
      await saveEvent(eventData);
      resetForm();
    }
  };

  return (
    <Box sx={{ width: '100%', height: '100vh', margin: 'auto', p: 5 }}>
      <Stack direction="row" spacing={6} sx={{ height: '100%' }}>
        <Stack spacing={2} sx={{ width: '20%' }}>
          <Typography variant="h4">{editingEvent ? '일정 수정' : '일정 추가'}</Typography>

          <FormControl fullWidth>
            <FormLabel htmlFor="title">제목</FormLabel>
            <TextField
              id="title"
              size="small"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel htmlFor="date">날짜</FormLabel>
            <TextField
              id="date"
              size="small"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </FormControl>

          <Stack direction="row" spacing={2}>
            <FormControl fullWidth>
              <FormLabel htmlFor="start-time">시작 시간</FormLabel>
              <Tooltip title={startTimeError || ''} open={!!startTimeError} placement="top">
                <TextField
                  id="start-time"
                  size="small"
                  type="time"
                  value={startTime}
                  onChange={handleStartTimeChange}
                  onBlur={() => getTimeErrorMessage(startTime, endTime)}
                  error={!!startTimeError}
                />
              </Tooltip>
            </FormControl>
            <FormControl fullWidth>
              <FormLabel htmlFor="end-time">종료 시간</FormLabel>
              <Tooltip title={endTimeError || ''} open={!!endTimeError} placement="top">
                <TextField
                  id="end-time"
                  size="small"
                  type="time"
                  value={endTime}
                  onChange={handleEndTimeChange}
                  onBlur={() => getTimeErrorMessage(startTime, endTime)}
                  error={!!endTimeError}
                />
              </Tooltip>
            </FormControl>
          </Stack>

          <FormControl fullWidth>
            <FormLabel htmlFor="description">설명</FormLabel>
            <TextField
              id="description"
              size="small"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel htmlFor="location">위치</FormLabel>
            <TextField
              id="location"
              size="small"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel id="category-label">카테고리</FormLabel>
            <Select
              id="category"
              size="small"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-labelledby="category-label"
              aria-label="카테고리"
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat} aria-label={`${cat}-option`}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <FormControlLabel
              id="repeat-checkbox"
              aria-labelledby="repeat-checkbox"
              aria-label="반복 일정"
              control={
                <Checkbox
                  checked={isRepeating}
                  onChange={(e) => setIsRepeating(e.target.checked)}
                />
              }
              label="반복 일정"
            />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel htmlFor="notification">알림 설정</FormLabel>
            <Select
              id="notification"
              size="small"
              value={notificationTime}
              onChange={(e) => setNotificationTime(Number(e.target.value))}
            >
              {notificationOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* 반복 설정 UI */}
          {isRepeating && (
            <RepeatSettings
              repeatType={repeatType}
              repeatInterval={repeatInterval}
              repeatEndDate={repeatEndDate}
              onRepeatTypeChange={setRepeatType}
              onRepeatIntervalChange={setRepeatInterval}
              onRepeatEndDateChange={setRepeatEndDate}
            />
          )}

          <Button
            data-testid="event-submit-button"
            onClick={addOrUpdateEvent}
            variant="contained"
            color="primary"
          >
            {editingEvent ? '일정 수정' : '일정 추가'}
          </Button>
        </Stack>

        <Stack flex={1} spacing={5}>
          <Typography variant="h4">일정 보기</Typography>

          <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
            <IconButton aria-label="Previous" onClick={() => navigate('prev')}>
              <ChevronLeft />
            </IconButton>
            <Select
              size="small"
              aria-label="뷰 타입 선택"
              value={view}
              onChange={(e) => setView(e.target.value as 'week' | 'month')}
            >
              <MenuItem value="week" aria-label="week-option">
                Week
              </MenuItem>
              <MenuItem value="month" aria-label="month-option">
                Month
              </MenuItem>
            </Select>
            <IconButton aria-label="Next" onClick={() => navigate('next')}>
              <ChevronRight />
            </IconButton>
          </Stack>

          <CalendarView
            view={view}
            currentDate={currentDate}
            filteredEvents={filteredEvents}
            notifiedEvents={notifiedEvents}
            holidays={holidays}
          />
        </Stack>

        <Stack
          data-testid="event-list"
          spacing={2}
          sx={{ width: '30%', height: '100%', overflowY: 'auto' }}
        >
          <FormControl fullWidth>
            <FormLabel htmlFor="search">일정 검색</FormLabel>
            <TextField
              id="search"
              size="small"
              placeholder="검색어를 입력하세요"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </FormControl>

          {filteredEvents.length === 0 ? (
            <Typography>검색 결과가 없습니다.</Typography>
          ) : (
            filteredEvents.map((event) => (
              <Box key={event.id} sx={{ border: 1, borderRadius: 2, p: 3, width: '100%' }}>
                <Stack direction="row" justifyContent="space-between">
                  <Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      {notifiedEvents.includes(event.id) && <Notifications color="error" />}
                      <Typography
                        fontWeight={notifiedEvents.includes(event.id) ? 'bold' : 'normal'}
                        color={notifiedEvents.includes(event.id) ? 'error' : 'inherit'}
                      >
                        {event.title}
                      </Typography>
                    </Stack>
                    <Typography>{event.date}</Typography>
                    <Typography>
                      {event.startTime} - {event.endTime}
                    </Typography>
                    <Typography>{event.description}</Typography>
                    <Typography>{event.location}</Typography>
                    <Typography>카테고리: {event.category}</Typography>
                    {event.repeat.type !== 'none' && (
                      <Typography>
                        반복: {event.repeat.interval}
                        {event.repeat.type === 'daily' && '일'}
                        {event.repeat.type === 'weekly' && '주'}
                        {event.repeat.type === 'monthly' && '월'}
                        {event.repeat.type === 'yearly' && '년'}
                        마다
                        {event.repeat.endDate && ` (종료: ${event.repeat.endDate})`}
                      </Typography>
                    )}
                    <Typography>
                      알림:{' '}
                      {
                        notificationOptions.find(
                          (option) => option.value === event.notificationTime
                        )?.label
                      }
                    </Typography>
                  </Stack>
                  <Stack>
                    <IconButton aria-label="Edit event" onClick={() => editEvent(event)}>
                      <Edit />
                    </IconButton>
                    <IconButton aria-label="Delete event" onClick={() => deleteEvent(event.id)}>
                      <Delete />
                    </IconButton>
                  </Stack>
                </Stack>
              </Box>
            ))
          )}
        </Stack>
      </Stack>

      <Dialog open={isOverlapDialogOpen} onClose={() => setIsOverlapDialogOpen(false)}>
        <DialogTitle>일정 겹침 경고</DialogTitle>
        <DialogContent>
          <DialogContentText>
            다음 일정과 겹칩니다:
            {overlappingEvents.map((event) => (
              <Typography key={event.id}>
                {event.title} ({event.date} {event.startTime}-{event.endTime})
              </Typography>
            ))}
            계속 진행하시겠습니까?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsOverlapDialogOpen(false)}>취소</Button>
          <Button
            color="error"
            onClick={() => {
              setIsOverlapDialogOpen(false);
              saveEvent({
                id: editingEvent ? editingEvent.id : undefined,
                title,
                date,
                startTime,
                endTime,
                description,
                location,
                category,
                repeat: {
                  type: isRepeating ? repeatType : 'none',
                  interval: repeatInterval,
                  endDate: repeatEndDate || undefined,
                },
                notificationTime,
              });
            }}
          >
            계속 진행
          </Button>
        </DialogActions>
      </Dialog>

      {notifications.length > 0 && (
        <Stack position="fixed" top={16} right={16} spacing={2} alignItems="flex-end">
          {notifications.map((notification, index) => (
            <Alert
              key={index}
              severity="info"
              sx={{ width: 'auto' }}
              action={
                <IconButton
                  size="small"
                  onClick={() => setNotifications((prev) => prev.filter((_, i) => i !== index))}
                >
                  <Close />
                </IconButton>
              }
            >
              <AlertTitle>{notification.message}</AlertTitle>
            </Alert>
          ))}
        </Stack>
      )}
    </Box>
  );
}

export default App;
