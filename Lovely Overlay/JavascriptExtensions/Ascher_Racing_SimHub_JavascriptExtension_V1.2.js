/*
author: Martin Ascher

#######################################################
##############    GENERAL INFORMATION    ##############
#######################################################

This Javascipt Extension is separately included in:
	- Ascher Racing Artura Buttons	[ledsprofile]
	- Ascher Racing Dashboard 		[ledsprofile]
	- Ascher Racing Dashboard 		[simhubdash]
	
Separation is necessary to make sure all products work out of the box individually.
Updated need to be pushed to all products affected.


#######################################################
##########    SC wireless wheel connection    #########
#######################################################

SC wireless wheels can be connected to both receivers:
	- SC2 Sport, Pro, ULTIMATE
	- SC-Link (Simucube Active Pedals)
	
If both receivers are available, connect the wheel to the SC2!


#######################################################
###################    CHANGELOG    ###################
#######################################################

V1.2:
	bug fix:
	- falsely triggered F64-USB rotary modifier mode

V1.1:
	bug fix:
	- Artura PRO-SC rotary modifier modes
	- shift RPMs:
		Super Formula

	feature:
	- Simucube Link compatibility
	- shift RPMs:
		Audi R8 LMS EVO II GT3
		Audi RS 3 LMS TCR
		FIA F4
		Hyundai Veloster N TCR
		Lamborghini Huracan GT3 EVO
		McLaren 570S GT4
		Super Formula Lights
		
	- function prefix "AR_"


V0.5:
	- code optimizations

V0.4:
	- added VID PID information for later use

V0.3:
	- function get_rpm_leds_per_gear: adjusted num_leds and ranges


V0.2:
	- initial release

*/


function AR_get_SteeringWheel() {		// detect the steering wheel that is currently in use
    // initialize global variable
    if (root["steering_wheel"] == null) {
        root["steering_wheel"] = "n/a";
    }

    // Steering wheel detection based on axis availability
    const joystickProps = [
        { prop: 'JoystickPlugin.Ascher_Racing_Artura_GT4_X', wheel: 'Artura_GT4' },
        { prop: 'JoystickPlugin.Ascher_Racing_Artura_SPORT_X', wheel: 'Artura_SPORT' },
        { prop: 'JoystickPlugin.Ascher_Racing_Artura_PRO_X', wheel: 'Artura_PRO' },
        { prop: 'JoystickPlugin.Ascher_Racing_Artura_ULTIMATE_X', wheel: 'Artura_ULTIMATE' },
        { prop: 'JoystickPlugin.Ascher_Racing_F64_X', wheel: 'F64-USB' },
        { prop: 'JoystickPlugin.Simucube_2_Sport_RZ', wheel: 'SC2_Sport_wireless_wheel' },
        { prop: 'JoystickPlugin.Simucube_2_Pro_RZ', wheel: 'SC2_Pro_wireless_wheel' },
        { prop: 'JoystickPlugin.Simucube_2_Ultimate_RZ', wheel: 'SC2_Ultimate_wireless_wheel' },
		{ prop: 'JoystickPlugin.SC-Link_Hub_RZ', wheel: 'SC_Link_Hub_wireless_wheel' },
    ];

    for (const { prop, wheel } of joystickProps) {
        if ($prop(prop) != null) {
            root["steering_wheel"] = wheel;
            return wheel;
        }
    }

    // If none of the steering wheels are detected
    root["steering_wheel"] = "n/a";
    return root["steering_wheel"];

    /*
    VID PID information

    0x1DD2,0x214E	-> F64-USB
    0x35EE,*		-> all Artura-USB models
	0x35EE,0x1049	-> Artura GT4
	0x35EE,0x1051	-> Artura SPORT-USB
	0x35EE,0x1053	-> Artura PRO-USB
	0x35EE,0x1054	-> Artura ULTIMATE
	0x16D0,0x0D66	-> Simucube Link
    0x16D0,0x0D61	-> SC2 Sport
    0x16D0,0x0D60	-> SC2 Pro
    0x16D0,0x0D5F	-> SC2 Ultimate
    */
}

function AR_get_buttonID() {	// definition of button IDs as shown in InputStatus.JoystickPlugin
    return {
        Artura_rotary_left_start: 30,
        Artura_rotary_left_shift_start: 80,
        Artura_rotary_right_start: 42,
        Artura_rotary_right_shift_start: 104,
        F64_rotary_left_start: 30,
        F64_rotary_right_start: 42,
        SC2_rotary_left_start: 104,
        SC2_rotary_left_shift_start: 52,
        SC2_rotary_right_start: 116,
        SC2_rotary_right_shift_start: 76,
		SC_Link_Hub_rotary_left_start: 96,
        SC_Link_Hub_rotary_left_shift_start: 44,
        SC_Link_Hub_rotary_right_start: 108,
        SC_Link_Hub_rotary_right_shift_start: 68,
    };
}

function AR_get_rotary_left_pos() {
    const steering_wheel = AR_get_SteeringWheel();
    const button_ID = AR_get_buttonID();

    if (root["rotary_left_pos"] == null) {
        root["rotary_left_pos"] = "INIT";
    }

    const checkRotaryPosition = (start, prefix) => {
        for (let i = start; i < start + 12; i++) {
            if ($prop(`InputStatus.JoystickPlugin.${prefix}_B${i}`) == 1) {
                root["rotary_left_pos"] = i - start + 1; // 1 - 12
            }
        }
    };

    switch (steering_wheel) {
        case "Artura_GT4":
            checkRotaryPosition(button_ID.Artura_rotary_left_start, "Ascher_Racing_Artura_GT4");
            break;
        case "Artura_PRO":
            checkRotaryPosition(button_ID.Artura_rotary_left_start, "Ascher_Racing_Artura_PRO");
            break;
        case "Artura_ULTIMATE":
            checkRotaryPosition(button_ID.Artura_rotary_left_start, "Ascher_Racing_Artura_ULTIMATE");
            break;
        case "F64-USB":
            checkRotaryPosition(button_ID.F64_rotary_left_start, "Ascher_Racing_F64");
            break;
        case "SC2_Sport_wireless_wheel":
            checkRotaryPosition(button_ID.SC2_rotary_left_start, "Simucube_2_Sport");
            break;
        case "SC2_Pro_wireless_wheel":
            checkRotaryPosition(button_ID.SC2_rotary_left_start, "Simucube_2_Pro");
            break;
        case "SC2_Ultimate_wireless_wheel":
            checkRotaryPosition(button_ID.SC2_rotary_left_start, "Simucube_2_Ultimate");
            break;
		case "SC_Link_Hub_wireless_wheel":
            checkRotaryPosition(button_ID.SC_Link_Hub_rotary_left_start, "SC-Link_Hub");
            break;
    }

    return root["rotary_left_pos"];
}


function AR_get_rotary_right_pos() {
    const steering_wheel = AR_get_SteeringWheel();
    const button_ID = AR_get_buttonID();

    if (root["rotary_right_pos"] == null) {
        root["rotary_right_pos"] = "INIT";
    }

    const checkRotaryPosition = (start, prefix) => {
        for (let i = start; i < start + 12; i++) {
            if ($prop(`InputStatus.JoystickPlugin.${prefix}_B${i}`) == 1) {
                root["rotary_right_pos"] = i - start + 1; // 1 - 12
            }
        }
    };

    switch (steering_wheel) {
        case "Artura_GT4":
            checkRotaryPosition(button_ID.Artura_rotary_right_start, "Ascher_Racing_Artura_GT4");
            break;
        case "Artura_PRO":
            checkRotaryPosition(button_ID.Artura_rotary_right_start, "Ascher_Racing_Artura_PRO");
            break;
        case "Artura_ULTIMATE":
            checkRotaryPosition(button_ID.Artura_rotary_right_start, "Ascher_Racing_Artura_ULTIMATE");
            break;
        case "F64-USB":
            checkRotaryPosition(button_ID.F64_rotary_right_start, "Ascher_Racing_F64");
            break;
        case "SC2_Sport_wireless_wheel":
            checkRotaryPosition(button_ID.SC2_rotary_right_start, "Simucube_2_Sport");
            break;
        case "SC2_Pro_wireless_wheel":
            checkRotaryPosition(button_ID.SC2_rotary_right_start, "Simucube_2_Pro");
            break;
        case "SC2_Ultimate_wireless_wheel":
            checkRotaryPosition(button_ID.SC2_rotary_right_start, "Simucube_2_Ultimate");
            break;
		case "SC_Link_Hub_wireless_wheel":
            checkRotaryPosition(button_ID.SC_Link_Hub_rotary_right_start, "SC-Link_Hub");
            break;
    }

    return root["rotary_right_pos"];
}

function AR_is_rotary_left_shift_mode_active() {		// check if a shifted input has been used
														// this function works only one way, once a shifted input has been detected -> the output is TRUE until SimHub is restarted
    const steering_wheel = AR_get_SteeringWheel();
    const button_ID = AR_get_buttonID();

    // initialize global variable
    if (root["rotary_left_shift_mode_active"] == null) {
        root["rotary_left_shift_mode_active"] = false;
    }

    const checkShiftModeActive = (start, prefix) => {
        for (let i = start; i < start + 24; i++) {
            if ($prop(`InputStatus.JoystickPlugin.${prefix}_B${i}`) != null) {
                root["rotary_left_shift_mode_active"] = true;
                break;
            }
        }
    };

    switch (steering_wheel) {
        case "Artura_GT4":
            checkShiftModeActive(button_ID.Artura_rotary_left_shift_start, "Ascher_Racing_Artura_GT4");
            break;
        case "Artura_PRO":
            checkShiftModeActive(button_ID.Artura_rotary_left_shift_start, "Ascher_Racing_Artura_PRO");
            break;
        case "Artura_ULTIMATE":
            checkShiftModeActive(button_ID.Artura_rotary_left_shift_start, "Ascher_Racing_Artura_ULTIMATE");
            break;
        case "SC2_Sport_wireless_wheel":
            checkShiftModeActive(button_ID.SC2_rotary_left_shift_start, "Simucube_2_Sport");
            break;
        case "SC2_Pro_wireless_wheel":
            checkShiftModeActive(button_ID.SC2_rotary_left_shift_start, "Simucube_2_Pro");
            break;
        case "SC2_Ultimate_wireless_wheel":
            checkShiftModeActive(button_ID.SC2_rotary_left_shift_start, "Simucube_2_Ultimate");
            break;
		case "SC_Link_Hub_wireless_wheel":
            checkShiftModeActive(button_ID.SC_Link_Hub_rotary_left_shift_start, "SC-Link_Hub");
            break;
    }

    return root["rotary_left_shift_mode_active"];
}


function AR_is_rotary_right_shift_mode_active() {		// check if a shifted input has been used
														// this function works only one way, once a shifted input has been detected -> the output is TRUE until SimHub is restarted
    const steering_wheel = AR_get_SteeringWheel();
    const button_ID = AR_get_buttonID();

    // initialize global variable
    if (root["rotary_right_shift_mode_active"] == null) {
        root["rotary_right_shift_mode_active"] = false;
    }

    const checkShiftModeActive = (start, prefix) => {
        for (let i = start; i < start + 24; i++) {
            if ($prop(`InputStatus.JoystickPlugin.${prefix}_B${i}`) != null) {
                root["rotary_right_shift_mode_active"] = true;
                break;
            }
        }
    };

    switch (steering_wheel) {
        case "Artura_GT4":
            checkShiftModeActive(button_ID.Artura_rotary_right_shift_start, "Ascher_Racing_Artura_GT4");
            break;
        case "Artura_PRO":
            checkShiftModeActive(button_ID.Artura_rotary_right_shift_start, "Ascher_Racing_Artura_PRO");
            break;
        case "Artura_ULTIMATE":
            checkShiftModeActive(button_ID.Artura_rotary_right_shift_start, "Ascher_Racing_Artura_ULTIMATE");
            break;
        case "SC2_Sport_wireless_wheel":
            checkShiftModeActive(button_ID.SC2_rotary_right_shift_start, "Simucube_2_Sport");
            break;
        case "SC2_Pro_wireless_wheel":
            checkShiftModeActive(button_ID.SC2_rotary_right_shift_start, "Simucube_2_Pro");
            break;
        case "SC2_Ultimate_wireless_wheel":
            checkShiftModeActive(button_ID.SC2_rotary_right_shift_start, "Simucube_2_Ultimate");
            break;
		case "SC_Link_Hub_wireless_wheel":
            checkShiftModeActive(button_ID.SC_Link_Hub_rotary_right_shift_start, "SC-Link_Hub");
            break;	
    }

    return root["rotary_right_shift_mode_active"];
}

function AR_get_rotary_left_output(rotary_text) {		// output position numbers or text (modifier mode)
    root["rotary_left_pos"] = AR_get_rotary_left_pos();
    const rotary_left_shift_mode_active = AR_is_rotary_left_shift_mode_active();

    // initialize global variable
    if (root["output"] == null) {
        root["output"] = "INIT";
    }

    // Output numbers
    if (!rotary_left_shift_mode_active) {
        root["output"] = root["rotary_left_pos"] <= 12 ? String(root["rotary_left_pos"]) : root["output"];
    }

    // Output text
    if (rotary_left_shift_mode_active) {
        root["output"] = rotary_text[root["rotary_left_pos"] - 1] || root["output"];
    }

    return root["output"];
}


function AR_get_rotary_right_output(rotary_text) {		// output position numbers or text (modifier mode)
    root["rotary_right_pos"] = AR_get_rotary_right_pos();
    const rotary_right_shift_mode_active = AR_is_rotary_right_shift_mode_active();

    // initialize global variable
    if (root["output"] == null) {
        root["output"] = "INIT";
    }

    // Output numbers
    if (!rotary_right_shift_mode_active) {
        root["output"] = root["rotary_right_pos"] <= 12 ? String(root["rotary_right_pos"]) : root["output"];
    }

    // Output text
    if (rotary_right_shift_mode_active) {
        root["output"] = rotary_text[root["rotary_right_pos"] - 1] || root["output"];
    }

    return root["output"];
}


function AR_get_clutch_position() {		// clutch position (0..1)
    const steering_wheel = AR_get_SteeringWheel();
    let clutch_position = 0;

    switch (steering_wheel) {
        case "Artura_GT4":
            clutch_position = $prop('JoystickPlugin.Ascher_Racing_Artura_GT4_X') != null
                ? $prop('JoystickPlugin.Ascher_Racing_Artura_GT4_X') / 65535
                : 0;
            break;
        case "Artura_SPORT":
            clutch_position = $prop('JoystickPlugin.Ascher_Racing_Artura_SPORT_X') != null
                ? $prop('JoystickPlugin.Ascher_Racing_Artura_SPORT_X') / 65535
                : 0;
            break;
        case "Artura_PRO":
            clutch_position = $prop('JoystickPlugin.Ascher_Racing_Artura_PRO_X') != null
                ? $prop('JoystickPlugin.Ascher_Racing_Artura_PRO_X') / 65535
                : 0;
            break;
        case "Artura_ULTIMATE":
            clutch_position = $prop('JoystickPlugin.Ascher_Racing_Artura_ULTIMATE_X') != null
                ? $prop('JoystickPlugin.Ascher_Racing_Artura_ULTIMATE_X') / 65535
                : 0;
            break;
        case "F64-USB":
            clutch_position = $prop('JoystickPlugin.Ascher_Racing_F64_X') != null
                ? $prop('JoystickPlugin.Ascher_Racing_F64_X') / 65535
                : 0;
            break;
        case "SC2_Sport_wireless_wheel":
            clutch_position = $prop('JoystickPlugin.Simucube_2_Sport_RZ') != null
                ? $prop('JoystickPlugin.Simucube_2_Sport_RZ') / 65535
                : 0;
            break;
        case "SC2_Pro_wireless_wheel":
            clutch_position = $prop('JoystickPlugin.Simucube_2_Pro_RZ') != null
                ? $prop('JoystickPlugin.Simucube_2_Pro_RZ') / 65535
                : 0;
            break;
        case "SC2_Ultimate_wireless_wheel":
            clutch_position = $prop('JoystickPlugin.Simucube_2_Ultimate_RZ') != null
                ? $prop('JoystickPlugin.Simucube_2_Ultimate_RZ') / 65535
                : 0;
            break;
        case "SC_Link_Hub_wireless_wheel":
            clutch_position = $prop('JoystickPlugin.SC-Link_Hub_RZ') != null
                ? $prop('JoystickPlugin.SC-Link_Hub_RZ') / 65535
                : 0;
            break;
        default:
            clutch_position = 0;
    }

    return clutch_position;
}

function AR_set_single_LED_by_rotary_left_pos(LED_ON_position) {	// turn on LED based on the rotary switch position (in shift mode)
    root["rotary_left_pos"] = AR_get_rotary_left_pos();
    const rotary_left_shift_mode_active = AR_is_rotary_left_shift_mode_active();

    // initialize global variable
    if (root["LED_ON"] == null) {
        root["LED_ON"] = false;
    }

    // Turn on LED only if the shift button pair mode is active
    if (rotary_left_shift_mode_active) {
        root["LED_ON"] = root["rotary_left_pos"] === LED_ON_position;
    } else {
        root["LED_ON"] = false;
    }

    return root["LED_ON"];
}

function AR_set_single_LED_by_rotary_right_pos(LED_ON_position) {	// turn on LED based on the rotary switch position (in shift mode)
    root["rotary_right_pos"] = AR_get_rotary_right_pos();
    const rotary_right_shift_mode_active = AR_is_rotary_right_shift_mode_active();

    // initialize global variable
    if (root["LED_ON"] == null) {
        root["LED_ON"] = false;
    }

    // Turn on LED only if the shift button pair mode is active
    if (rotary_right_shift_mode_active) {
        root["LED_ON"] = root["rotary_right_pos"] === LED_ON_position;
    } else {
        root["LED_ON"] = false;
    }

    return root["LED_ON"];
}

function AR_set_LED_colors_by_rotary_left_pos(LED_colors) {
// definition of LED colors based on rotary switch position (in shift mode)
    root["rotary_left_pos"] = AR_get_rotary_left_pos();
    const rotary_left_shift_mode_active = AR_is_rotary_left_shift_mode_active();

    // initialize global variable
    if (root["color"] == null || rotary_left_shift_mode_active === false) {
        root["color"] = '#00000000'; // Turn off LED if not initialized or if shift mode is inactive
    }

    // Output colors defined in DASH / LED profile via javascript
    if (rotary_left_shift_mode_active) {
        const colorIndex = root["rotary_left_pos"] - 1;
        root["color"] = LED_colors[colorIndex] || root["color"];
    }

    return root["color"];
}

function AR_set_LED_colors_by_rotary_right_pos(LED_colors) {
// definition of LED colors based on rotary switch position (in shift mode)
    root["rotary_right_pos"] = AR_get_rotary_right_pos();
    const rotary_right_shift_mode_active = AR_is_rotary_right_shift_mode_active();

    // initialize global variable
    if (root["color"] == null || rotary_right_shift_mode_active === false) {
        root["color"] = '#00000000'; // Turn off LED if not initialized or if shift mode is inactive
    }

    // Output colors defined in DASH / LED profile via javascript
    if (rotary_right_shift_mode_active) {
        const colorIndex = root["rotary_right_pos"] - 1;
        root["color"] = LED_colors[colorIndex] || root["color"];
    }

    return root["color"];
}

function AR_get_shift_rpm_per_car_per_gear() {		// iRacing: database of optimum shift rpms per gear
	const car = $prop('CarModel');
	const shift_rpm = {}; // car (and setup) specific variables
	const game = $prop('DataCorePlugin.CurrentGame'); // IRacing
	
	switch(car)
	{
		case "Acura ARX-06": 							// rpm_per_led[i] = 75
			shift_rpm[0] = $prop('MaxRpm');	// gear N
			shift_rpm[1] = 9402;			// gear 1
			shift_rpm[2] = 9617;			// gear 2
			shift_rpm[3] = 9741;			// gear 3
			shift_rpm[4] = 9838;			// gear 4
			shift_rpm[5] = 9904;			// gear 5
			shift_rpm[6] = 9965;			// gear 6
			shift_rpm[7] = $prop('MaxRpm');	// gear 7
			shift_rpm[8] = $prop('MaxRpm');	// gear 8
			break;
		case "Aston Martin Vantage GT4": 				// rpm_per_led[i] = 100
			shift_rpm[0] = $prop('MaxRpm');	// gear N
			shift_rpm[1] = 7150;			// gear 1
			shift_rpm[2] = 7150;			// gear 2
			shift_rpm[3] = 7070;			// gear 3
			shift_rpm[4] = 7070;			// gear 4
			shift_rpm[5] = 7070;			// gear 5
			shift_rpm[6] = $prop('MaxRpm');	// gear 6
			shift_rpm[7] = $prop('MaxRpm');	// gear 7
			shift_rpm[8] = $prop('MaxRpm');	// gear 8
			break;
		case "Audi R8 LMS EVO II GT3":
			shift_rpm[0] = $prop('MaxRpm');	// gear N
			shift_rpm[1] = 7901;			// gear 1	rpm_per_led[1] = 80
			shift_rpm[2] = 7906;			// gear 2	rpm_per_led[2] = 70
			shift_rpm[3] = 7961;			// gear 3	rpm_per_led[3] = 60
			shift_rpm[4] = 7954;			// gear 4	rpm_per_led[4] = 50
			shift_rpm[5] = 8083;			// gear 5	rpm_per_led[5] = 40
			shift_rpm[6] = $prop('MaxRpm');	// gear 6	rpm_per_led[6] = 50
			shift_rpm[7] = $prop('MaxRpm');	// gear 7
			shift_rpm[8] = $prop('MaxRpm');	// gear 8
			break;
		case "Audi RS 3 LMS TCR":  							// rpm_per_led[i] = 75
			shift_rpm[0] = $prop('MaxRpm');	// gear N
			shift_rpm[1] = 6500;			// gear 1
			shift_rpm[2] = 6780;			// gear 2
			shift_rpm[3] = 6812;			// gear 3
			shift_rpm[4] = 6862;			// gear 4
			shift_rpm[5] = 6695;			// gear 5
			shift_rpm[6] = $prop('MaxRpm');	// gear 6
			shift_rpm[7] = $prop('MaxRpm');	// gear 7
			shift_rpm[8] = $prop('MaxRpm');	// gear 8
			break;
		case "BMW M4 GT3": 								// rpm_per_led[i] = 100
			shift_rpm[0] = $prop('MaxRpm');	// gear N
			shift_rpm[1] = 6530;			// gear 1
			shift_rpm[2] = 6702;			// gear 2
			shift_rpm[3] = 6811;			// gear 3
			shift_rpm[4] = 6870;			// gear 4
			shift_rpm[5] = 6900;			// gear 5
			shift_rpm[6] = $prop('MaxRpm');	// gear 6
			shift_rpm[7] = $prop('MaxRpm');	// gear 7
			shift_rpm[8] = $prop('MaxRpm');	// gear 8
			break;
		case "BMW M4 GT4":
			shift_rpm[0] = $prop('MaxRpm');	// gear N
			shift_rpm[1] = 7000;			// gear 1
			shift_rpm[2] = 7090;			// gear 2
			shift_rpm[3] = 7294;			// gear 3
			shift_rpm[4] = 7378;			// gear 4
			shift_rpm[5] = 7363;			// gear 5
			shift_rpm[6] = $prop('MaxRpm');	// gear 6
			shift_rpm[7] = $prop('MaxRpm');	// gear 7
			shift_rpm[8] = $prop('MaxRpm');	// gear 8
			break;
		case "BMW M Hybrid V8": 							// rpm_per_led[i] = 100
			shift_rpm[0] = $prop('MaxRpm');	// gear N
			shift_rpm[1] = 7460;			// gear 1
			shift_rpm[2] = 7650;			// gear 2
			shift_rpm[3] = 7500;			// gear 3
			shift_rpm[4] = 7850;			// gear 4
			shift_rpm[5] = 7920;			// gear 5
			shift_rpm[6] = 7963;			// gear 6
			shift_rpm[7] = $prop('MaxRpm');	// gear 7
			shift_rpm[8] = $prop('MaxRpm');	// gear 8
			break;
		case "Cadillac CTS-V Racecar":
			shift_rpm[0] = $prop('MaxRpm');	// gear N
			shift_rpm[1] = 7283;			// gear 1
			shift_rpm[2] = 7120;			// gear 2
			shift_rpm[3] = 7100;			// gear 3
			shift_rpm[4] = 7086;			// gear 4
			shift_rpm[5] = 7086;			// gear 5
			shift_rpm[6] = $prop('MaxRpm');	// gear 6
			shift_rpm[7] = $prop('MaxRpm');	// gear 7
			shift_rpm[8] = $prop('MaxRpm');	// gear 8
			break;
		case "Cadillac V-Series.R":
			shift_rpm[0] = $prop('MaxRpm');	// gear N
			shift_rpm[1] = 8227;			// gear 1
			shift_rpm[2] = 8397;			// gear 2
			shift_rpm[3] = 8506;			// gear 3
			shift_rpm[4] = 8612;			// gear 4
			shift_rpm[5] = 8675;			// gear 5
			shift_rpm[6] = 8715;			// gear 6
			shift_rpm[7] = $prop('MaxRpm');	// gear 7
			shift_rpm[8] = $prop('MaxRpm');	// gear 8
			break;
		case "Dallara P217 LMP2":
			shift_rpm[0] = $prop('MaxRpm');	// gear N
			shift_rpm[1] = 8200;			// gear 1
			shift_rpm[2] = 8430;			// gear 2
			shift_rpm[3] = 8520;			// gear 3
			shift_rpm[4] = 8610;			// gear 4
			shift_rpm[5] = 8660;			// gear 5
			shift_rpm[6] = $prop('MaxRpm');	// gear 6
			shift_rpm[7] = $prop('MaxRpm');	// gear 7
			shift_rpm[8] = $prop('MaxRpm');	// gear 8
			break;
		case "Dallara F312 F3":
			shift_rpm[0] = $prop('MaxRpm');	// gear N
			shift_rpm[1] = 6854;			// gear 1
			shift_rpm[2] = 6921;			// gear 2
			shift_rpm[3] = 6971;			// gear 3
			shift_rpm[4] = 6994;			// gear 4
			shift_rpm[5] = 7125;			// gear 5
			shift_rpm[6] = $prop('MaxRpm');	// gear 6
			shift_rpm[7] = $prop('MaxRpm');	// gear 7
			shift_rpm[8] = $prop('MaxRpm');	// gear 8
			break;
		case "Ferrari 296 GT3":
			shift_rpm[0] = $prop('MaxRpm');	// gear N
			shift_rpm[1] = 7575;			// gear 1
			shift_rpm[2] = 7351;			// gear 2
			shift_rpm[3] = 7288;			// gear 3
			shift_rpm[4] = 7244;			// gear 4
			shift_rpm[5] = 7139;			// gear 5
			shift_rpm[6] = $prop('MaxRpm');	// gear 6
			shift_rpm[7] = $prop('MaxRpm');	// gear 7
			shift_rpm[8] = $prop('MaxRpm');	// gear 8
			break;
		case "Ferrari 488 GT3 Evo 2020":
			shift_rpm[0] = $prop('MaxRpm');	// gear N
			shift_rpm[1] = 7222;			// gear 1
			shift_rpm[2] = 7089;			// gear 2
			shift_rpm[3] = 7000;			// gear 3
			shift_rpm[4] = 6989;			// gear 4
			shift_rpm[5] = 6959;			// gear 5
			shift_rpm[6] = $prop('MaxRpm');	// gear 6
			shift_rpm[7] = $prop('MaxRpm');	// gear 7
			shift_rpm[8] = $prop('MaxRpm');	// gear 8
			break;
		case "FIA F4":
			shift_rpm[0] = $prop('MaxRpm');	// gear N
			shift_rpm[1] = 6821;			// gear 1
			shift_rpm[2] = 6908;			// gear 2
			shift_rpm[3] = 7003;			// gear 3
			shift_rpm[4] = 7008;			// gear 4
			shift_rpm[5] = 6919;			// gear 5
			shift_rpm[6] = $prop('MaxRpm');	// gear 6
			shift_rpm[7] = $prop('MaxRpm');	// gear 7
			shift_rpm[8] = $prop('MaxRpm');	// gear 8
			break;
		case "Ford Mustang FR500S":
			shift_rpm[0] = $prop('MaxRpm');	// gear N
			shift_rpm[1] = 6462;			// gear 1
			shift_rpm[2] = 6268;			// gear 2
			shift_rpm[3] = 6248;			// gear 3
			shift_rpm[4] = 6216;			// gear 4
			shift_rpm[5] = 6200;			// gear 5
			shift_rpm[6] = $prop('MaxRpm');	// gear 6
			shift_rpm[7] = $prop('MaxRpm');	// gear 7
			shift_rpm[8] = $prop('MaxRpm');	// gear 8
			break;
		case "Formula Vee":
			shift_rpm[0] = $prop('MaxRpm');	// gear N
			shift_rpm[1] = 5881;			// gear 1
			shift_rpm[2] = 6568;			// gear 2
			shift_rpm[3] = 6585;			// gear 3
			shift_rpm[4] = $prop('MaxRpm');	// gear 4
			shift_rpm[5] = $prop('MaxRpm');	// gear 5
			shift_rpm[6] = $prop('MaxRpm');	// gear 6
			shift_rpm[7] = $prop('MaxRpm');	// gear 7
			shift_rpm[8] = $prop('MaxRpm');	// gear 8
			break;
		case "Honda Civic Type R":
			shift_rpm[0] = $prop('MaxRpm');	// gear N
			shift_rpm[1] = 6688;			// gear 1
			shift_rpm[2] = 6715;			// gear 2
			shift_rpm[3] = 6717;			// gear 3
			shift_rpm[4] = 6721;			// gear 4
			shift_rpm[5] = 6723;			// gear 5
			shift_rpm[6] = $prop('MaxRpm');	// gear 6
			shift_rpm[7] = $prop('MaxRpm');	// gear 7
			shift_rpm[8] = $prop('MaxRpm');	// gear 8
			break;
		case "Hyundai Elantra N TC":					// rpm_per_led[i] = 100
			shift_rpm[0] = $prop('MaxRpm');	// gear N
			shift_rpm[1] = 6630;			// gear 1
			shift_rpm[2] = 6750;			// gear 2
			shift_rpm[3] = 6830;			// gear 3
			shift_rpm[4] = 6880;			// gear 4
			shift_rpm[5] = 6915;			// gear 5
			shift_rpm[6] = $prop('MaxRpm');	// gear 6
			shift_rpm[7] = $prop('MaxRpm');	// gear 7
			shift_rpm[8] = $prop('MaxRpm');	// gear 8
			break;
		case "Hyundai Veloster N TCR": 					// rpm_per_led[i] = 120
			shift_rpm[0] = $prop('MaxRpm');	// gear N
			shift_rpm[1] = 6744;			// gear 1
			shift_rpm[2] = 6816;			// gear 2
			shift_rpm[3] = 6860;			// gear 3
			shift_rpm[4] = 6871;			// gear 4
			shift_rpm[5] = 6883;			// gear 5
			shift_rpm[6] = $prop('MaxRpm');	// gear 6
			shift_rpm[7] = $prop('MaxRpm');	// gear 7
			shift_rpm[8] = $prop('MaxRpm');	// gear 8
			break;
		case "Lamborghini Huracan GT3 EVO": 
			shift_rpm[0] = $prop('MaxRpm');	// gear N
			shift_rpm[1] = 7911;			// gear 1	rpm_per_led[1] = 75
			shift_rpm[2] = 7915;			// gear 2	rpm_per_led[2] = 75
			shift_rpm[3] = 7968;			// gear 3	rpm_per_led[3] = 75
			shift_rpm[4] = 7961;			// gear 4	rpm_per_led[4] = 75
			shift_rpm[5] = 8090;			// gear 5	rpm_per_led[5] = 75
			shift_rpm[6] = $prop('MaxRpm');	// gear 6	rpm_per_led[6] = 120
			shift_rpm[7] = $prop('MaxRpm');	// gear 7
			shift_rpm[8] = $prop('MaxRpm');	// gear 8
			break;
		case "Ligier JS P320":
			shift_rpm[0] = $prop('MaxRpm');	// gear N
			shift_rpm[1] = 6520;			// gear 1	rpm_per_led[1] = 100
			shift_rpm[2] = 6710;			// gear 2	rpm_per_led[2] = 100
			shift_rpm[3] = 6800;			// gear 3	rpm_per_led[3] = 75
			shift_rpm[4] = 6870;			// gear 4	rpm_per_led[4] = 50
			shift_rpm[5] = 6920;			// gear 5	rpm_per_led[5] = 25
			shift_rpm[6] = $prop('MaxRpm');	// gear 6	rpm_per_led[6] = 25
			shift_rpm[7] = $prop('MaxRpm');	// gear 7
			shift_rpm[8] = $prop('MaxRpm');	// gear 8
			break;
		case "Mazda MX-5 Cup":
			shift_rpm[0] = $prop('MaxRpm');	// gear N
			shift_rpm[1] = 7197;			// gear 1
			shift_rpm[2] = 7283;			// gear 2
			shift_rpm[3] = 7330;			// gear 3
			shift_rpm[4] = 7365;			// gear 4
			shift_rpm[5] = 7380;			// gear 5
			shift_rpm[6] = $prop('MaxRpm');	// gear 6
			shift_rpm[7] = $prop('MaxRpm');	// gear 7
			shift_rpm[8] = $prop('MaxRpm');	// gear 8
			break;
		case "Mclaren 570s GT4": 
			shift_rpm[0] = $prop('MaxRpm');	// gear N
			shift_rpm[1] = 7120;			// gear 1	rpm_per_led[1] = 175
			shift_rpm[2] = 7232;			// gear 2	rpm_per_led[2] = 160
			shift_rpm[3] = 7336;			// gear 3	rpm_per_led[3] = 140
			shift_rpm[4] = 7359;			// gear 4	rpm_per_led[4] = 130
			shift_rpm[5] = 7436;			// gear 5	rpm_per_led[5] = 125
			shift_rpm[6] = $prop('MaxRpm');	// gear 6	rpm_per_led[6] = 125
			shift_rpm[7] = $prop('MaxRpm');	// gear 7
			shift_rpm[8] = $prop('MaxRpm');	// gear 8
			break;
		case "McLaren MP4-12C GT3":
			shift_rpm[0] = $prop('MaxRpm');	// gear N
			shift_rpm[1] = 7067;			// gear 1
			shift_rpm[2] = 7121;			// gear 2
			shift_rpm[3] = 6888;			// gear 3
			shift_rpm[4] = 6888;			// gear 4
			shift_rpm[5] = 6922;			// gear 5
			shift_rpm[6] = $prop('MaxRpm');	// gear 6
			shift_rpm[7] = $prop('MaxRpm');	// gear 7
			shift_rpm[8] = $prop('MaxRpm');	// gear 8
			break;
		case "Mercedes AMG GT3":						// rpm_per_led[i] = 100
			shift_rpm[0] = $prop('MaxRpm');	// gear N
			shift_rpm[1] = 7320;			// gear 1
			shift_rpm[2] = 7193;			// gear 2
			shift_rpm[3] = 6885;			// gear 3
			shift_rpm[4] = 6700;			// gear 4
			shift_rpm[5] = 6585;			// gear 5
			shift_rpm[6] = $prop('MaxRpm');	// gear 6
			shift_rpm[7] = $prop('MaxRpm');	// gear 7
			shift_rpm[8] = $prop('MaxRpm');	// gear 8
			break;
		case "Mercedes-AMG GT3 2020":
			shift_rpm[0] = $prop('MaxRpm');	// gear N
			shift_rpm[1] = 7250;			// gear 1	rpm_per_led[1] = 100
			shift_rpm[2] = 7177;			// gear 2	rpm_per_led[2] = 100
			shift_rpm[3] = 7056;			// gear 3	rpm_per_led[3] = 75
			shift_rpm[4] = 7065;			// gear 4	rpm_per_led[4] = 50
			shift_rpm[5] = 7126;			// gear 5	rpm_per_led[5] = 25
			shift_rpm[6] = $prop('MaxRpm');	// gear 6	rpm_per_led[6] = 25
			shift_rpm[7] = $prop('MaxRpm');	// gear 7
			shift_rpm[8] = $prop('MaxRpm');	// gear 8
			break;
		case "Mercedes AMG GT4":						// rpm_per_led[i] = 100
			shift_rpm[0] = $prop('MaxRpm');	// gear N
			shift_rpm[1] = 6365;			// gear 1
			shift_rpm[2] = 6593;			// gear 2
			shift_rpm[3] = 6705;			// gear 3
			shift_rpm[4] = 6773;			// gear 4
			shift_rpm[5] = 6800;			// gear 5
			shift_rpm[6] = $prop('MaxRpm');	// gear 6
			shift_rpm[7] = $prop('MaxRpm');	// gear 7
			shift_rpm[8] = $prop('MaxRpm');	// gear 8
			break;
		case "Pontiac Solstice":
			shift_rpm[0] = $prop('MaxRpm');	// gear N
			shift_rpm[1] = 6675;			// gear 1
			shift_rpm[2] = 7009;			// gear 2
			shift_rpm[3] = 7104;			// gear 3
			shift_rpm[4] = 7120;			// gear 4
			shift_rpm[5] = $prop('MaxRpm');	// gear 5
			shift_rpm[6] = $prop('MaxRpm');	// gear 6
			shift_rpm[7] = $prop('MaxRpm');	// gear 7
			shift_rpm[8] = $prop('MaxRpm');	// gear 8
			break;
		case "Porsche 718 Cayman GT4":
			shift_rpm[0] = $prop('MaxRpm');	// gear N
			shift_rpm[1] = 6800;			// gear 1
			shift_rpm[2] = 7360;			// gear 2
			shift_rpm[3] = 7600;			// gear 3
			shift_rpm[4] = 7700;			// gear 4
			shift_rpm[5] = 7740;			// gear 5
			shift_rpm[6] = $prop('MaxRpm');	// gear 6
			shift_rpm[7] = $prop('MaxRpm');	// gear 7
			shift_rpm[8] = $prop('MaxRpm');	// gear 8
			break;
		case "Porsche 911 GT3 Cup (992)":				// rpm_per_led[i] = 100
			shift_rpm[0] = $prop('MaxRpm');	// gear N
			shift_rpm[1] = 7884;			// gear 1
			shift_rpm[2] = 8038;			// gear 2
			shift_rpm[3] = 8095;			// gear 3
			shift_rpm[4] = 8103;			// gear 4
			shift_rpm[5] = 8097;			// gear 5
			shift_rpm[6] = $prop('MaxRpm');	// gear 6
			shift_rpm[7] = $prop('MaxRpm');	// gear 7
			shift_rpm[8] = $prop('MaxRpm');	// gear 8
			break;
		case "Porsche 911 GT3 R (992)":					// rpm_per_led[i] = 100
			shift_rpm[0] = $prop('MaxRpm');	// gear N
			shift_rpm[1] = 8732;			// gear 1
			shift_rpm[2] = 8832;			// gear 2
			shift_rpm[3] = 8772;			// gear 3
			shift_rpm[4] = 8766;			// gear 4
			shift_rpm[5] = 8761;			// gear 5
			shift_rpm[6] = $prop('MaxRpm');	// gear 6
			shift_rpm[7] = $prop('MaxRpm');	// gear 7
			shift_rpm[8] = $prop('MaxRpm');	// gear 8
			break;
		case "Porsche 911 GT3.R":						// rpm_per_led[i] = 100
			shift_rpm[0] = $prop('MaxRpm');	// gear N
			shift_rpm[1] = 8950;			// gear 1
			shift_rpm[2] = 9080;			// gear 2
			shift_rpm[3] = 9100;			// gear 3
			shift_rpm[4] = 9100;			// gear 4
			shift_rpm[5] = 9170;			// gear 5
			shift_rpm[6] = $prop('MaxRpm');	// gear 6
			shift_rpm[7] = $prop('MaxRpm');	// gear 7
			shift_rpm[8] = $prop('MaxRpm');	// gear 8
			break;
		case "Porsche 963 GTP":
			shift_rpm[0] = $prop('MaxRpm');	// gear N
			shift_rpm[1] = 7633;			// gear 1
			shift_rpm[2] = 7774;			// gear 2
			shift_rpm[3] = 7917;			// gear 3
			shift_rpm[4] = 8022;			// gear 4
			shift_rpm[5] = 8093;			// gear 5
			shift_rpm[6] = 8120;			// gear 6
			shift_rpm[7] = $prop('MaxRpm');	// gear 7
			shift_rpm[8] = $prop('MaxRpm');	// gear 8
			break;
		case "Ray Formula 1600":						// rpm_per_led[i] = 200
			shift_rpm[0] = $prop('MaxRpm');	// gear N
			shift_rpm[1] = 6804;			// gear 1
			shift_rpm[2] = 6879;			// gear 2
			shift_rpm[3] = 6936;			// gear 3
			shift_rpm[4] = $prop('MaxRpm');	// gear 4
			shift_rpm[5] = $prop('MaxRpm');	// gear 5
			shift_rpm[6] = $prop('MaxRpm');	// gear 6
			shift_rpm[7] = $prop('MaxRpm');	// gear 7
			shift_rpm[8] = $prop('MaxRpm');	// gear 8
			break;
		case "Renault Clio R.S. V":						// rpm_per_led[i] = 100
			shift_rpm[0] = $prop('MaxRpm');	// gear N
			shift_rpm[1] = 5278;			// gear 1
			shift_rpm[2] = 5244;			// gear 2
			shift_rpm[3] = 5400;			// gear 3
			shift_rpm[4] = 5438;			// gear 4
			shift_rpm[5] = 6500;			// gear 5
			shift_rpm[6] = $prop('MaxRpm');	// gear 6
			shift_rpm[7] = $prop('MaxRpm');	// gear 7
			shift_rpm[8] = $prop('MaxRpm');	// gear 8
			break;
		case "SCCA Spec Racer Ford":					// rpm_per_led[i] = 100
			shift_rpm[0] = $prop('MaxRpm');	// gear N
			shift_rpm[1] = 6288;			// gear 1
			shift_rpm[2] = 6495;			// gear 2
			shift_rpm[3] = 6573;			// gear 3
			shift_rpm[4] = 6610;			// gear 4
			shift_rpm[5] = 6600;			// gear 5
			shift_rpm[6] = $prop('MaxRpm');	// gear 6
			shift_rpm[7] = $prop('MaxRpm');	// gear 7
			shift_rpm[8] = $prop('MaxRpm');	// gear 8
			break;
		case "Street Stock":							// rpm_per_led[i] = 100
			shift_rpm[0] = $prop('MaxRpm');	// gear N
			shift_rpm[1] = 6234;			// gear 1
			shift_rpm[2] = 5682;			// gear 2
			shift_rpm[3] = 6088;			// gear 3
			shift_rpm[4] = $prop('MaxRpm');	// gear 4
			shift_rpm[5] = $prop('MaxRpm');	// gear 5
			shift_rpm[6] = $prop('MaxRpm');	// gear 6
			shift_rpm[7] = $prop('MaxRpm');	// gear 7
			shift_rpm[8] = $prop('MaxRpm');	// gear 8
			break;
		case "Super Formula Lights 324":
			shift_rpm[0] = $prop('MaxRpm');	// gear N
			shift_rpm[1] = 6750;			// gear 1	rpm_per_led[2] = 75
			shift_rpm[2] = 6890;			// gear 2	rpm_per_led[2] = 60
			shift_rpm[3] = 6911;			// gear 3	rpm_per_led[2] = 50
			shift_rpm[4] = 6945;			// gear 4	rpm_per_led[2] = 50
			shift_rpm[5] = 6875;			// gear 5	rpm_per_led[2] = 50
			shift_rpm[6] = $prop('MaxRpm');	// gear 6	rpm_per_led[2] = 75
			shift_rpm[7] = $prop('MaxRpm');	// gear 7
			shift_rpm[8] = $prop('MaxRpm');	// gear 8
			break;
		case "Super Formula SF23 - Honda":				// rpm_per_led[i] = 75
			shift_rpm[0] = $prop('MaxRpm');	// gear N
			shift_rpm[1] = 8500;			// gear 1
			shift_rpm[2] = 8680;			// gear 2
			shift_rpm[3] = 9046;			// gear 3
			shift_rpm[4] = 9142;			// gear 4
			shift_rpm[5] = 9226;			// gear 5
			shift_rpm[6] = $prop('MaxRpm');	// gear 6
			shift_rpm[7] = $prop('MaxRpm');	// gear 7
			shift_rpm[8] = $prop('MaxRpm');	// gear 8
			break;
		case "Super Formula SF23 - Toyota":				// rpm_per_led[i] = 75
			shift_rpm[0] = $prop('MaxRpm');	// gear N
			shift_rpm[1] = 8500;			// gear 1
			shift_rpm[2] = 8680;			// gear 2
			shift_rpm[3] = 9046;			// gear 3
			shift_rpm[4] = 9142;			// gear 4
			shift_rpm[5] = 9226;			// gear 5
			shift_rpm[6] = $prop('MaxRpm');	// gear 6
			shift_rpm[7] = $prop('MaxRpm');	// gear 7
			shift_rpm[8] = $prop('MaxRpm');	// gear 8
			break;
		case "Toyota GR86":
			shift_rpm[0] = $prop('MaxRpm');	// gear N
			shift_rpm[1] = 7250;			// gear 1
			shift_rpm[2] = 7300;			// gear 2
			shift_rpm[3] = 7350;			// gear 3
			shift_rpm[4] = 7400;			// gear 4
			shift_rpm[5] = 7400;			// gear 5
			shift_rpm[6] = $prop('MaxRpm');	// gear 6
			shift_rpm[7] = $prop('MaxRpm');	// gear 7
			shift_rpm[8] = $prop('MaxRpm');	// gear 8
			break;
		case "VW Jetta TDI Cup":
			shift_rpm[0] = $prop('MaxRpm');	// gear N
			shift_rpm[1] = 4700;			// gear 1
			shift_rpm[2] = 4436;			// gear 2
			shift_rpm[3] = 4476;			// gear 3
			shift_rpm[4] = 4416;			// gear 4
			shift_rpm[5] = 4444;			// gear 5
			shift_rpm[6] = $prop('MaxRpm');	// gear 6
			shift_rpm[7] = $prop('MaxRpm');	// gear 7
			shift_rpm[8] = $prop('MaxRpm');	// gear 8
			break;
        default:
            for (let i = 0; i <= 8; i++) {
                shift_rpm[i] = $prop('MaxRpm');
            }
    }
    return shift_rpm;
}

function AR_get_rpm_leds_per_gear(mode, rpm_per_led) {
    const shift_rpm = AR_get_shift_rpm_per_car_per_gear();
    const rpm_led_span = 16;
    const rpm_per_led_default = 50;

    // Fill non-customized rpm_per_led gears with default value
    for (let i = 0; i <= 8; i++) {
        if (rpm_per_led[i] == null) {
            rpm_per_led[i] = rpm_per_led_default;
        }
    }

    let num_leds;

    // Calculate number of LEDs to light up based on the current gear
    switch ($prop('Gear')) {
        case "N":
            num_leds = rpm_led_span - ((shift_rpm[0] - $prop('Rpms')) / rpm_per_led[0]);
            break;
        case "1":
            num_leds = rpm_led_span - ((shift_rpm[1] - $prop('Rpms')) / rpm_per_led[1]);
            break;
        case "2":
            num_leds = rpm_led_span - ((shift_rpm[2] - $prop('Rpms')) / rpm_per_led[2]);
            break;
        case "3":
            num_leds = rpm_led_span - ((shift_rpm[3] - $prop('Rpms')) / rpm_per_led[3]);
            break;
        case "4":
            num_leds = rpm_led_span - ((shift_rpm[4] - $prop('Rpms')) / rpm_per_led[4]);
            break;
        case "5":
            num_leds = rpm_led_span - ((shift_rpm[5] - $prop('Rpms')) / rpm_per_led[5]);
            break;
        case "6":
            num_leds = rpm_led_span - ((shift_rpm[6] - $prop('Rpms')) / rpm_per_led[6]);
            break;
        case "7":
            num_leds = rpm_led_span - ((shift_rpm[7] - $prop('Rpms')) / rpm_per_led[7]);
            break;
        case "8":
            num_leds = rpm_led_span - ((shift_rpm[8] - $prop('Rpms')) / rpm_per_led[8]);
            break;
        default:
            num_leds = rpm_led_span - (($prop('MaxRpm') - $prop('Rpms')) / rpm_per_led[0]);
    }

    let out;

    // Switch between RPM LEDs and FLASH LEDs
    switch (mode) {
        case "RPM":
            out = (num_leds < rpm_led_span) ? num_leds : 0;
            break;
        case "FLASH":
            out = (num_leds >= rpm_led_span) ? 1 : 0;
            break;
    }

    // Return the number of LEDs to light up
    return out;
}

