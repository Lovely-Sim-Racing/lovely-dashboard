const folderName = $prop('variable.folderName');
const delayRingColor = ['#FF0029A6','#FFB58100','#FFA60000'];

var json_settings = null;
var settings = null;

// Default Settings File
const json_default_settings = readtextfile('./DashTemplates/'+folderName+'/JavascriptExtensions/Lovely-Dashboard_default-settings.json');
const ld_settings = JSON.parse(JSON.stringify(JSON.parse(json_default_settings)));

// User Settings File
if ( json_settings === null ) {
    json_settings = readtextfile('./JavascriptExtensions/Lovely-Dashboard_settings.json');
    if ( json_settings != null && !json_settings.startsWith('ERROR') ) {
        settings = JSON.parse(JSON.stringify(JSON.parse(json_settings)));
    } else {
        json_settings = null;
        settings = null;
    }
}

// Default Theme Colors
const json_colors = readtextfile('./DashTemplates/'+folderName+'/JavascriptExtensions/Lovely-Dashboard_default-colors.json');
const ld_colors = JSON.parse(JSON.stringify(JSON.parse(json_colors)));

// Theming
function ld_getTheme() {
    const trueDarkMode = ld_getSettings('trueDarkMode');
    return trueDarkMode;
}
function ld_theme(token) {
    // 0: Standard Theme
    // 1: Red Theme
    // 2: Blue Theme
    // 3: Purple Theme
    // 4: Orange Theme
    const theme = ( ld_trueDarkMode() ) ? ld_getTheme() : '0';
    if (!ld_colors || ld_colors == null) { return 'Lime'; };
    return ld_colors[theme][token];
}
function ld_themeImage(token) {
    const theme = ( ld_trueDarkMode() ) ? ld_getTheme() : '0';
    return token+'-'+theme;
}

// Get Settings
function ld_getSettings(setting) {
    if ( !settings || settings === null ) { // Check to see if there's a settings file
        return ld_settings[setting];
    } else {
        // Check to see if there's a valid setting option
        return ( settings[setting] === null || typeof settings[setting] === 'undefined') ? ld_settings[setting] : settings[setting];
    }
}

// Players Data
function ld_GetPlayerName() {
    const driverName = ld_getSettings('driverName');
    const name = $prop('DataCorePlugin.GameData.PlayerName');
    return ld_formatName(name, driverName);
}
function ld_GetPlayerCarLogo () {
    const carName = $prop('DataCorePlugin.GameData.CarModel');
    const carBrand = carName.split(' ');
    return 'logo-' + lcase(carBrand[0]) + '-yellow';
}
function ld_GetPlayerBestLapTime() {
    if ( timespantoseconds($prop('DataCorePlugin.GameData.BestLapTime')) ==  0 ) {
        return '--:--.---';
    } else {
        return $prop('DataCorePlugin.GameData.BestLapTime');
    }
}
function ld_GetPlayerLastLapTime() {
    if ( timespantoseconds($prop('DataCorePlugin.GameData.LastLapTime')) ==  0 ) {
        return '--:--.---';
    } else {
        return $prop('DataCorePlugin.GameData.LastLapTime');
    }
}
function ld_GetPlayerBestColor() {
    if ( driverdeltatobest(getplayerleaderboardposition()) == 0 ) {
        return ld_theme('ld_uiFastest');
    } else {
        return ld_theme('ld_uiSlower');
    }
}

function ld_GetDriverName(position) {
    const driverName = ld_getSettings('driverName');
    if (drivername(position)) {
        const name = tcase(drivername(position));
        return ld_formatName(name, driverName);
    } else {
        return '';
    } 
}

function ld_getDriverClassIndex(position) {
    var driverClassName = drivercarclass( position );
    for (i=1; i<= getleaderboardcarclasscount(); i++) {
        if ( getleaderboardcarclassname(i) == driverClassName ) {
            var driverClassIndex =  i;
        }
    }
    return driverClassIndex;
}

function ld_GetRelDriverName(relPosition) {
    // Data expected is 'Ahead_01', 'Behind_00'
    // -> PersistantTrackerPlugin.DriverAhead_01_Name
    const driverName = ld_getSettings('driverName');
    if ( $prop('PersistantTrackerPlugin.Driver'+relPosition+'_Name') ) {
        const name = $prop('PersistantTrackerPlugin.Driver'+relPosition+'_Name');
        return ld_formatName(name, driverName);
    } else {
        return '';
    }
}

function ld_GetRelBestLapTime(relPosition) {
    if ( timespantoseconds($prop('PersistantTrackerPlugin.Driver'+relPosition+'_BestLapTime')) ==  0 ) {
        return '--:--.---';
    } else {
        return $prop('PersistantTrackerPlugin.Driver'+relPosition+'_BestLapTime');
    }
}

function ld_GetRelLastLapTime(relPosition) {
    if ( timespantoseconds($prop('PersistantTrackerPlugin.Driver'+relPosition+'_LastLapTime')) ==  0 ) {
        return '--:--.---';
    } else {
        return $prop('PersistantTrackerPlugin.Driver'+relPosition+'_LastLapTime');
    }
}

function ld_GetRelBestColor(relPosition) {
    if ( driverdeltatobest($prop('PersistantTrackerPlugin.Driver'+relPosition+'_Position')) == 0 ) {
        return ld_theme('ld_uiFastest');
    } else {
        return ld_theme('ld_uiTitle');
    }
}

function ld_GetRelDriverColor(relPosition) {
    // Data expected is 'Ahead_01', 'Behind_00'
    // -> PersistantTrackerPlugin.DriverAhead_01_Name
    const driver_gap = drivergaptoplayer( $prop('PersistantTrackerPlugin.Driver'+relPosition+'_Position'));
    const driver_lap = timespantoseconds( driverbestlap( $prop('DataCorePlugin.GameData.BestLapOpponentPosition')+1 ) );
    if (driver_lap > 0 && !ld_isQuali() ) {
        if (
            $prop('PersistantTrackerPlugin.Driver'+relPosition+'_CurrentLap') - $prop('DataCorePlugin.GameData.CompletedLaps') >= 2 ) {
            return ld_theme('ld_tableAhead'); // 2+ Laps Ahead
        } else if (
            $prop('PersistantTrackerPlugin.Driver'+relPosition+'_CurrentLap') - $prop('DataCorePlugin.GameData.CompletedLaps') <= -2 ) {
            return ld_theme('ld_tableBehind'); // 2- Laps Behind
        } else {
            if ( driver_lap + driver_gap < (driver_lap * 0.15) ) {
                return ld_theme('ld_tableAhead'); // Ahead
            } else if ( driver_lap + driver_gap > driver_lap+(driver_lap * 0.85) ) {
                return ld_theme('ld_tableBehind'); // Behind
            } else {
                return ld_theme('ld_tableOpponent'); // Same Lap
            }
        }
    } else {
        return ld_theme('ld_tableOpponent');
    }
}

function ld_GetRelCarLogo (relPosition) {
    // Data expected is 'Ahead_01', 'Behind_00'
    // -> PersistantTrackerPlugin.DriverAhead_01_CarName
    // -> PersistantTrackerPlugin.DriverAhead_01_Position
    let carName;
    ( !$prop('PersistantTrackerPlugin.Driver'+relPosition+'_CarName') ) ? carName = 'none' : carName = $prop('PersistantTrackerPlugin.Driver'+relPosition+'_CarName');
    const carBrand = carName.split(' ');
    let color = '';
    const driver_gap = drivergaptoplayer( $prop('PersistantTrackerPlugin.Driver'+relPosition+'_Position'));
    const driver_lap = timespantoseconds(driverlastlap( $prop('DataCorePlugin.GameData.BestLapOpponentPosition') ));
    if (driver_lap > 0 && $prop('DataCorePlugin.GameData.SessionTypeName') == 'Race') {
        if (
            $prop('PersistantTrackerPlugin.Driver'+relPosition+'_CurrentLap') - $prop('DataCorePlugin.GameData.CurrentLap') >= 2 ) {
            color = '-red' // 2+ Laps Ahead;
        } else if (
            $prop('PersistantTrackerPlugin.Driver'+relPosition+'_CurrentLap') - $prop('DataCorePlugin.GameData.CurrentLap') <= -2 ) {
            color = '-blue' // 2- Laps Behind;
        } else {
            if ( driver_lap + driver_gap < (driver_lap * 0.15) ) {
                color = '-red' // Ahead;
            } else if ( driver_lap + driver_gap > driver_lap+(driver_lap * 0.85) ) {
                color = '-blue' // Behind;
            } else {
                color = '' // Same Lap;
            }
        }
    } else {
        color = '';
    }
    return 'logo-' + lcase(carBrand[0]) + color;
}

function ld_getGapTrackOpponentAhead() {
    return ld_formatTimeShort($prop('PersistantTrackerPlugin.DriverAhead_00_Gap'));
}
function ld_getGapTrackOpponentBehind() {
    return ld_formatTimeShort($prop('PersistantTrackerPlugin.DriverBehind_00_Gap'));
}
function ld_getGapClassOpponentAhead() {
    let myPosInClass = driverclassposition( getplayerleaderboardposition() );
    let oppInClass = myPosInClass - 1;
    let oppInLeaderboard = getopponentleaderboardposition_playerclassonly(oppInClass);
    return ( oppInLeaderboard == -1 ) ? null : '-' + ld_formatNumberShort( Math.abs(driverrelativegaptoplayer( oppInLeaderboard )) );
}
function ld_getGapClassOpponentBehind() {
    let myPosInClass = driverclassposition( getplayerleaderboardposition() );
    let oppInClass = myPosInClass + 1;
    let oppInLeaderboard = getopponentleaderboardposition_playerclassonly(oppInClass);
    return ( oppInLeaderboard == -1 ) ? null : '+' + ld_formatNumberShort( Math.abs(driverrelativegaptoplayer( oppInLeaderboard )) );
}
function ld_getLapsClassOpponentAhead() {
    let myPosInClass = driverclassposition( getplayerleaderboardposition() );
    let oppInClass = myPosInClass - 1;
    let oppInLeaderboard = getopponentleaderboardposition_playerclassonly(oppInClass);
    return ( oppInLeaderboard == -1 ) ? null : '-' + Math.abs(drivercurrentlap( oppInLeaderboard ) - drivercurrentlap( getplayerleaderboardposition() )) + 'L';
}
function ld_getLapsClassOpponentBehind() {
    let myPosInClass = driverclassposition( getplayerleaderboardposition() );
    let oppInClass = myPosInClass + 1;
    let oppInLeaderboard = getopponentleaderboardposition_playerclassonly(oppInClass);
    return ( oppInLeaderboard == -1 ) ? null : '+' + Math.abs(drivercurrentlap( oppInLeaderboard ) - drivercurrentlap( getplayerleaderboardposition() )) + 'L';
}

function ld_formatName (name, mode) {
    if (name!=null) {
        name = name.replace('�0', 'E'); // replace unicode characters
        const full_name = name.split(' ');
        if ( full_name.length > 1 ) { // Check name for more than two parts (firstname & lastname)
            const first_name = full_name.shift();
            const last_name = full_name;
            if (mode == 2) {
                return first_name + ' ' + last_name.join(" ").substr(0,1) + '.';
            } else if (mode == 3) {
                return first_name + ' ' + last_name.join(" ");
            } else {
                return first_name.substr(0,1) + '. ' + last_name.join(" ");
            }
        } else {
            return name;
        }
    } else {
        return '';
    }
}


//
//
// Tires

function ld_getAvgValue(getAvgForProp, lapAvg, resetKey) {
    let ld_getAverage = function (array) {
        let total = 0;
        let count = 0;
        array.forEach(function(item, index) {
            total += item;
            count++;
        });
        return total / count;
    }
    if(root["currentLap"] == null){
        root["currentLap"] = $prop('DataCorePlugin.GameData.CurrentLap');/*  */
    }
    let prop = $prop(getAvgForProp);
    if(root['prop']==null){
        root['prop'] = [];
    }
    if (!$prop('DataCorePlugin.GamePaused') && !$prop('DataCorePlugin.GameData.IsInPitLane') && !$prop('DataCorePlugin.GameRawData.Graphics.IsSetupMenuVisible') && prop != 0) {
        if ($prop('DataCorePlugin.GameData.CurrentLap') - root["currentLap"] < lapAvg && root['prop'].length <= 349) {
            root['prop'].push(prop);
        } else {
            root['prop'].push(prop);
            root['prop'].shift();
        }
    }
    if ($prop('DataCorePlugin.GameData.IsInPitLane') && $prop('DataCorePlugin.GameRawData.Graphics.IsSetupMenuVisible')) {
        root["currentLap"] = null; // Reset laps;
        prop = 0; // Reset Tyre;
    }
    if ( $prop('InputStatus.KeyboardReaderPlugin.'+resetKey) == 1 ) {
        root['prop'] = [];
    }
    return ( Number.isNaN(ld_getAverage(root['prop'])) ) ? '0' : ld_getAverage(root['prop']);
}

function ld_getAvgTireTempColor(tire) {
    // Expected 'TyreTemperatureFrontLeft'
    let tempUnit = 0;
    if ( $prop('DataCorePlugin.GameData.TemperatureUnit') == 'Fahrenheit' ) {
        tempUnit = 1;
    } else if ( $prop('DataCorePlugin.GameData.TemperatureUnit') == 'Kelvin' ) {
        tempUnit = 2;
    }
    const lapAvg = ld_getSettings('tireLapAvg');
    const resetKey = ld_getSettings('tireLapAvgResetKey');
    return mapthreecolors( 
        ld_getAvgValue(tire, lapAvg, resetKey),
        coldTireTemp[tempUnit], optimumTireTemp[tempUnit], hotTireTemp[tempUnit],
        ld_theme('ld_uiTempCold'),
        ld_theme('ld_uiTempOptimum'),
        ld_theme('ld_uiTempHot')
    )
}

function ld_getTireTempColor(tire) {
    // Expected 'TyreTemperatureFrontLeft'
    let tempUnit = 0;
    if ( $prop('DataCorePlugin.GameData.TemperatureUnit') == 'Fahrenheit' ) {
        tempUnit = 1;
    } else if ( $prop('DataCorePlugin.GameData.TemperatureUnit') == 'Kelvin' ) {
        tempUnit = 2;
    }
    return mapthreecolors( 
        $prop(tire),
        coldTireTemp[tempUnit], optimumTireTemp[tempUnit], hotTireTemp[tempUnit],
        ld_theme('ld_uiTempCold'),
        ld_theme('ld_uiTempOptimum'),
        ld_theme('ld_uiTempHot')
    )
}

/* function ld_saveValue(value) {
    if (!$prop('DataCorePlugin.GamePaused') && !$prop('DataCorePlugin.GameData.IsInPitLane') && !$prop('DataCorePlugin.GameRawData.Graphics.IsSetupMenuVisible') && value != 0) {
        root['savedValue'] = value;
    }
    return ( Number.isNaN(root['savedValue']) ) ? '---' : root['savedValue'];
} */

function ld_tireSlipLock(tire) {
    var wheelSlip;
    var wheelSpeed;
    var tire = tire;

    if ( $prop('DataCorePlugin.CurrentGame') == 'Automobilista2' ) {
        wheelSlip = ( $prop('DataCorePlugin.GameRawData.mTyreGrip'+tire) < 0.1 ) ? 2 : 0;
        wheelSpeed = $prop('DataCorePlugin.GameRawData.Physics.WheelAngularSpeed'+tire);
        
    } else if ( $prop('DataCorePlugin.CurrentGame') == 'RFactor2' || $prop('DataCorePlugin.CurrentGame') == 'LMU' ) {
        wheelSlip = $prop('DataCorePlugin.GameRawData.mTyreSlipSpeed'+tire);
        wheelSpeed = $prop('DataCorePlugin.GameRawData.Physics.WheelAngularSpeed'+tire);
        
    } else if ( $prop('DataCorePlugin.CurrentGame').startsWith('F120') ) {
        if ($prop('GameRawData.PlayerMotionData.m_wheelSlip03') * 100 > 25) {
            return ld_themeImage('slip');
        } else if ($prop('GameRawData.PlayerMotionData.m_wheelSlip03') * 100 < -50) {
            return ld_themeImage('lock');
        } else {
            return null;
        }

    } else { // Default
        wheelSlip = $prop('DataCorePlugin.GameRawData.Physics.WheelSlip'+tire);
        wheelSpeed = $prop('DataCorePlugin.GameRawData.Physics.WheelAngularSpeed'+tire);
    }

    if ( wheelSlip > 1 ) {
        if ( ld_isIncreasing($prop('DataCorePlugin.GameData.SpeedLocal')) ) {
            return ld_themeImage('slip');
        } else if ( wheelSpeed == 0 ) {
            return ld_themeImage('lock');
        } else {  
            return null;
        }
    } else {  
        return null;
    }
}

function ld_tireSlipLockColor(tire) {
    var wheelSlip;
    var wheelSpeed;
    var tire = tire;

    if ( $prop('DataCorePlugin.CurrentGame') == 'Automobilista2' ) {
        wheelSlip = ( $prop('DataCorePlugin.GameRawData.mTyreGrip'+tire) < 0.1 ) ? 2 : 0;
        wheelSpeed = $prop('DataCorePlugin.GameRawData.Physics.WheelAngularSpeed'+tire);
        
    } else if ( $prop('DataCorePlugin.CurrentGame') == 'RFactor2' || $prop('DataCorePlugin.CurrentGame') == 'LMU' ) {
        wheelSlip = $prop('DataCorePlugin.GameRawData.mTyreSlipSpeed'+tire);
        wheelSpeed = $prop('DataCorePlugin.GameRawData.Physics.WheelAngularSpeed'+tire);
        
    } else if ( $prop('DataCorePlugin.CurrentGame').startsWith('F120') ) {
        if ($prop('GameRawData.PlayerMotionData.m_wheelSlip03') * 100 > 25) {
            return ld_theme('ld_uiBlue');
        } else if ($prop('GameRawData.PlayerMotionData.m_wheelSlip03') * 100 < -50) {
            return ld_theme('ld_uiYellow');
        } else {
            return ld_theme('ld_uiTitle');
        }

    } else { // Default
        wheelSlip = $prop('DataCorePlugin.GameRawData.Physics.WheelSlip'+tire);
        wheelSpeed = $prop('DataCorePlugin.GameRawData.Physics.WheelAngularSpeed'+tire);
    }

    if ( wheelSlip > 1 ) {
        if ( ld_isIncreasing($prop('DataCorePlugin.GameData.SpeedLocal')) ) {
            return ld_theme('ld_uiBlue');
        } else if ( wheelSpeed == 0 ) {
            return ld_theme('ld_uiYellow');
        } else {  
            return ld_theme('ld_uiTitle');
        }
    } else {  
        return ld_theme('ld_uiTitle');
    }
}


//
//
// Brakes
function ld_getAvgBrakeTempColor(brake) {
    // Expected 'TyreTemperatureFrontLeft'
    let tempUnit = 0;
    if ( $prop('DataCorePlugin.GameData.TemperatureUnit') == 'Fahrenheit' ) {
        tempUnit = 1;
    } else if ( $prop('DataCorePlugin.GameData.TemperatureUnit') == 'Kelvin' ) {
        tempUnit = 2;
    }
    const lapAvg = ld_getSettings('tireLapAvg');
    const resetKey = ld_getSettings('tireLapAvgResetKey');
    return mapthreecolors( 
        ld_getAvgValue(brake, lapAvg, resetKey),
        coldBrakeTemp[tempUnit], optimumBrakeTemp[tempUnit], hotBrakeTemp[tempUnit],
        ld_theme('ld_uiTempCold'),
        ld_theme('ld_uiTempOptimum'),
        ld_theme('ld_uiTempHot')
    )
}

function ld_getBrakeTempColor(brake) {
    // Expected 'TyreTemperatureFrontLeft'
    let tempUnit = 0;
    if ( $prop('DataCorePlugin.GameData.TemperatureUnit') == 'Fahrenheit' ) {
        tempUnit = 1;
    } else if ( $prop('DataCorePlugin.GameData.TemperatureUnit') == 'Kelvin' ) {
        tempUnit = 2;
    }
    return mapthreecolors( 
        $prop(brake),
        coldBrakeTemp[tempUnit], optimumBrakeTemp[tempUnit], hotBrakeTemp[tempUnit],
        ld_theme('ld_uiTempCold'),
        ld_theme('ld_uiTempOptimum'),
        ld_theme('ld_uiTempHot')
    )
}

//
//
// Estimated Lap
function ld_getEstimatedLapTime() {
    if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBasedSimhub')) != 0 ) {
        // Origin Game: Does not work with multi drivers
        //return $prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBased');
        
        // Origin Simhub: Testing
        return $prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBasedSimhub');

        // Origin Simhub: Compares to personal best only
        //return $prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased');
    } else if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) != 0 ) {
        return $prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased');
    } else {
        return $prop('CurrentLapTime');
    }
}

function ld_getEstimatedDelta() {
    if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBasedSimhub')) != 0 ) {
        //return ld_formatTime( timespantoseconds( $prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBased')) - timespantoseconds( $prop('DataCorePlugin.GameData.BestLapTime') ) );
        return ld_formatTime( timespantoseconds( $prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBasedSimhub')) - timespantoseconds( $prop('DataCorePlugin.GameData.BestLapTime') ) );
    } else if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) != 0 ) {
        return ld_formatTime( timespantoseconds( $prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) - timespantoseconds( $prop('PersistantTrackerPlugin.AllTimeBest') ) );
    } else {
        return ld_formatTime( 0 );
    }
}

function ld_getEstimatedLabel() {
    if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBasedSimhub')) != 0 ) {
        return 'ESTIMATED LAP';
    } else if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) != 0 ) {
        return 'ESTIMATED LAP (ALL TIME:                     )';
    } else {
        return 'CURRENT LAP';
    }
}

function ld_getEstimatedColour() {
    if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBasedSimhub')) != 0 ) {
        var timeDiffMine = timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBasedSimhub')) - timespantoseconds( $prop('DataCorePlugin.GameData.BestLapTime') );
        var timeDiffOverall = timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBasedSimhub')) - timespantoseconds( driverbestlap( $prop('DataCorePlugin.GameData.BestLapOpponentPosition')+1 ) );
        //var timeDiffMine = timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) - timespantoseconds( $prop('PersistantTrackerPlugin.AllTimeBest') );
        //var timeDiffOverall = timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) - timespantoseconds( driverbestlap( $prop('DataCorePlugin.GameData.BestLapOpponentPosition')+1 ) );
    } else if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) != 0 ) {
        var timeDiffMine = timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) - timespantoseconds( $prop('PersistantTrackerPlugin.AllTimeBest') );
        var timeDiffOverall = timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) - timespantoseconds( driverbestlap( $prop('DataCorePlugin.GameData.BestLapOpponentPosition')+1 ) );
     } else {
        var timeDiffMine = null;
        var timeDiffOverall = null;
    }
    if ( ld_getSim() == 'IRacing' ) {
        // Calculate Off Tracks
        if( root["offTrack"] == null ) {
            root["offTrack"] = 0;
        }
        if ( $prop('DataCorePlugin.GameRawData.Telemetry.PlayerTrackSurface') == 0 ) {
            root["offTrack"]++;
        }
        if ( $prop('DataCorePlugin.GameData.TrackPositionPercent') < 0.001 ) {
            root["offTrack"] = 0;
        }
        if ( root["offTrack"] > 0 && $prop('DataCorePlugin.GameData.SessionTypeName') != 'Race') {
            return ld_theme('ld_uiInvalid');
        } else {
            if ( timeDiffMine > 0 ) {
                return ld_theme('ld_uiSlower');
            } else {
                if ( timeDiffOverall > 0 ) {
                    return ld_theme('ld_uiFaster');
                } else {
                    return ld_theme('ld_uiFastest');
                }
            }
        }
    } else if ( ld_getSim() == 'Automobilista2') {
        if ( $prop('DataCorePlugin.GameRawData.mLapInvalidated') == false ) {
            if ( timeDiffMine > 0 ) {
                return ld_theme('ld_uiSlower');
            } else {
                if ( timeDiffOverall > 0 ) {
                    return ld_theme('ld_uiFaster');
                } else {
                    return ld_theme('ld_uiFastest');
                }
            }
        } else {
            return ld_theme('ld_uiInvalid');
        }
    } else if ( ld_getSim() == 'RFactor2' || ld_getSim() == 'LMU' ) {
        if ( timeDiffMine > 0 ) {
            return ld_theme('ld_uiSlower');
        } else {
            if ( timeDiffOverall > 0 ) {
                return ld_theme('ld_uiFaster');
            } else {
                return ld_theme('ld_uiFastest');
            }
        }
    } else if ( ld_getSim() == 'AC' ) {
        if ( timeDiffMine > 0 ) {
            return ld_theme('ld_uiSlower');
        } else {
            if ( timeDiffOverall > 0 ) {
                return ld_theme('ld_uiFaster');
            } else {
                return ld_theme('ld_uiFastest');
            }
        }
    } else if ( ld_getSim() == "F1" ) {
        fastestLap = timespantoseconds(isnull(driverbestlap($prop('DataCorePlugin.GameData.BestLapOpponentPosition')+1), '0:00.000'));
        if ( ! timespantoseconds($prop('DataCorePlugin.GameData.BestLapTime')) > 0) {
            return ld_theme('ld_uiNeutral');
        } else if ( $prop('GameRawData.PlayerLapData.m_currentLapInvalid') == 0) {

            if ( timeDiffMine > 0 ) {
                return ld_theme('ld_uiSlower');
            } else {
                if ( timeDiffOverall > 0 ) {
                    return ld_theme('ld_uiFaster');
                } else {
                    return ld_theme('ld_uiFastest');
                }
            }
        
        } else {
            return ld_theme('ld_uiInvalid');
        }
    } else {
        if ( $prop('DataCorePlugin.GameRawData.Graphics.isValidLap') == 1 ) {

            if ( timeDiffMine == null & timeDiffOverall == null) {
                return ld_theme('ld_uiTitle');
            } else if ( timeDiffMine > 0 ) {
                return ld_theme('ld_uiSlower');
            } else {
                if ( timeDiffOverall > 0 ) {
                    return ld_theme('ld_uiFaster');
                } else {
                    return ld_theme('ld_uiFastest');
                }
            }

        } else {
            return ld_theme('ld_uiInvalid');
        }
    }
}

function ld_isLapInvalid () {
    let pos = getplayerleaderboardposition() - 1;
    return ( $prop('DataCorePlugin.GameRawData.Graphics.isValidLap') == 0 || NewRawData().Cars[pos].CurrentLap.IsInvalid ) ? true : false;
}

function ld_getEstimatedTextColour() {
    if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBasedSimhub')) != 0 ) {
        var timeDiffMine = timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBasedSimhub')) - timespantoseconds( $prop('DataCorePlugin.GameData.BestLapTime') );
        var timeDiffOverall = timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBasedSimhub')) - timespantoseconds( driverbestlap( $prop('DataCorePlugin.GameData.BestLapOpponentPosition')+1 ) );
        //var timeDiffMine = timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) - timespantoseconds( $prop('DataCorePlugin.GameData.BestLapTime') );
        //var timeDiffOverall = timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) - timespantoseconds( driverbestlap( $prop('DataCorePlugin.GameData.BestLapOpponentPosition')+1 ) );
    } else if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) != 0 ) {
        var timeDiffMine = timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) - timespantoseconds( $prop('DataCorePlugin.GameData.BestLapTime') );
        var timeDiffOverall = timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) - timespantoseconds( driverbestlap( $prop('DataCorePlugin.GameData.BestLapOpponentPosition')+1 ) );
     } else {
        var timeDiffMine = null;
        var timeDiffOverall = null;
    }
    if ( ld_getSim() == 'IRacing' ) {
        // Calculate Off Tracks
        if( root["offTrack"] == null ) {
            root["offTrack"] = 0;
        }
        if ( $prop('DataCorePlugin.GameRawData.Telemetry.PlayerTrackSurface') == 0 ) {
            root["offTrack"]++;
        }
        if ( $prop('DataCorePlugin.GameData.TrackPositionPercent') < 0.001 ) {
            root["offTrack"] = 0;
        }
        if ( root["offTrack"] > 0 && $prop('DataCorePlugin.GameData.SessionTypeName') != 'Race') {
            return ld_theme('ld_uiInvalidText'); // red bg
        } else {
            return ld_theme('ld_uiTimingText');
        }
    } else if ( ld_getSim() == 'Automobilista2') {
        if ( $prop('DataCorePlugin.GameRawData.mLapInvalidated') == false ) {
            return ld_theme('ld_uiTimingText') ;
        } else {
            return ld_theme('ld_uiInvalidText'); // red bg
        }
    } else if ( ld_getSim() == 'RFactor2' || ld_getSim() == 'LMU' ) {
        return ld_theme('ld_uiTimingText');
    } else if ( ld_getSim() == 'AC' ) {
        return ld_theme('ld_uiTimingText');
    } else if ( ld_getSim() == "F1" ) {
        fastestLap = timespantoseconds(isnull(driverbestlap($prop('DataCorePlugin.GameData.BestLapOpponentPosition')+1), '0:00.000'));
        if ( ! timespantoseconds($prop('DataCorePlugin.GameData.BestLapTime')) > 0) {
            return ld_theme('ld_uiInvalidText');
        } else if ( $prop('GameRawData.PlayerLapData.m_currentLapInvalid') == 0) {

            return ld_theme('ld_uiTimingText');
        
        } else {
            return ld_theme('ld_uiInvalidText'); // red bg
        }
    } else {
        if ( $prop('DataCorePlugin.GameRawData.Graphics.isValidLap') == 1 ) {

            return ld_theme('ld_uiTimingText');

        } else {
            return ld_theme('ld_uiInvalidText'); // red bg
        }
    }
}

function ld_getPreviousColour () {
    if ( ld_getSim() == 'IRacing' ) {
        var timeDiffMine = timespantoseconds($prop('DataCorePlugin.GameData.LastLapTime')) - timespantoseconds( $prop('DataCorePlugin.GameData.BestLapTime') );
        var timeDiffOverall = timespantoseconds($prop('DataCorePlugin.GameData.LastLapTime')) - timespantoseconds( driverbestlap( $prop('DataCorePlugin.GameData.BestLapOpponentPosition')+1 ) );
        if ( timeDiffMine > 0 ) {
            return ld_theme('ld_uiSlower');
        } else {
            if ( timeDiffOverall > 0 ) {
                return ld_theme('ld_uiFaster');
            } else {
                return ld_theme('ld_uiFastest');
            }
        }
    } else if ( ld_getSim() == 'AssettoCorsaCompetizione' ) {
        // ACC
        if ( $prop('DataCorePlugin.GameRawData.Graphics.isValidLap') == 1 ) {
            var timeDiffMine = timespantoseconds($prop('DataCorePlugin.GameData.LastLapTime')) - timespantoseconds( $prop('DataCorePlugin.GameData.BestLapTime') );
            var timeDiffOverall = timespantoseconds($prop('DataCorePlugin.GameData.LastLapTime')) - timespantoseconds( driverbestlap( $prop('DataCorePlugin.GameData.BestLapOpponentPosition')+1 ) );
            
            if ( timeDiffMine > 0 ) {
                return ld_theme('ld_uiSlower');
            } else {
                if ( timeDiffOverall > 0 ) {
                    return ld_theme('ld_uiFaster');
                } else {
                    return ld_theme('ld_uiFastest');
                }
            }
        } else {
            return ld_theme('ld_uiInvalid');
        }
    } else if ( ld_getSim() == 'Automobilista2' ) {
        // AMS2
        if ( $prop('DataCorePlugin.GameRawData.mLapInvalidated') == false ) {
            var timeDiffMine = timespantoseconds($prop('DataCorePlugin.GameData.LastLapTime')) - timespantoseconds( $prop('DataCorePlugin.GameData.BestLapTime') );
            var timeDiffOverall = timespantoseconds($prop('DataCorePlugin.GameData.LastLapTime')) - timespantoseconds( driverbestlap( $prop('DataCorePlugin.GameData.BestLapOpponentPosition')+1 ) );
            if ( timeDiffMine > 0 ) {
                return ld_theme('ld_uiSlower');
            } else {
                if ( timeDiffOverall > 0 ) {
                    return ld_theme('ld_uiFaster');
                } else {
                    return ld_theme('ld_uiFastest');
                }
            }
        } else {
            return ld_theme('ld_uiInvalid');
        }
    } else if ( ld_getSim() == 'RFactor2' || ld_getSim() == 'LMU' ) {
        // rF2
        if ( $prop('DataCorePlugin.GameData.LapInvalidated') == false ) {
            var timeDiffMine = timespantoseconds($prop('DataCorePlugin.GameData.LastLapTime')) - timespantoseconds( $prop('DataCorePlugin.GameData.BestLapTime') );
            var timeDiffOverall = timespantoseconds($prop('DataCorePlugin.GameData.LastLapTime')) - timespantoseconds( driverbestlap( $prop('DataCorePlugin.GameData.BestLapOpponentPosition')+1 ) );
            if ( timeDiffMine > 0 ) {
                return ld_theme('ld_uiSlower');
            } else {
                if ( timeDiffOverall > 0 ) {
                    return ld_theme('ld_uiFaster');
                } else {
                    return ld_theme('ld_uiFastest');
                }
            }
        } else {
            return ld_theme('ld_uiInvalid');
        }
    } else {
        if ( timespantoseconds($prop('DataCorePlugin.GameData.LastLapTime')) == 0 ) {
            return ld_theme('ld_uiNeutral');
        } else if (!$prop('LapInvalidated')) {
            var timeDiffMine = timespantoseconds($prop('DataCorePlugin.GameData.LastLapTime')) - timespantoseconds( $prop('DataCorePlugin.GameData.BestLapTime') );
            var timeDiffOverall = timespantoseconds($prop('DataCorePlugin.GameData.LastLapTime')) - timespantoseconds( driverbestlap( $prop('DataCorePlugin.GameData.BestLapOpponentPosition')+1 ) );
            if ( timeDiffMine > 0 ) {
                return ld_theme('ld_uiSlower');
            } else {
                if ( timeDiffOverall > 0 ) {
                    return ld_theme('ld_uiFaster');
                } else {
                    return ld_theme('ld_uiFastest');
                }
            }
        } else {
            return ld_theme('ld_uiInvalid');
        }
    }
}

function ld_getPreviousTextColour () {
    if ( ld_getSim() == 'IRacing' ) {
		var timeDiffMine = timespantoseconds($prop('DataCorePlugin.GameData.LastLapTime')) - timespantoseconds( $prop('DataCorePlugin.GameData.BestLapTime') );
		var timeDiffOverall = timespantoseconds($prop('DataCorePlugin.GameData.LastLapTime')) - timespantoseconds( driverbestlap( $prop('DataCorePlugin.GameData.BestLapOpponentPosition')+1 ) );
		if ( timeDiffMine > 0 ) {
			return ld_theme('ld_uiTimingText'); // Yellow
		} else {
			if ( timeDiffOverall > 0 ) {
				return ld_theme('ld_uiTimingText'); // Green
			} else {
				return ld_theme('ld_uiTimingText'); // Purple
			}
		}
    } else if ( ld_getSim() == 'AssettoCorsaCompetizione' ) {
        // ACC
        if ( $prop('DataCorePlugin.GameRawData.Graphics.isValidLap') == 1 ) {
            var timeDiffMine = timespantoseconds($prop('DataCorePlugin.GameData.LastLapTime')) - timespantoseconds( $prop('DataCorePlugin.GameData.BestLapTime') );
            var timeDiffOverall = timespantoseconds($prop('DataCorePlugin.GameData.LastLapTime')) - timespantoseconds( driverbestlap( $prop('DataCorePlugin.GameData.BestLapOpponentPosition')+1 ) );
            if ( timeDiffMine > 0 ) {
                return ld_theme('ld_uiTimingText'); // Yellow
            } else {
                if ( timeDiffOverall > 0 ) {
                    return ld_theme('ld_uiTimingText'); // Green
                } else {
                    return ld_theme('ld_uiTimingText'); // Purple
                }
            }
        } else {
            return ld_theme('ld_uiInvalidText');
        }
    } else if ( ld_getSim() == 'Automobilista2' ) {
        // AMS2
        if ( $prop('DataCorePlugin.GameRawData.mLapInvalidated') == false ) {
            var timeDiffMine = timespantoseconds($prop('DataCorePlugin.GameData.LastLapTime')) - timespantoseconds( $prop('DataCorePlugin.GameData.BestLapTime') );
            var timeDiffOverall = timespantoseconds($prop('DataCorePlugin.GameData.LastLapTime')) - timespantoseconds( driverbestlap( $prop('DataCorePlugin.GameData.BestLapOpponentPosition')+1 ) );
            if ( timeDiffMine > 0 ) {
                return ld_theme('ld_uiTimingText'); // Yellow
            } else {
                if ( timeDiffOverall > 0 ) {
                    return ld_theme('ld_uiTimingText'); // Green
                } else {
                    return ld_theme('ld_uiTimingText'); // Purple
                }
            }
        } else {
            return ld_theme('ld_uiInvalidText');
        }
    } else if ( ld_getSim() == 'RFactor2' || ld_getSim() == 'LMU' ) {
        // rF2
        if ( $prop('DataCorePlugin.GameData.LapInvalidated') == false ) {
            var timeDiffMine = timespantoseconds($prop('DataCorePlugin.GameData.LastLapTime')) - timespantoseconds( $prop('DataCorePlugin.GameData.BestLapTime') );
            var timeDiffOverall = timespantoseconds($prop('DataCorePlugin.GameData.LastLapTime')) - timespantoseconds( driverbestlap( $prop('DataCorePlugin.GameData.BestLapOpponentPosition')+1 ) );
            if ( timeDiffMine > 0 ) {
                return ld_theme('ld_uiTimingText'); // Yellow
            } else {
                if ( timeDiffOverall > 0 ) {
                    return ld_theme('ld_uiTimingText'); // Green
                } else {
                    return ld_theme('ld_uiTimingText'); // Purple
                }
            }
        } else {
            return ld_theme('ld_uiInvalidText');
        }
    } else {
        if ( ! timespantoseconds($prop('DataCorePlugin.GameData.BestLapTime')) > 0) {
            return ld_theme('ld_uiTimingText');
        } else if (!$prop('LapInvalidated')) {
            var timeDiffMine = timespantoseconds($prop('DataCorePlugin.GameData.LastLapTime')) - timespantoseconds( $prop('DataCorePlugin.GameData.BestLapTime') );
            var timeDiffOverall = timespantoseconds($prop('DataCorePlugin.GameData.LastLapTime')) - timespantoseconds( driverbestlap( $prop('DataCorePlugin.GameData.BestLapOpponentPosition')+1 ) );
            if ( timeDiffMine > 0 ) {
                return ld_theme('ld_uiTimingText'); // Yellow
            } else {
                if ( timeDiffOverall > 0 ) {
                    return ld_theme('ld_uiTimingText'); // Green
                } else {
                    return ld_theme('ld_uiTimingText'); // Purple
                }
            }
        } else {
            return ld_theme('ld_uiInvalidText');
        }
    }
}

//
//
// Sectors
function ld_sectorCount() {
    return $prop('DataCorePlugin.GameData.SectorsCount');
}

function ld_sectorSegmentWidth(sector) {
    if ( sector == ld_sectorCount() ) {
        return 160 / ld_sectorCount();
    } else {
        return 160 / ld_sectorCount() - 1;
    }
}

function ld_sectorSegmentPos(sector) {
    return (160 / ld_sectorCount() ) * (sector-1);
}


function ld_sectorSegmentColor(sector) {
    var timeDiff = timespantoseconds( currentlapgetsectortime(sector, false) ) - 
                timespantoseconds( bestsectortime(sector, false) );
    var timeDiffOverall = timespantoseconds( currentlapgetsectortime(sector, false) ) - 
                timespantoseconds( getbestsplittime(sector) );
    if (sector >= $prop('DataCorePlugin.GameData.CurrentSectorIndex') ) {
        return ld_theme('ld_uiNeutral');
    } else if ( timeDiffOverall <= 0 ) {
        return ld_theme('ld_uiFastest');
    } else if (timeDiff <= 0) {
        return ld_theme('ld_uiFaster');
    } else {
        return ld_theme('ld_uiSlower');
    }
}
function ld_sectorLastSegmentColor(sector) {
    var timeDiff = timespantoseconds( lastlapgetsectortime(sector, false) ) - 
                timespantoseconds( bestsectortime(sector, false) );
    var timeDiffOverall = timespantoseconds( lastlapgetsectortime(sector, false) ) - 
                timespantoseconds( getbestsplittime(sector) );
    if ( timeDiffOverall == 0 ) {
        return ld_theme('ld_uiFastest');
    } else if (timeDiff <= 0) {
        return ld_theme('ld_uiFaster');
    } else {
        return ld_theme('ld_uiSlower');
    }
}

function ld_driverSectorSegmentColor(driver, sector) {
    var timeDiff = timespantoseconds( driversectorcurrentlap( driver, sector, false) ) - 
                    timespantoseconds( driversectorbest( driver, sector, false) );
    var timeDiffOverall = timespantoseconds( driversectorcurrentlap( driver, sector, false) ) - 
                timespantoseconds( getbestsplittime( sector ) );
    if (sector >= drivercurrentsector( driver ) ) {
        return ld_theme('ld_uiNeutral');
    } else if ( timeDiffOverall <= 0 ) {
        return ld_theme('ld_uiFastest');
    } else if (timeDiff <= 0) {
        return ld_theme('ld_uiFaster');
    } else {
        return ld_theme('ld_uiSlower') ;
    }
}

//
//
// Track Data
function ld_trackData() {
    if ( $prop('DataCorePlugin.CurrentGame') != null && $prop('DataCorePlugin.GameData.TrackId') != null ) {
        var json_track = null;
        var track_data = null;
        let getGameId = $prop('DataCorePlugin.CurrentGame').toLowerCase();
        let getTrackId = $prop('DataCorePlugin.GameData.TrackId').replace(/\s/g, '').toLowerCase();
        let getTrackUrl = 'https://raw.githubusercontent.com/Lovely-Sim-Racing/lovely-track-data/main/data/'+getGameId+'/'+getTrackId+'.json';
        if( json_track == null ){
            json_track = downloadstring( 81920, getTrackUrl ); //async
            if ( json_track != null && !json_track.startsWith('ERROR') ){
                track_data = JSON.parse(JSON.stringify(JSON.parse(json_track)));
            }
            root['currentTrack'] = getTrackId;
        }
        if ( root['currentTrack'] != getTrackId ) { json_track = null; }
        if ( json_track != null && track_data == null ) {
            return null;
        } else {
            return track_data;
        }
    } else {
        return null;
    }
}

function ld_getTrackName(trackData) {
    if ( trackData ) {
        return trackData.name
    } else {
        if ( ld_getSim()=='ACC') {
            if ($prop('DataCorePlugin.GameRawData.Track.TrackName')) {
                return tcase($prop('DataCorePlugin.GameRawData.Track.TrackName'))
            } else {
                return ''
            }
        } else if ( ld_getSim()=='IRacing') {
            if ($prop('DataCorePlugin.GameRawData.SessionData.WeekendInfo.TrackDisplayName')) {
                return $prop('DataCorePlugin.GameRawData.SessionData.WeekendInfo.TrackDisplayName')
            } else {
                return ''
            }
        } else if ( ld_getSim()=='AC') {
            if ($prop('DataCorePlugin.GameRawData.Track.TrackInfo.name')) {
                return $prop('DataCorePlugin.GameRawData.Track.TrackInfo.name')
            } else {
                return ''
            }
        } else {
            if ($prop('DataCorePlugin.GameData.TrackName')) {
                return $prop('DataCorePlugin.GameData.TrackName')
            } else {
                return ''
            }
        }
    }
}

function ld_getTrackSegment(trackData) {
    if ( !trackData || trackData == undefined ) { return null }
    const trackTurns = trackData.turn;
    const trackStraights = trackData.straight;
    let currentPosition = drivertrackpositionpercent( getplayerleaderboardposition() );
    let margin = 0.01;

    // Get Turns first
    for ( const turn in trackTurns ) {
        if (trackTurns[turn].start && trackTurns[turn].end) {
            if ( currentPosition >= (trackTurns[turn].start) && currentPosition <= (trackTurns[turn].end) ) {
                return trackTurns[turn].name;
            }
        } else {
            if ( currentPosition >= (trackTurns[turn].marker - margin) && currentPosition <= (trackTurns[turn].marker + margin) ) {
                return trackTurns[turn].name;
            }
        }
    }
    // Then get straights
    for ( const straight in trackStraights ) {
        if (trackStraights[straight].start && trackStraights[straight].end) {
            if ( currentPosition >= (trackStraights[straight].start) && currentPosition <= (trackStraights[straight].end) ) {
                return trackStraights[straight].name;
            }
        }
    }
    return null;
}

function ld_getTrackTurn(trackData) {
    if ( !trackData || trackData == undefined ) { return null }
    const trackTurns = trackData.turn;
    let currentPosition = drivertrackpositionpercent( getplayerleaderboardposition() );
    let margin = 0.01;

    // Get Turns first
    for ( const turn in trackTurns ) {
        if (trackTurns[turn].start && trackTurns[turn].end) {
            if ( currentPosition >= (trackTurns[turn].start) && currentPosition <= (trackTurns[turn].end) ) {
                return parseInt(turn) + 1;
            }
        } else {
            if ( currentPosition >= (trackTurns[turn].marker - margin) && currentPosition <= (trackTurns[turn].marker + margin) ) {
                return parseInt(turn) + 1;
            }
        }
    }
    return null;
}

//
//
// Generic 
function ld_changed(delay, value) {
	root['ld_time'] = Math.floor($prop('DataCorePlugin.CustomExpression.CurrentDateTime').getTime())/1000;
	root['ld_oldstate'] = root['ld_oldstate'] == null ? value : root['ld_newstate'];
	root['ld_newstate'] = value;
	if (root['ld_newstate'] != root['ld_oldstate']) {
		root['ld_triggerTime'] = root['ld_time'];
	}
	return root['ld_triggerTime'] == null ? false : root['ld_time'] - root['ld_triggerTime'] <= delay/1000;
}


function ld_isQuali() {
    if ( ld_getSim() == 'IRacing' ) {
        return ( 
            $prop('DataCorePlugin.GameData.SessionTypeName')=='Open Qualify' || 
            $prop('DataCorePlugin.GameData.SessionTypeName')=='Lone Qualify' || 
            $prop('DataCorePlugin.GameData.SessionTypeName')=='Open Practice' || 
            $prop('DataCorePlugin.GameData.SessionTypeName')=='Practice' || 
            $prop('DataCorePlugin.GameData.SessionTypeName')=='Offline Testing'
        ) ? true : false;
    } else if ( ld_getSim() == 'Automobilista2' ) {
        return ( 
            $prop('DataCorePlugin.GameData.SessionTypeName')=='QUALIFY' ||
            $prop('DataCorePlugin.GameData.SessionTypeName')=='PRACTICE'
        ) ? true : false;
    } else if ( ld_getSim() == 'RFactor2' || ld_getSim() == 'LMU' ) {
        return ( 
            $prop('DataCorePlugin.GameData.SessionTypeName')=='Qualify' ||
            $prop('DataCorePlugin.GameData.SessionTypeName')=='Practice'
        ) ? true : false;
    } else if ( ld_getSim() == "F1" ) {
        return ( 
            $prop('GameRawData.PacketSessionData.m_sessionType') < 10
            // 0 = unknown, 1 = P1, 2 = P2, 3 = P3, 4 = Short P, 5 = Q1
            // 6 = Q2, 7 = Q3, 8 = Short Q, 9 = OSQ, 10 = R, 11 = R2
            // 12 = Time Trial
        ) ? true : false;
    } else {
        return ( 
            ucase($prop('DataCorePlugin.GameData.SessionTypeName')) =='QUALIFY' ||
            ucase($prop('DataCorePlugin.GameData.SessionTypeName')) =='PRACTICE'
        ) ? true : false;
    }
}

function ld_getSim() {
    let currentGame = $prop('DataCorePlugin.CurrentGame');
    switch (currentGame) {
        case "AssettoCorsaCompetizione": 
            return "ACC";
        case "AssettoCorsa": 
            return "AC";
        case "IRacing": 
            return "IRacing";
        case "Automobilista2": 
            return "Automobilista2";
        case "RFactor2": 
            return "RFactor2";
        case "LMU": 
            return "LMU";
        case "F12020":
        case "F12021":
        case "F12022":
        case "F12023":
        case "F12024":
            return "F1";
        default:
            return "generic";
    }
}

function ld_alertDelay(status, delay) {
    const alertStatus = ld_getSettings(status)
    const alertDelay = ld_getSettings(delay)

    if ( alertStatus == 0 ) { return 0 }
    if ( ld_getSim() == 'IRacing' ) {
        if ( $prop('DataCorePlugin.GameData.CompletedLaps') > 1 && $prop('DataCorePlugin.GameRawData.Telemetry.LapCurrentLapTime') < alertDelay/1000 && timespantoseconds($prop('DataCorePlugin.GameRawData.Telemetry.LapCurrentLapTime')) != 0 ) {
            return 1
        } else {
            return 0
        }
    } else if ( ld_getSim() == 'Automobilista2' ) {
        if ( $prop('DataCorePlugin.GameData.CompletedLaps') > 1 && timespantoseconds($prop('DataCorePlugin.GameData.CurrentLapTime')) < (alertDelay/1000) && timespantoseconds($prop('DataCorePlugin.GameData.CurrentLapTime')) != 0 ) {
            return 1
        } else {
            return 0
        }
    } else if ( ld_getSim() == 'RFactor2' || ld_getSim() == 'LMU' ) {
        if ( $prop('DataCorePlugin.GameData.CompletedLaps') > 1 && timespantoseconds($prop('DataCorePlugin.GameData.CurrentLapTime'))*1000 < alertDelay && timespantoseconds($prop('DataCorePlugin.GameData.CurrentLapTime'))*1000 != 0) {
            return 1
        } else {
            return 0
        }
    } else if ( ld_getSim() == "F1") {
        if ( $prop('DataCorePlugin.GameData.CompletedLaps') > 1 && timespantoseconds($prop('DataCorePlugin.GameData.CurrentLapTime'))*1000 < alertDelay && timespantoseconds($prop('DataCorePlugin.GameData.CurrentLapTime'))*1000 != 0) {
            return 1
        } else {
            return 0
        }
    } else {
        if ( $prop('DataCorePlugin.GameData.CompletedLaps') > 1 && $prop('DataCorePlugin.GameRawData.Graphics.iCurrentTime') < alertDelay && $prop('DataCorePlugin.GameRawData.Graphics.iCurrentTime') != 0 ) {
            return 1
        } else {
            return 0
        }
    }
}



function ld_formatTime(time) {
    if (time > -10 && time < 10) {
		return format(time, '0.000', true);
	} else if (time > -100 && time < 100) {
		return format(time, '00.00', true);
	} else if (time > -1000 && time < 1000) {
		return format(time, '000.0', true);
	} else {
		return format(time, '000', true);
	}
}

function ld_formatTimeShort(time) {
    if (time > -10 && time < 10) {
		return format(time, '0.00', true);
	} else if (time > -100 && time < 100) {
		return format(time, '00.0', true);
	} else {
		return format(time, '000', true);
	}
}

function ld_formatTimeVeryShort(time) {
    if (time > -10 && time < 10) {
		return format(time, '0.0', true);
	} else if (time > -100 && time < 100) {
		return format(time, '00', true);
	} else {
		return format(time, '00', true);
	}
}

function ld_formatNumber(time) {
    if (time > -10 && time < 10) {
		return format(time, '0.000', false);
	} else if (time > -100 && time < 100) {
		return format(time, '00.00', false);
	} else if (time > -1000 && time < 1000) {
		return format(time, '000.0', false);
	} else {
		return format(time, '000', false);
	}
}

function ld_formatNumberShort(time) {
    if (time > -10 && time < 10) {
		return format(time, '0.00', false);
	} else if (time > -100 && time < 100) {
		return format(time, '00.0', false);
	} else {
		return format(time, '000', false);
	}
}

function ld_formatNumberVeryShort(time) {
    if (time > -10 && time < 10) {
		return format(time, '0.0', false);
	} else if (time > -100 && time < 100) {
		return format(time, '00', false);
	} else {
		return format(time, '00', false);
	}
}

function ld_isIncreasing(value) {
    if(root['value']==null){
        root['value'] = [];
    }
    let expect = root['value'] - value;
    root['value'].push(value);
    if (root['value'].length > 1) {
        root['value'].shift();
    }
    return (expect < 0) ? true : false;
}

function ld_sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}

function ld_boardScroll(boardHeight) {
    //
    // I'm assuming all calculations will start after P3
    // boardHeight = Number of rows
    let maxScroll = $prop('OpponentsCount')-boardHeight;
    let currentPos = $prop('Position');
    let midPos = Math.round(boardHeight/2 + 3);
    let maxPos = Math.round(boardHeight/2);
    // maxScroll can't be smaller than 3 (P3)
    maxScroll = ( maxScroll < 3 ) ? 3 : maxScroll;
    if ( currentPos > midPos ) {
        if (maxScroll < currentPos - maxPos) {
            scrollPos = maxScroll;
        } else {
            scrollPos = currentPos - maxPos;
        }
    } else {
        scrollPos = 3; // Start board after P3 ...
    }
    return scrollPos;
}

function ld_boardScrollClass(boardHeight) {
    //
    // I'm assuming all calculations will start after P3
    // boardHeight = Number of rows
    let maxScroll = $prop('DataCorePlugin.GameData.PlayerClassOpponentsCount')-boardHeight;
    let currentPos = $prop('DataCorePlugin.GameRawData.Telemetry.PlayerCarClassPosition');
    let midPos = Math.round(boardHeight/2 + 3);
    let maxPos = Math.round(boardHeight/2);
    // maxScroll can't be smaller than 3 (P3)
    maxScroll = ( maxScroll < 3 ) ? 3 : maxScroll;
    if ( currentPos > midPos ) {
        if (maxScroll < currentPos - maxPos) {
            scrollPos = maxScroll;
        } else {
            scrollPos = currentPos - maxPos;
        }
    } else {
        scrollPos = 3; // Start board after P3 ...
    }
    return scrollPos;
}

function ld_nightMode () {
    const nightMode = ld_getSettings('nightMode');
    if ( nightMode === 1 ) {
        if ( ld_getSim() == 'ACC' ) { // ACC
            return ($prop('DataCorePlugin.GameRawData.Graphics.LightsStage') > 0 ) ? true : false;
        } else if ( ld_getSim() == 'Automobilista2' ) { // AMS2
            let mCarFlags = $prop('DataCorePlugin.GameRawData.mCarFlags');
            return ( mCarFlags.toString(2).substr(-1) == 1 ) ? true : false;
        } else if  ( ld_getSim() == 'RFactor2' || ld_getSim() == 'LMU' ) { // rF2  or LMU
            return ( $prop('DataCorePlugin.GameRawData.CurrentPlayer.mHeadlights') > 0 ) ? true : false;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

function ld_trueDarkMode () {
    const trueDarkMode = ld_getSettings('trueDarkMode');
    const trueDarkModeNative = ld_getSettings('trueDarkModeNative');
    if ( 
        $prop('variable.dashName') == 'LovelyPitWall' ||
        $prop('variable.dashName') == 'LovelyFlags' ||
        $prop('variable.dashName') == 'LovelySponsors' ||
        $prop('variable.dashName') == 'LovelyTower' ||
        $prop('variable.dashName') == 'LovelyOverlay'
    ) { return false; }
    if ( trueDarkMode == 0 ) {
        return false;
    } else {
        if ( trueDarkModeNative > 0 ) {
            if ( ld_getSim() =='Automobilista2') { // Automobilista 2
                let mCarFlags = $prop('DataCorePlugin.GameRawData.mCarFlags');
                var amsLights = ( mCarFlags.toString(2).substr(-1) == 1 ) ? 1 : 0;
                return ( amsLights >= trueDarkModeNative || $prop('variable.trueDarkMode') ) ? true : false;
            } /* else if  ( ld_getSim() == 'RFactor2' || ld_getSim() == 'LMU' ) { // rF2  or LMU
                return ( $prop('DataCorePlugin.GameRawData.CurrentPlayer.mHeadlights') >= trueDarkModeNative || $prop('variable.trueDarkMode') ) ? true : false;
            } */
            else if ( ld_getSim() == "ACC" ) { // Default and ACC
                if ( ACC_carList_singleLightsstage.includes( $prop('DataCorePlugin.GameData.CarId') ) ) {
                    return ( $prop('DataCorePlugin.GameRawData.Graphics.LightsStage') > 0 || $prop('variable.trueDarkMode') ) ? true : false;
                } else {
                    return ( $prop('DataCorePlugin.GameRawData.Graphics.LightsStage') > 1 || $prop('variable.trueDarkMode') ) ? true : false;
                }
            } else {
                return ( $prop('DataCorePlugin.GameRawData.Graphics.LightsStage') > 0 || $prop('variable.trueDarkMode') ) ? true : false;
            }
        } else {
            return $prop('variable.trueDarkMode');
        }
    }
}

function ld_compactNumber(number) {
    if (number < 1000) {
        return number;
    } else if (number >= 1000 && number < 1_000_000) {
        return (number / 1000).toFixed(1).replace(/\.0$/, "") + "K";
    } else if (number >= 1_000_000 && number < 1_000_000_000) {
        return (number / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    } else if (number >= 1_000_000_000 && number < 1_000_000_000_000) {
        return (number / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
    } else if (number >= 1_000_000_000_000 && number < 1_000_000_000_000_000) {
        return (number / 1_000_000_000_000).toFixed(1).replace(/\.0$/, "") + "T";
    }
}

function ld_compareVersions(local,remote) {
    let x=local.split('.').map(e=> parseInt(e));
    let y=remote.split('.').map(e=> parseInt(e));
    let z = "";

    // Make both versions numbers equal length
    while (y.length-x.length != 0) {
        if (y.length > x.length) {
            x.push(0)
        } else {
            y.push(0)
        }
    }

    for(i=0;i<x.length;i++) {
        if(x[i] === y[i]) {
            z+="e";
        } else
        if(x[i] > y[i]) {
            z+="m";
        } else {
            z+="l";
        }
    }
    if (!z.match(/[l|m]/g)) {
      return 0;
    } else if (z.split('e').join('')[0] == "m") {
      return 1;
    } else {
      return -1;
    }
}

function ld_analytics(screen) {
    const analytics = ld_getSettings('analytics');
    if ( analytics ) {
        const url = 'https://dash.ohmylovely.com/analytics/tracking.php?';
        let params = {
                sim: $prop('DataCorePlugin.CurrentGame'),
                app: $prop('variable.dashName'),
                ver: $prop('variable.dashVer'),
                screen: screen
            };
        var esc = encodeURIComponent;
        const query = Object.keys(params)
            .map(k => esc(k) + '=' + esc(params[k]))
            .join('&');
        return url+query
    } else {
        return ''
    }
}

function ld_analyticsMFM(screen, mfmScreen) {
    const analytics = ld_getSettings('analytics');
    if ( analytics ) {
        const url = 'https://dash.ohmylovely.com/analytics/tracking.php?';
        let params = {
            sim: $prop('DataCorePlugin.CurrentGame'),
            app: $prop('variable.dashName'),
            ver: $prop('variable.dashVer'),
            screen: screen,
            mfm: $prop('variable.positionMFM'),
            mfmScreen: mfmScreen
        };
        var esc = encodeURIComponent;
        const query = Object.keys(params)
            .map(k => esc(k) + '=' + esc(params[k]))
            .join('& ');
        return url+query
    } else {
        return null
    }
}

function ld_getVersion(version_data) {
    // Break if error in JSON
    if ( version_data == null || version_data.startsWith('ERROR') ) { return false; }

    // Get current Version Number
    var currentVer = $prop('variable.dashVer');

    // Get Version Numbers
    const latestVer = JSON.parse(JSON.stringify(JSON.parse(version_data)));
    const checkVer = latestVer[$prop('variable.dashName')];
    const checkBetaVer = latestVer['beta'][$prop('variable.dashName')];

    // Check if currentVer is Beta
    const isPrivate = $prop('variable.isPrivate');

    if ( isPrivate && ld_compareVersions( currentVer, checkBetaVer ) == '-1' ) {
        return 'NEW PRIVATE VERSION AVAILABLE: ' + checkBetaVer + ' - Visit lsr.gg/discord'
    } else if ( ld_compareVersions( currentVer, checkVer ) == '-1' ) {
        return 'NEW VERSION AVAILABLE: ' + checkVer + ' - Visit lsr.gg/update'
    } else {
        return false; // Nothing New
    }

    // local = remote : 0 // Local version is the latest
    // local > remote : 1 // Local version is ahead of the latest
    // local < remote : -1 // New version available
}