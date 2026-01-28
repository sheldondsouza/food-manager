# food-manager

A simple app to help manage food items, inventory, and expiry tracking.

## Features
- Add, edit, and remove food items
- Track quantities and expiry dates
- Search and filter by category, name, or expiry status
- Notifications or reminders for items near expiry (if configured)
- Import/export CSV for bulk updates
- chatbot for easy ordering queries about orders or reservation

## Quick Start

Prerequisites:
- Node.js >= 18 (or the version your project requires)
- npm or yarn
- (Optional) Docker for containerized setup

Local development:
1. Clone the repo
   ```bash
   git clone https://github.com/sheldondsouza/food-manager.git
   cd food-manager
   ```
2. Install dependencies
   ```bash
   npm install
   # or
   yarn
   ```
3. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Configuration
- Add environment variables in a `.env` file. Example:
  ```
  DATABASE_URL=postgres://user:pass@localhost:5432/food_manager
  NODE_ENV=development
  PORT=3000
  ```
- If your project uses a different DB or storage, update the example accordingly.

## Testing
Run tests with:
```bash
npm test
# or
yarn test
```

## Contributing
Contributions are welcome! Please open an issue to discuss major changes, and submit pull requests for bug fixes or features.

## License
Specify your license here (e.g., MIT). If you don't have one yet, consider adding a LICENSE file.
