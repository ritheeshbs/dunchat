<script lang="ts">
	import { ExplainerSection, HeroSection, ProblemStatementSection } from "$lib/components/sections/home";

    const introSection = {
        id: "home-intro",
        title: "A simpler way to stay connected",
        description: "DunChat organizes your team's communication in a way that makes sense. *Create workspaces, add teams and channels, and start threaded conversations.*\n\n*Follow each topic without the noise.* No extra fluff - just what you need to chat and keep work moving.",
        imageURL: "/images/inbox.png",
        altText: "Inbox interface of DunChat"
    }
</script>

<HeroSection />
<ProblemStatementSection />
<ExplainerSection {...introSection} />