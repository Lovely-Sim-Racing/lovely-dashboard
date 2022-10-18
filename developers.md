<p align="center">
<img width="150" height="150" alt="Lovely Sim Racing" src="docs/images/lr-logo-small.png">
</p>

<h1 align="center">Lovely Developers</h1>

<p align="center">
The <strong>Lovely Dashboard</strong> is an open source project, based on the very popular SimHub.<br/>As such, anyone who wants to contribute, can do so by follwoing the instructions below.
</p>
 
<br/>

## Requirements
SimHub exports the **Sim Dash** code in a zipped file named `{filename}.simhubdash`, which is a collection of `JSON` files and resources. To maintain a properly versioned codebase, I've implemented and0 require a `pre-commit` script, that will prettify the JSON files and thus properly track changes to them.

### 1. Install Pre-Commit Hook
Before you can run hooks, you need to have the pre-commit package manager installed. You can do so by following the instructions on the [official pre-commit website](https://pre-commit.com/#installation), or just install it using the following command:

```
brew install pre-commit
```

Homebrew not your thing? Read more on the [official pre-commit website](https://pre-commit.com/#installation).


### 2. Install Git Hook Scripts

Once installed, run `pre-commit install` to set up the git hook scripts

```
$ pre-commit install
pre-commit installed at .git/hooks/pre-commit
```

### 3. Test & Finish
You're all set as far as tooling is concerned. Every time you make a commit, the `pre-commit` script will make sure the files are properly formatted and are prettified. 

It's usually a good idea to run the hooks against all of the files when adding new hooks (usually pre-commit will only run on the changed files during git hooks). Running `pre-commit run --all-files` will have a pass at everythig, and if all is well, you should see somthing like the below. 

```
$ pre-commit run --all-files
check json...............................................................Passed
pretty format json.......................................................Passed
```

## Contributing Files
To maintain a versioned repository, you will need to commit **ONLY the source files** of the dashboard which can be found in the SimHub folder. You can right click on the Dashboard in SimHub and select `Open Folder`. You should copy all those files into the repository, and let GitHub do it's thing when you commit.