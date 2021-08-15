//

import {
  Dictionary,
  MarkupResolver,
  ParsedWord,
  Parser,
  Section,
  Word
} from "soxsot";
import {
  DocumentBuilder,
  NodeCallback,
  NodeLike,
  NodeList
} from "../module";
import {
  FormatDocument,
  FormatElement
} from "./element";


const EUROPIAN_FONT_FAMILY = "Linux Libertine G";
const JAPANESE_FONT_FAMILY = "源ノ明朝";
const EUROPIAN_SHALEIAN_FONT_FAMILY = "Vekos";
const JAPANESE_SHALEIAN_FONT_FAMILY = "源ノ角ゴシック";
const SPECIAL_FONT_FAMILY = "Gill Sans Nova Cn Book";

const FONT_FAMILY = EUROPIAN_FONT_FAMILY + ", " + JAPANESE_FONT_FAMILY;
const SHALEIAN_FONT_FAMILY = EUROPIAN_SHALEIAN_FONT_FAMILY + ", " + JAPANESE_SHALEIAN_FONT_FAMILY;

const FONT_SIZE = "8pt";
const SHALEIAN_FONT_SIZE = "100%";
const LINE_HEIGHT = "1.2";

const PAGE_SIZE = {width: "148mm", height: "220mm"};
const PAGE_SPACES = {top: "15mm", bottom: "15mm", outer: "14mm", inner: "18mm"};
const HEADER_EXTENT = "11mm";
const FOOTER_EXTENT = "11mm";
const SIDE_EXTENT = "8mm";
const BLEED_SIZE = "0mm";

const COLUMN_GAP = "3mm";
const ALPHABET_INDEX_HEIGHT = "6mm";
const ALPHABET_INDEX_GAP = "2mm";

const TEXT_COLOR = "rgb-icc(#CMYK, 0, 0, 0, 1)";
const HIGHLIGHT_COLOR = "rgb-icc(#CMYK, 0, 0.8, 0, 0)";
const GRAY_COLOR = "rgb-icc(#CMYK, 0, 0, 0, 0.6)";


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
      self.setAttribute("color", TEXT_COLOR);
      self.setAttribute("axf:ligature-mode", "all");
      self.appendElement("fo:layout-master-set", (self) => {
        self.appendChild(this.buildMainPageMaster());
      });
      self.appendChild(this.buildMainPageSequence(dictionary));
    });
    return self;
  }

  private buildMainPageMaster(): FormatNodeLike {
    let self = this.createNodeList();
    self.appendChild(this.document.createPageMaster(PAGE_SIZE, BLEED_SIZE, (self) => {
      self.setAttribute("master-name", "main.left");
      self.appendChild(this.document.createRegionBody(PAGE_SPACES, "left", (self) => {
        self.setAttribute("region-name", "main.body");
        self.setAttribute("column-count", "2");
        self.setAttribute("column-gap", COLUMN_GAP);
      }));
      self.appendChild(this.document.createRegionBefore(HEADER_EXTENT, (self) => {
        self.setAttribute("region-name", "main.left-header");
        self.setAttribute("precedence", "true");
      }));
      self.appendChild(this.document.createRegionAfter(FOOTER_EXTENT, (self) => {
        self.setAttribute("region-name", "main.left-footer");
        self.setAttribute("precedence", "true");
      }));
      self.appendChild(this.document.createRegionStart(SIDE_EXTENT, (self) => {
        self.setAttribute("region-name", "main.left-side");
      }));
    }));
    self.appendChild(this.document.createPageMaster(PAGE_SIZE, BLEED_SIZE, (self) => {
      self.setAttribute("master-name", "main.right");
      self.appendChild(this.document.createRegionBody(PAGE_SPACES, "right", (self) => {
        self.setAttribute("region-name", "main.body");
        self.setAttribute("column-count", "2");
        self.setAttribute("column-gap", COLUMN_GAP);
      }));
      self.appendChild(this.document.createRegionBefore(HEADER_EXTENT, (self) => {
        self.setAttribute("region-name", "main.right-header");
        self.setAttribute("precedence", "true");
      }));
      self.appendChild(this.document.createRegionAfter(FOOTER_EXTENT, (self) => {
        self.setAttribute("region-name", "main.right-footer");
        self.setAttribute("precedence", "true");
      }));
      self.appendChild(this.document.createRegionEnd(SIDE_EXTENT, (self) => {
        self.setAttribute("region-name", "main.right-side");
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

  private buildMainPageSequence(dictionary: Dictionary): FormatNodeLike {
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
      self.appendElement("fo:static-content", (self) => {
        self.setAttribute("flow-name", "main.left-side");
        self.appendChild(this.buildSide("left"));
      });
      self.appendElement("fo:static-content", (self) => {
        self.setAttribute("flow-name", "main.right-side");
        self.appendChild(this.buildSide("right"));
      });
      self.appendElement("fo:flow", (self) => {
        self.setAttribute("flow-name", "main.body");
        self.appendElement("fo:block", (self) => {
          self.appendChild(this.buildDictionaryBlock(dictionary));
        });
      });
    });
    return self;
  }

  private buildHeader(position: "left" | "right"): FormatNodeLike {
    let self = this.createNodeList();
    self.appendElement("fo:block-container", (self) => {
      self.setAttribute("height", `${HEADER_EXTENT} + ${BLEED_SIZE}`);
      self.setAttribute("margin-top", `-1 * ${BLEED_SIZE}`);
      self.setAttribute("margin-left", `-1 * ${BLEED_SIZE}`);
      self.setAttribute("margin-right", `-1 * ${BLEED_SIZE}`);
      self.setAttribute("display-align", "after");
      self.appendElement("fo:block-container", (self) => {
        self.setAttribute("margin-left", (position === "left") ? PAGE_SPACES.outer : PAGE_SPACES.inner);
        self.setAttribute("margin-right", (position === "left") ? PAGE_SPACES.inner : PAGE_SPACES.outer);
        self.setAttribute("border-bottom-width", "0.2mm");
        self.setAttribute("border-bottom-color", HIGHLIGHT_COLOR);
        self.setAttribute("border-bottom-style", "solid");
        self.appendElement("fo:block", (self) => {
          self.resetIndent();
          self.setAttribute("padding-bottom", "0.2mm");
          self.setAttribute("font-weight", "bold");
          self.setAttribute("text-align-last", "justify");
          self.appendChild(this.buildShaleianText((self) => {
            self.appendElement("fo:retrieve-marker", (self) => {
              self.setAttribute("retrieve-class-name", "name");
              self.setAttribute("retrieve-position", "first-including-carryover");
              self.setAttribute("retrieve-boundary", "page-sequence");
            });
          }));
          self.appendElement("fo:leader", (self) => {
            self.setAttribute("leader-pattern", "space");
          });
          self.appendChild(this.buildShaleianText((self) => {
            self.appendElement("fo:retrieve-marker", (self) => {
              self.setAttribute("retrieve-class-name", "name");
              self.setAttribute("retrieve-position", "last-starting-within-page");
              self.setAttribute("retrieve-boundary", "page-sequence");
            });
          }));
        });
      });
    });
    return self;
  }

  private buildFooter(position: "left" | "right"): FormatNodeLike {
    let self = this.createNodeList();
    self.appendElement("fo:block-container", (self) => {
      self.setAttribute("height", `${FOOTER_EXTENT} + ${BLEED_SIZE}`);
      self.setAttribute("margin-bottom", `-1 * ${BLEED_SIZE}`);
      self.setAttribute("margin-left", `-1 * ${BLEED_SIZE}`);
      self.setAttribute("margin-right", `-1 * ${BLEED_SIZE}`);
      self.setAttribute("display-align", "before");
      self.appendElement("fo:block-container", (self) => {
        self.setAttribute("margin-left", (position === "left") ? PAGE_SPACES.outer : PAGE_SPACES.inner);
        self.setAttribute("margin-right", (position === "left") ? PAGE_SPACES.inner : PAGE_SPACES.outer);
        self.setAttribute("border-top-width", "0.2mm");
        self.setAttribute("border-top-color", HIGHLIGHT_COLOR);
        self.setAttribute("border-top-style", "solid");
        self.appendElement("fo:block", (self) => {
          self.resetIndent();
          self.setAttribute("font-family", SPECIAL_FONT_FAMILY);
          self.setAttribute("font-size", "1.1em");
          self.setAttribute("font-weight", "bold");
          self.setAttribute("text-align", "center");
          self.fixTextPosition();
          self.appendElement("fo:page-number");
        });
      });
    });
    return self;
  }

  private buildSide(position: "left" | "right"): FormatNodeLike {
    let self = this.createNodeList();
    self.appendElement("fo:block-container", (self) => {
      self.setAttribute("width", `${SIDE_EXTENT} + ${BLEED_SIZE}`);
      self.setAttribute("height", `${PAGE_SIZE.height} - ${PAGE_SPACES.top} - ${PAGE_SPACES.bottom}`);
      self.setAttribute("margin-top", `${PAGE_SPACES.top} - ${HEADER_EXTENT}`);
      self.setAttribute(`margin-${position}`, `-1 * ${BLEED_SIZE}`);
      self.appendElement("fo:block", (self) => {
        self.setAttribute("margin-top", `(${PAGE_SIZE.height} - ${PAGE_SPACES.top} - ${PAGE_SPACES.bottom} - ${ALPHABET_INDEX_HEIGHT} * 21 - ${ALPHABET_INDEX_GAP} * 20) div 2`);
        self.setAttribute("margin-top.conditionality", "retain");
        self.appendElement("fo:retrieve-marker", (self) => {
          self.setAttribute("retrieve-class-name", `${position}-side`);
          self.setAttribute("retrieve-position", "first-starting-within-page");
          self.setAttribute("retrieve-boundary", "page-sequence");
        });
      });
    });
    return self;
  }

  private buildDictionaryBlock(dictionary: Dictionary): FormatNodeLike {
    let self = this.createNodeList();
    let words = Word.sortWords(Array.from(dictionary.words));
    let alphabetData = [] as Array<[string, Array<Word>]>;
    let currentInitialAlphabet = null as string | null;
    let currentWords = [] as Array<Word>;
    for (let word of words) {
      let initialAlphabet = word.name.replace(/['\+\-]/, "").charAt(0);
      if ("aáàâeéèêiíìîoóòôuúùû".indexOf(initialAlphabet) >= 0) {
        initialAlphabet = "a";
      }
      if (currentInitialAlphabet !== initialAlphabet) {
        currentInitialAlphabet = initialAlphabet;
        currentWords = [];
        alphabetData.push([initialAlphabet, currentWords]);
      }
      currentWords.push(word);
    }
    for (let [alphabet, words] of alphabetData) {
      self.appendChild(this.buildAlphabetBlock(alphabet, words));
    }
    return self;
  }

  private buildAlphabetBlock(alphabet: string, words: Array<Word>): FormatNodeLike {
    let self = this.createNodeList();
    let resolver = this.createMarkupResolver();
    let parser = new Parser(resolver);
    self.appendElement("fo:block", (self) => {
      self.setAttribute("break-before", "page");
      self.setAttribute("break-after", "page");
      self.appendElement("fo:marker", (self) => {
        self.setAttribute("marker-class-name", "alphabet");
        self.appendChild(alphabet);
      });
      self.appendElement("fo:marker", (self) => {
        self.setAttribute("marker-class-name", "left-side");
        self.appendElement("fo:block", (self) => {
          self.appendChild(this.buildAlphabetIndexes(alphabet, "left"));
        });
      });
      self.appendElement("fo:marker", (self) => {
        self.setAttribute("marker-class-name", "right-side");
        self.appendElement("fo:block", (self) => {
          self.appendChild(this.buildAlphabetIndexes(alphabet, "right"));
        });
      });
      self.appendElement("fo:block", (self) => {
        self.setAttribute("space-after", "2mm");
        self.setAttribute("space-after.conditionality", "retain");
        self.setAttribute("text-align-last", "center");
        self.setAttribute("span", "all");
        self.appendElement("fo:inline-container", (self) => {
          self.setAttribute("width", "30%");
          self.appendElement("fo:block", (self) => {
            self.setAttribute("font-size", "200%");
            self.setAttribute("font-weight", "bold");
            self.setAttribute("border-top-width", "0.6mm");
            self.setAttribute("border-bottom-width", "0.6mm");
            self.setAttribute("border-top-color", HIGHLIGHT_COLOR);
            self.setAttribute("border-bottom-color", HIGHLIGHT_COLOR);
            self.setAttribute("border-top-style", "double");
            self.setAttribute("border-bottom-style", "double");
            self.appendChild(this.buildShaleianText((self) => {
              self.appendChild((alphabet === "a") ? "a–u" : alphabet);
            }));
          });
        });
      });
      for (let word of words) {
        let parsedWord = parser.parse(word);
        self.appendChild(this.buildWordBlock(parsedWord));
      }
    });
    return self;
  }

  private buildAlphabetIndexes(alphabet: string, position: "left" | "right"): FormatNodeLike {
    let self = this.createNodeList();
    let oppositePosition = (position === "left") ? "right" : "left";
    let alphabets = "sztdkgfvpbcqxjlrnmyha";
    for (let currentAlphabet of alphabets) {
      self.appendElement("fo:block-container", (self) => {
        self.setAttribute("space-before", ALPHABET_INDEX_GAP);
        self.setAttribute("height", ALPHABET_INDEX_HEIGHT);
        self.setAttribute(`padding-${position}`, `2mm + ${BLEED_SIZE}`);
        self.setAttribute(`axf:border-top-${oppositePosition}-radius`, "1mm");
        self.setAttribute(`axf:border-bottom-${oppositePosition}-radius`, "1mm");
        self.setAttribute("display-align", "center");
        if (currentAlphabet === alphabet) {
          self.setAttribute("font-size", "130%");
          self.setAttribute("font-weight", "bold");
          self.setAttribute("color", "white");
          self.setAttribute("background-color", HIGHLIGHT_COLOR);
        } else {
          self.setAttribute("color", HIGHLIGHT_COLOR);
        }
        self.appendElement("fo:block", (self) => {
          self.setAttribute("text-align", "center");
          self.appendChild(this.buildShaleianText((self) => {
            self.setAttribute("font-family", EUROPIAN_SHALEIAN_FONT_FAMILY);
            self.appendChild(currentAlphabet);
          }));
        });
      });
    }
    return self;
  }

  private buildWordBlock(word: ParsedWord<FormatNodeLike>): FormatNodeLike {
    let self = this.createNodeList();
    let part = word.parts["ja"]!;
    self.appendElement("fo:block", (self) => {
      self.setAttribute("space-before", "1mm");
      self.setAttribute("space-before.conditionality", "discard");
      self.setAttribute("space-after", "1mm");
      self.setAttribute("space-after.conditionality", "discard");
      self.makeElastic("space-before");
      self.makeElastic("space-after");
      self.appendElement("fo:marker", (self) => {
        self.setAttribute("marker-class-name", "name");
        self.appendChild(word.name);
      });
      self.appendElement("fo:block", (self) => {
        self.setAttribute("keep-with-next.within-column", "always");
        self.setAttribute("keep-with-next.within-page", "always");
        self.appendChild(this.buildTag(part.sort ?? "", HIGHLIGHT_COLOR));
        self.appendElement("fo:inline", (self) => {
          self.setAttribute("font-size", "130%");
          self.setAttribute("font-weight", "bold");
          self.setAttribute("color", HIGHLIGHT_COLOR);
          self.appendChild(this.buildShaleianText((self) => {
            self.setAttribute("font-family", EUROPIAN_SHALEIAN_FONT_FAMILY);
            self.appendChild(word.name);
          }));
        });
        self.appendElement("fo:inline", (self) => {
          self.setAttribute("space-start", "0.8mm");
          self.appendChild(`/${word.pronunciation}/`);
        });
      });
      for (let section of part.sections) {
        self.appendChild(this.buildSectionBlock(section));
      }
    });
    return self;
  }

  private buildSectionBlock(section: Section<FormatNodeLike>): FormatNodeLike {
    let self = this.createNodeList();
    self.appendChild(this.buildEquivalentBlock(section));
    self.appendChild(this.buildUsageBlock(section));
    self.appendChild(this.buildPhraseBlock(section));
    self.appendChild(this.buildExampleBlock(section));
    return self;
  }

  private buildEquivalentBlock(section: Section<FormatNodeLike>): FormatNodeLike {
    let self = this.createNodeList();
    let equivalents = section.getEquivalents(true);
    let meaningInformation = section.getNormalInformations(true).find((information) => information.kind === "meaning");
    self.appendElement("fo:block", (self) => {
      self.setAttribute("start-indent", "2mm");
      self.setAttribute("widows", "1");
      self.setAttribute("orphans", "1");
      self.setAttribute("line-height", LINE_HEIGHT);
      self.makeElastic("line-height", 0.9, 1);
      self.justifyText();
      for (let equivalent of equivalents) {
        self.appendElement("fo:inline", (self) => {
          self.setAttribute("space-start", "1.2mm");
          self.appendChild(this.buildTag(equivalent.category ?? "", GRAY_COLOR));
          if (equivalent.frame !== null) {
            self.appendElement("fo:inline", (self) => {
              self.setAttribute("space-end", "0.8mm");
              self.setAttribute("font-size", "80%");
              self.appendChild("(");
              self.appendChild(equivalent.frame!);
              self.appendChild(")");
            });
          }
          self.appendElement("fo:inline", (self) => {
            for (let i = 0 ; i < equivalent.names.length ; i ++) {
              self.appendElement("fo:inline", (self) => {
                self.setAttribute("font-weight", "bold");
                self.appendChild(equivalent.names[i]);
              });
              if (i !== equivalent.names.length - 1) {
                self.appendChild(", ");
              }
            }
          });
        });
      }
      if (meaningInformation !== undefined && meaningInformation.text.toString() !== "?") {
        self.appendChild(this.buildEquivalentSeparator());
        self.appendElement("fo:inline", (self) => {
          self.appendChild(meaningInformation!.text);
        });
      }
    });
    return self;
  }

  private buildUsageBlock(section: Section<FormatNodeLike>): FormatNodeLike {
    let self = this.createNodeList();
    let usageInformations = section.getNormalInformations(true).filter((information) => information.kind === "usage");
    for (let information of usageInformations) {
      self.appendElement("fo:block", (self) => {
        self.setAttribute("start-indent", "2mm");
        self.setAttribute("widows", "1");
        self.setAttribute("orphans", "1");
        self.setAttribute("line-height", LINE_HEIGHT);
        self.makeElastic("line-height", 0.9, 1);
        self.justifyText();
        self.appendElement("fo:inline", (self) => {
          self.appendChild(information.text);
        });
      });
    }
    return self;
  }

  private buildPhraseBlock(section: Section<FormatNodeLike>): FormatNodeLike {
    let self = this.createNodeList();
    let phraseInformations = section.getPhraseInformations(true);
    for (let information of phraseInformations) {
      self.appendElement("fo:block", (self) => {
        self.setAttribute("start-indent", "2mm");
        self.setAttribute("widows", "1");
        self.setAttribute("orphans", "1");
        self.setAttribute("line-height", LINE_HEIGHT);
        self.makeElastic("line-height", 0.9, 1);
        self.justifyText();
        self.appendElement("fo:inline", (self) => {
          self.appendElement("fo:inline", (self) => {
            self.setAttribute("font-weight", "bold");
            self.appendChild(information.expression);
          });
          self.appendChild(this.buildExampleSeparator());
          self.appendElement("fo:inline", (self) => {
            for (let i = 0 ; i < information.equivalentNames.length ; i ++) {
              self.appendElement("fo:inline", (self) => {
                self.setAttribute("font-weight", "bold");
                self.appendChild(information.equivalentNames[i]);
              });
              if (i !== information.equivalentNames.length - 1) {
                self.appendChild(", ");
              }
            }
          });
          if (information.text !== null && information.text.toString() !== "?") {
            self.appendChild(this.buildPhraseSeparator());
            self.appendElement("fo:inline", (self) => {
              self.appendChild(information.text!);
            });
          }
        });
      });
    }
    return self;
  }

  private buildExampleBlock(section: Section<FormatNodeLike>): FormatNodeLike {
    let self = this.createNodeList();
    let exampleInformations = section.getExampleInformations(true);
    for (let information of exampleInformations) {
      self.appendElement("fo:block", (self) => {
        self.setAttribute("start-indent", "2mm");
        self.setAttribute("widows", "1");
        self.setAttribute("orphans", "1");
        self.setAttribute("line-height", LINE_HEIGHT);
        self.makeElastic("line-height", 0.9, 1);
        self.justifyText();
        self.appendElement("fo:inline", (self) => {
          self.appendChild(information.sentence);
          self.appendChild(this.buildExampleSeparator());
          self.appendChild(information.translation);
        });
      });
    }
    return self;
  }

  private buildTag(string: string, backgroundColor: string): FormatNodeLike {
    let self = this.createNodeList();
    self.appendElement("fo:inline-container", (self) => {
      self.setAttribute("space-end", "1mm");
      self.appendElement("fo:block", (self) => {
        self.resetIndent();
        self.setAttribute("padding", "0em 0.1em");
        self.setAttribute("font-size", "75%");
        self.setAttribute("color", "white");
        self.setAttribute("background-color", backgroundColor);
        self.setAttribute("axf:border-radius", "0.2em");
        self.appendChild(string);
      });
    });
    return self;
  }

  private buildSmallHeader(string: string): FormatNodeLike {
    let self = this.createNodeList();
    self.appendElement("fo:inline-container", (self) => {
      self.setAttribute("space-end", "1mm");
      self.appendElement("fo:block", (self) => {
        self.resetIndent();
        self.setAttribute("padding", "0em 0.1em");
        self.setAttribute("font-size", "75%");
        self.setAttribute("color", GRAY_COLOR);
        self.setAttribute("border-width", "0.1mm");
        self.setAttribute("border-color", GRAY_COLOR);
        self.setAttribute("border-style", "solid");
        self.setAttribute("axf:border-radius", "0.2em");
        self.appendChild(string);
      });
    });
    return self;
  }

  private buildEquivalentSeparator(): FormatNodeLike {
    let self = this.createNodeList();
    self.appendElement("fo:inline", (self) => {
      self.setAttribute("space-start", "1mm");
      self.setAttribute("space-end", "1mm");
      self.setAttribute("font-size", "80%");
      self.setAttribute("color", GRAY_COLOR);
      self.setAttribute("relative-position", "relative");
      self.setAttribute("bottom", "0.2em");
      self.appendChild("||");
    });
    return self;
  }

  private buildPhraseSeparator(): FormatNodeLike {
    let self = this.createNodeList();
    self.appendElement("fo:inline", (self) => {
      self.setAttribute("space-start", "1mm");
      self.setAttribute("space-end", "1mm");
      self.setAttribute("font-size", "80%");
      self.setAttribute("color", GRAY_COLOR);
      self.setAttribute("relative-position", "relative");
      self.setAttribute("bottom", "0.2em");
      self.appendChild("||");
    });
    return self;
  }

  private buildExampleSeparator(): FormatNodeLike {
    let self = this.createNodeList();
    self.appendElement("fo:inline", (self) => {
      self.setAttribute("space-start", "1mm");
      self.setAttribute("space-end", "1mm");
      self.setAttribute("font-size", "90%");
      self.setAttribute("color", GRAY_COLOR);
      self.setAttribute("relative-position", "relative");
      self.setAttribute("bottom", "0.1em");
      self.appendChild("▶");
    });
    return self;
  }

  private buildShaleianText(callback?: FormatNodeCallback): FormatNodeLike {
    let self = this.createNodeList();
    self.appendElement("fo:inline", (self) => {
      self.setAttribute("font-family", SHALEIAN_FONT_FAMILY);
      self.setAttribute("font-size", SHALEIAN_FONT_SIZE);
      callback?.call(this, self);
    });
    return self;
  }

  private createMarkupResolver(): MarkupResolver<FormatNodeLike, FormatNodeLike> {
    let resolver = new MarkupResolver<FormatNodeLike, FormatNodeLike>({
      resolveLink: (name, children) => {
        let node = this.createNodeList();
        for (let child of children) {
          node.appendChild(child);
        }
        return node;
      },
      resolveBracket: (children) => {
        let node = this.buildShaleianText((self) => {
          for (let child of children) {
            self.appendChild(child);
          }
        });
        return node;
      },
      resolveSlash: (children) => {
        let node = this.createElement("fo:inline");
        node.setAttribute("font-style", "italic");
        for (let child of children) {
          node.appendChild(child);
        }
        return node;
      },
      join: (nodes) => {
        let node = this.createNodeList();
        for (let child of nodes) {
          node.appendChild(child);
        }
        return node;
      }
    });
    return resolver;
  }

}


export type FormatNodeLike = NodeLike<FormatElement, string, FormatDocument>;
export type FormatNodeCallback = NodeCallback<FormatElement>;