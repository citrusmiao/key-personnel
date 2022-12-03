const path1 = [
  { lng: 113.33036109778745, lat: 23.147266426662974 },
  { lng: 113.3302234266074, lat: 23.139035169459106 },
  { lng: 113.33065589790075, lat: 23.137661924065405 },
  { lng: 113.3307736098856, lat: 23.13470378122391 },
  { lng: 113.33136281756491, lat: 23.125797855716822 },
  { lng: 113.33114671718569, lat: 23.123309036470285 },
  { lng: 113.33118134135026, lat: 23.12023449950246 },
  { lng: 113.3305061701413, lat: 23.114181296639405 },
  { lng: 113.32991755934378, lat: 23.11334669739095 },
  { lng: 113.32983099893237, lat: 23.112866269617378 },
  { lng: 113.32995218350834, lat: 23.112225696547444 }
]
const haizhu = [
  { lng: 113.24890957538062, lat: 23.10926632094443 },
  { lng: 113.25278769897565, lat: 23.10305704334711 },
  { lng: 113.25651666397091, lat: 23.09353558709017 },
  { lng: 113.25905236016767, lat: 23.08677355879773 },
  { lng: 113.2627813251629, lat: 23.079873175224158 },
  { lng: 113.2673306624571, lat: 23.074559635769322 },
  { lng: 113.27125511185139, lat: 23.070333334798406 },
  { lng: 113.2743874424474, lat: 23.067365846838822 },
  { lng: 113.27804182814273, lat: 23.065019414140405 },
  { lng: 113.28266574473683, lat: 23.06143067231227 },
  { lng: 113.28728966133093, lat: 23.060878549592914 },
  { lng: 113.29236105372405, lat: 23.060395440334187 },
  { lng: 113.2978053426171, lat: 23.059567248952458 },
  { lng: 113.30228010061138, lat: 23.0582559353894 },
  { lng: 113.31272120259806, lat: 23.056530503119394 },
  { lng: 113.31853838798997, lat: 23.055357196397807 },
  { lng: 113.3236843596834, lat: 23.054943085673468 },
  { lng: 113.32860659347712, lat: 23.054528973660652 },
  { lng: 113.33345424797093, lat: 23.05418387933241 },
  { lng: 113.33695947506597, lat: 23.053631726546342 },
  { lng: 113.33986806776227, lat: 23.053217610453487 },
  { lng: 113.34426824645665, lat: 23.051768193982475 },
  { lng: 113.3498616939492, lat: 23.04969757164709 },
  { lng: 113.35299402454521, lat: 23.049145400251597 },
  { lng: 113.35538056214216, lat: 23.048386160843382 },
  { lng: 113.35888578923769, lat: 23.047557894732712 },
  { lng: 113.36261475423292, lat: 23.048248116849425 },
  { lng: 113.36552334692921, lat: 23.049007357044882 },
  { lng: 113.36843193962551, lat: 23.050180719739462 },
  { lng: 113.3713405323218, lat: 23.051768193982603 },
  { lng: 113.37357791131895, lat: 23.05411486035972 },
  { lng: 113.37521865591684, lat: 23.057082643880218 },
  { lng: 113.37574071101618, lat: 23.059291184013503 },
  { lng: 113.3759644489159, lat: 23.061223626561553 },
  { lng: 113.377825756669, lat: 23.06222790987444 },
  { lng: 113.37935915728025, lat: 23.063741491026516 },
  { lng: 113.3814036914286, lat: 23.065065860408875 },
  { lng: 113.38309043210099, lat: 23.066390216606656 },
  { lng: 113.38467494606596, lat: 23.067525368567605 },
  { lng: 113.38615723332349, lat: 23.068471321134954 },
  { lng: 113.38769063393475, lat: 23.070221315648784 },
  { lng: 113.38896846777749, lat: 23.07178210213952 },
  { lng: 113.38978628143774, lat: 23.073721235595492 },
  { lng: 113.39106411528046, lat: 23.075423866046663 },
  { lng: 113.39269974259913, lat: 23.077031885898023 },
  { lng: 113.39478157990268, lat: 23.0784947859124 },
  { lng: 113.39708792685991, lat: 23.080146908226926 },
  { lng: 113.39935707467264, lat: 23.081317149110077 },
  { lng: 113.40110543446278, lat: 23.082280869160485 },
  { lng: 113.4026021171582, lat: 23.083077330275326 },
  { lng: 113.40461087095963, lat: 23.084075455551734 },
  { lng: 113.40714041278368, lat: 23.08517682646803 },
  { lng: 113.40951821166016, lat: 23.086276825236233 },
  { lng: 113.41193615605079, lat: 23.08734376077623 },
  { lng: 113.41468889274164, lat: 23.08841068774995 },
  { lng: 113.41669764654308, lat: 23.089236689846224 },
  { lng: 113.41892959521135, lat: 23.090234768861766 },
  { lng: 113.42112434473516, lat: 23.091198424245547 },
  { lng: 113.42337991493831, lat: 23.091882825178683 },
  { lng: 113.42507228291103, lat: 23.092665696672086 },
  { lng: 113.42642617728922, lat: 23.093318086059245 },
  { lng: 113.42811854526194, lat: 23.0941531397999 },
  { lng: 113.4191723501398, lat: 23.09836854653731 },
  { lng: 113.42267471258529, lat: 23.102722444013484 },
  { lng: 113.42033273830693, lat: 23.103984126641507 },
  { lng: 113.42043350915056, lat: 23.10440362871295 },
  { lng: 113.4163019045618, lat: 23.10734010610115 },
  { lng: 113.41468957106373, lat: 23.105522294423743 },
  { lng: 113.41327877925295, lat: 23.105988402354804 },
  { lng: 113.41393378973652, lat: 23.10724688559496 },
  { lng: 113.41166644575489, lat: 23.108924844691227 },
  { lng: 113.41116259153674, lat: 23.10836552734901 },
  { lng: 113.41085546827675, lat: 23.108311779206325 },
  { lng: 113.40992572090396, lat: 23.107320498362604 },
  { lng: 113.40510364130942, lat: 23.1105712887578 },
  { lng: 113.40103627805077, lat: 23.112170683239135 },
  { lng: 113.39490630426694, lat: 23.11319238600316 },
  { lng: 113.38999128024207, lat: 23.11406082716863 },
  { lng: 113.3826463566993, lat: 23.114265165440525 },
  { lng: 113.37691611879193, lat: 23.113578164166988 },
  { lng: 113.37151588986033, lat: 23.112683466965972 },
  { lng: 113.36579325920148, lat: 23.112758025296422 },
  { lng: 113.35878102163359, lat: 23.11350360629727 },
  { lng: 113.35281658967928, lat: 23.11402551050573 },
  { lng: 113.3480611642022, lat: 23.11521842670384 },
  { lng: 113.34378934131601, lat: 23.11574032416864 },
  { lng: 113.3380879536878, lat: 23.115079711251035 },
  { lng: 113.33106866179997, lat: 23.11473538585066 },
  { lng: 113.32761219230974, lat: 23.114489438589153 },
  { lng: 113.3240493699104, lat: 23.113358075315585 },
  { lng: 113.3215500765867, lat: 23.1131613155009 },
  { lng: 113.31798725418909, lat: 23.112423463597917 },
  { lng: 113.31362678498513, lat: 23.111931560050426 },
  { lng: 113.30931949223579, lat: 23.111931560050426 },
  { lng: 113.30448043494947, lat: 23.11252184408865 },
  { lng: 113.30043902446859, lat: 23.11321050548192 },
  { lng: 113.29661031980251, lat: 23.11444024908216 },
  { lng: 113.29262208577532, lat: 23.115866737382856 },
  { lng: 113.28915322926075, lat: 23.11740304527286 },
  { lng: 113.28511181877987, lat: 23.119075440942222 },
  { lng: 113.28255934900248, lat: 23.11981325585988 },
  { lng: 113.27963464404921, lat: 23.120108380678136 },
  { lng: 113.27617817455899, lat: 23.119616505616342 },
  { lng: 113.27335982251311, lat: 23.118977065309878 },
  { lng: 113.27059464692093, lat: 23.117648987134437 },
  { lng: 113.26740405969917, lat: 23.116222517992007 },
  { lng: 113.26394759020896, lat: 23.114599275832838 },
  { lng: 113.26081017944092, lat: 23.11332034378406 },
  { lng: 113.25671559250469, lat: 23.111697066128023 },
  { lng: 113.25230194684795, lat: 23.110172150851536 },
  { lng: 113.24948359480207, lat: 23.109581856363885 },
  { lng: 113.24890957538062, lat: 23.10926632094443 }
]

export default {
  path1,
  haizhu
}
