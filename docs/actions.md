<p align="center">
<img width="150" height="150" alt="Lovely Sim Racing" src="./images/lr-logo-small.png">
</p>

<h1 align="center">SimHub Action Triggers</h1>
 
<br/>

Actions in SimHub provide a way to interact with the dashboard, offfering many way to customise the Lovely Dashboard experience. 

In SimHub, depending on your device (Touch or Hardware Buttons) you will need to assign the Actions to buttons on your Steering Wheel or Button Box. You can choose whatever suits your personal needs.

# Add your device
As of **SimHub v9+**, all devices should be added to the Devices section.

1. Navigate to the `Devices` tab on the left hand menu
2. If your device is not already present, tap on `Add new device`
	* For **Mobiles & Tablets**: Select `Web Device`
	* For **DDU's, Steering Wheels etc**: Select your device from the list
	* For **Generic Devices**: Select `Generic Vocore Screen`

# Setup Touch Triggers
> [!TIP]
> For all devices wth **Touch Inputs** (Mobile Phones, Tablets, DDUs with Touch Screens etc) 
 
The Lovely Dashboard is pre-configured out-of-the-box to work with touch gestures. 

#### Setup your device
1. In **SimHub**, navigate to `Devices` on the left hand menu
2. Select `'Your Device'`
3. In `'Your Device' > LCD` tab, enable `Touch screen` and select `Advanced touch mode`
4. In `'Your Device' > Controls` tab, **Clear** all settings that may exist
6. **Done**

#### Using the controls
The areas which you can use to control your Lovely Dashboard are shown below.

![Pre-Defined Triggers](./images/PrimaryActionsOnlyTouch.png)

# Setup Physical Buttons
> [!TIP]
> For all devices (Touch and non-touch enabled)

If you prefer to control your device with physical buttons, you can assign specific actions to your Steering Wheel, Button Box etc.

#### Setup device
1. In **SimHub**, navigate to `Devices` on the left hand menu
2. In `'Your Device' > Controls` tab, select `Click to configure` next to the action you want
3. Click on the trigger (button) you want to assign and hit `Save`
4. Repeat for each action. We recommend the following actions
	* `Show next screen`
	* `Trigger dash action A`
	* `Trigger dash action B`
	* `Trigger dash action C`
	* `Trigger dash action D`
5. **Done**

#### Using the controls
Clicking on any of the physical buttons you just assigned, should change the screen, as shown below.

![Pre-Defined Triggers](./images/PrimaryActionsOnly.png)

# Setup Hot keys
> [!TIP]
> Hot-Keys Enable extra features like True Dark Mode on all simulators!

There are a few cases where setting up a Hot-Key will come in handy. The latest version of the Lovely Dashboard (v2.6.0) has new features that require a Hot-Key in order for them to trigger.

A Hot-Key is a keyboard combination that triggers an action inside the Lovely Dashboard, just like CTRL+C is used to Copy an item on your PC. To use Hot-Keys in Simhub, you will need to enable two Plugins in Simhub.

### Step 1
Navigate to `Simhub > Settings > Plugins` and enable the following plugins:

* `Keyboard Emulator`
* `Keyboard Input`

![Hot-Key Plugins](./images/simhub-plugins-hotkey.png)

### Step 2
Navigate to `Controls and events > Keyboard Emulation` and add the mappings you want. By default, the Dashboard uses:

* `Shift+A` Reset the AVG Tire data
* `Shift+D` Toggles the True Dark Mode

You can now continue to `Add mapping` in Simhub. Here's an example of my settings:

![Keybard Emulation Example](./images/simhub-emulator.png)

> [!WARNING]
> If these hot-keys conflict with other commands on your system you can change them in the [Settings File](settings.md), and make sure to update the mappings above.