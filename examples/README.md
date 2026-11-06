# Example code

This folder holds the code you run while reading the notebooks. Each notebook has its own folder.

| Notebook | Folder | What's in it |
|---|---|---|
| #1 Shipping AI Agents | — | No code yet. |
| #2 Running Your Own Models | — | No code yet. |
| #3 Inside the Machine | — | No code yet. |
| #4 Kubernetes from the Beginning | [`04-kubernetes-from-the-beginning`](04-kubernetes-from-the-beginning/) | Botley, a small Python app, and the Kubernetes files for each chapter. |

## Get the code

```bash
git clone https://github.com/nimeshmora/shipping-ai-agents.git
cd shipping-ai-agents/examples
```

Then go to the folder for your notebook and read its README.

## How a notebook's folder is laid out

Every notebook folder is named with the notebook's number and its address on the website, and has the same three files at the top:

```text
examples/04-kubernetes-from-the-beginning/
  README.md        what you need, and which files go with which chapter
  versions.env     the exact versions of the tools the notebook was tested with
  test.sh          runs the notebook's examples and checks they still work
  botley/          the example itself (one folder for each app)
```

Each notebook folder also has its own GitHub check, in `.github/workflows/examples-<folder>.yml`.
It runs `test.sh` when a pull request changes that folder, and again once a month,
so we find out when a new version of a tool breaks a chapter.

## The rules for every example

1. **It must run on a laptop.** Use kind, Docker or plain Python. If an example needs a cloud account, say so at the top of its README, and say roughly what it costs.
2. **No real keys or secrets.** Use made-up values like `sk-pretend-1234`. Never commit a `.env` file with real values in it.
3. **Pin every version.** Write image tags and tool versions in full, like `python:3.13-slim` or `curlimages/curl:8.17.0`. Never use `latest`. Put tool versions in the notebook's `versions.env`.
4. **Match the book.** File names, names inside the files, and output should be the same as in the chapter. If you change a file, check the chapter that uses it, and change the chapter in the same pull request if it needs it.
5. **Say which chapter.** Put a comment at the top of each new file, like `# Chapter 9. ...`, and add the file to the table in the notebook's README.
6. **Keep the test passing.** Run the notebook's `test.sh` before you send a pull request. If you add an example, add a check for it to `test.sh`.

## Running the tests

For Notebook #4 you need Docker, [kind](https://kind.sigs.k8s.io/) and kubectl:

```bash
cd examples/04-kubernetes-from-the-beginning
./test.sh          # about 10 minutes
./test.sh --keep   # leaves the test cluster running, so you can look around
```

It makes its own cluster called `botley-test`, so it doesn't touch the cluster you use for the book.

## Adding a folder for a new notebook

1. Make a folder called `examples/NN-<notebook-slug>`, for example `examples/05-agents-in-the-cloud`. The slug is the notebook's address on the website, the same as its `slug` in `src/lib/notebooks.ts`.
2. Add `README.md`, `versions.env` and `test.sh`. Copy Notebook #4's and change them.
3. Copy `.github/workflows/examples-04-kubernetes-from-the-beginning.yml` to `examples-NN-<notebook-slug>.yml`, and change the folder name in it.
4. Set `examples: 'NN-<notebook-slug>'` on the notebook in `src/lib/notebooks.ts`. The front page then shows a button that links to the folder. Set `examplesButton` to name your example app, like `"Botley's code"`. If you leave it out, the button says **Get the code**.
5. Add the notebook to the table at the top of this file.

## Something doesn't work?

[Tell us what happened](https://github.com/nimeshmora/shipping-ai-agents/issues/new?template=broken-example.yml).
Say which notebook and chapter, the command you ran, and what it printed.

The code in this folder is under the [MIT License](../LICENSE). You can copy it into your own projects.
