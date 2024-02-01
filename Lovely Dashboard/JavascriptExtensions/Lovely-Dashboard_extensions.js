const folderName = $prop('variable.folderName');

// Settings File
const json_settings = readtextfile('./JavascriptExtensions/Lovely-Dashboard_settings.json');
const settings = JSON.parse(JSON.stringify(JSON.parse(json_settings)));

// Track Data
const json_tracks = readtextfile('./DashTemplates/'+folderName+'/JavascriptExtensions/Lovely-Dashboard_tracks.json');
const ld_tracks = JSON.parse(JSON.stringify(JSON.parse(json_tracks)));

// Lovely Theme Colors
const json_colors = readtextfile('./DashTemplates/'+folderName+'/JavascriptExtensions/Lovely-Dashboard_colors.json');
const ld_colors = JSON.parse(JSON.stringify(JSON.parse(json_colors)));


function ld_getTheme() {
    const trueDarkMode = (!settings || typeof(settings.trueDarkMode) === 'undefined') ? 1 : parseInt(settings.trueDarkMode);
    return trueDarkMode;
}

function ld_theme(token) {
    // 0: Standard Theme
    // 1: Red Theme
    // 2: Blue Theme
    // 3: Purple Theme
    // 4: Orange Theme
    //const theme = ( ld_trueDarkMode() ) ? settings.trueDarkMode : '0';
    const theme = ( ld_trueDarkMode() ) ? ld_getTheme() : '0';
    return ld_colors[theme][token];
}

function ld_themeImage(token) {
    //const theme = ( ld_trueDarkMode() ) ? settings.trueDarkMode : '0';
    const theme = ( ld_trueDarkMode() ) ? ld_getTheme() : '0';
    return token+'-'+theme;
}

function ld_GetPlayerName() {
    if ( !settings || !settings.driverName ) {
        driverName = 0;
    } else {
        driverName = settings.driverName;
    }
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
    const driverName = (!settings || typeof(settings.driverName) === 'undefined') ? 0 : parseInt(settings.driverName);
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
    const driverName = (!settings || typeof(settings.driverName) === 'undefined') ? 0 : parseInt(settings.driverName);
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
    const driver_lap = timespantoseconds(driverlastlap( $prop('DataCorePlugin.GameData.BestLapOpponentPosition')+1 ));
    if (driver_lap > 0 && $prop('DataCorePlugin.GameData.SessionTypeName') == 'RACE') {
        if (
            $prop('PersistantTrackerPlugin.Driver'+relPosition+'_CurrentLap') - $prop('DataCorePlugin.GameRawData.Graphics.CompletedLaps') >= 2 ) {
            return ld_theme('ld_tableAhead'); // 2+ Laps Ahead
        } else if (
            $prop('PersistantTrackerPlugin.Driver'+relPosition+'_CurrentLap') - $prop('DataCorePlugin.GameRawData.Graphics.CompletedLaps') <= -2 ) {
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
        root["currentLap"] = $prop('DataCorePlugin.GameData.CurrentLap');
    }
    let prop = $prop(getAvgForProp);
    if(root['prop']==null){
        root['prop'] = [];
    }
    if (!$prop('DataCorePlugin.GamePaused') && !$prop('DataCorePlugin.GameData.IsInPitLane') && !$prop('DataCorePlugin.GameRawData.Graphics.IsSetupMenuVisible') && prop != 0) {
        if ($prop('DataCorePlugin.GameData.CurrentLap') - root["currentLap"] <= lapAvg) {
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
    if ($prop('InputStatus.KeyboardReaderPlugin.'+resetKey) ) {
        root['prop'] = [];
    }
    return ( Number.isNaN(ld_getAverage(root['prop'])) ) ? '0' : ld_getAverage(root['prop']);
}

function ld_saveValue(value) {
    if (!$prop('DataCorePlugin.GamePaused') && !$prop('DataCorePlugin.GameData.IsInPitLane') && !$prop('DataCorePlugin.GameRawData.Graphics.IsSetupMenuVisible') && value != 0) {
        root['savedValue'] = value;
    }
    return ( Number.isNaN(root['savedValue']) ) ? '---' : root['savedValue'];
}

function ld_tireSlipLock(tyre) {
    var wheelSlip;
    var wheelSpeed;
    var tyre = tyre;

    if ( $prop('DataCorePlugin.CurrentGame') == 'Automobilista2' ) {
        wheelSlip = ( $prop('DataCorePlugin.GameRawData.mTyreGrip'+tyre) < 0.1 ) ? 2 : 0;
        wheelSpeed = $prop('DataCorePlugin.GameRawData.Physics.WheelAngularSpeed'+tyre);
        
    } else if ( $prop('DataCorePlugin.CurrentGame') == 'RFactor2' ) {
        wheelSlip = $prop('DataCorePlugin.GameRawData.mTyreSlipSpeed'+tyre);
        wheelSpeed = $prop('DataCorePlugin.GameRawData.Physics.WheelAngularSpeed'+tyre);
        
    } else if ( $prop('DataCorePlugin.CurrentGame').startsWith('F120') ) {
        if ($prop('GameRawData.PlayerMotionData.m_wheelSlip03') * 100 > 25) {
            return ld_themeImage('slip');
        } else if ($prop('GameRawData.PlayerMotionData.m_wheelSlip03') * 100 < -50) {
            return ld_themeImage('lock');
        } else {
            return null;
        }

    } else { // Default
        wheelSlip = $prop('DataCorePlugin.GameRawData.Physics.WheelSlip'+tyre);
        wheelSpeed = $prop('DataCorePlugin.GameRawData.Physics.WheelAngularSpeed'+tyre);
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

function ld_tireSlipLockColor(tyre) {
    var wheelSlip;
    var wheelSpeed;
    var tyre = tyre;

    if ( $prop('DataCorePlugin.CurrentGame') == 'Automobilista2' ) {
        wheelSlip = ( $prop('DataCorePlugin.GameRawData.mTyreGrip'+tyre) < 0.1 ) ? 2 : 0;
        wheelSpeed = $prop('DataCorePlugin.GameRawData.Physics.WheelAngularSpeed'+tyre);
        
    } else if ( $prop('DataCorePlugin.CurrentGame') == 'RFactor2' ) {
        wheelSlip = $prop('DataCorePlugin.GameRawData.mTyreSlipSpeed'+tyre);
        wheelSpeed = $prop('DataCorePlugin.GameRawData.Physics.WheelAngularSpeed'+tyre);
        
    } else if ( $prop('DataCorePlugin.CurrentGame').startsWith('F120') ) {
        if ($prop('GameRawData.PlayerMotionData.m_wheelSlip03') * 100 > 25) {
            return ld_theme('ld_uiBlue');
        } else if ($prop('GameRawData.PlayerMotionData.m_wheelSlip03') * 100 < -50) {
            return ld_theme('ld_uiYellow');
        } else {
            return ld_theme('ld_uiTitle');
        }

    } else { // Default
        wheelSlip = $prop('DataCorePlugin.GameRawData.Physics.WheelSlip'+tyre);
        wheelSpeed = $prop('DataCorePlugin.GameRawData.Physics.WheelAngularSpeed'+tyre);
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
// Estimated Lap

function ld_getEstimatedLapTime() {
    if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBased')) != 0 ) {
        return $prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBased');
    } else if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) != 0 ) {
        return $prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased');
    } else {
        return $prop('CurrentLapTime');
    }
}

function ld_getEstimatedDelta() {
    if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBased')) != 0 ) {
        return ld_formatTime( timespantoseconds( $prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBased')) - timespantoseconds( $prop('DataCorePlugin.GameData.BestLapTime') ) );
    } else if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) != 0 ) {
        return ld_formatTime( timespantoseconds( $prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) - timespantoseconds( $prop('PersistantTrackerPlugin.AllTimeBest') ) );
    } else {
        return ld_formatTime( 0 );
    }
}

function ld_getEstimatedLabel() {
    if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBased')) != 0 ) {
        return 'ESTIMATED LAP';
    } else if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) != 0 ) {
        return 'ESTIMATED LAP (ALL TIME:                     )';
    } else {
        return 'CURRENT LAP';
    }
}

function ld_getEstimatedColour() {
    if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBased')) != 0 ) {
        var timeDiffMine = timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBased')) - timespantoseconds( $prop('DataCorePlugin.GameData.BestLapTime') );
        var timeDiffOverall = timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBased')) - timespantoseconds( driverbestlap( $prop('DataCorePlugin.GameData.BestLapOpponentPosition')+1 ) );
    } else if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) != 0 ) {
        var timeDiffMine = timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) - timespantoseconds( $prop('PersistantTrackerPlugin.AllTimeBest') );
        var timeDiffOverall = timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) - timespantoseconds( driverbestlap( $prop('DataCorePlugin.GameData.BestLapOpponentPosition')+1 ) );
     } else {
        var timeDiffMine = null;
        var timeDiffOverall = null;
    }
    if ( $prop('DataCorePlugin.CurrentGame') == 'IRacing' ) {
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
    } else if ( $prop('DataCorePlugin.CurrentGame') == 'Automobilista2') {
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
    } else if ( $prop('DataCorePlugin.CurrentGame') == 'RFactor2' ) {
        if ( timeDiffMine > 0 ) {
            return ld_theme('ld_uiSlower');
        } else {
            if ( timeDiffOverall > 0 ) {
                return ld_theme('ld_uiFaster');
            } else {
                return ld_theme('ld_uiFastest');
            }
        }
    } else if ( $prop('DataCorePlugin.CurrentGame') == 'AssettoCorsa' ) {
        if ( timeDiffMine > 0 ) {
            return ld_theme('ld_uiSlower');
        } else {
            if ( timeDiffOverall > 0 ) {
                return ld_theme('ld_uiFaster');
            } else {
                return ld_theme('ld_uiFastest');
            }
        }
    } else if ( $prop('DataCorePlugin.CurrentGame').startsWith('F120') ) {
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
    if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBased')) != 0 ) {
        var timeDiffMine = timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBased')) - timespantoseconds( $prop('DataCorePlugin.GameData.BestLapTime') );
        var timeDiffOverall = timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBased')) - timespantoseconds( driverbestlap( $prop('DataCorePlugin.GameData.BestLapOpponentPosition')+1 ) );
    } else if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) != 0 ) {
        var timeDiffMine = timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) - timespantoseconds( $prop('DataCorePlugin.GameData.BestLapTime') );
        var timeDiffOverall = timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) - timespantoseconds( driverbestlap( $prop('DataCorePlugin.GameData.BestLapOpponentPosition')+1 ) );
     } else {
        var timeDiffMine = null;
        var timeDiffOverall = null;
    }
    if ( $prop('DataCorePlugin.CurrentGame') == 'IRacing' ) {
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
    } else if ( $prop('DataCorePlugin.CurrentGame') == 'Automobilista2') {
        if ( $prop('DataCorePlugin.GameRawData.mLapInvalidated') == false ) {
            return ld_theme('ld_uiTimingText') ;
        } else {
            return ld_theme('ld_uiInvalidText'); // red bg
        }
    } else if ( $prop('DataCorePlugin.CurrentGame') == 'RFactor2' ) {
        return ld_theme('ld_uiTimingText');
    } else if ( $prop('DataCorePlugin.CurrentGame') == 'AssettoCorsa' ) {
        return ld_theme('ld_uiTimingText');
    } else if ( $prop('DataCorePlugin.CurrentGame').startsWith('F120') ) {
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
    if ( $prop('DataCorePlugin.CurrentGame') == 'IRacing' ) {
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
    } else if ( $prop('DataCorePlugin.CurrentGame') == 'AssettoCorsaCompetizione' ) {
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
    } else if ($prop('DataCorePlugin.CurrentGame') == 'Automobilista2' ) {
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
    } else if ( $prop('DataCorePlugin.CurrentGame') == 'RFactor2' ) {
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
    if ( $prop('DataCorePlugin.CurrentGame') == 'IRacing' ) {
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
    } else if ( $prop('DataCorePlugin.CurrentGame') == 'AssettoCorsaCompetizione' ) {
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
    } else if ( $prop('DataCorePlugin.CurrentGame') == 'Automobilista2' ) {
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
    } else if ( $prop('DataCorePlugin.CurrentGame') == 'RFactor2' ) {
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
    if ( $prop('DataCorePlugin.CurrentGame') == 'IRacing' ) {
        return ( 
            $prop('DataCorePlugin.GameData.SessionTypeName')=='Open Qualify' || 
            $prop('DataCorePlugin.GameData.SessionTypeName')=='Lone Qualify' || 
            $prop('DataCorePlugin.GameData.SessionTypeName')=='Open Practice' || 
            $prop('DataCorePlugin.GameData.SessionTypeName')=='Practice' || 
            $prop('DataCorePlugin.GameData.SessionTypeName')=='Offline Testing'
        ) ? true : false;
    } else if ( $prop('DataCorePlugin.CurrentGame') == 'Automobilista2' ) {
        return ( 
            $prop('DataCorePlugin.GameData.SessionTypeName')=='QUALIFY' ||
            $prop('DataCorePlugin.GameData.SessionTypeName')=='PRACTICE'
        ) ? true : false;
    } else if ( $prop('DataCorePlugin.CurrentGame') == 'RFactor2' ) {
        return ( 
            $prop('DataCorePlugin.GameData.SessionTypeName')=='Qualify' ||
            $prop('DataCorePlugin.GameData.SessionTypeName')=='Practice'
        ) ? true : false;
    } else if ($prop('DataCorePlugin.CurrentGame').startsWith('F120')) {
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
        case "F12020":
        case "F12021":
        case "F12022":
        case "F12023":
            return "F1";
        default:
            return "generic";
    }
}

function ld_getTurn() {
    const sim = ld_getSim();
    const trackName = $prop('TrackId').replace(/ /g, "");
    const track = ld_tracks[sim][trackName];
    if ( !track || track == undefined ) { return null }
    const trackTurns = ld_tracks[sim][trackName]['turns'];
    let currentPosition = drivertrackpositionpercent( getplayerleaderboardposition() ).toFixed(3);
    let margin = 0.01;
    for ( const turn in trackTurns ) {
        if ( currentPosition >= (trackTurns[turn] - margin) && currentPosition <= (trackTurns[turn] + margin) ) {
            return turn;
        }
    }
    return null;
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
    const nightMode = (!settings || typeof(settings.nightMode) === 'undefined') ? 1 : parseInt(settings.nightMode);
    if ( nightMode === 1 ) {
        if ( $prop('DataCorePlugin.CurrentGame') == 'AssettoCorsaCompetizione' ) {
            // Trigger Night Mode when lights on
            return ($prop('DataCorePlugin.GameRawData.Graphics.LightsStage')>0 ) ? true : false;
        } else if ( $prop('DataCorePlugin.CurrentGame') == 'Automobilista2' ) {
            // Trigger Night Mode when lights on
            let mCarFlags = $prop('DataCorePlugin.GameRawData.mCarFlags');
            return ( mCarFlags.toString(2).substr(-1) == 1 ) ? true : false;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

function ld_trueDarkMode () {
    const trueDarkMode = (!settings || typeof(settings.trueDarkMode) === 'undefined') ? 1 : parseInt(settings.trueDarkMode);
    const trueDarkModeNative = (!settings || typeof(settings.trueDarkModeNative) === 'undefined') ? 0 : parseInt(settings.trueDarkModeNative);
    if ( 
        $prop('variable.dashName') == 'LovelyPitWall' ||
        $prop('variable.dashName') == 'LovelyFlags' ||
        $prop('variable.dashName') == 'LovelyOverlay' ||
        $prop('variable.dashName') == 'LovelySponsors' ||
        $prop('variable.dashName') == 'LovelyTower'
    ) { return false; }
    if ( trueDarkMode == 0 ) {
        return false;
    } else {
        if ( $prop('DataCorePlugin.CurrentGame') == 'AssettoCorsaCompetizione' ) { // ACC Specific Modes
            if ( trueDarkModeNative === 1 ) {
                return ( $prop('DataCorePlugin.GameRawData.Graphics.LightsStage')>1 ) ? true : false;
            } else {
                return $prop('variable.trueDarkMode');
            }
        } else {
            // Trigger TDM manually
            return $prop('variable.trueDarkMode');
        }
    }
}
 
function ld_analytics(screen) {
    const analytics = (!settings || typeof(settings.analytics) === 'undefined') ? 0 : parseInt(settings.analytics);
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
    const analytics = (!settings || typeof(settings.analytics) === 'undefined') ? 0 : parseInt(settings.analytics);
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