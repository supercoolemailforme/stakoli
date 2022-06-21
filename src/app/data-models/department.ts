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

    getDepartmentNamesHash(): number {
        let sum = 0;
        
        for (let i = 0; i < this.persons.length; ++i) {
            sum += this.persons[i].getNameHash() + i;
        }

        return sum;
    }
}

export class Person {
    firstName: string;
    lastName: string;
    rank: string;
    position: string;
    attendances: any = {};

    constructor(lastName: string, position: string = "", rank: string = "", firstName: string = "", attendances: any = {}) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.rank = rank;
        this.position = position;
        this.attendances = attendances;
    };

    getAttendanceLength(): number {
        return Object.keys(this.attendances).length;
    }

    getFullNameString(): string {
        return this.lastName + " " + this.firstName + ", " + this.rank;
    }

    getNameHash(): number {
        let sum: number = 0;
        let fullName: string = this.getFullNameString() + " " + this.position;

        for (let i = 0; i < fullName.length; ++i) {
            sum += fullName.charCodeAt(i) + i;
        }

        return sum;
    }

    static copyPerson(person: Person): Person {
      return new Person(person.lastName, person.position, person.rank, person.firstName, person.attendances);
    }
}