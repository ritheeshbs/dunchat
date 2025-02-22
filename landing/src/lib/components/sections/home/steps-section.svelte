<script lang="ts">
	import { cn } from "@/utils";

    const tabs = [
        {
            title: "Start thread",
            image: "/images/start-thread.png",
            altText: "Start thread interface"
        },
        {
            title: "Make conversations",
            image: "/images/make-conversations.png",
            altText: "Thread conversations interface"
        },
        {
            title: "Conclude & close",
            image: "/images/conclude-and-close.png",
            altText: "Closed thread interface with conclusion message"
        }
    ]

    let activeTabIndex = $state(0);

    const switchTab = (newIndex : number) => {
        activeTabIndex = newIndex;
    }
</script>

<section
    id="home-steps"
    class="flex w-full flex-col gap-6"
>
    <h2
        id="home-title"
        class="w-full text-start text-2xl lg:text-4xl font-medium leading-tight tracking-tight"
    >
        Conversations dun within three steps
    </h2>

    <div class="flex gap-1 p-1 rounded-2xl bg-black/5 overflow-clip font-medium w-fit">
        {#each tabs as tab, index}
            <button 
                onclick={() => switchTab(index)}
                class={cn(
                    "px-4 py-2 rounded-xl text-gray-500",
                    activeTabIndex===index ? "bg-white shadow-mild text-black" :"",
                )}
            >
                {tab.title}
            </button>
        {/each}
    </div>
    
    <img src={tabs[activeTabIndex].image} alt={tabs[activeTabIndex].altText} class="w-full rounded-3xl border-2 border-white shadow-mild " />
</section>