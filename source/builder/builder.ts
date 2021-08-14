//

import {
  Dictionary
} from "soxsot";
import {
  DocumentBuilder,
  NodeCallback,
  NodeLike
} from "../module";
import {
  FormatDocument,
  FormatElement
} from "./element";


const EUROPIAN_FONT_FAMILY = "Linux Libertine G";
const JAPANESE_FONT_FAMILY = "源ノ明朝";
const EUROPIAN_SHALEIAN_FONT_FAMILY = "FreeSans";
const JAPANESE_SHALEIAN_FONT_FAMILY = "源ノ角ゴシック";
const SPECIAL_FONT_FAMILY = "Gill Sans Nova Cn Book";

const FONT_FAMILY = EUROPIAN_FONT_FAMILY + ", " + JAPANESE_FONT_FAMILY;
const SHALEIAN_FONT_FAMILY = EUROPIAN_SHALEIAN_FONT_FAMILY + ", " + JAPANESE_SHALEIAN_FONT_FAMILY;

const FONT_SIZE = "9pt";
const SHALEIAN_FONT_SIZE = "95%";
const LINE_HEIGHT = "1.6";

const PAGE_SIZE = {width: "148mm", height: "220mm"};
const PAGE_SPACES = {top: "22mm", bottom: "22mm", outer: "23mm", inner: "17mm"};
const HEADER_EXTENT = "12mm";
const FOOTER_EXTENT = "12mm";
const BLEED_SIZE = "0mm";


export class DictionaryFormatBuilder extends DocumentBuilder<FormatElement, string, FormatDocument> {

  public convert(dictionary: Dictionary): string {
    let document = this.buildRoot(dictionary);
    let output = document.toString();
    return output;
  }

  protected createDocument(tagName: string): FormatDocument {
    let document = new FormatDocument(tagName, FormatElement);
    return document;
  }

  private buildRoot(dictionary: Dictionary): FormatDocument {
    let self = this.buildDocument("fo:root", (self) => {
      self.setAttribute("xmlns:fo", "http://www.w3.org/1999/XSL/Format");
      self.setAttribute("xmlns:axf", "http://www.antennahouse.com/names/XSL/Extensions");
      self.setAttribute("xml:lang", "ja");
      self.setAttribute("font-family", FONT_FAMILY);
      self.setAttribute("font-size", FONT_SIZE);
      self.setAttribute("axf:ligature-mode", "all");
      self.appendElement("fo:layout-master-set", (self) => {
        self.appendChild(this.buildMainPageMaster());
      });
      self.appendChild(this.buildMainPageSequence());
    });
    return self;
  }

  private buildMainPageMaster(): FormatNodeLike {
    let self = this.createNodeList();
    self.appendChild(this.document.createPageMaster(PAGE_SIZE, BLEED_SIZE, (self) => {
      self.setAttribute("master-name", "main.left");
      self.appendChild(this.document.createRegionBody(PAGE_SPACES, "left", (self) => {
        self.setAttribute("region-name", "main.body");
      }));
      self.appendChild(this.document.createRegionBefore(HEADER_EXTENT, (self) => {
        self.setAttribute("region-name", "main.left-header");
      }));
      self.appendChild(this.document.createRegionAfter(FOOTER_EXTENT, (self) => {
        self.setAttribute("region-name", "main.left-footer");
      }));
    }));
    self.appendChild(this.document.createPageMaster(PAGE_SIZE, BLEED_SIZE, (self) => {
      self.setAttribute("master-name", "main.right");
      self.appendChild(this.document.createRegionBody(PAGE_SPACES, "right", (self) => {
        self.setAttribute("region-name", "main.body");
      }));
      self.appendChild(this.document.createRegionBefore(HEADER_EXTENT, (self) => {
        self.setAttribute("region-name", "main.right-header");
      }));
      self.appendChild(this.document.createRegionAfter(FOOTER_EXTENT, (self) => {
        self.setAttribute("region-name", "main.right-footer");
      }));
    }));
    self.appendElement("fo:page-sequence-master", (self) => {
      self.setAttribute("master-name", "section");
      self.appendElement("fo:repeatable-page-master-alternatives", (self) => {
        self.appendElement("fo:conditional-page-master-reference", (self) => {
          self.setAttribute("master-reference", "main.left");
          self.setAttribute("odd-or-even", "even");
        });
        self.appendElement("fo:conditional-page-master-reference", (self) => {
          self.setAttribute("master-reference", "main.right");
          self.setAttribute("odd-or-even", "odd");
        });
      });
    });
    return self;
  }

  private buildMainPageSequence(): FormatNodeLike {
    let self = this.createNodeList();
    self.appendElement("fo:page-sequence", (self) => {
      self.setAttribute("master-reference", "section");
      self.setAttribute("initial-page-number", "auto-even");
      self.appendElement("fo:static-content", (self) => {
        self.setAttribute("flow-name", "main.left-header");
        self.appendChild(this.buildHeader("left"));
      });
      self.appendElement("fo:static-content", (self) => {
        self.setAttribute("flow-name", "main.right-header");
        self.appendChild(this.buildHeader("right"));
      });
      self.appendElement("fo:static-content", (self) => {
        self.setAttribute("flow-name", "main.left-footer");
        self.appendChild(this.buildFooter("left"));
      });
      self.appendElement("fo:static-content", (self) => {
        self.setAttribute("flow-name", "main.right-footer");
        self.appendChild(this.buildFooter("right"));
      });
      self.appendElement("fo:flow", (self) => {
        self.setAttribute("flow-name", "main.body");
        self.appendElement("fo:block", (self) => {
          self.appendChild("Nekoneko");
        });
      });
    });
    return self;
  }

  private buildHeader(position: "left" | "right"): FormatNodeLike {
    let self = this.createNodeList();
    return self;
  }

  private buildFooter(position: "left" | "right"): FormatNodeLike {
    let self = this.createNodeList();
    return self;
  }

}


export type FormatNodeLike = NodeLike<FormatElement, string, FormatDocument>;
export type FormatNodeCallback = NodeCallback<FormatElement>;