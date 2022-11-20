export class Person {
  constructor(private first: string, private last: string) {}
  sayMyName() {
    // console.log(this.first + ' ' + this.last);
    return this.first + ' ' + this.last;
  }
  bla() {
    return 'bla';
  }
}

describe('practice_mock', function () {
  it('without mock', () => {
    const person = new Person('Lorem', 'Ipsum');

    expect(person.sayMyName()).toBe('Lorem Ipsum');
    // console.log(person.sayMyName());
    expect(person.bla()).toBe('bla');
  });

  it('Modify only instance', () => {
    const person = new Person('Lorem', 'Ipsum');
    const spy = jest
      .spyOn(person, 'sayMyName')
      .mockImplementation(() => 'Hello');

    expect(person.sayMyName()).toBe('Hello');
    // console.log(person.sayMyName());
    expect(person.bla()).toBe('bla');

    // unnecessary in this case, putting it here just to illustrate how to "unmock" a method
    spy.mockRestore();
  });
});
