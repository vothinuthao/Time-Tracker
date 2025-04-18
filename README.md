# Freelance Time Tracker

A simple time tracking application for freelancers with local storage-based data persistence. This application allows you to track your work time, manage projects, and view reports of your time entries without requiring a server or authentication.

## Features

- Project management
- Time tracking with automatic or manual entries
- Dashboard with summary statistics
- Data import/export for backup and portability
- Completely client-side (no server required)
- Data is stored in your browser's localStorage

## Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/freelance-time-tracker.git
cd freelance-time-tracker
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm start
```

4. Build for production
```bash
npm run build
```

## Usage

### Manage Projects
Create and manage your projects in the "Dự Án" (Projects) tab.

### Track Time
- Use the "Chấm Công" (Time Tracking) tab to track time
- Select a project and click "Bắt Đầu Làm Việc" to start tracking
- Click "Kết Thúc Làm Việc" to stop tracking and save the entry
- You can also add manual time entries by clicking the "Thêm thủ công" button

### View Dashboard
The Dashboard shows today's tracked time, monthly statistics, and recent time entries.

### Export/Import Data
In the "Dữ Liệu" (Data) tab, you can:
- Export your data to a JSON file for backup
- Import data from a previously exported file
- Clear all data if needed

## Customization

You can customize the application by editing the following:

- Target hours: Edit the Dashboard and TimeTracking components to change the 8-hour daily target
- Language: Change the text in the components to your preferred language
- Colors: Edit the Tailwind CSS classes for different color schemes

## License

MIT