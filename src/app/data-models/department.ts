export class Department {
    name: string;
    persons: Person[];

    constructor(name: string, persons: Person[] = []) {
        this.name = name;
        this.persons = persons;
    }

    addPerson(pers: Person): void {
        this.persons.push(pers);
    }
}

export class Person {
    firstName: string;
    lastName: string;
    rank: string;
    position: string;
    attendances: {} = {};

    constructor(lastName: string, position: string = "", rank: string = "", firstName: string = "", attendances: any = {}) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.rank = rank;
        this.position = position;
        this.attendances = attendances;
    };
}