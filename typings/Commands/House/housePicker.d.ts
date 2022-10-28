import { Command } from '../template';
export declare enum House {
    TIGER = "\uD83D\uDC2F House of Tiger",
    OWL = "\uD83E\uDD89 100 Acre Wood",
    RAVEN = "\uD83D\uDC41\uFE0F The Ravens",
    TURTLE = "\uD83D\uDC22 Kame House",
    PANDA = "\uD83D\uDC3C Bamboo Forest"
}
export declare enum HouseDescription {
    TIGER = "Competitive, crud central, Fearless, Rage",
    OWL = "observant, Integrity, judge, They do not speak a lot but when they do, they talk wisely.",
    RAVEN = "The eye of all eyes, Pure Daily Offenders, can be calm or on crud, depending on the tea or tequila!",
    TURTLE = "chill, perseverance, otaku, cosplay & hentai enthusiast! (LOT'S OF NOSE BLEEDS)",
    PANDA = "bashful, emotional, foodie, jokes, sleepy"
}
export declare enum RoleID {
    TIGER = "1024014286416261191",
    OWL = "1024014430448660490",
    RAVEN = "1024014477789773965",
    TURTLE = "1024014510723432478",
    PANDA = "1024014614536667239"
}
export declare enum RoleHouse {
    '1024014286416261191' = "TIGER",
    '1024014430448660490' = "OWL",
    '1024014477789773965' = "RAVEN",
    '1024014510723432478' = "TURTLE",
    '1024014614536667239' = "PANDA"
}
export declare const HOUSE_COMMAND: Command<"cached">;
