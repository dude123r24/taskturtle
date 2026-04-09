import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GroupsIcon from '@mui/icons-material/Groups';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ListAltIcon from '@mui/icons-material/ListAlt';
import type { SvgIconComponent } from '@mui/icons-material';
import type { EisenhowerQuadrant } from '@/store/taskStore';

export const QUADRANT_ICONS: Record<EisenhowerQuadrant, SvgIconComponent> = {
    DO_FIRST: FiberManualRecordIcon,
    SCHEDULE: CalendarMonthIcon,
    DELEGATE: GroupsIcon,
    ELIMINATE: DeleteOutlineIcon,
    UNASSIGNED: ListAltIcon,
};
