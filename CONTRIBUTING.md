# Help improve Shipping AI Agents

Thank you for helping! This notebook gets better when readers share real examples and spot what has gone out of date.
You don't need to be an expert, and you don't need to write code for most kinds of help.

## Ways to help

| You want to… | Do this |
|---|---|
| Fix a typo or a small mistake | Click **Edit this page** at the bottom of any chapter. GitHub opens the file and helps you send a change. |
| Report something that is wrong or out of date | Click **Report a mistake or outdated fact** at the bottom of the chapter, or [open an issue](https://github.com/nimeshmora/shipping-ai-agents/issues/new/choose). |
| Share an example (code, a story from production, a diagram) | Click **Suggest an example**, or send a pull request that adds it to the chapter. |
| Fix or add example code that you run | Example code is in [`examples/`](examples/), with one folder for each notebook. [examples/README.md](examples/README.md) explains the rules and how to run the tests. |
| Suggest a topic for a new notebook or chapter | [Suggest a topic](https://github.com/nimeshmora/shipping-ai-agents/issues/new?template=chapter-idea.yml) first so we can agree on the plan before you write it. |
| Ask a question | Use [Discussions](https://github.com/nimeshmora/shipping-ai-agents/discussions) if they are turned on, otherwise open an issue. |

## Share the stage: speaking opportunities

Schools, universities and meetups invite Nimesha to speak more often than one person can say yes.
If you help with these notebooks and you would like to speak, you can take over a session or present one together.
School students in IT, Maths, Biology and Technology streams are especially keen to meet people who work in software.

[Raise your hand to speak](https://github.com/nimeshmora/shipping-ai-agents/issues/new?template=speaking.yml). The form becomes a public issue, so please don't share your phone number or email there.

## How we write

The notebook is written for people who are new to running agents in production. Please keep to the house style:

- **Plain, short sentences.** One idea per sentence. Explain any new word the first time you use it.
- **Fair to every cloud.** When you add an AWS example, consider the Azure and Google Cloud equivalent too, or say that it is missing.
- **Check your facts.** Link to the provider's official documentation in your pull request. Cloud services change fast.
- **Examples should run.** Code should be complete enough to copy and paste, with no real keys, account IDs or secrets.
- **Use the boxes.** `<Careful>`, `<Think>`, `<YourTurn>`, `<NoSillyQuestions>` and the rest are described in the [README](README.md#use-the-head-first-boxes).
- If you change the facts in a chapter, update `lastChecked` at the top of the file to today's date.

## Sending a change from your computer

You need Node.js 22 or newer.

```bash
# Fork the repository on GitHub first, then:
git clone https://github.com/YOUR-USERNAME/shipping-ai-agents.git
cd shipping-ai-agents
npm install
npm run dev          # live preview at http://localhost:4321/shipping-ai-agents/
git checkout -b my-change
# …edit files…
npm run build        # make sure the site still builds
git commit -am "Ch 8: add a Redis session example"
git push origin my-change
```

Then open a pull request on GitHub. A check builds the site automatically, and the author reviews every change before it goes live.

## Credit and license

By sending a contribution you agree that it is released under the same licenses as the project:
[CC BY-NC-SA 4.0](LICENSE-CONTENT.md) for text and drawings, and [MIT](LICENSE) for code.
Contributors are credited in the Git history and on GitHub's contributors page.

Please be kind and patient with each other. Everyone here is learning.
