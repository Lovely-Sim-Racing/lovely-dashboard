//
// Lovely Dashboard JavaScript Extensions
// Please drop this file in the 'Simhub/JavascriptExtensions' folder
//

function ld_GetPlayerName() {
    const json_settings = readtextfile('./JavascriptExtensions/Lovely-Dashboard_settings.json')
    const settings = JSON.parse(json_settings);
    if ( !settings || !settings.driverName ) {
        driverName = 0
    } else {
        driverName = settings.driverName
    }
    var name = $prop('DataCorePlugin.GameData.PlayerName');
    return ld_formatName(name, driverName)
}

function ld_GetPlayerCarLogo () {
    var carName = $prop('DataCorePlugin.GameData.CarModel')
    var carBrand = carName.split(' ')
    return 'logo-' + lcase(carBrand[0]) + '-yellow'
}

function ld_GetPlayerBestLapTime() {

    if ( timespantoseconds($prop('DataCorePlugin.GameData.BestLapTime')) ==  0 ) {
        return '--:--.---'
    } else {
        return $prop('DataCorePlugin.GameData.BestLapTime')
    }

}

function ld_GetPlayerLastLapTime() {

    if ( timespantoseconds($prop('DataCorePlugin.GameData.LastLapTime')) ==  0 ) {
        return '--:--.---'
    } else {
        return $prop('DataCorePlugin.GameData.LastLapTime')
    }

}

function ld_GetPlayerBestColor() {
    if ( driverdeltatobest($prop('DataCorePlugin.GameData.Position')) == 0 ) {
        return '#C500CE'
    } else {
        return '#FFE04C'
    }
}

function ld_GetDriverName(position) {

    // Data expected is '01', '00'
    const json_settings = readtextfile('./JavascriptExtensions/Lovely-Dashboard_settings.json')
    const settings = JSON.parse(json_settings);

    if ( !settings || !settings.driverName ) {
        driverName = 0
    } else {
        driverName = settings.driverName
    }
    
    if (drivername(position)) {
        var name = tcase(drivername(position))
        return ld_formatName(name, driverName)
    } else {
        return ''
    } 
    
    
}

function ld_GetRelDriverName(relPosition) {

    // Data expected is 'Ahead_01', 'Behind_00'
    // -> PersistantTrackerPlugin.DriverAhead_01_Name
    const json_settings = readtextfile('./JavascriptExtensions/Lovely-Dashboard_settings.json')
    const settings = JSON.parse(json_settings);

    if ( !settings || !settings.driverName ) {
        driverName = 0
    } else {
        driverName = settings.driverName
    }

    if ( $prop('PersistantTrackerPlugin.Driver'+relPosition+'_Name') ) {
        var name = $prop('PersistantTrackerPlugin.Driver'+relPosition+'_Name');
        return ld_formatName(name, driverName)

    } else {
        return ''
    }

}

function ld_GetRelBestLapTime(relPosition) {

    if ( timespantoseconds($prop('PersistantTrackerPlugin.Driver'+relPosition+'_BestLapTime')) ==  0 ) {
        return '--:--.---'
    } else {
        return $prop('PersistantTrackerPlugin.Driver'+relPosition+'_BestLapTime')
    }

}

function ld_GetRelLastLapTime(relPosition) {

    if ( timespantoseconds($prop('PersistantTrackerPlugin.Driver'+relPosition+'_LastLapTime')) ==  0 ) {
        return '--:--.---'
    } else {
        return $prop('PersistantTrackerPlugin.Driver'+relPosition+'_LastLapTime')
    }

}

function ld_GetRelBestColor(relPosition) {
    if ( driverdeltatobest($prop('PersistantTrackerPlugin.Driver'+relPosition+'_Position')) == 0 ) {
        return '#C500CE'
    } else {
        return '#FFFFFF'
    }
}

function ld_GetRelDriverColor(relPosition) {

    // Data expected is 'Ahead_01', 'Behind_00'
    // -> PersistantTrackerPlugin.DriverAhead_01_Name
    var driver_gap = drivergaptoplayer( $prop('PersistantTrackerPlugin.Driver'+relPosition+'_Position'));
    var driver_lap = timespantoseconds(driverlastlap( $prop('DataCorePlugin.GameData.BestLapOpponentPosition')+1 ));
    
    if (driver_lap > 0 && $prop('DataCorePlugin.GameData.SessionTypeName') == 'RACE') {
        if (
            $prop('PersistantTrackerPlugin.Driver'+relPosition+'_CurrentLap') - $prop('DataCorePlugin.GameRawData.Graphics.CompletedLaps') >= 2 ) {
            return '#FF7400' // 2+ Laps Ahead
        } else if (
            $prop('PersistantTrackerPlugin.Driver'+relPosition+'_CurrentLap') - $prop('DataCorePlugin.GameRawData.Graphics.CompletedLaps') <= -2 ) {
            return '#00BFFF' // 2- Laps Behind
        } else {
            if ( driver_lap + driver_gap < (driver_lap * 0.15) ) {
                return '#FF7400' // Ahead
            } else if ( driver_lap + driver_gap > driver_lap+(driver_lap * 0.85) ) {
                return '#00BFFF' // Behind
            } else {
                return '#FFFFFF' // Same Lap
            }
        }
    } else {
        return '#FFFFFF'
    }
}

function ld_GetRelCarLogo (relPosition) {

    // Data expected is 'Ahead_01', 'Behind_00'
    // -> PersistantTrackerPlugin.DriverAhead_01_CarName
    // -> PersistantTrackerPlugin.DriverAhead_01_Position
    var carName
    ( !$prop('PersistantTrackerPlugin.Driver'+relPosition+'_CarName') ) ? carName = 'none' : carName = $prop('PersistantTrackerPlugin.Driver'+relPosition+'_CarName')
    var carBrand = carName.split(' ')
    var color = ''
    var driver_gap = drivergaptoplayer( $prop('PersistantTrackerPlugin.Driver'+relPosition+'_Position'));
    var driver_lap = timespantoseconds(driverlastlap( $prop('DataCorePlugin.GameData.BestLapOpponentPosition') ));

    if (driver_lap > 0 && $prop('DataCorePlugin.GameData.SessionTypeName') == 'Race') {
        if (
            $prop('PersistantTrackerPlugin.Driver'+relPosition+'_CurrentLap') - $prop('DataCorePlugin.GameData.CurrentLap') >= 2 ) {
            color = '-red' // 2+ Laps Ahead
        } else if (
            $prop('PersistantTrackerPlugin.Driver'+relPosition+'_CurrentLap') - $prop('DataCorePlugin.GameData.CurrentLap') <= -2 ) {
            color = '-blue' // 2- Laps Behind
        } else {
            if ( driver_lap + driver_gap < (driver_lap * 0.15) ) {
                color = '-red' // Ahead
            } else if ( driver_lap + driver_gap > driver_lap+(driver_lap * 0.85) ) {
                color = '-blue' // Behind
            } else {
                color = '' // Same Lap
            }
        }
    } else {
        color = ''
    }

    return 'logo-' + lcase(carBrand[0]) + color
}

function ld_formatName (name, mode) {

    name = name.replace('�0', 'E'); // replace unicode characters
    name = name.toLowerCase().replace(/\b\w/g, s => s.toUpperCase()); // transform to title case

    if (name!=null) {
        var full_name = name.split(' ');
        if (mode == 2) {
            // Firstname L.
            return full_name[0] + ' ' + full_name[full_name.length-1].substr(0,1) + '.'
        } else if (mode == 3) {
            // Firstname Lastname
            return full_name[0] + ' ' + full_name[full_name.length-1]
        } else {
            // F. Lastname
            return full_name[0].substr(0,1) + '. ' + full_name[full_name.length-1]
        }
    } else {
        return ''
    }
}


//
//
// Tires

function ld_getAvgValue(getAvgForProp, lapAvg, resetKey) {

    var ld_getAverage = function (array) {
        var total = 0;
        var count = 0;
        array.forEach(function(item, index) {
            total += item;
            count++;
        });
        return total / count;
    }

    if(root["currentLap"] == null){
        root["currentLap"] = $prop('DataCorePlugin.GameData.CurrentLap')
    }

    var prop = $prop(getAvgForProp)
    
    if(root['prop']==null){
        root['prop'] = []
    }

    if (!$prop('DataCorePlugin.GamePaused') && !$prop('DataCorePlugin.GameData.IsInPitLane') && !$prop('DataCorePlugin.GameRawData.Graphics.IsSetupMenuVisible') && prop != 0) {
        if ($prop('DataCorePlugin.GameData.CurrentLap') - root["currentLap"] <= lapAvg) {
            root['prop'].push(prop)
        } else {
            root['prop'].push(prop)
            root['prop'].shift()
        }
    }

    if ($prop('DataCorePlugin.GameData.IsInPitLane') && $prop('DataCorePlugin.GameRawData.Graphics.IsSetupMenuVisible')) {
        root["currentLap"] = null // Reset laps
        prop = 0 // Reset Tyre
    }

    if ($prop('InputStatus.KeyboardReaderPlugin.'+resetKey) ) {
        root['prop'] = []
    }

    return ld_getAverage(root['prop'])

}


//
//
// Sectors
function ld_sectorCount() {
    // if ( $prop('DataCorePlugin.GameData.CompletedLaps') <= 0 ) {
    //     root['sectorCount'] = 1 // Reset if 0 laps completed
    // }

    if ( root['sectorCount'] == null ) {
        root['sectorCount'] = $prop('DataCorePlugin.GameData.CurrentSectorIndex')
    }
    if ( root['sectorCount'] < $prop('DataCorePlugin.GameData.CurrentSectorIndex') ) {
        root['sectorCount'] = $prop('DataCorePlugin.GameData.CurrentSectorIndex')
    } else {
        root['sectorCount'] = root['sectorCount']
    }
    return root['sectorCount']
}
function ld_sectorSegmentWidth(sector) {
    if ( sector == ld_sectorCount() ) {
        return 160 / ld_sectorCount()
    } else {
        return 160 / ld_sectorCount() - 1
    }
}
function ld_sectorSegmentPos(sector) {
    return (160 / ld_sectorCount() ) * (sector-1)
}
function ld_sectorSegmentColor(sector) {

    var timeDiff = timespantoseconds( currentlapgetsectortime(sector, false) ) - 
                timespantoseconds( sessionbestlapgetsectortime(sector, false) )
    var overallDiff = timespantoseconds( currentlapgetsectortime(sector, false) ) - 
                timespantoseconds( bestsectortime(sector, false) )
    if (sector >= $prop('DataCorePlugin.GameData.CurrentSectorIndex') ) {
        return '#FF262626' // Off
    } else if (overallDiff <= 0) {
        return '#FFC500CE' // Purple
    } else if (timeDiff <= 0) {
        return '#FF00FF02' // Green
    } else {
        return '#FFFFE04C' // Yellow 
    }
}
function ld_sectorLastSegmentColor(sector) {
    var timeDiff = timespantoseconds( lastlapgetsectortime(sector, false) ) - 
                timespantoseconds( sessionbestlapgetsectortime(sector, false) )
    var overallDiff = timespantoseconds( lastlapgetsectortime(sector, false) ) - 
                timespantoseconds( bestsectortime(sector, false) )
    if (overallDiff <= 0) {
        return '#FFC500CE' // Purple
    } else if (timeDiff <= 0) {
        return '#FF00FF02' // Green
    } else {
        return '#FFFFE04C' // Yellow
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

function ld_getSim() {
    currentGame = $prop('DataCorePlugin.CurrentGame')

    switch (currentGame) {
        case "AssettoCorsaCompetizione": 
            return "ACC"
        case "AssettoCorsa": 
            return "AC"
        case "IRacing": 
            return "IRacing"
        case "Automobilista2": 
            return "Automobilista2"
        case "RFactor2": 
            return "RFactor2"
        case "F12020":
        case "F12021":
        case "F12022":
        case "F12023":
            return "F1"
        default:
            return "generic"
    }
	
}

function ld_isIncreasing(value) {
    
    if(root['value']==null){
        root['value'] = []
    }
    
    expect = root['value'] - value
    root['value'].push(value)
    if (root['value'].length > 1) {
        root['value'].shift()
    }
   
    return (expect < 0) ? true : false

}