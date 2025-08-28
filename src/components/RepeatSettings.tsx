import { FormControl, FormLabel, MenuItem, Select, Stack, TextField } from '@mui/material';

import { RepeatType } from '../types';

interface RepeatSettingsProps {
  repeatType: RepeatType;
  repeatInterval: number;
  repeatEndDate: string;
  onRepeatTypeChange: (type: RepeatType) => void;
  onRepeatIntervalChange: (interval: number) => void;
  onRepeatEndDateChange: (date: string) => void;
}

export const RepeatSettings = ({
  repeatType,
  repeatInterval,
  repeatEndDate,
  onRepeatTypeChange,
  onRepeatIntervalChange,
  onRepeatEndDateChange,
}: RepeatSettingsProps) => {
  return (
    <Stack spacing={2}>
      <FormControl fullWidth>
        <FormLabel htmlFor="repeat-type">반복 유형</FormLabel>
        <Select
          id="repeat-type"
          aria-labelledby="repeat-type"
          aria-label="반복 유형"
          size="small"
          value={repeatType === 'none' ? 'daily' : repeatType}
          onChange={(e) => onRepeatTypeChange(e.target.value as RepeatType)}
        >
          <MenuItem data-testid="repeat-daily" value="daily">
            매일
          </MenuItem>
          <MenuItem data-testid="repeat-weekly" value="weekly">
            매주
          </MenuItem>
          <MenuItem data-testid="repeat-monthly" value="monthly">
            매월
          </MenuItem>
          <MenuItem data-testid="repeat-yearly" value="yearly">
            매년
          </MenuItem>
        </Select>
      </FormControl>

      <Stack direction="row" spacing={2}>
        <FormControl fullWidth>
          <FormLabel htmlFor="repeat-interval">반복 간격</FormLabel>
          <TextField
            id="repeat-interval"
            size="small"
            type="number"
            value={repeatInterval}
            onChange={(e) => onRepeatIntervalChange(Number(e.target.value))}
            slotProps={{ htmlInput: { min: 1 } }}
          />
        </FormControl>

        <FormControl fullWidth>
          <FormLabel htmlFor="repeat-end-date">반복 종료일</FormLabel>
          <TextField
            id="repeat-end-date"
            size="small"
            type="date"
            value={repeatEndDate}
            onChange={(e) => onRepeatEndDateChange(e.target.value)}
          />
        </FormControl>
      </Stack>
    </Stack>
  );
};
