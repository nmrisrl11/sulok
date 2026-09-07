import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, "public/temporary/sound variants");
const destDir = path.join(__dirname, "src/components/icons");

const files = fs.readdirSync(srcDir);

for (const file of files) {
	if (file.endsWith(".svg")) {
		const name = path.basename(file, ".svg");
		const componentName =
			name
				.split("-")
				.map((p) => p.charAt(0).toUpperCase() + p.slice(1))
				.join("") + "Icon";
		let svgContent = fs.readFileSync(path.join(srcDir, file), "utf-8");

		// Remove XML declaration and doctype
		svgContent = svgContent.replace(/<\?xml.*?\?>/gi, "").replace(/<!DOCTYPE.*?>/gi, "");

		// Extract the content inside the <svg> tag
		const match = svgContent.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
		let innerContent = match ? match[1] : "";

		// Convert hyphenated attributes to camelCase
		innerContent = innerContent.replace(
			/([a-z]+)-([a-z]+)="/g,
			(m, p1, p2) => `${p1}${p2.charAt(0).toUpperCase() + p2.slice(1)}="`,
		);

		// Fix class to className
		innerContent = innerContent.replace(/class="/g, 'className="');

		const componentContent = `import type { SVGProps } from "react";
import { cn } from "@/lib/utils";

export function ${componentName}({ className, ...props }: SVGProps<SVGSVGElement>) {
\treturn (
\t\t<svg
\t\t\txmlns="http://www.w3.org/2000/svg"
\t\t\tviewBox="0 0 24 24"
\t\t\tfill="currentColor"
\t\t\tclassName={cn("w-4 h-4", className)}
\t\t\t{...props}
\t\t>
\t\t\t${innerContent.trim()}
\t\t</svg>
\t);
}
`;

		fs.writeFileSync(path.join(destDir, `${name}-icon.tsx`), componentContent);
		console.log(`Created ${componentName} in ${name}-icon.tsx`);
	}
}
