//


export interface CreatableDocument<E, T> {

  createElement(tagName: string): E;

  createTextNode(string: string): T;

}