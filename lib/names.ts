interface NamePool {
  first: string[];
  last: string[];
}

/**
 * Invented name pools per country — these are NOT meant to match real
 * footballers, only to read as plausibly local. If a combination happens
 * to land on a real person, that's coincidence.
 */
export const NAMES_BY_COUNTRY: Record<string, NamePool> = {
  AR: {
    first: [
      "Mateo", "Ramiro", "Tobías", "Bautista", "Lucio", "Renzo", "Iván", "Nahuel",
      "Joaquín", "Bruno", "Joaco", "Ezequiel", "Camilo", "Alejo", "Benicio", "Valentín",
      "Tomás", "Agustín", "Cristian", "Damián", "Esteban", "Mauro", "Ignacio", "Sebastián",
      "Gonzalo", "Federico", "Maximiliano", "Hernán", "Luciano", "Ramón",
    ],
    last: [
      "Aguirre", "Salgado", "Vázquez", "Bermúdez", "Bustos", "Cabrera", "Castaño",
      "Domínguez", "Esquivel", "Funes", "Galván", "Gauto", "Herrera", "Ibarra",
      "Lema", "Maidana", "Mansilla", "Medrano", "Núñez", "Olivera", "Páez", "Pereyra",
      "Quiroga", "Rojas", "Sosa", "Tévez", "Vergara", "Yacante", "Zabala", "Lascano",
    ],
  },
  BR: {
    first: [
      "Heitor", "Davi", "Arthur", "Bento", "Théo", "Miguel", "Caio", "Otávio",
      "Murilo", "Ravi", "Enzo", "Henrique", "Yuri", "Igor", "Renan", "Mateus",
      "Augusto", "Gustavo", "Anderson", "Eduardo", "Vitor", "Diego", "Rafael",
      "Bernardo", "Felipe", "Tiago", "Wesley", "Iago", "Pedro", "Léo",
    ],
    last: [
      "Cordeiro", "Tavares", "Macedo", "Fontes", "Vilela", "Magalhães", "Quintas",
      "Sardinha", "Drumond", "Bezerra", "Padilha", "Camargo", "Sampaio", "Sarmento",
      "Goulart", "Mascarenhas", "Holanda", "Pacheco", "Tinoco", "Veloso", "Pestana",
      "Brito", "Vasconcelos", "Carmo", "Câmara", "Cândido", "Furtado", "Loureiro",
      "Albuquerque", "Aragão",
    ],
  },
  ES: {
    first: [
      "Adrián", "Álvaro", "Bruno", "Daniel", "Eduardo", "Emilio", "Fernando", "Gonzalo",
      "Hugo", "Iván", "Javier", "Joaquín", "Jorge", "José", "Juan", "Luis", "Manuel",
      "Marco", "Mario", "Miguel", "Nicolás", "Pablo", "Pedro", "Rafael", "Raúl",
      "Roberto", "Rodrigo", "Sergio", "Tomás", "Vicente",
    ],
    last: [
      "Aguilar", "Bermúdez", "Cabrera", "Camacho", "Castaño", "Cifuentes", "Delgado",
      "Escudero", "Estévez", "Galván", "Garrido", "Guerrero", "Herrera", "Jiménez",
      "Lara", "Lozano", "Marín", "Medina", "Mendoza", "Molina", "Ortega", "Pacheco",
      "Quintana", "Rivas", "Robles", "Salas", "Salgado", "Solano", "Vergara", "Villalba",
    ],
  },
  EN: {
    first: [
      "Alfie", "Archie", "Bailey", "Charlie", "Dexter", "Edward", "Finley", "George",
      "Harvey", "Isaac", "Jacob", "Kieran", "Leonard", "Mason", "Nathan", "Oliver",
      "Patrick", "Quentin", "Reggie", "Stanley", "Theo", "Vincent", "William", "Xavier",
      "Cole", "Owen", "Tobias", "Felix", "Henry", "Jasper",
    ],
    last: [
      "Ashton", "Bramley", "Crowther", "Dalton", "Eastwood", "Fairbanks", "Goddard",
      "Holloway", "Inglis", "Jardine", "Kingsley", "Lockhart", "Marlow", "Newbury",
      "Osborne", "Pemberton", "Quincey", "Radcliffe", "Sutcliffe", "Thornton",
      "Underwood", "Vance", "Whitaker", "Yarwood", "Hartley", "Lambert", "Mortimer",
      "Penrose", "Skinner", "Westbrook",
    ],
  },
  SC: {
    first: [
      "Angus", "Bruce", "Calum", "Donald", "Euan", "Fergus", "Gordon", "Hamish",
      "Iain", "Jamie", "Keir", "Lachlan", "Magnus", "Niall", "Orin", "Paddy",
      "Quinn", "Robbie", "Stuart", "Torin", "Ualan", "Wallace", "Cameron", "Lyle",
      "Murray", "Rory", "Greig", "Innes", "Kenzie", "Findlay",
    ],
    last: [
      "Abernethy", "Buchanan", "Carmichael", "Drummond", "Erskine", "Forsyth",
      "Galbraith", "Hamilton", "Inverarity", "Kinross", "Lockhart", "MacBride",
      "MacRae", "Niven", "Oswald", "Pollock", "Ramsay", "Stirling", "Tannock",
      "Urquhart", "Wishart", "Aitken", "Boyd", "Crawford", "Dunbar", "Elphinstone",
      "Fyfe", "Henderson", "MacPhee", "Sinclair",
    ],
  },
  IT: {
    first: [
      "Alessio", "Bruno", "Carlo", "Davide", "Edoardo", "Francesco", "Giulio", "Lorenzo",
      "Marco", "Nicolò", "Orlando", "Paolo", "Riccardo", "Stefano", "Tommaso", "Umberto",
      "Vittorio", "Antonio", "Cesare", "Diego", "Enrico", "Gianni", "Luca", "Massimo",
      "Pietro", "Salvatore", "Daniele", "Fabio", "Mauro", "Sergio",
    ],
    last: [
      "Albanese", "Bellini", "Cattaneo", "De Luca", "Esposito", "Ferrari", "Greco",
      "Iannone", "La Rocca", "Marchetti", "Negri", "Orlando", "Pellegrini", "Quaranta",
      "Rinaldi", "Sabatini", "Tartaglia", "Vacca", "Zambrotta", "Caputo", "Donati",
      "Fontana", "Gallo", "Mancini", "Pagano", "Riva", "Sacco", "Tedesco", "Vitale",
      "Zappia",
    ],
  },
  FR: {
    first: [
      "Arthur", "Bastien", "Clément", "Damien", "Étienne", "Florian", "Gaël", "Hugo",
      "Ilan", "Julien", "Kévin", "Lucas", "Mathieu", "Noah", "Olivier", "Pascal",
      "Quentin", "Romain", "Sébastien", "Tristan", "Valentin", "Xavier", "Yann",
      "Antoine", "Baptiste", "Cédric", "Maxence", "Théo", "Loïc", "Aurélien",
    ],
    last: [
      "Bernard", "Cordier", "Dubois", "Estève", "Faure", "Garnier", "Hervieu", "Imbert",
      "Joubert", "Lacroix", "Marchand", "Noël", "Olivier", "Petit", "Roche", "Sénéchal",
      "Tisserand", "Vidal", "Aubert", "Béranger", "Chastel", "Delaunay", "Foucault",
      "Granger", "Huet", "Lambert", "Mercier", "Pelletier", "Rambert", "Surin",
    ],
  },
  DE: {
    first: [
      "Andreas", "Benedikt", "Christian", "Daniel", "Erik", "Felix", "Gregor", "Hannes",
      "Ingo", "Jens", "Kilian", "Lukas", "Matthias", "Niklas", "Oskar", "Paul",
      "Quirin", "Rainer", "Sebastian", "Tobias", "Uwe", "Valentin", "Werner", "Xaver",
      "Bastian", "Fabian", "Jonas", "Markus", "Stefan", "Florian",
    ],
    last: [
      "Achterberg", "Bauerschmidt", "Brandes", "Drechsel", "Engelhardt", "Falkenberg",
      "Geiger", "Hartmann", "Iversen", "Jaeger", "Kaltenbach", "Lindemann", "Maibaum",
      "Neumeier", "Ostermann", "Pfeiffer", "Quasthoff", "Reinhardt", "Stöger",
      "Trautmann", "Uhlmann", "Vollbrecht", "Wagenknecht", "Zellner", "Bachmeier",
      "Diederich", "Hoffmeister", "Krieger", "Riedel", "Steinhoff",
    ],
  },
  PT: {
    first: [
      "Afonso", "Bernardo", "Carlos", "Diogo", "Eduardo", "Fábio", "Gonçalo", "Henrique",
      "Inácio", "João", "Lourenço", "Manuel", "Nuno", "Otávio", "Paulo", "Rafael",
      "Salvador", "Tiago", "Vasco", "Xavier", "Tomé", "Rúben", "Filipe", "Hugo",
      "Pedro", "Mário", "Joaquim", "Sebastião", "Daniel", "Renato",
    ],
    last: [
      "Almeida", "Branco", "Cabral", "Diniz", "Estrela", "Faro", "Galvão", "Henriques",
      "Isidoro", "Joaquim", "Lemos", "Magalhães", "Nogueira", "Oliveira", "Pinheiro",
      "Quintela", "Resende", "Soromenho", "Tavares", "Urbano", "Valverde", "Xavier",
      "Antunes", "Bento", "Castanheira", "Domingues", "Esteves", "Loureiro", "Pestana",
      "Veiga",
    ],
  },
  NL: {
    first: [
      "Bram", "Cas", "Daan", "Erik", "Finn", "Gijs", "Hidde", "Ivar", "Joep", "Koen",
      "Lars", "Maarten", "Niels", "Olaf", "Pim", "Quinn", "Roel", "Sander", "Tom",
      "Vincent", "Wessel", "Sven", "Twan", "Bas", "Joris", "Kasper", "Stijn", "Thijs",
      "Wouter", "Jelle",
    ],
    last: [
      "Beelen", "Cremers", "Dekker", "Engelhart", "Florijn", "Goossens", "Heemskerk",
      "Ijsbrand", "Janssen", "Kortleve", "Lansink", "Meeuwis", "Nieuwenhuis", "Ottens",
      "Plantinga", "Quint", "Roozemond", "Schipper", "Terpstra", "Uitterlinden",
      "Vermeulen", "Wijngaard", "Zijderveld", "Bakker", "Doornbos", "Hagedoorn",
      "Kooistra", "Mulder", "Reijnders", "Stolwijk",
    ],
  },
  BE: {
    first: [
      "Arnaud", "Benoît", "Cédric", "Denis", "Émile", "François", "Gilles", "Henri",
      "Ignace", "Jasper", "Killian", "Loïc", "Mathis", "Niels", "Olivier", "Pierre",
      "Quentin", "Renaud", "Simon", "Théo", "Ulrich", "Vincent", "Wouter", "Yves",
      "Bart", "Dries", "Jef", "Joris", "Lieven", "Senne",
    ],
    last: [
      "Buyse", "Coppens", "De Smet", "Eloy", "Frans", "Goffin", "Heuvel", "Ingelbrecht",
      "Janssens", "Kerckhof", "Lemmens", "Maertens", "Nys", "Ottoy", "Peeters",
      "Quintens", "Renier", "Saelens", "Thielemans", "Uyttebroek", "Van Damme",
      "Wauters", "Beckers", "Claes", "Driessen", "Geudens", "Hofkens", "Mertens",
      "Stevens", "Verheyen",
    ],
  },
  TR: {
    first: [
      "Ahmet", "Berke", "Can", "Demir", "Emre", "Fatih", "Gökhan", "Halil", "İbrahim",
      "Kerim", "Mehmet", "Nazım", "Oğuz", "Polat", "Recep", "Selim", "Tarık", "Umut",
      "Volkan", "Yavuz", "Zafer", "Burak", "Cem", "Doruk", "Erdem", "Ferhat", "Murat",
      "Sinan", "Tuncay", "Onur",
    ],
    last: [
      "Akın", "Bayrak", "Coşkun", "Demirci", "Erdoğmuş", "Fındık", "Güneş", "Hacıoğlu",
      "İnal", "Karaca", "Levent", "Mutlu", "Nalbant", "Oktay", "Polat", "Reis",
      "Sezer", "Tezcan", "Uçar", "Vural", "Yıldırım", "Zorlu", "Aslan", "Doğan",
      "Eren", "Kara", "Öz", "Şahin", "Tuncer", "Uzun",
    ],
  },
  US: {
    first: [
      "Aiden", "Brody", "Caleb", "Drew", "Elliot", "Finn", "Grayson", "Hudson",
      "Isaiah", "Jaxon", "Kyle", "Logan", "Mason", "Noah", "Owen", "Parker", "Quincy",
      "Ryder", "Sawyer", "Tucker", "Walker", "Xavier", "Wyatt", "Brandon", "Cody",
      "Dustin", "Garrett", "Hunter", "Trent", "Zane",
    ],
    last: [
      "Ashford", "Brennan", "Carrington", "Donaldson", "Easton", "Fowler", "Granger",
      "Hollings", "Iverson", "Jeffries", "Kendrick", "Langford", "Maddox", "Norris",
      "Oakley", "Prescott", "Quigley", "Rutherford", "Stratton", "Thatcher", "Upton",
      "Vanover", "Whitfield", "Yeagley", "Boone", "Cassidy", "Dempsey", "Fairchild",
      "Hewitt", "Sutton",
    ],
  },
  SA: {
    first: [
      "Abdullah", "Bandar", "Faisal", "Hamad", "Ibrahim", "Khalid", "Majed", "Naif",
      "Omar", "Rakan", "Sami", "Tarek", "Walid", "Yousef", "Ziyad", "Adel", "Bassam",
      "Fahad", "Hisham", "Jamal", "Mansour", "Nasser", "Rayan", "Saif", "Talal",
      "Waleed", "Yazeed", "Salem", "Mohanad", "Ammar",
    ],
    last: [
      "Al-Bassam", "Al-Daoud", "Al-Faisal", "Al-Ghamdi", "Al-Harbi", "Al-Jasser",
      "Al-Khateeb", "Al-Mansour", "Al-Nahdi", "Al-Otaibi", "Al-Qahtani", "Al-Rashid",
      "Al-Saeed", "Al-Tamimi", "Al-Uthman", "Al-Wahid", "Al-Yamani", "Al-Zahrani",
      "Al-Abbas", "Al-Bishi", "Al-Dosari", "Al-Enezi", "Al-Fawzan", "Al-Hassan",
      "Al-Jabri", "Al-Kazimi", "Al-Mutlaq", "Al-Nuaim", "Al-Qarni", "Al-Sulami",
    ],
  },
};

export function randomName(countryCode: string): { first: string; last: string } {
  const pool = NAMES_BY_COUNTRY[countryCode] ?? NAMES_BY_COUNTRY.AR;
  const first = pool.first[Math.floor(Math.random() * pool.first.length)];
  const last = pool.last[Math.floor(Math.random() * pool.last.length)];
  return { first, last };
}
