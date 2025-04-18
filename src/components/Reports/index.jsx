import React from 'react';
import { MonthSummary } from './MonthSummary';
import { TimeEntryList } from './TimeEntryList';
import { Card } from '../UI/Card';
import { useTimeEntries } from '../../hooks/useTimeEntries';
import { getCurrentMonthName } from '../../utils/dateFormatter';

export function Reports() {
    const { timeEntries } = useTimeEntries();

    return (
        <>
            <Card title={`Tổng Kết Tháng ${getCurrentMonthName()}`}>
                <MonthSummary />
            </Card>

            <Card title="Lịch Sử Chấm Công">
                <TimeEntryList />
            </Card>
        </>
    );
}
