1. Navigation Structure
Bottom Tab Bar (Fixed):
Home: (Active: Filled Home Icon, Inactive: Outline).
Search: (Magnifying Glass).
Create: (Square with Plus +).
Reels: (Clapperboard Icon).
Profile: (Circular User Avatar, border turns black when active).

2. Detailed Feature Requirements
2.1 Home Tab (The Feed)
Header:
Left: "Instagram" text logo (SVG).
Right: Heart Icon (Activity), Messenger Icon (DMs).
Stories Tray (Top):
Horizontal scrollable row.
Item: User Avatar with a Gradient Ring (Pink/Orange) indicating "Unseen". Grey ring if "Seen".
Interaction: Click opens a full-screen Story Viewer overlay (5-second progress bar, tap right/left to navigate).
The Feed List:
Post Header: Tiny Avatar + Username + Location + "..." (More options).
Media Container:
Image: Standard display.
Video: Auto-plays (muted) when 50% visible in viewport. Shows a small "Speaker" icon to toggle sound.
Interaction: Double-tap media to trigger a White Heart Animation overlay (Like).
Action Bar: Heart, Comment Bubble, Paper Plane (Share), Bookmark (Save - aligned right).
Meta Data: "Liked by user and others", Caption (truncate after 2 lines with "...more"), "View all X comments", "2 hours ago".

2.2 Search Tab (Explore)
Header: Search Bar (rounded gray input) at the top.
Grid Layout:
Masonry Logic: CSS Grid. 3 Columns.
Pattern: 1x1 Squares mostly. Every 3rd row, the rightmost item is a 1x2 Vertical Rectangle (Reel) or a 2x2 Featured Post.
Media Types: Mix of images and autoplaying videos (muted).
Interaction: Clicking an item transitions to a "Detail Feed View" (scrolling down shows more posts related to that tag/category).

2.3 Create Tab (New Post)
Context: Opens as a Modal or Bottom Sheet.
Step 1: Gallery:
Top half: Preview of selected image.
Bottom half: Grid of local images (Mocked list or File Input).
Step 2: Editing (Mock): Simple Filter selection (B&W, Sepia, Vivid) - CSS Filters.
Step 3: Details:
Input: "Write a caption..."
Input: "Add Location"
Action: Clicking "Share" simulates an upload, adds to the MongoDB posts collection, and redirects to Home Feed.
2.4 Reels Tab
Layout: Full-screen immersive (100% Height/Width).
Scroll Physics: scroll-snap-type: y mandatory. Always snaps to the center of the video.
Overlay UI (Bottom):
Left: Username, "Follow" button, Caption, "Original Audio" scrolling text.
Right (Vertical Stack): Heart, Comment, Paper Plane, Three Dots, Audio Cover Art (spinning).
Behavior: Video loops infinitely. Single tap to Play/Pause.
2.5 Activity (Notifications)
Access: Heart icon in Home Header.
Content: List of events:
"user1 liked your photo. 2h" (Thumbnail of photo on right).
"user2 started following you. 1d" (Follow button on right).
2.6 Direct Messages (Chat)
Access: Messenger icon in Home Header.
Inbox List: List of users. Bold text if unread message.
Chat Window:
Standard messaging interface.
Bubbles: Sent (Blue/Purple gradient), Received (Gray).
Input: Text + Heart Icon.
2.7 Profile Tab
Header:
Avatar (Large).
Stats Row: Posts, Followers, Following.
Bio Text & Link.
Action Button: "Edit Profile" (since it's me) or "Follow" (if viewing others).
Highlights: Horizontal scroll of circle avatars below bio.
Tab Switcher: 3 Icons: Grid (Posts), Reel (Videos), Tagged (User icon).
Content: 3-column grid of user's posts.

3. Analytics & Data Collection Requirements
To support the "Further Analysis" requirement, the application must silently track user behavior.
Database Model: AnalyticsEvent
View Duration:
Trigger: When a Reel or Video Post is fully visible.
Action: Start timer. Stop timer when scrolled away.
Save: userId, postId, durationMs.
Interaction Log:
Trigger: User Likes, Comments, or Saves a post.
Save: userId, postId, actionType ('like', 'comment', 'save'), timestamp.
Search Queries:
Trigger: User searches in Explore tab.
Save: queryText, timestamp.