let tty = new Terminal();

tty.open(document.getElementById("tty"));
tty.write("Hello World!!! :D I'm now in a terminal!");

tty.onData((t) => {
  tty.write(t);
});
