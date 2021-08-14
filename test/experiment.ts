//

import execa from "execa";
import {
  promises as fs
} from "fs";
import {
  DirectoryLoader
} from "soxsot/dist/io";
import {
  DictionaryFormatBuilder
} from "../source";


async function typeset(path: string): Promise<void> {
  let loader = new DirectoryLoader(path);
  let dictionary = await loader.asPromise();
  let builder = new DictionaryFormatBuilder();
  let documentString = builder.convert(dictionary);
  await fs.mkdir("./out", {recursive: true});
  await fs.writeFile("./out/main.fo", documentString, {encoding: "utf8"});
  await execa("AHFCmd", ["-pgbar", "-x", "3", "-d", "out/main.fo", "-p", "@PDF", "-o", "out/document.pdf"]);
}

typeset(process.argv[2]);