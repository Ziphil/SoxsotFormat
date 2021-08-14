//

import escapeXml from "xml-escape";
import {
  CreatableDocument
} from "./interface";
import {
  NodeCallback,
  NodeLike,
  NodeList
} from "./node-list";


export class SimpleDocument<E extends SimpleElement<E, D>, D extends SimpleDocument<E, D>> implements CreatableDocument<E, string> {

  private readonly elementStatic: new(document: D, tagName: string) => E;
  public readonly documentElement: E;

  public constructor(rootTagName: string, elementStatic: new(document: D, tagName: string) => E) {
    this.elementStatic = elementStatic;
    this.documentElement = this.createElement(rootTagName);
  }

  public createNodeList(): NodeList<E, string, D> {
    let castThis = this as unknown as D;
    return NodeList.create(castThis);
  }

  public createElement(tagName: string): E {
    let castThis = this as unknown as D;
    let Element = this.elementStatic;
    return new Element(castThis, tagName);
  }

  public createTextNode(string: string): string {
    return string;
  }

  public appendChild<N extends NodeLike<E, string, D>>(node: N, callback?: NodeCallback<N>): N {
    return this.documentElement.appendChild(node, callback);
  }

  public appendElement(tagName: string, callback?: NodeCallback<E>): E {
    return this.documentElement.appendElement(tagName, callback);
  }

  public getAttribute(name: string): string | null {
    return this.documentElement.getAttribute(name);
  }

  public setAttribute(name: string, value: string): void {
    this.documentElement.setAttribute(name, value);
  }

  public toString(): string {
    let string = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
    string += this.documentElement.toString();
    return string;
  }

}


export class SimpleElement<E extends SimpleElement<E, D>, D extends SimpleDocument<E, D>> {

  protected tagName: string;
  private attributes: Map<string, string>;
  private children: NodeList<E, string, D>;

  public constructor(document: D, tagName: string) {
    this.tagName = tagName;
    this.attributes = new Map();
    this.children = NodeList.create(document);
  }

  public appendChild<N extends NodeLike<E, string, D>>(node: N, callback?: NodeCallback<N>): N {
    return this.children.appendChild(node, callback);
  }

  public appendElement(tagName: string, callback?: NodeCallback<E>): E {
    return this.children.appendElement(tagName, callback);
  }

  public getAttribute(name: string): string | null {
    return this.attributes.get(name) ?? null;
  }

  public setAttribute(name: string, value: string): void {
    this.attributes.set(name, value);
  }

  public toString(): string {
    let string = "";
    string += `<${this.tagName}`;
    string += Array.from(this.attributes).map(([name, value]) => ` ${name}="${escapeXml(value)}"`).join("");
    if (this.children.length > 0) {
      string += ">";
      string += this.children.map((child) => (typeof child === "string") ? escapeXml(child) : child.toString()).join("");
      string += `</${this.tagName}>`;
    } else {
      string += "/>";
    }
    return string;
  }

}