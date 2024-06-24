export class House {
    private constructor(
        readonly id: House.id,
        readonly name: string,
        readonly description: string,
        readonly emoji: string,
        readonly roleId: string, 
        readonly channelId: string
    ) {}

    static readonly ids = ['TIGER', 'OWL', 'RAVEN', 'TURTLE', 'PANDA'] as const;
    static get ALL() {
        return [
            House.TIGER,
            House.OWL,
            House.RAVEN,
            House.TURTLE,
            House.PANDA
        ] as const;
    }

    static readonly TIGER = new House(
        'TIGER',
        'Tiger Terror Squad',
        'brave, courageous, fearless, strong, fierce, competitive, and powerful.',
        '🐯',
        '1024014286416261191',
        '1023372920170483713'
    );

    static readonly OWL = new House(
        'OWL',
        'Court of Owls',
        'observant, Integrity, judge, They do not speak a lot but when they do, they talk wisely.',
        '🦉',
        '1024014430448660490',
        '1023373108389883979'
    );

    static readonly RAVEN = new House(
        'RAVEN',
        'Raven Reapers',
        'The eye of all eyes, Pure Daily Offenders, can be calm or on crud, depending on the tea or tequila!',
        '👁️',
        '1024014477789773965',
        '1023373249733738536'
    );

    static readonly TURTLE = new House(
        'TURTLE',
        'The Otakus',
        'chill, perseverance, otaku, cosplay(LOT\'S OF NOSE BLEEDS), gamers and tech enthusiast! ',
        '🐢',
        '1024014510723432478',
        '1023373586465046528'
    );

    static readonly PANDA = new House(
        'PANDA',
        'Pandamonium',
        'bashful, emotional, foodie, jokes, sleepy, knowledgeable.',
        '🐼',
        '1024014614536667239',
        '1023373723551666296'
    );
}

export namespace House {
    export type id = typeof House['ids'][number];

    export interface Document {
        _id: id;
        points: number;
    }
}

export const ChannelId = {
    Logs: '1025143957186941038',
    Trophy: '1028280826472955975',
} as const;