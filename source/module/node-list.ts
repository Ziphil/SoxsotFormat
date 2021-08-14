//

import {
  CreatableDocument
} from "./interface";


export class NodeList<E, T, D extends CreatableDocument<E, T>> extends Array<E | T> {

  public readonly document!: D;

  private constructor(...items: Array<E | T>) {
    super(...items);
  }

  public static create<E, T, D extends CreatableDocument<E, T>>(document: D): NodeList<E, T, D> {
    let nodeList = Object.create(NodeList.prototype);
    nodeList.document = document;
    return nodeList;
  }

  public appendChild<N extends NodeLike<E, T, D>>(node: N, callback?: NodeCallback<N>): N {
    let anyNode = node as any;
    if (callback !== undefined) {
      callback(node);
    }
    if (node instanceof NodeList) {
      this.push(...node);
    } else {
      this.push(anyNode);
    }
    return node;
  }

  public appendElement(tagName: string, callback?: NodeCallback<E>): E {
    let element = this.document.createElement(tagName);
    this.appendChild(element, callback);
    return element;
  }

  public appendTextNode(string: string, callback?: NodeCallback<T>): T {
    let text = this.document.createTextNode(string);
    this.appendChild(text, callback);
    return text;
  }

}


export type NodeLike<E, T, D extends CreatableDocument<E, T>> = NodeList<E, T, D> | E | T;
export type NodeCallback<N> = (node: N) => void;