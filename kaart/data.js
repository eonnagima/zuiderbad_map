const locations = [
    {
        category: "firstaid", //catogory
        coordinates: {
            lat: 50.98512230588802, //latitude 
            lon: 4.515648247829347 //longitude
        },
        model: "./assets/models/firstAidPin.glb", //model
        active: false, //active
        scale: 1, //scale
        data: { //data
            name: "EHBO Post",
            openingHours: null,
            description: "Hier kan je terecht voor eerste hulp bij ongevallen. Bij nood, bel 112.",
            url: null
        }
    },
    {
        category: "event", //category
        coordinates:{
            lat: 50.985994202273275, //latitude
            lon: 4.517068054409663 //longitude
        },
        model: "./assets/models/eventPin.glb", //model
        active: false, //active
        scale: 1, //scale
        data: { //data
            name: "Sportimonium",
            openingHours: null,
            description: "uitleg locatie",
            url: null
        }
    },
    {
        category: "event", //category
        coordinates:{
            lat: 50.986902596237215, //latitude
            lon: 4.515715104720473 //longitude
        },
        model: "./assets/models/eventPin.glb", //model
        active: false, //active
        scale: 1, //scale
        data: { //data
            name: "De Vergaderzaal",
            openingHours: null,
            description: "Een vergaderzaal geschikt voor bijeenkomsten, besprekingen en presentaties.",
            url: null
        }
    },
    {
        category: "event",
        coordinates: {
            lat: 50.98556532834233,
            lon: 4.5160155121242
        },
        model: "./assets/models/eventPin.glb",
        active: false,
        scale: 1,
        data: {
            name: "De Serre",
            openingHours: null,
            description: "Locatie uitleg",
            url: null
        }
    },
    {
        category: "event",
        coordinates: {
            lat: 50.985314779455486,
            lon: 4.515912650378422
        },
        model: "./assets/models/eventPin.glb",
        active: false,
        scale: 1,
        data: {
            name: "Het Strandhuis",
            openingHours: null,
            description: "Locatie uitleg",
            url: null
        }
    },
    {
        category: "event",
        coordinates: {
            lat: 50.98615986754142,
            lon: 4.515750376732202
        },
        model: "./assets/models/eventPin.glb",
        active: false,
        scale: 1,
        data: {
            name: "De Strandzone",
            openingHours: null,
            description: "Locatie uitleg",
            url: null
        }
    },
    {
        category: "event",
        coordinates: {
            lat: 50.983074362927674,
            lon: 4.508021469834593
        },
        model: "./assets/models/eventPin.glb",
        active: false,
        scale: 1,
        data: {
            name: "De Eventweide",
            openingHours: null,
            description: "120m x 70m",
            url: null
        }
    },
    {
        category: "event",
        coordinates: {
            lat: 50.980879175006564,
            lon: 4.505927530047485
        },
        model: "./assets/models/eventPin.glb",
        active: false,
        scale: 1,
        data: {
            name: "Oud Voetbalveld - Eventweide",
            openingHours: null,
            description: "Locatie uitleg",
            url: null
        }
    },
    {
        category: "food",
        coordinates: {
            lat: 50.98549954573283,
            lon: 4.515929496151217
        },
        model: "./assets/models/zuiderbadPin.glb",
        active: false,
        scale: 1,
        data: {
            name: "Zuiderbad Strandbar",
            openingHours: null,
            description: "Welkom in de strandbar op de meest magische plek op het domein van Sport Vlaanderen Hofstade! Op het menu: frisse dranken, beachfood & holiday vibes. De strandbar beschikt over een ruim terras en serre (bij regenweer). Welkom zonder reserveren.",
            url: null
        }
    },
    {
        category: "food",
        coordinates: {
            lat: 50.98277298826048,
            lon: 4.51063204776379
        },
        model: "./assets/models/zuiderbadPin.glb",
        active: false,
        scale: 1,
        data: {
            name: "Zuiderbad Zomerlust",
            openingHours: null,
            description: "In deze kleurrijke selfservice-bar met ruim terras & de leukste (én grootste) buitenspeeltuin kan je terecht voor lekkere snacks, zoetigheden en koele dranken. De toonbank wordt voorzien van gebak, smoothies en taart. ",
            url: null
        }
    },
    {
        category: "food",
        coordinates: {
            lat: 50.98418716544021,
            lon: 4.5145279563706255
        },
        model: "./assets/models/zuiderbadPin.glb",
        active: false,
        scale: 1,
        data: {
            name: "Zuiderbad Strandkiosk",
            openingHours: null,
            description: "Take-away kiosk voor strandbezoekers.",
            url: null
        }
    },

    {
        category: "activity",
        coordinates: {
            lat: 50.98361323301715,
            lon: 4.505498195955115
        },
        model: "./assets/models/activityPin.glb",
        active: false,
        scale: 1,
        data: {
            name: "Sportverblijf",
            openingHours: null,
            description: "Locatie uitleg",
            url: null
        }
    },
    {
        category: "activity",
        coordinates: {
            lat: 50.98433931025913,
            lon: 4.5059085739496165
        },
        model: "./assets/models/activityPin.glb",
        active: false,
        scale: 1,
        data: {
            name: "Zeilclub",
            openingHours: null,
            description: "Locatie uitleg",
            url: null
        }
    },
    {
        category: "activity",
        coordinates: {
            lat: 50.98184864915311,
            lon: 4.507804895735719
        },
        model: "./assets/models/activityPin.glb",
        active: false,
        scale: 1,
        data: {
            name: "Sportweide",
            openingHours: null,
            description: "150m x 65m",
            url: null
        }
    },
    {
        category: "activity",
        coordinates: {
            lat: 50.98642945370189,
            lon: 4.51736024345233
        },
        model: "./assets/models/activityPin.glb",
        active: false,
        scale: 1,
        data: {
            name: "Documentatiecentrum Sport Vlaanderen",
            openingHours: null,
            description: "Locatie uitleg",
            url: null
        }
    },
    {
        category: "activity",
        coordinates: {
            lat: 50.987322056242014,
            lon: 4.516805882630891
        },
        model: "./assets/models/activityPin.glb",
        active: false,
        scale: 1,
        data: {
            name: "Uitleendienst Sport Vlaanderen",
            openingHours: null,
            description: "Locatie uitleg",
            url: null
        }
    },
    {
        category: "activity",
        coordinates: {
            lat: 50.986951311613666,
            lon: 4.496932554291879
        },
        model: "./assets/models/activityPin.glb",
        active: false,
        scale: 1,
        data: {
            name: "Sportcomplex: Sporthal + Gymnastiekhal",
            openingHours: null,
            description: "Locatie uitleg",
            url: null
        }
    },
    {
        category: "activity",
        coordinates: {
            lat: 50.983008929335604,
            lon: 4.50639447033648
        },
        model: "./assets/models/activityPin.glb",
        active: false,
        scale: 1,
        data: {
            name: "Skateramp",
            openingHours: null,
            description: "Locatie uitleg",
            url: null
        }
    },
    {
        category: "activity",
        coordinates: {
            lat: 50.98771984773038,
            lon: 4.513132179386137
        },
        model: "./assets/models/activityPin.glb",
        active: false,
        scale: 1,
        data: {
            name: "Zensportplatform",
            openingHours: null,
            description: "Locatie uitleg",
            url: null
        }
    },
    {
        category: "activity",
        coordinates: {
            lat: 50.98432600845067,
            lon: 4.512206817254621
        },
        model: "./assets/models/activityPin.glb",
        active: false,
        scale: 1,
        data: {
            name: "Openwaterzwemmen",
            openingHours: null,
            description: "Locatie uitleg",
            url: null
        }
    },
    {
        category: "activity",
        coordinates: {
            lat: 50.98434692736529,
            lon: 4.504302244086647
        },
        model: "./assets/models/activityPin.glb",
        active: false,
        scale: 1,
        data: {
            name: "Hoogtouwenparcours",
            openingHours: null,
            description: "Locatie uitleg",
            url: null
        }
    },
    {
        category: "activity",
        coordinates: {
            lat: 50.9831013740483,
            lon: 4.505932100058098
        },
        model: "./assets/models/activityPin.glb",
        active: false,
        scale: 1,
        data: {
            name: "Boogschieten",
            openingHours: null,
            description: "Locatie uitleg",
            url: null
        }
    },
    {
        category: "activity",
        coordinates: {
            lat: 50.98326685493851,
            lon: 4.5058757736673
        },
        model: "./assets/models/activityPin.glb",
        active: false,
        scale: 1,
        data: {
            name: "Muurklimmen",
            openingHours: null,
            description: "Locatie uitleg",
            url: null
        }
    },
    {
        category: "activity",
        coordinates: {
            lat: 50.98619572975237,
            lon: 4.518236317632268
        },
        model: "./assets/models/activityPin.glb",
        active: false,
        scale: 1,
        data: {
            name: "Finse piste",
            openingHours: null,
            description: "Locatie uitleg",
            url: null
        }
    },
    {
        category: "activity",
        coordinates: {
            lat: 50.984002131029364,
            lon: 4.50571373191572
        },
        model: "./assets/models/activityPin.glb",
        active: false,
        scale: 1,
        data: {
            name: "Voetbalveldje",
            openingHours: null,
            description: "Locatie uitleg",
            url: null
        }
    },
    {
        category: "activity",
        coordinates: {
            lat: 50.98344068665865,
            lon: 4.505889593302249
        },
        model: "./assets/models/activityPin.glb",
        active: false,
        scale: 1,
        data: {
            name: "Pingpongtafel",
            openingHours: null,
            description: "Locatie uitleg",
            url: null
        }
    },
    {
        category: "activity",
        coordinates: {
            lat: 50.98221139055193,
            lon: 4.507040260973086
        },
        model: "./assets/models/activityPin.glb",
        active: false,
        scale: 1,
        data: {
            name: "Basket- en voetbalplein",
            openingHours: null,
            description: "Locatie uitleg",
            url: null
        }
    },
    {
        category: "activity",
        coordinates: {
            lat: 50.983475426085185,
            lon: 4.512112646576719
        },
        model: "./assets/models/activityPin.glb",
        active: false,
        scale: 1,
        data: {
            name: "Waterpretpark",
            openingHours: null,
            description: "Locatie uitleg",
            url: null
        }
    },
    {
        category: "playground",
        coordinates: {
            lat: 50.9837789105706,
            lon: 4.513602807229226
        },
        model: "./assets/models/playgroundPin.glb",
        active: false,
        scale: 1,
        data: {
            name: "Piratenspeeltuin",
            openingHours: null,
            description: "Locatie uitleg",
            url: null
        }
    },
    {
        category: "playground",
        coordinates: {
            lat: 50.98250067836458,
            lon: 4.511346087312436
        },
        model: "./assets/models/playgroundPin.glb",
        active: false,
        scale: 1,
        data: {
            name: "Mega-speeltuin",
            openingHours: null,
            description: "Locatie uitleg",
            url: null
        }
    },
    {
        category: "dog",
        coordinates: {
            lat: 50.989256821596854,
            lon: 4.502164197900196
        },
        model: "./assets/models/dogPin.glb",
        active: false,
        scale: 1,
        data: {
            name: "Hondenlosloopweide",
            openingHours: null,
            description: "Locatie uitleg",
            url: null
        }
    },
    {
        category: "entrance",
        coordinates: {
            lat: 50.98761561491742,
            lon: 4.497159331394608
        },
        model: "./assets/models/entrancePin.glb",
        active: false,
        scale: 1,
        data: {
            name: "Ingang A",
            openingHours: null,
            description: "Locatie uitleg",
            url: null
        }
    },
    {
        category: "entrance",
        coordinates: {
            lat: 50.983642575863506,
            lon: 4.503382953508312
        },
        model: "./assets/models/entrancePin.glb",
        active: false,
        scale: 1,
        data: {
            name: "Ingang B",
            openingHours: null,
            description: "Locatie uitleg",
            url: null
        }
    },
    {
        category: "entrance",
        coordinates: {
            lat: 50.98216800646788,
            lon: 4.504478951619294
        },
        model: "./assets/models/entrancePin.glb",
        active: false,
        scale: 1,
        data: {
            name: "Ingang C",
            openingHours: null,
            description: "Locatie uitleg",
            url: null
        }
    },
    {
        category: "entrance",
        coordinates: {
            lat: 50.979563838977995,
            lon: 4.5064236021895505
        },
        model: "./assets/models/entrancePin.glb",
        active: false,
        scale: 1,
        data: {
            name: "Ingang D",
            openingHours: null,
            description: "Locatie uitleg",
            url: null
        }
    },
    {
        category: "entrance",
        coordinates: {
            lat: 50.98585133313062,
            lon: 4.519856104838509
        },
        model: "./assets/models/entrancePin.glb",
        active: false,
        scale: 1,
        data: {
            name: "Ingang E",
            openingHours: null,
            description: "Locatie uitleg",
            url: null
        }
    },
    {
        category: "entrance",
        coordinates: {
            lat: 50.98739811101135,
            lon: 4.512465275365514
        },
        model: "./assets/models/entrancePin.glb",
        active: false,
        scale: 1,
        data: {
            name: "Uitgang Strand A",
            openingHours: null,
            description: "Locatie uitleg",
            url: null
        }
    },
    {
        category: "entrance",
        coordinates: {
            lat: 50.98497787283702,
            lon: 4.515659272881967
        },
        model: "./assets/models/entrancePin.glb",
        active: false,
        scale: 1,
        data: {
            name: "Uitgang Strand B",
            openingHours: null,
            description: "Locatie uitleg",
            url: null
        }
    },
    {
        category: "entrance",
        coordinates: {
            lat: 50.9833737556066,
            lon: 4.514657467797241
        },
        model: "./assets/models/entrancePin.glb",
        active: false,
        scale: 1,
        data: {
            name: "Ingang strand + Infopunt + kassa strand",
            openingHours: null,
            description: "Locatie uitleg",
            url: null
        }
    },
    {
        category: "parkings",
        coordinates: {
            lat: 50.98643214349996,
            lon: 4.497888915076186
        },
        model: "./assets/models/parkingPin.glb",
        active: false,
        scale: 1,
        data: {
            name: "Parking A",
            openingHours: null,
            description: "Gratis",
            url: null
        }
    },
    {
        category: "parkings",
        coordinates: {
            lat: 50.98390318626152,
            lon: 4.503174843520835
        },
        model: "./assets/models/parkingPin.glb",
        active: false,
        scale: 1,
        data: {
            name: "Parking B",
            openingHours: null,
            description: "Betalend",
            url: null
        }
    },
    {
        category: "parkings",
        coordinates: {
            lat: 50.98512399500207,
            lon: 4.518216671631152
        },
        model: "./assets/models/parkingPin.glb",
        active: false,
        scale: 1,
        data: {
            name: "Parking E",
            openingHours: null,
            description: "Betalend",
            url: null
        }
    },
    {
        category: "parkings",
        coordinates: {
            lat: 50.97955301514079,
            lon: 4.5064678559313975
        },
        model: "./assets/models/parkingPin.glb",
        active: false,
        scale: 1,
        data: {
            name: "Parking D",
            openingHours: null,
            description: "Uitleg locatie",
            url: null
        }
    },
    {
        category: "parkings",
        coordinates: {
            lat: 50.9837146608202,
            lon: 4.505264885257313
        },
        model: "./assets/models/parkingPin.glb",
        active: false,
        scale: 1,
        data: {
            name: "Parking Sportcomplex",
            openingHours: null,
            description: "Betalend",
            url: null
        }
    },
    {
        category: "misc",
        coordinates: {
            lat: 50.985903521837976,
            lon: 4.516523135818364
        },
        model: "./assets/models/smokerPin.glb",
        active: false,
        scale: 1,
        data: {
            name: "Rookzone A",
            openingHours: null,
            description: "Locatie uitleg",
            url: null
        }
    },
    {
        category: "misc",
        coordinates: {
            lat: 50.984952178948106,
            lon: 4.515687813896553
        },
        model: "./assets/models/smokerPin.glb",
        active: false,
        scale: 1,
        data: {
            name: "Rookzone B",
            openingHours: null,
            description: "Locatie uitleg",
            url: null
        }
    },
    {
        category: "misc",
        coordinates: {
            lat: 50.98328474150657,
            lon: 4.505310275274428
        },
        model: "./assets/models/smokerPin.glb",
        active: false,
        scale: 1,
        data: {
            name: "Rookzone C",
            openingHours: null,
            description: "Locatie uitleg",
            url: null
        }
    },
    {
        category: "misc",
        coordinates: {
            lat: 50.98569420877726, 
            lon: 4.517210304870805
        },
        model: "./assets/models/firstAidPin.glb",
        active: false,
        scale: 1,
        data: {
            name: "Verzamelpunt A",
            openingHours: null,
            description: "Locatie uitleg",
            url: null
        }
    },
    {
        category: "misc",
        coordinates: {
            lat: 50.98197816612686, 
            lon: 4.510728737661302
        },
        model: "./assets/models/firstAidPin.glb",
        active: false,
        scale: 1,
        data: {
            name: "Verzamelpunt B",
            openingHours: null,
            description: "Locatie uitleg",
            url: null
        }
    },
    {
        category: "terminal",
        coordinates: {
            lat: 50.983197014068054,
            lon: 4.514638923003463
        },
        model: "./assets/models/terminalPin.glb",
        active: false,
        scale: 1,
        data: {
            name: "Betaalautomaat A",
            openingHours: null,
            description: "Locatie uitleg",
            url: null
        }
    },
    {
        category: "terminal",
        coordinates: {
            lat: 50.979191529387315,
            lon: 4.507193110805814
        },
        model: "./assets/models/terminalPin.glb",
        active: false,
        scale: 1,
        data: {
            name: "Betaalautomaat B",
            openingHours: null,
            description: "Locatie uitleg",
            url: null
        }
    },
    {
        category: "terminal",
        coordinates: {
            lat: 50.983636042819796,
            lon: 4.503537259882611
        },
        model: "./assets/models/terminalPin.glb",
        active: false,
        scale: 1,
        data: {
            name: "Betaalautomaat C",
            openingHours: null,
            description: "Locatie uitleg",
            url: null
        }
    },
    {
        category: "terminal",
        coordinates: {
            lat: 50.98578714553714,
            lon: 4.518978109538798
        },
        model: "./assets/models/terminalPin.glb",
        active: false,
        scale: 1,
        data: {
            name: "Betaalautomaat D",
            openingHours: null,
            description: "Locatie uitleg",
            url: null
        }
    },
    {
        category: "toilet",
        coordinates: {
           lat: 50.9850038744516, 
           lon: 4.515582039492203
        },
        model: "./assets/models/wcPin.glb",
        active: false,
        scale: 1,
        data: {
            name: "Toilet",
            openingHours: null,
            description: "Locatie uitleg",
            url: null
        }
    },
    {
        category: "toilet",
        coordinates: {
           lat: 50.985083386858655, 
           lon: 4.515426412759036
        },
        model: "./assets/models/showerPin.glb",
        active: false,
        scale: 1,
        data: {
            name: "Openbare douches",
            openingHours: null,
            description: "Locatie uitleg",
            url: null
        }
    },
    {
        category: "culture",
        coordinates: {
            lat: 50.98295389905467, 
            lon: 4.514065794095727
        },
        model: "./assets/models/culture.glb",
        active: false,
        scale: 1,
        data: {
            name: "Boothuis",
            openingHours: null,
            description: "Huidige status; vervallen en niet meer in gebruik. De ontwerper Félix Milan, 1920-2000. Milan zou 19 jaar geweest zijn bij de oplevering. Het werd in 1939 gebouwd aan een inham ten zuiden van de strandzone, aansluitend bij een aanlegsteiger voor bootjes. Het niveauverschil tussen de oever en het water wordt overbrugd door een horizontaliserend, langgerekt volume met aansluitend terras en kiosk, het geheel opgetrokken uit witgepleisterde baksteen. Het 'Bootshuis' bevatte op waterniveau de open loods met aansluitend een kelder, een pompkamer en een bergplaats. Een bescheiden binnentrap leidde naar het tweede niveau met kleedkamers en sanitair, keuken en restaurant. Een volledig beglaasde rotonde vormt de overgang naar het ruime, met metalen borstweringen beveiligde terras. Aan het uiteinde van het terras is een kleine kiosk voorzien, bereikbaar via een trap die tevens voor de verbinding zorgt met de pier, die de inham aan de noordzijde aflijnt. De horizontale, gestroomlijnde vormgeving met plat dak, bandramen ('fenêtres à longueur'), patrijspoorten, afgeronde hoeken en metalen borstweringen, roept onvermijdelijk het beeld op van een gestrande pakketboot. De gelijkenis met het boothotel 'Normandie' (1935) van L. Bruggeman in Oostduinkerke is niet toevallig. In 1953 werd de aanlegsteiger voor roeibootjes overkapt met een betonnen hangar, volgens de oorspronkelijke plannen. In 1963 volgde een tweede verbouwing waarbij het 'Bootshuis' werd uitgebreid en voorzien van een garage.",
            url: null
        }
    },
    {
        category: "culture",
        coordinates: {
            lat: 50.98572838438112, 
            lon: 4.516555759932292
        },
        model: "./assets/models/culture.glb",
        active: false,
        scale: 1,
        data: {
            name: "Olympische Fakkel",
            openingHours: null,
            description: "Locatie uitleg",
            url: null
        }
    },
    {
        category: "culture",
        coordinates: {
            lat: 50.98271135797229, 
            lon: 4.514094108547552
        },
        model: "./assets/models/culture.glb",
        active: false,
        scale: 1,
        data: {
            name: "RAF of RAAF monument",
            openingHours: null,
            description: "Locatie uitleg",
            url: null
        }
    }
];