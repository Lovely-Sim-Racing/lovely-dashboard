<p align="center">
<img width="150" height="150" alt="Lovely Sim Racing" src="./images/lr-logo-small.png">
</p>

<h1 align="center">Lovely Dashboard Settings</h1>

<p align="center">
As of version 1.5.4, the <strong>Lovely Dashboard</strong> can be setup to your personal preferences.
</p>
 
<br/>

## Settings File
You will need to copy the file `Lovely-Dashboard_settings.json` into `./SimHub/JavascriptExtensions`. 

![Copy the settings file into the JavascriptExtensions folder](./images/settings-file.png)

## Editing the settings

To change your personal settings, you will need to edit the `Lovely-Dashboard_settings.json` file in any text editor. 

**:information_source: If you do not copy the settings file, the default values will be used.**

The available settings are:

---

#### `yourName`, `yourNumber`
Setup the custom splash screen with your Name & Number. If you do not specify a name and number, the default splash screen will be displayed.

#### `yourColor`
Setup the custom splash screen with your Color. You can use any web safe name or hex code eg. `#2B98FB`

---

#### `driverName`
You can change the way the Driver Name is formatted and displayed.

- `0` (Default) - Will display names as "**F. Lastname**"
- `1` Will display names as "**Firstname L.**"

---

#### `lapReview`
Choose when the Lap Review Alert should appear.

- `0` **Never** show the Lap Review Alert
- `1` (Default) - **Qualifying** & **Practice** - This will only show the Lap Review Alert during **Qualifying** & **Practice** sessions
- `2` **Always** - Will show the Lap Review Alert on every lap

#### `lapReviewDelay`
Set how much time in milliseconds to display the Lap Review Alert. (eg. 1000 = 1 second)

- `5000` (Default) - Display the Lap Review Alert for 5 seconds

---

#### `alertView`
Display the Alert Views (TC, ABS, MAP etc)

- `0` (Default) **Normal** full width size
- `1` **Mini** size
- `2` **Off** - Do not display any Alerts

#### `alertDelay`
Set how much time in milliseconds to display the Alert Views. (eg. 1000 = 1 second)

- `1000` (Default) - Display the Alert Views for 1 second

---

#### `clutchMode`
Display the Clutch Value

- `0` Always Off
- `1` (Default) Show when engaged
- `2` Always On

---

#### `showFlags`
You can enable or disable the track flags in the top left module.

- `0` (Default) Show Flags
- `1` Hide Flags

---

#### `mapType`
Change the map type, between two avaialble options

- `0` (Default) Static Map
- `1` Animated Map

---

#### `uiMode`
Set the UI mode intensity and change the line brightness throughout the dashbaord.

- `0` Low
- `1` Medium
- `2` (Default) High