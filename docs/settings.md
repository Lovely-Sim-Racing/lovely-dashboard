<p align="center">
<img width="150" height="150" alt="Lovely Sim Racing" src="./images/lr-logo-small.png">
</p>

<h1 align="center">Lovely Dashboard Settings</h1>

<p align="center">
The <strong>Lovely Dashboard</strong> can be customised to your personal preferences in many ways.
</p>
 
<br/>

> [!WARNING]
> **As of v2.0.0+ of the Lovely Dashboard**, you must update your Settings File to the latest version. The actual Settings File format has changed. Failing to update the Settings File will cause problems to the functionality of the Lovely Dashboard.


## Settings File
To customise the **Lovely Dashboard**, you will need to copy the Settings File (`Lovely-Dashboard_settings.json`) into the `./SimHub/JavascriptExtensions`. You can find and download the latest **Settings File** in the [Releases](https://github.com/cdemetriadis/lovely-dashboard/releases) section.

![Copy the settings file into the JavascriptExtensions folder](./images/settings-file.png)

## Editing the settings

### Use the Online Settings File Configurator
You can use the new online Settings File Configurator, to create a **new Settings File** from scratch or **update your existing** one.

[![Settings File Configurator](./images/settings-file-button.png)](https://lsr.gg/configurator)

### Direct File Edit
You can also directly edit the Settings File with a text editor of your choice (we recommend VS Code or NotePad++). To change your personal settings, you will need to edit the `Lovely-Dashboard_settings.json`.

> [!WARNING]
> Every time you make a change in the Settings File, you will need to restart your Dashboard. The Settings File is always loaded into the dashboard memory for better performance.

> [!TIP]
> If you do not copy the settings file, the default values will be used

## Settings
The settings will work for the **Lovely Dashboard**, **Lovely Dashboard XL** and **Lovely Overlay**. 

* [Analytics](#analytics)
* [Idle Screen Personalisation](#idle-screen-personlisation)
* [Platform Integrations](#platform-integrations)
* [UI Customisation](#ui-customisation)
* [Night Mode](#night-mode)
* [True Dark Mode](#true-dark-mode)
* [Alerts](#alerts)
* Sim Specific Settings
	* [Assetto Corsa Competizione](#acc-assetto-corsa-competizione)
	* [Assetto Corsa](#ac-assetto-corsa)
	* [iRacing](#iracing-iracing)
	* [Autmobilista 2](#automobilista2-automobilista-2)
	* [rFactor 2](#rfactor2-rfactor-2)
	* [Formula 1](#f1-formula-1)
	* [Generic](#generic)
* Manufacturer Settings
	* [Ascher Racing](#ascherRacing-ascher-racing)
	  * Left Dial
	  * Right Dial


---

### Analytics

#### `analytics`
Enable anonymous data usage of the Dashboard. Going forward, the Lovely Dashboard will rely on this data in order to improve the experience and understanding the usage. **It is recommended to turn this on.**

- `0` Disabled: no data is collected
- **`1` (Recommended)** - Enabled: anonymous data is collected 

---

### Idle Screen Personlisation

#### `yourName`, `yourNumber`
Setup the custom splash screen with your Name & Number. If you do not specify a name and number, the default idle screen will be displayed. You can use a blank space to hide these, exposing only the backgroud image (`yourLogo`).

#### `yourColor`
If you've set a Name & Number, you can also change it to your Color. You can use any web safe name or hex code 

* Example: `Light Blue` or`#2B98FB`

#### `yourLogo`
Setup the custom idle screen with your Logo or Image. The image file path must be relative to the SimHub folder, eg `./JavascriptExtensions`. Recommended image size is `800 x 270px`, but it will scale to fit. The image can be used alongside your Name and Number as a background, or on its' own by not using a Name and Number at all.

* Example:  `./JavascriptExtensions/lovely-dash-bg.jpg`

--

### Platform Integrations

#### `lfmID`
Display your Low Fuel Motorsport next session countdown and information on the Lovely Dashboard.

- You can find your LFM ID in the URL of your profile page on [Low Fuel Motorsports](https://lowfuelmotorsport.com)

#### `pitskillID`
Display your Pitskill.io next session countdown and information on the Lovely Dashboard.

- You can find your **Pitskill.io License ID** on your "My Racing License" page on [Pitskill.io](https://pitskill.io/)

---

### UI Customisation

#### `driverName`
You can change the way the Driver Name is formatted and displayed.

- **`1` (Default)** - Will display names as "**F. Lastname**"
- `2` Will display names as "**Firstname L.**"
- `3` Will display names as "**Firstname Lastname**"

---

#### `rpmLED`
Display virtual RPM LEDs within the Lovely Dashboard. Ideal for those who do not run the dashboard on a mobile phone or tablet, that does not have built in LEDs.

- **`0` (Default)** - Hide virtual RPM LEDs
- `1` Show virtual RPM LEDs

---

#### `estimatedTimeMode`
Select the Timing Methods used within the Dashboards

- `0` - Standard (Less accurate but matches in-game timings)
- **`1` (Default)** - Advanced (Advanced - Accurate & works with multi driver events)

---

#### `clutchMode`
Display the Clutch Value (0-100). This is great for defining the bite point.

- `0` Hide Clutch Value
- **`1` (Default)** Show only when clutch is engaged
- `2` Always Show

---

#### `showFlags`
You can enable or disable the track flags in the top left module.

- `0` Hide Flags
- **`1` (Default)** Show Flags

---

#### `mapType`
Change the map type on the Map Screen, between a static or animated map

- **`1` (Default)** Static Map
- `2` Animated Map

#### `mapTypeMFM`
Change the map type in the MFM, between a static or animated map

- `1` Static Map
- **`2` (Default)** Animated Map

#### `mapZoom`
If `mapType` is set to animated, you can select the unzoom percentage. The faster you go, the more the map zooms-out.

- **`30` (Default)** (0 - 100) The larger the number, the more zoomed-out the map gets

---

#### `uiMode`
Set the UI mode intensity and change the line brightness throughout the dashbaord.

- `1` Low
- `2` Medium
- **`3` (Default)** High

#### `uiRadius`
Change the dashboard's outer corner radii to match that of your physical device.

- **`45` (Default)** Pixel Radius of outer corners, suggested size Min:12 - Max:50

---

### Night Mode

#### `nightMode`
For sims that support night races and provide info on Lights (currently ACC and AMS2), when you turn on the lights, it will activate a dimmer view of the dashboard. You can enable this or disable this feature:

- `0` Disabled: Will always remain bright
- **`1` (Default)** Enabled: Will dim the screen when lights are on

---

### True Dark Mode

#### `trueDarkMode`
Enable or disable True Dark Mode for your Lovely Dashboard & Lovely Dashboard XL. You can also define the True Dark Mode colour.

- `0` Disabled: your dashboard will not go into True Dark Mode
- **`1` (Default)** Red
- `2` Blue
- `3` Purple
- `4` Orange

#### `trueDarkModeNative`
When a simulator has more than one light stage, you can enable `trueDarkModeNative` which will use the high beam stage to activate True Dark Mode. Currently, only Assetto Corsa Competizione supports this feature, but not all cars do. Be careful, and test your car before enabling this feature.

- `0` (Default) Disabled: Will always use the Hot-Key as a trigger.
- **`1` (Default)** Enabled: Will use the second light stage as a trigger.
        
#### `trueDarkModeHotKey`
Set a hot-key to enable True Dark Mode. 

- **`Alt+Shift+D` (Default)**

> [!NOTE]
> Requires `Settings > Plugins > Keyboard Emulator` & `Keyboard Input` Plugin enabled in Simhub.

---

#### `tireLapAvg`
Specify the number of laps to collect tire data.

- **`2` (Default)** - The number of laps to collect tire data

#### `tireLapAvgResetKey` (Experimental)
Set a hot-key to reset the AVG Tire data. 

- **`Alt+Shift+A` (Default)** - The hot-key or key-combination of your choice

:warning: **Warning:** This is still a bit buggy. If the data does not resume collecting, you will need to restart your DDU/Device.

> [!NOTE]
> Requires `Settings > Plugins > Keyboard Emulator` & `Keyboard Input` Plugin enabled in Simhub.

---

### Alerts

#### `lapReview`
Choose when the Lap Review Alert should appear.

- `0` Never show the Lap Review Alert
- **`1` (Default)** - **Qualifying** & **Practice** - This will only show the Lap Review Alert during **Qualifying** & **Practice** sessions
- `2` Always - Will show the Lap Review Alert on every lap

#### `lapReviewDelay`
Set how much time in milliseconds to display the Lap Review Alert. (eg. 1000 = 1 second)

- **`5000` (Default)** - Display the Lap Review Alert for 5 seconds

---

#### `deltaReview`
Show or hide the delta and sector review for the previous lap review

- `0` Off
- **`1` (Default)** On

#### `deltaReviewDelay`
Set how much time in milliseconds to display the Sector Delta Review. (eg. 1000 = 1 second)

- **`5000` (Default)** - Display the Sector Delta Review for 5 seconds

---

#### `alertView`
Display the Alert Views (TC, ABS, MAP etc)

- `0` Off - Do not display any Alerts
- **`1` (Default)** Normal full width size
- `2` Mini size

#### `alertDelay`
Set how much time in milliseconds to display the Alert Views. (eg. 1000 = 1 second)

- **`5000` (Default)** - Display the Alert Views for 5 seconds

---

#### `damageAlert`
Display the Damage Alert every time there is a change in the overall vehicle damage.

- `0` Off
- **`1` (Default)** On

#### `damageAlertDelay`
Set how much time in milliseconds to display the Damage Alert. (eg. 1000 = 1 second)

- **`7500` (Default)** - Display the Damage Alert for 7.5 seconds

---

#### `pitAlert`
The interface changes to a blue color, indicating that you are in the Pit Lane.

- **`0` (Default)** Off
- `1` On

#### `pitLarge`
Display the large Pit Limiter alert

- **`0` (Default)** Off
- `1` On

#### `ignitionOff`
Enable the Ignition Off screen for increased immersion

- **`0` (Default)** Off
- `1` On

---

### Sim Specific Settings
Set the active & default MFM pages for each sim seperately.

### `ACC` Assetto Corsa Competizione

**Left, Right & Overlay Multi Function Module (MFM)**

### Active Pages

#### `activeLeftMFM: "0,1,2,3"` `activeRightMFM: "4,5,6,8"`

* `0` Lap Times
* `1` Sectors
* `2` Relative
* `3` Standings
* `4` Tires
* `5` Tire AVG
* `6` Damage
* `8` Map
* `9` Opponents

### Default Pages

#### `leftMFM: 4` `rightMFM: 0` `overlayMFM: 0`

* **`0` Lap Times**
* `1` Sectors
* `2` Relative
* `3` Standings
* **`4` Tires**
* `5` Tire AVG
* `6` Damage
* `8` Map
* `9` Opponents

**Central**

#### `centralModule: 0`
* **`0` Full**
* `1` Simple (no lap delta)
* `2` Time (displays a real worl clock on top)
* `3` Speedometer (prioritise the speedometer)

**Fuel Calculator**

#### `fuelModule: 0`
* **`0` Fuel Data**
* `1` Fuel Time Left
* `2` Refuel Calculator (Refuel or Finish Line)

---

### `AC` Assetto Corsa

**Left, Right & Overlay Multi Function Module (MFM)**

### Active Pages

#### `activeLeftMFM: "0,1,2,3"` `activeRightMFM: "4,5,6,8"`

* `0` Lap Times
* `1` Sectors
* `2` Relative
* `3` Standings
* `4` Tires
* `5` Tire AVG
* `6` Damage
* `8` Map
* `9` Opponents

### Default Pages

#### `leftMFM: 4` `rightMFM: 0` `overlayMFM: 0`

* **`0` Lap Times**
* `1` Sectors
* `2` Relative
* `3` Standings
* **`4` Tires**
* `5` Tire AVG
* `6` Damage
* `8` Map
* `9` Opponents

**Central**

#### `centralModule: 0`
* **`0` Full**
* `1` Simple (no lap delta)
* `2` Time (displays a real worl clock on top)
* `3` Speedometer (prioritise the speedometer)

**Fuel Calculator**

#### `fuelModule: 0`
* **`0` Fuel Data**
* `1` Fuel Time Left
* `2` Refuel Calculator (Refuel or Finish Line)

---

### `IRacing` iRacing

**Left, Right & Overlay Multi Function Module (MFM)**

### Active Pages

#### `activeLeftMFM: "0,1,2,3"` `activeRightMFM: "4,7,8"`

* `0` Lap Times
* `1` Sectors
* `2` Relative
* `3` Standings
* `4` Tires
* `7` Status
* `8` Map
* `9` Opponents

### Default Pages

#### `leftMFM: 7` `rightMFM: 0` `overlayMFM: 0`

* **`0` Lap Times**
* `1` Sectors
* `2` Relative
* `3` Standings
* `4` Tires
* **`7` Status**
* `8` Map
* `9` Opponents

**Central**

#### `centralModule: 0`
* **`0` Full**
* `1` Simple (no lap delta)
* `2` Time (displays a real worl clock on top)
* `3` Speedometer (prioritise the speedometer)

**Fuel Calculator**

#### `fuelModule: 0`
* **`0` Fuel Data**
* `1` Fuel Time Left
* `2` Refuel Calculator (Refuel or Finish Line)

---

### `Automobilista2` Automobilista 2

**Left, Right & Overlay Multi Function Module (MFM)**

### Active Pages

#### `activeLeftMFM: "0,1,2,3"` `activeRightMFM: "4,5,7,8"`

* `0` Lap Times
* `1` Sectors
* `2` Relative
* `3` Standings
* `4` Tires
* `5` Tire AVG
* `7` Status
* `8` Map
* `9` Opponents

### Default Pages

#### `leftMFM: 4` `rightMFM: 0` `overlayMFM: 0`

* **`0` Lap Times**
* `1` Sectors
* `2` Relative
* `3` Standings
* **`4` Tires**
* `5` Tire AVG
* `7` Status
* `8` Map
* `9` Opponents

**Central**

#### `centralModule: 0`
* **`0` Full**
* `1` Simple (no lap delta)
* `2` Time (displays a real worl clock on top)
* `3` Speedometer (prioritise the speedometer)

**Fuel Calculator**

#### `fuelModule: 0`
* **`0` Fuel Data**
* `1` Fuel Time Left
* `2` Refuel Calculator (Refuel or Finish Line)

---

### `RFactor2` rFactor 2

**Left, Right & Overlay Multi Function Module (MFM)**

### Active Pages

#### `activeLeftMFM: "0,1,2,3"` `activeRightMFM: "4,5,8"`

* `0` Lap Times
* `1` Sectors
* `2` Relative
* `3` Standings
* `4` Tires
* `5` Tire AVG
* `8` Map
* `9` Opponents

### Default Pages

#### `leftMFM: 4` `rightMFM: 0` `overlayMFM: 0`

* **`0` Lap Times**
* `1` Sectors
* `2` Relative
* `3` Standings
* **`4` Tires**
* `5` Tire AVG
* `8` Map
* `9` Opponents

**Central**

#### `centralModule: 0`
* **`0` Full**
* `1` Simple (no lap delta)
* `2` Time (displays a real worl clock on top)
* `3` Speedometer (prioritise the speedometer)

**Fuel Calculator**

#### `fuelModule: 0`
* **`0` Fuel Data**
* `1` Fuel Time Left
* `2` Refuel Calculator (Refuel or Finish Line)

---

### `F1` Formula 1

**Left, Right & Overlay Multi Function Module (MFM)**

### Active Pages

#### `activeLeftMFM: "0,1,2,3"` `activeRightMFM: "4,5,6,7,8"`

* `0` Lap Times
* `1` Sectors
* `2` Relative
* `3` Standings
* `4` Tires
* `5` Tire AVG
* `6` Damage
* `7` Status
* `8` Map
* `9` Opponents

### Default Pages

#### `leftMFM: 4` `rightMFM: 0` `overlayMFM: 0`

* **`0` Lap Times**
* `1` Sectors
* `2` Relative
* `3` Standings
* **`4` Tires**
* `5` Tire AVG
* `6` Damage
* `7` Status
* `8` Map
* `9` Opponents

**Central**

#### `centralModule: 0`
* **`0` Full**
* `1` Simple (no lap delta)
* `2` Time (displays a real worl clock on top)
* `3` Speedometer (prioritise the speedometer)

**Fuel Calculator**

#### `fuelModule: 0`
* **`0` Fuel Data**
* `1` Fuel Time Left
* `2` Refuel Calculator (Refuel or Finish Line)

---

### `generic` For all not supported titles

**Left, Right & Overlay Multi Function Module (MFM)**

### Active Pages

#### `activeLeftMFM: "0,1,2,3"` `activeRightMFM: "4,5,6,7,8"`

* `0` Lap Times
* `1` Sectors
* `2` Relative
* `3` Standings
* `4` Tires
* `5` Tire AVG
* `6` Damage
* `7` Status
* `8` Map
* `9` Opponents

### Default Pages

#### `leftMFM: 4` `rightMFM: 0` `overlayMFM: 0`

* **`0` Lap Times**
* `1` Sectors
* `2` Relative
* `3` Standings
* **`4` Tires**
* `5` Tire AVG
* `6` Damage
* `7` Status
* `8` Map
* `9` Opponents

**Central**

#### `centralModule: 0`
* **`0` Full**
* `1` Simple (no lap delta)
* `2` Time (displays a real worl clock on top)
* `3` Speedometer (prioritise the speedometer)

**Fuel Calculator**

#### `fuelModule: 0`
* **`0` Fuel Data**
* `1` Fuel Time Left
* `2` Refuel Calculator (Refuel or Finish Line)

---

### Manufacturer Settings
Set the Labels fro teh Rotary Dials on your Ascher Racing Artura Series steering wheel.

### `ascherRacing` Ascher Racing

#### `leftDial`
* `pos1` **B.BIAS** - Label for position 1
* `pos2` **TC** - Label for position 2
* `pos3` **TC2** - Label for position 3
* `pos4` **ABS** - Label for position 4
* `pos5` **MAP** - Label for position 5
* `pos6` **ERS** - Label for position 6
* `pos7` **DEPLOY** - Label for position 7
* `pos8` **F-ARB** - Label for position 8
* `pos9` **R-ARB** - Label for position 9
* `pos10` **DIFF ENT** - Label for position 10
* `pos11` **DIFF MID** - Label for position 11
* `pos12` **DIFF EXT** - Label for position 12

#### `rightDial`
* `pos1` **DISP** - Label for position 1
* `pos2` **FAN** - Label for position 2
* `pos3` **SHKR** - Label for position 3
* `pos4` **PAGE** - Label for position 4
* `pos5` **GAME** - Label for position 5
* `pos6` **SPOT** - Label for position 6
* `pos7` **CHAT** - Label for position 7
* `pos8` **BBOX** - Label for position 8
* `pos9` **CAM** - Label for position 9
* `pos10` **PIT 5|6** - Label for position 10
* `pos11` **PIT 3|4** - Label for position 11
* `pos12` **PIT 1|2** - Label for position 12
