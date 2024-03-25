import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY, // This is the default and can be omitted
});

export async function generateAffirmation({ role }: { role: string }) {
  const prompt = `You are world-class at coming up with humorous affirmation sessions based on the individual's job or position.
Make sure to include a funny title as well as the affirmation itself.

<input>
Site Reliability Engineer
</input>
<output>
<title>Positive Affirmations for Site Reliability Engineers</title>
Begin by opening your heart to this exercise. 

Now, exhale.

Your pipeline is green. 

Your tests are well written and stable. 

Your friends and family understand what you do.

Your friends and family appreciate your humorous work stories.

That joke you told in your meeting was funny. 

If your co-workers were not on mute you would have heard them laughing

DevOps is a meaningful term.

You understand DevOps because you use it every day.

You were born to deploy Kubernetes clusters.

You are happy.

You are happy.

You are happy.
</output>
<input>
${role}
</input>
<output>`;
  const message = await anthropic.messages.create({
    max_tokens: 1200,
    messages: [{ role: "user", content: prompt }],
    model: "claude-3-opus-20240229",
    stop_sequences: ["</output>"],
  });

  const messageText = Array.isArray(message.content)
    ? message.content.map((c) => c.text).join("")
    : message.content;

  // get text only, split into lines
  const [cleanedTitle, ...affirmations] = messageText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  // Remove everything between <title> and </title>
  const title = cleanedTitle?.split("<title>")[1]?.split("</title>")[0] ?? "";

  return {
    title,
    affirmations,
  };
}
