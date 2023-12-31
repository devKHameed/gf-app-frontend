var __rest =
  (this && this.__rest) ||
  function (s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (
          e.indexOf(p[i]) < 0 &&
          Object.prototype.propertyIsEnumerable.call(s, p[i])
        )
          t[p[i]] = s[p[i]];
      }
    return t;
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.Html = void 0;
const react_1 = __importDefault(require("react"));
const client_1 = __importDefault(require("react-dom/client"));
const react_konva_1 = require("react-konva");
const needForceStyle = (el) => {
  const pos = window.getComputedStyle(el).position;
  const ok = pos === "absolute" || pos === "relative";
  return !ok;
};
const Html = ({ children, groupProps, divProps, transform, transformFunc }) => {
  const groupRef = react_1.default.useRef(null);
  const container = react_1.default.useRef();
  const [div] = react_1.default.useState(() => document.createElement("div"));
  const root = react_1.default.useMemo(
    () => client_1.default.createRoot(div),
    [div]
  );
  const shouldTransform =
    transform !== null && transform !== void 0 ? transform : true;
  const handleTransform = () => {
    if (shouldTransform && groupRef.current) {
      const tr = groupRef.current.getAbsoluteTransform();
      let attrs = tr.decompose();
      if (transformFunc) {
        attrs = transformFunc(attrs);
      }
      div.style.position = "absolute";
      div.style.zIndex = "10";
      div.style.top = "0px";
      div.style.left = "0px";
      div.style.transform = `translate(${attrs.x}px, ${attrs.y}px) rotate(${attrs.rotation}deg) scaleX(${attrs.scaleX}) scaleY(${attrs.scaleY})`;
      div.style.transformOrigin = "top left";
    } else {
      div.style.position = "";
      div.style.zIndex = "";
      div.style.top = "";
      div.style.left = "";
      div.style.transform = ``;
      div.style.transformOrigin = "";
    }
    const _a = divProps || {},
      { style } = _a,
      restProps = __rest(_a, ["style"]);
    // apply deep nesting, because direct assign of "divProps" will overwrite styles above
    Object.assign(div.style, style);
    Object.assign(div, restProps);
  };
  react_1.default.useLayoutEffect(() => {
    var _a;
    const group = groupRef.current;
    if (!group) {
      return;
    }
    const parent =
      (_a = group.getStage()) === null || _a === void 0
        ? void 0
        : _a.container();
    if (!parent) {
      return;
    }
    parent.appendChild(div);
    if (shouldTransform && needForceStyle(parent)) {
      parent.style.position = "relative";
    }
    group.on("absoluteTransformChange", handleTransform);
    handleTransform();
    return () => {
      var _a;
      group.off("absoluteTransformChange", handleTransform);
      (_a = div.parentNode) === null || _a === void 0
        ? void 0
        : _a.removeChild(div);
    };
  }, [shouldTransform]);
  react_1.default.useLayoutEffect(() => {
    handleTransform();
  }, [divProps]);
  react_1.default.useLayoutEffect(() => {
    root.render(children);
  });
  react_1.default.useLayoutEffect(() => {
    return () => {
      // I am not really sure why do we need timeout here
      // but it resolve warnings from react
      // ref: https://github.com/konvajs/react-konva-utils/issues/26
      setTimeout(() => {
        root.unmount();
      });
    };
  }, []);
  return react_1.default.createElement(
    react_konva_1.Group,
    Object.assign({ ref: groupRef }, groupProps)
  );
};
exports.Html = Html;
