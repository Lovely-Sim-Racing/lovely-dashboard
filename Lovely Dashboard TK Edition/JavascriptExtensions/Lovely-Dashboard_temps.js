// 
// [Celsius,Fahrenheit,Kelvin]
// Generic Tyre Temps
let coldTireTemp = [50,122,323];
let optimumTireTemp = [85,185,358];
let hotTireTemp = [120,248,393];

// ACC
if ( $prop('GameRawData.Graphics.TyreCompound') == 'dry_compound' ) {
    // Dry Temps
    coldTireTemp = [50,122,323];
    optimumTireTemp = [85,185,358];
    hotTireTemp = [120,248,393];
} else if ( $prop('GameRawData.Graphics.TyreCompound') == 'wet_compound' ) {
    // Wet Temps
    coldTireTemp = [65,149,338];
    optimumTireTemp = [85,185,358];
    hotTireTemp = [105,221,378];
}

// F1 Compounds
if ( 
    // C1
    $prop('GameRawData.PlayerCarStatusData.m_actualTyreCompound') == 20 &&
	$prop('GameRawData.PlayerCarStatusData.m_actualTyreCompound') == 9 &&
	$prop('GameRawData.PlayerCarStatusData.m_actualTyreCompound') == 14
) {
    coldTireTemp = [85,185,358];
    optimumTireTemp = [105,221,378];
    hotTireTemp = [125,257,398];
} else if (
    // C2
    $prop('GameRawData.PlayerCarStatusData.m_actualTyreCompound') == 19 ||
	$prop('GameRawData.PlayerCarStatusData.m_actualTyreCompound') == 9 ||
	$prop('GameRawData.PlayerCarStatusData.m_actualTyreCompound') == 13
) {
    coldTireTemp = [82,179,355];
    optimumTireTemp = [102,215,375];
    hotTireTemp = [122,251,395];
} else if (
    // C3
    $prop('GameRawData.PlayerCarStatusData.m_actualTyreCompound') == 18 ||
	$prop('GameRawData.PlayerCarStatusData.m_actualTyreCompound') == 9 ||
	$prop('GameRawData.PlayerCarStatusData.m_actualTyreCompound') == 12
) {
    coldTireTemp = [80,176,353];
    optimumTireTemp = [100,212,373];
    hotTireTemp = [120,248,393];
} else if (
    // C4
    $prop('GameRawData.PlayerCarStatusData.m_actualTyreCompound') == 17 ||
	$prop('GameRawData.PlayerCarStatusData.m_actualTyreCompound') == 9 ||
	$prop('GameRawData.PlayerCarStatusData.m_actualTyreCompound') == 11
) {
    coldTireTemp = [77,170,350];
    optimumTireTemp = [97,206,370];
    hotTireTemp = [117,242,390];
} else if(
    // C5
    $prop('GameRawData.PlayerCarStatusData.m_actualTyreCompound') == 16 ||
	$prop('GameRawData.PlayerCarStatusData.m_actualTyreCompound') == 9 ||
	$prop('GameRawData.PlayerCarStatusData.m_actualTyreCompound') == 11
) {
    coldTireTemp = [75,167,348];
    optimumTireTemp = [95,203,368];
    hotTireTemp = [115,239,388];
} else if (
    // Intermmediate
    $prop('GameRawData.PlayerCarStatusData.m_visualTyreCompound') == 7
) {
    coldTireTemp = [65,149,338];
    optimumTireTemp = [85,185,358];
    hotTireTemp = [105,221,378];
} else if (
    // Full Wet
    $prop('GameRawData.PlayerCarStatusData.m_visualTyreCompound') == 8 ||
	$prop('GameRawData.PlayerCarStatusData.m_visualTyreCompound') == 15
) {
    coldTireTemp = [55,131,328];
    optimumTireTemp = [75,167,348];
    hotTireTemp = [95,203,368];
}

// Generic Brake Temps
let coldBrakeTemp = [150,302,423];
let optimumBrakeTemp = [550,1022,823];
let hotBrakeTemp = [1000,1832,1273];

// ACC
if ( $prop('DataCorePlugin.CurrentGame') == 'AssettoCorsaCompetizione' ) {
    coldBrakeTemp = [150,302,423];
    optimumBrakeTemp = [550,1022,823];
    hotBrakeTemp = [1000,1832,1273];
}

// F1
if ( $prop('DataCorePlugin.CurrentGame').startsWith('F120') ) {
    coldBrakeTemp = [300,572,573];
    optimumBrakeTemp = [600,1112,873];
    hotBrakeTemp = [1100,2012,1373];
}