# Ship It with Nimesha: visual notebooks

**[Read them online →](https://nimeshmora.github.io/shipping-ai-agents/)**

Free, Head First style notebooks about taking AI agents and their models from a prototype to production
on **AWS**, **Microsoft Azure** and **Google Cloud**. They use sketches, puzzles and plain language,
and you don't need any cloud experience to start.

Written by Nimesha Jinarajadasa, with help from [contributors](https://github.com/nimeshmora/shipping-ai-agents/graphs/contributors).

## The notebooks

### Notebook #1: [Shipping AI Agents](https://nimeshmora.github.io/shipping-ai-agents/notebooks/shipping-ai-agents/) &nbsp;·&nbsp; [PDF](https://nimeshmora.github.io/shipping-ai-agents/shipping-ai-agents.pdf)

**The basics**
1. Meet your agent
2. It worked on my laptop!
3. Giving your agent an address
4. Pack it up
5. Where will it live?
6. Meet the landlords
7. Making it safe to trust

**Under the hood**

8. What happens to a conversation?
9. How agents remember
10. Who is allowed in?

**Choose, deploy, launch**

11. Choosing where to deploy
12. Deploying Botley for real
13. The road to production

### Notebook #2: [Running Your Own Models](https://nimeshmora.github.io/shipping-ai-agents/notebooks/running-your-own-models/) &nbsp;·&nbsp; [PDF](https://nimeshmora.github.io/shipping-ai-agents/running-your-own-models.pdf)

**The basics**
1. Where does Botley's brain live?
2. What is a model, really?
3. How a model writes an answer
4. Meet the GPU

**The two paths**

5. The managed path
6. The do-it-yourself path
7. Models on Kubernetes
8. Deploying a model for real

**Choose**

9. Does it pay off?
10. Reasons that aren't money
11. Choosing your path

### Notebook #3: [Inside the Machine](https://nimeshmora.github.io/shipping-ai-agents/notebooks/inside-the-machine/) &nbsp;·&nbsp; [PDF](https://nimeshmora.github.io/shipping-ai-agents/inside-the-machine.pdf)

*How GPUs run your agent.*

**How any computer works**
1. What happens when Botley thinks?
2. Switches all the way down
3. The CPU: a few very fast chefs
4. The counter, the fridge and the warehouse

**Why AI needs GPUs**

5. The maths inside a model, gently
6. The GPU: thousands of line cooks
7. The real bottleneck
8. When one GPU isn't enough

**From chip to cloud**

9. Inside a data center
10. Not only NVIDIA
11. How to read a GPU spec sheet
12. What this means for your agent

## Help make it better

These notebooks are open to contributions, and you don't have to write code to help.

- **Spotted a mistake or something out of date?** Cloud services change fast. [Report it](https://github.com/nimeshmora/shipping-ai-agents/issues/new?template=fix.yml).
- **Have a good example?** Code, a production story or a diagram: [suggest it](https://github.com/nimeshmora/shipping-ai-agents/issues/new?template=example.yml).
- **Small fix?** Click **Edit this page** at the bottom of any chapter.
- **Idea for a new topic or chapter?** [Suggest it](https://github.com/nimeshmora/shipping-ai-agents/issues/new?template=chapter-idea.yml) before you start writing.

- **Like to speak?** Contributors can take over a school, university or meetup session, or present one together with Nimesha. [Raise your hand](https://github.com/nimeshmora/shipping-ai-agents/issues/new?template=speaking.yml).

Read [CONTRIBUTING.md](CONTRIBUTING.md) for the writing style and how to send a pull request.

## Run it on your computer

You need Node.js 22 or newer.

```bash
git clone https://github.com/nimeshmora/shipping-ai-agents.git
cd shipping-ai-agents
npm install
npm run dev        # live preview at http://localhost:4321/shipping-ai-agents/
npm run build      # checks that the whole site builds
```

The site is built with [Astro](https://astro.build). Each chapter is one MDX file (Markdown plus a few components).

## Writing guide

### Where things live

| What | Where |
|---|---|
| Site front page (Ship It with Nimesha) | `src/pages/index.astro` |
| List of notebooks shown on the front page | `src/lib/notebooks.ts` |
| Notebook cover, how-to-use page, word list | `src/pages/notebooks/<notebook>/` (`index.astro`, `how.astro`, `back.mdx`) |
| Chapters | `src/content/notebooks/<notebook>/*.mdx` (one file per chapter) |
| Drawings | `src/sketches/*.svg` |
| Box components (Careful!, Your turn and so on) | `src/components/` |
| Page layout, sidebar, Previous and Next | `src/layouts/Base.astro` |
| Colors, fonts, light and dark mode | `src/styles/notebook.css` and `src/styles/site.css` |
| The PDF | `public/shipping-ai-agents.pdf` |

### Edit a chapter

Open its file in `src/content/notebooks/<notebook>/`. Normal text is Markdown: `**bold**`, `*italic*`, `## Heading`, lists and tables.
The front matter at the top sets the number, title, subtitle, the character's speech bubble and the date the facts were last checked.

### Add a new chapter

1. In the notebook's folder, copy an existing file, for example `src/content/notebooks/shipping-ai-agents/08-what-happens-to-a-conversation.mdx`, and give it a new name such as `14-agents-talking-to-agents.mdx`.
2. Change `number`, `title`, `kicker`, `subtitle`, `question`, `part` and `quote` at the top.
3. Write the content. The sidebar, chapter list, page numbers in the URL, and Previous and Next links update by themselves.

`part` decides which group the chapter appears in on the sidebar (for example "The basics" or "Under the hood").
Use a new `part` name to start a new group.

### Use the Head First boxes

```mdx
<Careful>
**Never let users choose a session ID.** Create it on the server.
</Careful>

<Think>Guess the answer before you read on.</Think>

<YourTurn>
1. Which home would you choose? <Blank />
</YourTurn>

<NoSillyQuestions>
<QA q="Is a session the same as being logged in?">
No. Logging in proves who you are. A session is one conversation.
</QA>
</NoSillyQuestions>

<Sticky color="blue" tilt="right">A short note in handwriting.</Sticky>

<Columns>
<div>

Left column

</div>
<div>

Right column

</div>
</Columns>

<Sketch name="ch08-1" caption="The caption under the drawing." />

<Takeaways>

- First point
- Second point

</Takeaways>
```

Leave an empty line after an opening tag and before a closing tag when the inside has Markdown (lists, bold text and so on).

### Add a drawing

Draw it as an SVG (by hand in a tool such as Excalidraw, Figma or Inkscape, or in code), save it in `src/sketches/`,
and show it with `<Sketch name="file-name-without-.svg" />`.
To match the notebook look, use these text classes inside the SVG: `h` (blue handwriting), `hb` (bold handwriting), `hk` (black handwriting).

### Keep it accurate

Cloud services change often. Each chapter has a `lastChecked` date in its front matter, shown at the bottom of the page.
Re-check the facts and the commands in chapter 12 every few months, then update the date.

## License

- Chapters, drawings and the PDF: [CC BY-NC-SA 4.0](LICENSE-CONTENT.md). You may share and adapt them with credit, but not commercially.
- Website code: [MIT](LICENSE).
