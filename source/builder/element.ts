//

import {
  BaseDocument,
  BaseDocumentFragment,
  BaseElement,
  BaseText,
  NodeLikeOf
} from "@zenml/zenml";


const MAXIMUM_RATIO = "1.4";
const MINIMUM_RATIO = "0.8";


export class FormatDocument extends BaseDocument<FormatDocument, FormatDocumentFragment, FormatElement, FormatText> {

  public createPageMaster(pageSize: PageSize, bleedSize: string, callback?: (self: FormatElement) => void): NodeLikeOf<FormatDocument> {
    let self = this.createDocumentFragment();
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

  public createRegionBody(pageSpaces: PageSpaces, position: "left" | "right", callback?: (self: FormatElement) => void): NodeLikeOf<FormatDocument> {
    let self = this.createDocumentFragment();
    self.appendElement("fo:region-body", (self) => {
      self.setAttribute("margin-top", pageSpaces.top);
      self.setAttribute("margin-bottom", pageSpaces.bottom);
      self.setAttribute("margin-left", (position === "left") ? pageSpaces.outer : pageSpaces.inner);
      self.setAttribute("margin-right", (position === "left") ? pageSpaces.inner : pageSpaces.outer);
      callback?.call(this, self);
    });
    return self;
  }

  public createRegionBefore(extent: string, callback?: (self: FormatElement) => void): NodeLikeOf<FormatDocument> {
    let self = this.createDocumentFragment();
    self.appendElement("fo:region-before", (self) => {
      self.setAttribute("extent", extent);
      callback?.call(this, self);
    });
    return self;
  }

  public createRegionAfter(extent: string, callback?: (self: FormatElement) => void): NodeLikeOf<FormatDocument> {
    let self = this.createDocumentFragment();
    self.appendElement("fo:region-after", (self) => {
      self.setAttribute("extent", extent);
      callback?.call(this, self);
    });
    return self;
  }

  public createRegionStart(extent: string, callback?: (self: FormatElement) => void): NodeLikeOf<FormatDocument> {
    let self = this.createDocumentFragment();
    self.appendElement("fo:region-start", (self) => {
      self.setAttribute("extent", extent);
      callback?.call(this, self);
    });
    return self;
  }

  public createRegionEnd(extent: string, callback?: (self: FormatElement) => void): NodeLikeOf<FormatDocument> {
    let self = this.createDocumentFragment();
    self.appendElement("fo:region-end", (self) => {
      self.setAttribute("extent", extent);
      callback?.call(this, self);
    });
    return self;
  }

  protected prepareDocumentFragment(): FormatDocumentFragment {
    return new FormatDocumentFragment(this);
  }

  protected prepareElement(tagName: string): FormatElement {
    return new FormatElement(this, tagName);
  }

  protected prepareTextNode(content: string): FormatText {
    return new FormatText(this, content);
  }

}


export class FormatElement extends BaseElement<FormatDocument, FormatDocumentFragment, FormatElement, FormatText> {

  public makeElastic(attributeName: string, minimumRatio?: number, maximumRatio?: number): void {
    let originalSpace = this.getAttribute(attributeName);
    if (originalSpace !== null) {
      this.setAttribute(`${attributeName}.minimum`, `(${originalSpace}) * ${minimumRatio ?? MINIMUM_RATIO}`);
      this.setAttribute(`${attributeName}.maximum`, `(${originalSpace}) * ${maximumRatio ?? MAXIMUM_RATIO}`);
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

  // アクセントに用いている Gill Sans Nova フォントの上下の位置を修正します。
  // このフォントはディセントが大きいため、ディセンダーがない文字のみで組むと少し上に浮いているような見た目になります。
  // このメソッドにより、文字の位置を少し下にずらし、文字が浮いてしまうのを防ぐことができます。
  public fixTextPosition(): void {
    this.setAttribute("relative-position", "relative");
    this.setAttribute("top", "0.1em");
  }

}


export class FormatDocumentFragment extends BaseDocumentFragment<FormatDocument, FormatDocumentFragment, FormatElement, FormatText> {

}


export class FormatText extends BaseText<FormatDocument, FormatDocumentFragment, FormatElement, FormatText> {

}


export type PageSize = {width: string, height: string};
export type PageSpaces = {top: string, bottom: string, outer: string, inner: string};