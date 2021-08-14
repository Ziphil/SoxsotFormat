//

import {
  CreatableDocument
} from "./interface";
import {
  NodeCallback,
  NodeList
} from "./node-list";


export abstract class DocumentBuilder<E, T, D extends CreatableDocument<E, T>> {

  protected document!: D;

  protected buildDocument(tagName: string, callback?: NodeCallback<D>): D {
    let self = this.createDocument(tagName);
    this.document = self;
    callback?.call(this, self);
    return self;
  }

  protected abstract createDocument(tagName: string): D;

  protected createNodeList(): NodeList<E, T, D> {
    return NodeList.create(this.document);
  }

  protected createElement(tagName: string): E {
    return this.document.createElement(tagName);
  }

  protected createTextNode(string: string): T {
    return this.document.createTextNode(string);
  }

}