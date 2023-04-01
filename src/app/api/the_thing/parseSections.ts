import * as fs from "fs";
import { unified } from "unified";
import markdown from "remark-parse";
import mdx from "remark-mdx";
// // import html from "remark-html";
// import { Node } from "unist";
// import { Root } from "@types/mdast";

export async function parseMdxIntoSections(filename: string) {
    const processor = unified().use(markdown).use(mdx);

    const content = fs.readFileSync(filename, "utf-8");

    const ast = unified().use(markdown).use(mdx).parse(content);

    console.log(ast);
}
