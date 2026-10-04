import {
	shareTargetTextParser,
	shareTargetTitleParser,
	shareTargetUrlParser,
} from "@/lib/search-params";
import { useItemStore } from "@/stores";
import { useQueryStates } from "nuqs";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function ShareTargetPage() {
	const [{ title, text, url }] = useQueryStates({
		title: shareTargetTitleParser,
		text: shareTargetTextParser,
		url: shareTargetUrlParser,
	});
	const navigate = useNavigate();
	const openCreateDialog = useItemStore((state) => state.openCreateDialog);

	useEffect(() => {
		// Extract URL from text or url parameter
		let extractedUrl = url;
		let extractedTitle = title;

		if (!extractedUrl && text) {
			const urlRegex = /(https?:\/\/[^\s]+)/g;
			const urls = text.match(urlRegex);
			if (urls && urls.length > 0) {
				extractedUrl = urls[0];
				// If text has URL, maybe the rest of text is the title/description
				const remainingText = text.replace(urls[0], "").trim();
				if (!extractedTitle && remainingText) {
					extractedTitle = remainingText;
				}
			}
		}

		if (extractedUrl) {
			openCreateDialog(extractedUrl, null, extractedTitle);
		}

		// Always redirect to home after processing
		navigate("/", { replace: true });
	}, [title, text, url, navigate, openCreateDialog]);

	return null;
}
