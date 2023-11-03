var lovely_blue = '#FF2B98FB'
var white = '#FFFFFFFF'
var black = '#FF000000'
var gray = '#FF444444'
var light_gray = '#FF8C8C8C'
var dark = '#FF262626'
var red = '#FFFA0000'
var yellow = '#FFFFE04C'
var green = '#FF00FF02'
var purple = '#FFC500CE'
var orange = '#FFFF7400'
var blue = '#FF00BFFF'
var dark_blue = '#FF0000FF'
var transparent = '#00000000'

const json_settings = readtextfile('./JavascriptExtensions/Lovely-Dashboard_settings.json')
const settings = JSON.parse(json_settings)

const json_tracks = readtextfile('./DashTemplates/Lovely Dashboard/JavascriptExtensions/Lovely-Dashboard_tracks.json')
const ld_tracks = JSON.parse(json_tracks)

function ld_GetPlayerName() {
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
    if ( driverdeltatobest(getplayerleaderboardposition()) == 0 ) {
        return purple
    } else {
        return yellow
    }
}

function ld_GetDriverName(position) {

    // Data expected is '01', '00'

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
        return purple
    } else {
        return white
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
            return orange // 2+ Laps Ahead
        } else if (
            $prop('PersistantTrackerPlugin.Driver'+relPosition+'_CurrentLap') - $prop('DataCorePlugin.GameRawData.Graphics.CompletedLaps') <= -2 ) {
            return blue // 2- Laps Behind
        } else {
            if ( driver_lap + driver_gap < (driver_lap * 0.15) ) {
                return orange // Ahead
            } else if ( driver_lap + driver_gap > driver_lap+(driver_lap * 0.85) ) {
                return blue // Behind
            } else {
                return white // Same Lap
            }
        }
    } else {
        return white
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

    if (name!=null) {
        
        name = name.replace('�0', 'E'); // replace unicode characters
        
        var full_name = name.split(' ');
        var first_name = full_name.shift();
        var last_name = full_name;
        if (mode == 2) {
            return first_name + ' ' + last_name.join(" ").substr(0,1) + '.'
        } else if (mode == 3) {
            return first_name + ' ' + last_name.join(" ")
        } else {
            return first_name.substr(0,1) + '. ' + last_name.join(" ")
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

    return ( Number.isNaN(ld_getAverage(root['prop'])) ) ? '---' : ld_getAverage(root['prop'])

}

function ld_saveValue(value) {
    
    if (!$prop('DataCorePlugin.GamePaused') && !$prop('DataCorePlugin.GameData.IsInPitLane') && !$prop('DataCorePlugin.GameRawData.Graphics.IsSetupMenuVisible') && value != 0) {
        root['savedValue'] = value
    }

    return ( Number.isNaN(root['savedValue']) ) ? '---' : root['savedValue']

}

//
//
// Estimated Lap

function ld_getEstimatedLapTime() {
    if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBased')) != 0 ) {
        return $prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBased')
    } else if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) != 0 ) {
        return $prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')
    } else {
        return $prop('CurrentLapTime')
    }
}

function ld_getEstimatedDelta() {
    if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBased')) != 0 ) {
        return ld_formatTime( timespantoseconds( $prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBased')) - timespantoseconds( $prop('DataCorePlugin.GameData.BestLapTime') ) )
    } else if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) != 0 ) {
        return ld_formatTime( timespantoseconds( $prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) - timespantoseconds( $prop('PersistantTrackerPlugin.AllTimeBest') ) )
    } else {
        return ld_formatTime( 0 )
    }
}

function ld_getEstimatedLabel() {
    if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBased')) != 0 ) {
        return 'ESTIMATED LAP'
    } else if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) != 0 ) {
        return 'ESTIMATED LAP (ALL TIME:                     )'
    } else {
        return 'CURRENT LAP'
    }
}

function ld_getEstimatedColour() {

    if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBased')) != 0 ) {
        var timeDiffMine = timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBased')) - timespantoseconds( $prop('DataCorePlugin.GameData.BestLapTime') )
        var timeDiffOverall = timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBased')) - timespantoseconds( driverbestlap( $prop('DataCorePlugin.GameData.BestLapOpponentPosition')+1 ) )
    } else if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) != 0 ) {
        var timeDiffMine = timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) - timespantoseconds( $prop('PersistantTrackerPlugin.AllTimeBest') )
        var timeDiffOverall = timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) - timespantoseconds( driverbestlap( $prop('DataCorePlugin.GameData.BestLapOpponentPosition')+1 ) )
     } else {
        var timeDiffMine = null
        var timeDiffOverall = null
    }

     if ( $prop('DataCorePlugin.CurrentGame') == 'IRacing' ) {
    
        // Calculate Off Tracks
        if( root["offTrack"] == null ) {
            root["offTrack"] = 0
        }
        if ( $prop('DataCorePlugin.GameRawData.Telemetry.PlayerTrackSurface') == 0 ) {
            root["offTrack"]++
        }
        if ( $prop('DataCorePlugin.GameData.TrackPositionPercent') < 0.001 ) {
            root["offTrack"] = 0 
        }
        if ( root["offTrack"] > 0 && $prop('DataCorePlugin.GameData.SessionTypeName') != 'Race') {
            return red
        } else {
            if ( timeDiffMine > 0 ) {
                return yellow
            } else {
                if ( timeDiffOverall > 0 ) {
                    return green
                } else {
                    return purple
                }
            }
        }

    } else if ( $prop('DataCorePlugin.CurrentGame') == 'Automobilista2') {

        if ( $prop('DataCorePlugin.GameRawData.mLapInvalidated') == false ) {
            
            if ( timeDiffMine > 0 ) {
                return yellow
            } else {
                if ( timeDiffOverall > 0 ) {
                    return green
                } else {
                    return purple
                }
            }
        } else {
            return red
        }

    } else if ( $prop('DataCorePlugin.CurrentGame') == 'RFactor2' ) {

        if ( timeDiffMine > 0 ) {
            return yellow
        } else {
            if ( timeDiffOverall > 0 ) {
                return green
            } else {
                return purple
            }
        }

    } else if ( $prop('DataCorePlugin.CurrentGame') == 'AssettoCorsa' ) {

        if ( timeDiffMine > 0 ) {
            return yellow
        } else {
            if ( timeDiffOverall > 0 ) {
                return green
            } else {
                return purple
            }
        }
        
    } else if ( $prop('DataCorePlugin.CurrentGame').startsWith('F120') ) {

        fastestLap = timespantoseconds(isnull(driverbestlap($prop('DataCorePlugin.GameData.BestLapOpponentPosition')+1), '0:00.000'))
        
        if ( ! timespantoseconds($prop('DataCorePlugin.GameData.BestLapTime')) > 0) {
            return white
        } else if ( $prop('GameRawData.PlayerLapData.m_currentLapInvalid') == 0) {

            if ( timeDiffMine > 0 ) {
                return yellow
            } else {
                if ( timeDiffOverall > 0 ) {
                    return green
                } else {
                    return purple
                }
            }
        
        } else {
            return red
        }

    } else {

        if ( $prop('DataCorePlugin.GameRawData.Graphics.isValidLap') == 1 ) {

            if ( timeDiffMine == null & timeDiffOverall == null) {
                return white
            } else if ( timeDiffMine > 0 ) {
                return yellow
            } else {
                if ( timeDiffOverall > 0 ) {
                    return green
                } else {
                    return purple
                }
            }

        } else {
            return red
        }

    }

}

function ld_getEstimatedTextColour() {

    if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBased')) != 0 ) {
        var timeDiffMine = timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBased')) - timespantoseconds( $prop('DataCorePlugin.GameData.BestLapTime') )
        var timeDiffOverall = timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBased')) - timespantoseconds( driverbestlap( $prop('DataCorePlugin.GameData.BestLapOpponentPosition')+1 ) )
    } else if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) != 0 ) {
        var timeDiffMine = timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) - timespantoseconds( $prop('DataCorePlugin.GameData.BestLapTime') )
        var timeDiffOverall = timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) - timespantoseconds( driverbestlap( $prop('DataCorePlugin.GameData.BestLapOpponentPosition')+1 ) )
     } else {
        var timeDiffMine = null
        var timeDiffOverall = null
    }

    if ( $prop('DataCorePlugin.CurrentGame') == 'IRacing' ) {
    
        // Calculate Off Tracks
        if( root["offTrack"] == null ) {
            root["offTrack"] = 0
        }
        if ( $prop('DataCorePlugin.GameRawData.Telemetry.PlayerTrackSurface') == 0 ) {
            root["offTrack"]++
        }
        if ( $prop('DataCorePlugin.GameData.TrackPositionPercent') < 0.001 ) {
            root["offTrack"] = 0 
        }
        if ( root["offTrack"] > 0 && $prop('DataCorePlugin.GameData.SessionTypeName') != 'Race') {
            return white // red bg
        } else {
            return black
        }

    } else if ( $prop('DataCorePlugin.CurrentGame') == 'Automobilista2') {

        if ( $prop('DataCorePlugin.GameRawData.mLapInvalidated') == false ) {
            return black 
        } else {
            return white // red bg
        }

    } else if ( $prop('DataCorePlugin.CurrentGame') == 'RFactor2' ) {

        return black

    } else if ( $prop('DataCorePlugin.CurrentGame') == 'AssettoCorsa' ) {

        return black
        
    } else if ( $prop('DataCorePlugin.CurrentGame').startsWith('F120') ) {

        fastestLap = timespantoseconds(isnull(driverbestlap($prop('DataCorePlugin.GameData.BestLapOpponentPosition')+1), '0:00.000'))
        
        if ( ! timespantoseconds($prop('DataCorePlugin.GameData.BestLapTime')) > 0) {
            return white
        } else if ( $prop('GameRawData.PlayerLapData.m_currentLapInvalid') == 0) {

            return black
        
        } else {
            return white // red bg
        }

    } else {

        if ( $prop('DataCorePlugin.GameRawData.Graphics.isValidLap') == 1 ) {

            return black

        } else {
            return white // red bg
        }

    }

}

//
//
// Sectors
function ld_sectorCount() {
    /*
    if ( root['sectorCount'] == null ) {
        root['sectorCount'] = $prop('DataCorePlugin.GameData.CurrentSectorIndex')
    }
    if ( root['sectorCount'] < $prop('DataCorePlugin.GameData.CurrentSectorIndex') ) {
        root['sectorCount'] = $prop('DataCorePlugin.GameData.CurrentSectorIndex')
    } else {
        root['sectorCount'] = root['sectorCount']
    }
    return root['sectorCount']
    */
    return $prop('DataCorePlugin.GameData.SectorsCount')
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
                timespantoseconds( bestsectortime(sector, false) )
    var timeDiffOverall = timespantoseconds( currentlapgetsectortime(sector, false) ) - 
                timespantoseconds( getbestsplittime(sector) )

    if (sector >= $prop('DataCorePlugin.GameData.CurrentSectorIndex') ) {
        return gray
    } else if ( timeDiffOverall <= 0 ) {
        return purple
    } else if (timeDiff <= 0) {
        return green
    } else {
        return yellow 
    }
}
function ld_sectorLastSegmentColor(sector) {
    var timeDiff = timespantoseconds( lastlapgetsectortime(sector, false) ) - 
                timespantoseconds( bestsectortime(sector, false) )
    var timeDiffOverall = timespantoseconds( lastlapgetsectortime(sector, false) ) - 
                timespantoseconds( getbestsplittime(sector) )
    if ( timeDiffOverall == 0 ) {
        return purple
    } else if (timeDiff <= 0) {
        return green
    } else {
        return yellow
    }
}

function ld_driverSectorSegmentColor(driver, sector) {
    var timeDiff = timespantoseconds( driversectorcurrentlap( driver, sector, false) ) - 
                    timespantoseconds( driversectorbest( driver, sector, false) )
    var timeDiffOverall = timespantoseconds( driversectorcurrentlap( driver, sector, false) ) - 
                timespantoseconds( getbestsplittime( sector ) )
    if (sector >= drivercurrentsector( driver ) ) {
        return gray
    } else if ( timeDiffOverall <= 0 ) {
        return purple
    } else if (timeDiff <= 0) {
        return green
    } else {
        return yellow 
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
        ) ? true : false

    } else if ( $prop('DataCorePlugin.CurrentGame') == 'Automobilista2' ) {

        return ( 
            $prop('DataCorePlugin.GameData.SessionTypeName')=='QUALIFY' ||
            $prop('DataCorePlugin.GameData.SessionTypeName')=='PRACTICE'
        ) ? true : false

    } else if ( $prop('DataCorePlugin.CurrentGame') == 'RFactor2' ) {

        return ( 
            $prop('DataCorePlugin.GameData.SessionTypeName')=='Qualify' ||
            $prop('DataCorePlugin.GameData.SessionTypeName')=='Practice'
        ) ? true : false

    } else if ($prop('DataCorePlugin.CurrentGame').startsWith('F120')) {
        
        return ( 
            $prop('GameRawData.PacketSessionData.m_sessionType') < 10
            // 0 = unknown, 1 = P1, 2 = P2, 3 = P3, 4 = Short P, 5 = Q1
            // 6 = Q2, 7 = Q3, 8 = Short Q, 9 = OSQ, 10 = R, 11 = R2
            // 12 = Time Trial
        ) ? true : false

    } else {

        return ( 
            ucase($prop('DataCorePlugin.GameData.SessionTypeName')) =='QUALIFY' ||
            ucase($prop('DataCorePlugin.GameData.SessionTypeName')) =='PRACTICE'
        ) ? true : false
        
    }
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

function ld_getTurn() {
    var sim = ld_getSim()
    var track = eval( "ld_tracks." + sim + "." + $prop('TrackId') )
    if ( !track || track == undefined ) { return null }

    var trackTurns = eval( "ld_tracks." + sim + "." + $prop('TrackId') + ".turns" )
    var currentPosition = drivertrackpositionpercent( getplayerleaderboardposition() ).toFixed(3)
    var margin = 0.03
    for ( const turn in trackTurns ) {
        if ( currentPosition >= (trackTurns[turn] - margin) && currentPosition <= (trackTurns[turn] + margin) ) {
            return turn
        }
    }
    return null
}

function ld_formatTime(time) {
    if (time > -10 && time < 10) {
		return format(time, '0.000', true)
	} else if (time > -100 && time < 100) {
		return format(time, '00.00', true)
	} else if (time > -1000 && time < 1000) {
		return format(time, '000.0', true)
	} else {
		return format(time, '000', true)
	}
}

function ld_formatTimeShort(time) {
    if (time > -10 && time < 10) {
		return format(time, '0.00', true)
	} else if (time > -100 && time < 100) {
		return format(time, '00.0', true)
	} else {
		return format(time, '000', true)
	}
}

function ld_formatTimeVeryShort(time) {
    if (time > -10 && time < 10) {
		return format(time, '0.0', true)
	} else if (time > -100 && time < 100) {
		return format(time, '00', true)
	} else {
		return format(time, '00', true)
	}
}

function ld_formatNumber(time) {
    if (time > -10 && time < 10) {
		return format(time, '0.000', false)
	} else if (time > -100 && time < 100) {
		return format(time, '00.00', false)
	} else if (time > -1000 && time < 1000) {
		return format(time, '000.0', false)
	} else {
		return format(time, '000', false)
	}
}

function ld_formatNumberShort(time) {
    if (time > -10 && time < 10) {
		return format(time, '0.00', false)
	} else if (time > -100 && time < 100) {
		return format(time, '00.0', false)
	} else {
		return format(time, '000', false)
	}
}

function ld_formatNumberVeryShort(time) {
    if (time > -10 && time < 10) {
		return format(time, '0.0', false)
	} else if (time > -100 && time < 100) {
		return format(time, '00', false)
	} else {
		return format(time, '00', false)
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

function ld_boardScroll(boardHeight) {
    //
    // I'm assuming all calculations will start after P3
    // boardHeight = Number of rows
    var maxScroll = $prop('OpponentsCount')-boardHeight
    var currentPos = $prop('Position')
    var midPos = Math.round(boardHeight/2 + 3)
    var maxPos = Math.round(boardHeight/2)
    
    // maxScroll can't be smaller than 3 (P3)
    maxScroll = ( maxScroll < 3 ) ? 3 : maxScroll

    if ( currentPos > midPos ) {
        if (maxScroll < currentPos - maxPos) {
            scrollPos = maxScroll
        } else {
            scrollPos = currentPos - maxPos
        }
    } else {
        scrollPos = 3 // Start board after P3 ...
    }

    return scrollPos
}