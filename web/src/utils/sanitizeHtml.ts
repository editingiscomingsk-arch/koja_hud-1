const ALLOWED_TAGS = new Set(["B", "STRONG", "I", "EM", "U", "S", "SMALL", "SPAN", "BR", "P", "DIV", "UL", "OL", "LI"]);
const DROPPED_TAGS = new Set(["SCRIPT", "STYLE", "IFRAME", "OBJECT", "EMBED", "NOSCRIPT", "TEMPLATE", "TEXTAREA", "TITLE", "SVG", "MATH"]);
const ALLOWED_STYLES = new Set(["color", "font-weight", "font-style", "text-decoration", "opacity"]);

const cleanStyle = (element: HTMLElement): string =>
    Array.from(element.style)
        .filter((property) => ALLOWED_STYLES.has(property))
        .map((property) => `${property}: ${element.style.getPropertyValue(property)}`)
        .filter((declaration) => !/url\s*\(|expression\s*\(/i.test(declaration))
        .join("; ");

const cleanNode = (node: Node, target: Node, doc: Document) => {
    node.childNodes.forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
            target.appendChild(doc.createTextNode(child.textContent ?? ""));
            return;
        }
        if (child.nodeType !== Node.ELEMENT_NODE) {
            return;
        }
        const element = child as HTMLElement;
        if (DROPPED_TAGS.has(element.tagName.toUpperCase())) {
            return;
        }
        if (!ALLOWED_TAGS.has(element.tagName)) {
            cleanNode(element, target, doc);
            return;
        }
        const copy = doc.createElement(element.tagName.toLowerCase());
        const style = cleanStyle(element);
        if (style) {
            copy.setAttribute("style", style);
        }
        cleanNode(element, copy, doc);
        target.appendChild(copy);
    });
};

export const sanitizeHtml = (html: string): string => {
    const source = new DOMParser().parseFromString(`<body>${html ?? ""}</body>`, "text/html");
    const output = document.implementation.createHTMLDocument("");
    const container = output.createElement("div");
    cleanNode(source.body, container, output);
    return container.innerHTML;
};
