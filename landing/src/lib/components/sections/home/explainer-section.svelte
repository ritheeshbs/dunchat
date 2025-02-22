<script lang="ts">
    interface ExplainerSectionProps {
        id: string;
        title: string;
        description: string;
        imageURL: string;
        altText: string;
    }

    interface DescriptionSegment {
		text: string;
		highlight: boolean;
	}

    let { id, title, description, imageURL, altText } : ExplainerSectionProps = $props();

    /**
	 * Splits the description into segments based on markdown-style highlighting.
	 *
	 * @param description - The description text to be split into segments.
	 * @returns An array of DescriptionSegment objects, each containing the text and a boolean indicating if it's highlighted.
	 */
	function getDescriptionSegments(description: string): DescriptionSegment[] {
		// Regular expression to match markdown-style highlighting (text surrounded by asterisks)
		const regex = /\*(.*?)\*/g;
		let match;
		let lastIndex = 0; // Keeps track of the last index processed to ensure all text is accounted for
		const segments: DescriptionSegment[] = []; // Array to store the description segments

		// Loop through the description to find all matches of the highlighting pattern
		while ((match = regex.exec(description)) !== null) {
			// If there's text before the current match, add it as a non-highlighted segment
			if (match.index > lastIndex) {
				segments.push({ text: description.slice(lastIndex, match.index), highlight: false });
			}
			// Add the matched text as a highlighted segment
			segments.push({ text: match[1], highlight: true });
			// Update the last index to the position after the current match
			lastIndex = regex.lastIndex;
		}

		// Ensure the remaining text after the last match is included as a non-highlighted segment
		if (lastIndex < description.length) {
			segments.push({ text: description.slice(lastIndex), highlight: false });
		}

		return segments;
	}
</script>

<section
    id={id}
    class="flex w-full flex-col gap-6"
>
    <h2
        id="{id}-title"
        class="w-full text-start text-4xl font-medium leading-tight tracking-tight"
    >
        {title}
    </h2>

    <img src={imageURL} alt={altText} class="w-full rounded-2xl border-2 border-white shadow-mild" />

    <p class="w-full text-xl font-medium leading-relaxed text-gray-500 wrap-pre-line">
        {#each getDescriptionSegments(description) as segment}
            {#if segment.highlight}
                <span class="text-black">{segment.text}</span>
            {:else}
                {segment.text}
            {/if}
        {/each}
    </p>
</section>