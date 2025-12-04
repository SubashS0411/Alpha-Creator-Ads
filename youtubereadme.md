Feature Specification: YouTube Clone Module

1. Overview
This module operates strictly within the Phone Frame Wrapper. It mimics the YouTube Mobile App (not the mobile website).
Key Constraint: Hardcoded currentUserId. Visuals must align with Material Design standards (Roboto font, Red accents, Pill-shaped buttons).

2. Global UI/UX Standards
Font: Roboto (Google Fonts). This is non-negotiable for the YouTube look.
Theme: Standard Light Mode (White background #FFFFFF) with Dark Mode utility support.
Icons: react-icons/md (Material Design) or react-icons/si (Simple Icons for brand logos).
Colors: YouTube Red (#FF0000), Dark Gray (#0F0F0F for text), Light Gray (#F2F2F2 for backgrounds/pills).
Scrollbars: Hidden globally.

3. Navigation Structure
Bottom Tab Bar (Fixed, White Background):
Home: (Home Icon).
Shorts: (The specific "S" logo outline).
Create: (Circle with + icon, centered).
Subscriptions: (Stacked rectangles icon).
You: (User Avatar Icon - replaces the old "Library" text).

4. Detailed Feature Requirements
4.1 Home Tab (The Discovery Engine)
Header (Sticky Top):
Left: YouTube Logo (Icon + Text).
Right (Flex Row): Cast Icon, Bell Icon (Notifications), Search Magnifier.
Categories Bar (Filter Chips):
Horizontal scroll below header.
First Item: Compass Icon (Explore).
Chips: "All", "Gaming", "Music", "Live", "Mixes", "Programming".
UI: Gray pill background, turns Black (inverted) when active.
Feed List:
Video Card Component:
Thumbnail: Full width of the phone screen (aspect ratio 16:9).
Duration Badge: Black rounded box (e.g., 10:35) bottom-right of thumbnail.
Meta Row:
Left: Channel Avatar.
Center: Title (2 lines max, ellipsis), Channel Name • Views • Relative Time (e.g., "2M views • 3 days ago").
Right: Three dots (Vertical).
Auto-Play: After 1 second of hovering (or pausing scroll), the video plays silently in the thumbnail with captions enabled.
4.2 Watch Page (The Player)
Transition: Pushes onto the stack (covers bottom nav).
Video Player Container (Top):
Standard 16:9 aspect ratio.
Controls: Play/Pause center overlay, Red progress bar, Fullscreen toggle.
Video Details (Below Player):
Title: Bold text. Collapsible chevron on the right.
Meta Info: "1.2M views • 1 year ago" text.
Channel Row:
Left: Avatar + Name + Subscriber Count.
Right: "Subscribe" button (Black pill shape, turns gray "Subscribed" + bell animation on click).
Action ScrollView: A horizontal scrolling row of buttons (Pill shaped, Gray background):
[Thumbs Up (Icon + Count) | Thumbs Down (Icon)] (Joined pill).
[Share].
[Remix].
[Download].
Description Box:
Gray rounded rectangle. Shows top 2 lines of description.
Clicking opens "Description View" overlay.
Comments Teaser:
A block showing: "Comments 405" and the Top Comment snippet.
Action: Clicking opens the Comments Bottom Sheet (half-height modal).
Up Next (Recommendations):
Infinite list of "Video Cards" (smaller version) below the details.
4.3 Shorts Tab
UI: Full-screen immersive (similar to Instagram Reels but distinctive).
Top Header: "Shorts" text, Search, Camera icon, Menu.
Action Overlay (Right Side):
Thumbs Up: Filled icon when active (unlike Insta heart).
Thumbs Down: Explicit dislike button.
Comment: Chat bubble.
Share: Arrow.
Remix: Sound wave icon.
Metadata Overlay (Bottom):
Channel Name + "Subscribe" Button (Red rect) inline.
Caption text.
Music ticker.
4.4 Search Page
Input: Back Arrow (Left), Search Input (Center), Mic Icon (Right).
State 1 (Focus): List of "History" terms with clock icons.
State 2 (Results): Vertical list.
Channel Result: Round avatar, Subscriber count, "Subscribe" button.
Video Results: Standard Video Cards.
4.5 "You" Tab (Profile/Library)
Header: Large Avatar + Name + Handle (@username).
History: "History" label + Horizontal scroll of recently watched videos.
Playlists: Vertical list (Your Videos, Watch Later, Liked Videos).
Stats: (For this clone) Show total Time Watched calculated from the analytics.

5. Analytics & Data Collection
This app serves as a data gathering tool. The backend must support these specific metrics.
Database Model: YTAnalytics
Watch Session (Precision Tracking):
Trigger: User starts a video.
Logic:
startTime: Timestamp.
endTime: Timestamp (updated on page leave/pause).
pausedDuration: Accumulator.
completed: Boolean (Did they reach >90%?).
Save: userId, videoId, category, actualWatchDuration.
Interaction Map:
Metrics: Likes, Dislikes (unique to YT), Subscribes.
Context: Did the user subscribe from the Shorts player or the Main Watch Page? (Track source field).
Search Intent:
Log every search term entered to analyze user interests.