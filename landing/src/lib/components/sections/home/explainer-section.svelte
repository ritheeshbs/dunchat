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

    let { id, title, description, imageURL, altText }: ExplainerSectionProps = $props();

    function highlightDescription(description: string): DescriptionSegment[][] {
        return description.split('\n').map((line) => {
            const regex = /\*(.*?)\*/g;
            let match;
            let lastIndex = 0;
            const segments: DescriptionSegment[] = [];

            while ((match = regex.exec(line)) !== null) {
                if (match.index > lastIndex) {
                    segments.push({ text: line.slice(lastIndex, match.index), highlight: false });
                }

                segments.push({ text: match[1], highlight: true });
                lastIndex = regex.lastIndex;
            }

            if (lastIndex < line.length) {
                segments.push({ text: line.slice(lastIndex), highlight: false });
            }

            return segments;
        });
    }
</script>

<section id={id} class="flex w-full flex-col gap-6">
    <h2 id="{id}-title" class="w-full text-start text-2xl lg:text-4xl font-medium leading-tight tracking-tight">
        {title}
    </h2>

    <img src={imageURL} alt={altText} class="w-full rounded-3xl border-2 border-white shadow-mild" />

    <p class="w-full text-lg lg:text-xl font-medium leading-relaxed text-gray-500 wrap-pre-line">
        {#each highlightDescription(description) as lineSegments, lineIndex}
            {#if lineIndex > 0}<br>{/if}
            {#each lineSegments as segment}
                {#if segment.highlight}
                    <span class="text-black">{segment.text}</span>
                {:else}
                    {segment.text}
                {/if}
            {/each}
        {/each}
    </p>
</section>
