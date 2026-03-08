- Implement a gentle onboarding sequence. When a user first logs in, auto-generate 3-4 "sample tasks" (e.g., "Schedule a meeting", "Pay bills") placed in different quadrants. Include a brief tooltip walkthrough highlighting where to drop tasks and how the "Do First" vs. "Schedule" mechanics work.

- Introduce a Floating AI Assistant (FAB) or a globally accessible Command Palette (Cmd+K). This allows users to summon Gemini from any page to quickly say "Remind me to buy groceries for tomorrow", which seamlessly creates a task without leaving their current view. Furthermore, ensure the "Quick Add" dialog has a universal keyboard shortcut (e.g., Cmd+N).

- The features pages endpoint is /ideas. It should be /features.

- Add a parentId relation to the Task schema to support Parent-Child Relationships (Subtasks). Allow users to open a Task dialog and add bite-sized checklists. This keeps the high-level matrix clean while ensuring they can track step-by-step execution linearly.

- Enhance the /focus page or the TaskCard with a built-in Pomodoro / Stopwatch timer. When the user clicks "Start Focus", the app ticks up the minutes and automatically saves them to actualMinutes upon completion. This removes the friction of manual data entry and makes your new "Focus Session Efficiency" chart infinitely more accurate and enjoyable to populate.
