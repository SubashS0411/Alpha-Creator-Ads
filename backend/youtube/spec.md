Just like the Instagram PRD, this is structured to be precise for GitHub Copilot or a development team. It assumes the same technical stack (MERN) and the "No Auth" constraint.
Product Requirement Document (PRD): YouTube Clone
Project Name	YouTube Clone (MERN)
Version	1.0
Status	Planning / Development
Tech Stack	MongoDB, Express, React (Vite), Node.js, Tailwind CSS
Primary Goal	specific replica of YouTube’s desktop and mobile web interface, focusing on video playback, discovery, and channel interaction.
1. Executive Summary
The objective is to build a responsive video streaming application that mimics YouTube. The core value prop is the "Watch Page" experience and the "Home Feed" discovery algorithms.
Key Constraint: No Authentication. The app operates with a hardcoded currentUserId to simulate a logged-in environment (allowing subscriptions, likes, and comments).
2. Technical Architecture
Frontend:
React.js (Vite) with React Router DOM.
State Management: Redux Toolkit or Context API (Global Sidebar state, User State).
Styling: Tailwind CSS (Crucial for the complex grid responsiveness).
Video Player: react-player or native HTML5 Video with custom controls.
Icons: react-icons (Material Design icons mostly).
Backend: Node.js / Express.js REST API.
Database: MongoDB with Mongoose.
3. Functional Requirements
3.1. Navigation & Layout (The "Shell")
Requirement: A persistent Master Layout.
Header (Fixed Top):
Left: Hamburger Menu Toggle, YouTube Logo.
Center: Search Bar (with search icon button), Mic Icon (visual only).
Right: Create Video Icon, Notifications, User Avatar.
Sidebar (Dynamic):
Expanded (Desktop default): Home, Shorts, Subscriptions, History, Playlist list.
Collapsed (Desktop small/Tablet): Icon-only navigation (Home, Shorts, Subs, You).
Mobile (Hidden/Drawer): Overlay drawer when hamburger is clicked. Bottom bar navigation on mobile view.
Categories Bar:
Sticky bar below the header containing filter chips (All, Gaming, Music, Live, Mixed). Horizontal scroll.
3.2. Home Feed
Requirement: Responsive Grid of Video Cards.
Layout: Responsive Grid.
Desktop: 3 to 4 columns depending on sidebar state.
Tablet: 2 columns.
Mobile: 1 column.
Video Card Component:
Thumbnail Image (with duration badge on bottom right).
Hover State (Desktop): Auto-play mute preview of video after 1s hover.
Meta Info: Channel Avatar, Title (truncated 2 lines), Channel Name, Views • Relative Time.
3.3. Watch Page (Video Player)
Requirement: The core feature. A specific URL route /watch?v={id}.
Layout:
Left Column (Primary):
Video Player: 16:9 Aspect Ratio. Auto-play. Theater mode toggle.
Title Section: Video Title.
Action Bar: Channel Info (Avatar, Name, Sub count, "Subscribe" button), Like/Dislike pill, Share, Download (visual), Three dots.
Description Box: Collapsible background container. Shows views, date, and description text. "Show more" toggle.
Comments Section: "Add a comment" input (active user avatar), List of comments with threading (Reply logic).
Right Column (Recommendations):
Vertical list of "Related Videos" (smaller card style: Thumbnail on left, info on right).
Should include videos from the same category or author.
3.4. Search Functionality
Requirement: Ability to find videos and channels.
Input: Type query in Header -> Press Enter -> Navigate to /results?search_query=xyz.
Results Page:
Vertical list layout (not grid).
cards show detailed description snippets and channel avatar prominently.
Filter toggle (visual only for MVP) on top.
3.5. Channel Page
Requirement: A user's public profile /channel/:id.
Banner: Full-width header image.
Header: Large Avatar, Channel Name, Handle, Sub count, Video count, Description snippet. "Subscribe" button (dynamic state).
Tabs: Home, Videos, Shorts, Playlists, Community.
Videos Tab: Grid view of all videos uploaded by this user, sorted by Newest.
3.6. Studio / Upload (Mock)
Requirement: Mechanism to add content.
Simple Modal or Page:
Input: Video URL (Youtube link or hosted link), Thumbnail URL.
Input: Title, Description, Category.
Button: "Publish" (POST request to backend).
4. Database Schema (Draft Models)
User Model
code
JSON
{
  "_id": "ObjectId",
  "username": "string",
  "name": "string",
  "email": "string",
  "avatar": "string",
  "banner": "string",
  "subscribers": ["ObjectId (User)"], // People following me
  "subscribedUsers": ["ObjectId (User)"], // People I follow
  "watchHistory": ["ObjectId (Video)"]
}
Video Model
code
JSON
{
  "_id": "ObjectId",
  "userId": "ObjectId (User Ref)",
  "title": "string",
  "description": "string",
  "imgUrl": "string (Thumbnail)",
  "videoUrl": "string (Source)",
  "views": "number",
  "tags": ["string"],
  "likes": ["ObjectId (User)"],
  "dislikes": ["ObjectId (User)"],
  "createdAt": "Date"
}
Comment Model
code
JSON
{
  "_id": "ObjectId",
  "userId": "ObjectId (User Ref)",
  "videoId": "ObjectId (Video Ref)",
  "desc": "string",
  "createdAt": "Date"
}
5. API Endpoints (Core Routes)
GET /api/videos/random - Fetch random videos for Home Feed.
GET /api/videos/trend - Fetch most viewed videos.
GET /api/videos/sub - Fetch videos from subscribed channels.
GET /api/videos/tags?tags=js,py - Get related videos.
GET /api/videos/search?q=... - Search title.
GET /api/users/:id - Get channel profile.
PUT /api/users/sub/:id - Subscribe/Unsubscribe.
POST /api/comments - Add comment.
6. Non-Functional Constraints
Responsiveness: The Sidebar behavior is complex.
XL Screen: Sidebar fixed left, content right.
MD Screen: Sidebar becomes mini-icons (rail).
SM Screen: Sidebar hidden, toggle triggers overlay.
Performance:
Use Skeleton loaders for the video grid while fetching API.
Do not load the full video file for the home feed; only load the thumbnail image.
Visuals:
Font: Roboto (Standard Google font).
Border Radius: YouTube uses rounded-xl (approx 12px) for thumbnails and rounded-full for buttons.

MONGODB_URI=mongodb://localhost:27017/instagram-clone
frontend port:5173
backend port:5010