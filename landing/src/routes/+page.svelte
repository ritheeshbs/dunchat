<script lang="ts">
	import { ExplainerSection, HeroSection, ProblemStatementSection } from "$lib/components/sections/home";

    const introSection = {
        id: "home-intro",
        title: "A simpler way to stay connected",
        description: "DunChat organizes your team's communication in a way that makes sense. *Create workspaces, add teams and channels, and start threaded conversations.*\n\n*Follow each topic without the noise.* No extra fluff - just what you need to chat and keep work moving.",
        imageURL: "/images/inbox.png",
        altText: "Inbox interface of DunChat"
    }

    const workspaceSection = {
        id: "home-workspace",
        title: "Workspaces that bring everyone together",
        description: "With DunChat, your workspaces keep conversations, channels, and threads organized and in the right context. \n\n*Create a space for your team, and focus on your goals*—all within a workspace that's easy to manage.",
        imageURL: "/images/workspace.png",
        altText: "Workspace creation interface in DunChat"
    }

    const threadsSection = {
        id: "home-threads",
        title: "Threads for focused conversations",
        description: "Start threads for specific topic related discussions, *keeping everything organized without clogging up the main chat.* \n\nOnce decisions are made or a thread is no longer active, simply close it to keep the focus on what matters.",
        imageURL: "/images/thread-conversation.png",
        altText: "Thread conversation interface in DunChat"
    }
</script>

<HeroSection />
<ProblemStatementSection />
<ExplainerSection {...introSection} />
<ExplainerSection {...workspaceSection} />
<ExplainerSection {...threadsSection} />