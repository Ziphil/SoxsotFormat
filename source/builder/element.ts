//

import {
  NodeCallback,
  NodeLike,
  SimpleDocument,
  SimpleElement
} from "../module";


const MAXIMUM_RATIO = "1.4";
const MINIMUM_RATIO = "0.8";


export class FormatDocument extends SimpleDocument<FormatElement, FormatDocument> {

  public createPageMaster(pageSize: PageSize, bleedSize: string, callback?: NodeCallback<FormatElement>): NodeLike<FormatElement, string, FormatDocument> {
    let self = this.createNodeList();
    self.appendElement("fo:simple-page-master", (self) => {
      self.setAttribute("page-width", pageSize.width);
      self.setAttribute("page-height", pageSize.height);
      self.setAttribute("axf:bleed", bleedSize);
      if (true) {
        self.setAttribute("background-image", "url('../document/material/blank.svg')");
        self.setAttribute("background-repeat", "no-repeat");
      }
      callback?.call(this, self);
    });
    return self;
  }

  public createRegionBody(pageSpaces: PageSpaces, position: "left" | "right", callback?: NodeCallback<FormatElement>): NodeLike<FormatElement, string, FormatDocument> {
    let self = this.createNodeList();
    self.appendElement("fo:region-body", (self) => {
      self.setAttribute("margin-top", pageSpaces.top);
      self.setAttribute("margin-bottom", pageSpaces.bottom);
      self.setAttribute("margin-left", (position === "left") ? pageSpaces.outer : pageSpaces.inner);
      self.setAttribute("margin-right", (position === "left") ? pageSpaces.inner : pageSpaces.outer);
      callback?.call(this, self);
    });
    return self;
  }

  public createRegionBefore(extent: string, callback?: NodeCallback<FormatElement>): NodeLike<FormatElement, string, FormatDocument> {
    let self = this.createNodeList();
    self.appendElement("fo:region-before", (self) => {
      self.setAttribute("extent", extent);
      callback?.call(this, self);
    });
    return self;
  }

  public createRegionAfter(extent: string, callback?: NodeCallback<FormatElement>): NodeLike<FormatElement, string, FormatDocument> {
    let self = this.createNodeList();
    self.appendElement("fo:region-after", (self) => {
      self.setAttribute("extent", extent);
      callback?.call(this, self);
    });
    return self;
  }

  public createRegionStart(extent: string, callback?: NodeCallback<FormatElement>): NodeLike<FormatElement, string, FormatDocument> {
    let self = this.createNodeList();
    self.appendElement("fo:region-start", (self) => {
      self.setAttribute("extent", extent);
      callback?.call(this, self);
    });
    return self;
  }

  public createRegionEnd(extent: string, callback?: NodeCallback<FormatElement>): NodeLike<FormatElement, string, FormatDocument> {
    let self = this.createNodeList();
    self.appendElement("fo:region-end", (self) => {
      self.setAttribute("extent", extent);
      callback?.call(this, self);
    });
    return self;
  }

}


export class FormatElement extends SimpleElement<FormatElement, FormatDocument> {

  public makeElastic(attributeName: string): void {
    let originalSpace = this.getAttribute(attributeName);
    if (originalSpace !== null) {
      this.setAttribute(`${attributeName}.maximum`, `(${originalSpace}) * ${MAXIMUM_RATIO}`);
      this.setAttribute(`${attributeName}.minimum`, `(${originalSpace}) * ${MINIMUM_RATIO}`);
    }
  }

  public resetIndent(): void {
    this.setAttribute("start-indent", "0mm");
    this.setAttribute("end-indent", "0mm");
  }

  public justifyText(): void {
    this.setAttribute("text-align", "justify");
    this.setAttribute("axf:text-justify-trim", "punctuation ideograph inter-word");
  }

}


export type PageSize = {width: string, height: string};
export type PageSpaces = {top: string, bottom: string, outer: string, inner: string};