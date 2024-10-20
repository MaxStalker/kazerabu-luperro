
interface Globals {
  mouseDown: boolean;
  notes: { [key: string]: boolean };
  touch: boolean
}

const globals: Globals = {
  mouseDown: false,
  touch: false,
  notes: {},
};

export default globals;
