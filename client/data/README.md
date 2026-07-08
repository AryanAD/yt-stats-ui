# Data Folder

Drop your exported YouTube watch history here for local testing.

## How to get the file

1. Go to [Google Takeout](https://takeout.google.com/).
2. Deselect everything, then select only **YouTube and YouTube Music**.
3. In the options, choose **"All YouTube data included"** and make sure
   **history/watch-history.json** is included.
4. Export and download the archive, then extract `watch-history.json`.

## Usage

Place `watch-history.json` in this folder (or any location) and upload it
through the app's file picker. All processing happens in your browser — the
file is never uploaded to any server.

> Note: Large files (100,000+ records) are processed in a Web Worker to keep
> the UI responsive.
