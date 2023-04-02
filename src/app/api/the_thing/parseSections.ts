import * as fs from "fs";
import { unified } from "unified";
import markdown from "remark-parse";
import mdx from "remark-mdx";
import { visit } from "unist-util-visit";
import { Node } from "unist";

interface Paragraph {
    type: "paragraph";
    content: string;
}

interface Section {
    type: "section";
    title: string;
    content: string;
}

type ContentNode = Section | Paragraph;

function groupParagraphsBySubheadings(ast: Node): ContentNode[] {
    const contentNodes: ContentNode[] = [];
    let currentSection: Section | null = null;

    const visitor = (node: Node) => {
        if (node.type === "heading" && (node as any).depth === 2) {
            if (currentSection) {
                contentNodes.push(currentSection);
            }
            currentSection = {
                type: "section",
                title: (node as any).children[0].value,
                content: "",
            };
        } else if (node.type === "paragraph") {
            const paragraphContent = (node as any).children[0]?.value;
            if (paragraphContent) {
                // Filter out undefined paragraphs
                if (currentSection) {
                    currentSection.content += paragraphContent + "\n\n";
                } else {
                    contentNodes.push({
                        type: "paragraph",
                        content: paragraphContent,
                    });
                }
            }
        }
    };

    visit(ast, visitor);

    if (currentSection) {
        contentNodes.push(currentSection);
    }

    return contentNodes;
}

export async function parseMdxIntoSections(filename: string) {
    const processor = unified().use(markdown).use(mdx);

    const content = fs.readFileSync(filename, "utf-8");

    const ast: Node = processor.parse(content);
    const groupedContent = groupParagraphsBySubheadings(ast);

    return JSON.stringify(groupedContent, null, 2);
}
