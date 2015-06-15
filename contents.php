<?php

function getContent($filter = ""){
$contents = [
    ['Content' => [
            "Number"=> 1,
            "ID"=> "81c68e15-b12f-4ffd-8be7-c175dede6c1d",
            "Name"=> "Our Company- About Us (#1)"
        ]
    ],
    [
        "Content" => [
            "Number"=> 2,
            "ID"=> "47d64103-4553-42d4-a69c-7467f280c403",
            "Name"=> "Luis Test Content (#2)"
        ]
    ],
    [
        "Content" => [
            "Number"=> 3,
            "ID"=> "152f9754-0842-4455-9373-0823894a38c4",
            "Name"=> "FHA Lending (#3)"
        ]
    ],
    [
        "Content" => [
            "Number"=> 4,
            "ID"=> "b5ee25f6-25be-4b29-bc35-fff0aa2ae37c",
            "Name"=> "SBA Lending #4"
        ]
    ],
    [
        "Content" => [
            "Number"=> 5,
            "ID"=> "ef2d7e31-3817-4da6-8357-544b0e0c31e6",
            "Name"=> "Conventional #5"
        ]
    ]
];

$searchResults = array();
$filter = strtolower($filter);

if( strlen($filter) > 0 ){

    for($i=0; $i<count($contents); $i++){

        $name = strtolower($contents[$i]["Content"]["Name"]);

        if(strrpos($name, $filter) > -1 ){
            array_push( $searchResults, $contents[$i]);
        }

    }

   return $searchResults;
}

return $contents;


}



function query($variable){
    return (isset($_GET[$variable]) ? $_GET[$variable] : "");
}

function json_parse($data){
    header('Content-Type: application/json');
    echo json_encode($data);
}

$r = getContent(query('q'));
json_parse($r);