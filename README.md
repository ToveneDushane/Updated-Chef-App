Change Log — “Restaurant Menu App” (Updated Version with Drinks)
1. Added a new category: “Drinks”

Before: The menu only had three courses — Starters, Mains, and Dessert
Now: Added a fourth course, Drinks, everywhere it’s needed:
In the initialMenuItems array
In the courses array
In the FilterMenuScreen picker options
In the average price calculations on the Home screen

2. Added new drink items
Added two new objects inside initialMenuItems

3. Updated average price display
The Home screen now calculates and displays an average price for Drinks, using: <Text>Average Price for Drinks: R{calculateAveragePrice(menuItems, 'Drinks')}</Text>

4. Updated calculateAveragePrice function
Function remains the same, but it now supports an additional course value: 'Drinks'.

5. Updated courses array

Added “Drinks” as an option for the Picker in ManageMenuScreen:
const courses = ['Starters', 'Mains', 'Dessert', 'Drinks'];

6. Updated the FilterMenuScreen Picker

Added a <Picker.Item> for “Drinks”:
<Picker.Item label="Drinks" value="Drinks" />

7. Updated visuals

Background color retained: #F6C27A (the peach brown tone you picked)
Images on each screen are unchanged but still appropriate for the new structure.

8. No breaking changes

Navigation structure (Home, ManageMenu, FilterMenu) remains the same.
State management (useState) and FlatList behavior remain identical — they now simply handle more menu categories.

Made it more user friendly as per the instractions from the lecturer.
