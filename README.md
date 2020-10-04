
# Propulsion Technology Stat Pack

## Cloning

```bash
$ git clone https://github.com/Chicow-Moovers/chicow-moovers.github.io.git
...

$ cd chicow-moovers.github.io
$ git submodule init
$ git submodule update
```

The last two lines are needed to allow any `JSHelper.something` functions to work. These additional steps are rather annoying... 

## Testing It -- Hosting Locally

If you have `python3` installed, you can host a local server like this:
```bash
(Commandline)
$ python3 -m http.server
```

You can then visit `127.0.0.1:8000` (assuming this is the address `python3 -m http.server` gives you) and test the site!


