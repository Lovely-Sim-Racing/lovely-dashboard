<p align="center">
<img width="150" height="150" alt="Lovely Sim Racing" src="docs/images/lr-logo-small.png">
</p>

<h1 align="center">Lovely SimHub Dashboard</h1>

<p align="center">
A multifunctional feature packed SimHub Dashboard (DDU) and a matching Stream Overlay.
</p>
 
<br/>

## Settings
As of version 1.5.4, the Lovely Dashboard can also be setup to your liking. 


## Installing
You will need to copy the file `Lovely-Dashboard_settings.json` into `./SimHub/JavascriptExtensions`. 

![Copy the settings file into the JavascriptExtensions folder](docs/images/settings-file.png)

## Editing the settings

To change your personal settings, you will need to edit the `Lovely-Dashboard_settings.json` file in any text editor. The available settings are:

#### `driverName`
You can change the way the Driver Name is formatted and displayed.

- `0` (Default) - Will display names as "**F. Lastname**"
- `1` Will display names as "**Firstname L.**"

#### `lapReview`
Choose when the Lap Review Alert should appear.

- `0` **Never** show the Lap Review Alert
- `1` (Default) - **Qualifying** & **Practice** - This will only show the Lap Review Alert during **Qualifying** & **Practice** sessions
- `2` **Always** - Will show the Lap Review Alert on every lap

#### `lapReviewDelay`
Set how much time in milliseconds to display the Lap Review Alert. (eg. 1000 = 1 second)

- `5000` (Default) - Display the Lap Review Alert for 5 seconds

**:information_source: If you do not copy the settings file, the default values will be used.**