<script lang="ts">
	import { ExplainerSection, HeroSection, ProblemStatementSection, StepsSection } from "@/components/sections/home";

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

    const feedSection = {
        id: "home-feed",
        title: "Quick team updates with the internal feed",
        description: "*The internal feed lets everyone see the latest news, updates, quick notes*, or just to share about your day *without cluttering your threads*.\n\nLabel your updates—like \"Project update\" or \"Announcements\"—so that so the important stuff doesn't get lost in the shuffle.",
        imageURL: "/images/feed.png",
        altText: "Feed interface in DunChat"
    }

    const keyboardShortcutsSection = {
        id: "home-keyboard-shortcuts",
        title: "And the best of all, it's keyboard first",
        description: "No need to waste time clicking around—DunChat is built to work with keyboard shortcuts.\n\nWith our pre——set shortcuts, everything is just a few keystrokes away. *You can navigate, make changes, and manage threads more efficiently—saving you time and effort on every action.*",
        imageURL: "/images/keyboard-shortcuts.png",
        altText: "Keyboard shortcuts for managing a thread"
    }
</script>

<HeroSection />
<ProblemStatementSection />
<ExplainerSection {...introSection} />
<StepsSection />
<ExplainerSection {...workspaceSection} />
<ExplainerSection {...threadsSection} />
<ExplainerSection {...feedSection} />
<ExplainerSection {...keyboardShortcutsSection} />
