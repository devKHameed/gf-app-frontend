import { Box, ClickAwayListener, styled, useTheme } from "@mui/material";
import Tagify from "@yaireo/tagify";
import { MixedTags } from "@yaireo/tagify/dist/react.tagify";
import { MappableTagType } from "enums/Fusion";
import debounce from "lodash/debounce";
import escape from "lodash/escape";
import trim from "lodash/trim";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Controller } from "react-hook-form";
import { useFusionFlowStore } from "store/stores/fusion-flow";
import { v4 } from "uuid";
import { NodeEditorTooltip } from "../FlowPopover";
import { BaseParamFieldProps } from "../NodeEditorFields";
import ParamMapper from "./ParamMapper";

import { NavigateNext } from "@mui/icons-material";
import "@yaireo/tagify/dist/tagify.css";
import { Resizable } from "re-resizable";
import { parseTagsToExpression } from "utils/tagsParser";

const getTagsFromFunction = (func: GFMLFunction) => {
  const functionHeader = func.function_script || "";
  const startIndex = functionHeader.indexOf("(");
  const endIndex = functionHeader.indexOf(")");
  const params = functionHeader.substring(startIndex + 1, endIndex);
  const paramsArray = params.split(",");
  const separatorTagCount =
    paramsArray.reduce((count, param) => {
      if (param.startsWith("...")) {
        count += 2;
      } else {
        count += 1;
      }
      return count;
    }, 0) - 1;
  const funcId = v4();
  const closeTagId = v4();
  const tags = [];
  for (let i = 0; i < separatorTagCount; i++) {
    const tagId = v4();
    tags.push({
      value: ";",
      id: tagId,
      slug: func.function_slug,
      color: func.function_color,
      type: MappableTagType.Separator,
    });
  }
  tags.push({
    value: ")",
    id: closeTagId,
    slug: func.function_slug,
    color: func.function_color,
    type: MappableTagType.ClosingBracket,
  });

  tags.unshift({
    value: `${func.function_button_title || func.function_title} (`,
    id: funcId,
    slug: func.function_slug,
    color: func.function_color,
    draggable: true,
    type: MappableTagType.Function,
  });

  return tags;
};

const placeCaretAfterTagId = (tagId: string, tagifyRef: Tagify) => {
  tagifyRef.DOM.input.focus();
  const el = tagifyRef?.getTagElms()?.find((el: Element) => el.id === tagId);
  if (el) {
    tagifyRef.placeCaretAfterNode(el);
  }
};

const addEventsToTag = (startTagId: string, tagifyRef: Tagify) => {
  if (startTagId) {
    const tagElms = tagifyRef.getTagElms();
    const startTagElm = tagElms.find((el: Element) => el.id === startTagId);
    if (startTagElm) {
      startTagElm.ondragstart = (evt: any) => {
        evt.dataTransfer.setData(
          "text/plain",
          JSON.stringify({ mode: "sort", startTagId })
        );
      };

      startTagElm.ondragend = (evt: any) => {
        if (evt.dataTransfer.dropEffect === "none") {
          return;
        }
      };
    }
  }
};

const getCaretRange = (e: any) => {
  let range;
  if (document.caretRangeFromPoint) {
    // edge, chrome, android
    range = document.caretRangeFromPoint(e.clientX, e.clientY);
  } else {
    // firefox
    var pos = [e.rangeParent, e.rangeOffset];
    range = document.createRange();
    range.setStart(pos[0], pos[1]);
    range.setEnd(pos[0], pos[1]);
  }

  return range;
};

const handleSortTag = (
  startTagId: string,
  dropEvent: DragEvent,
  tagifyRef: Tagify
) => {
  const range = getCaretRange(dropEvent);
  let tagElms: any[] = tagifyRef.getTagElms();
  let startAddingTags = false;
  let tagsToCopy: any[] = [];
  const startTagElm = tagElms.find((el: Element) => el.id === startTagId);
  const startTagData = tagifyRef.tagData(startTagElm);
  let closingTagId: string = "";
  if (startTagData?.type === MappableTagType.Variable) {
    closingTagId = startTagData.id;
    tagsToCopy.push(startTagElm);
  } else if (startTagData?.type === MappableTagType.Function) {
    const startTagIndex = tagElms.findIndex((tag) => tag.id === startTagId);
    tagElms = tagElms.slice(startTagIndex);
    // tagsToCopy.push()
    startAddingTags = true;
    const funcs: any[] = [];
    tagElms.forEach((el) => {
      if (startAddingTags) {
        tagsToCopy.push(el);
        const tagData = tagifyRef.tagData(el);
        if (tagData?.type === MappableTagType.Function) {
          funcs.push(el);
        }
        if (tagData?.type === MappableTagType.ClosingBracket) {
          funcs.pop();
          if (funcs.length === 0) {
            startAddingTags = false;
          }
        } else if (el.nextSibling?.nodeType === 3) {
          tagsToCopy.push(el.nextSibling);
        }
      }
    });
    if (funcs.length > 0) {
      tagsToCopy = [];
    }
  }

  const [firstTagElm, ...restTags] = tagsToCopy;
  if (firstTagElm) {
    tagifyRef.injectAtCaret(firstTagElm, range as any);

    if (restTags.length) {
      let insetAfterElm = firstTagElm;
      restTags.forEach((tagElm) => {
        tagifyRef.insertAfterTag(insetAfterElm, tagElm);
        insetAfterElm = tagElm;
      });
      // tagifyRef.current.insertAfterTag(insetAfterElm, '\u00A0');
    }
    setTimeout(() => {
      tagifyRef.updateValueByDOMTags();
      closingTagId && placeCaretAfterTagId(closingTagId, tagifyRef);
      addEventsToTag(startTagId, tagifyRef);
    }, 0);
  }
};

const handleDropOperatorTag = (
  param: Record<string, any>,
  dropEvent: DragEvent,
  tagifyRef: Tagify
) => {
  const range = getCaretRange(dropEvent);
  if (range && tagifyRef && param) {
    const tagId = v4();
    const tagElm = tagifyRef.createTagElem({
      value: param.label || param.name,
      id: tagId,
      slug: param.slug,
      color: param.color,
      draggable: true,
      type: MappableTagType.Variable,
    });
    tagifyRef.injectAtCaret(tagElm, range as any);
    setTimeout(() => {
      tagifyRef.updateValueByDOMTags();
      placeCaretAfterTagId(tagId, tagifyRef);
      addEventsToTag(tagId, tagifyRef);
    }, 0);
  }
};

const handleDropTag = (
  func: GFMLFunction,
  dropEvent: DragEvent,
  tagifyRef: Tagify
) => {
  const range = getCaretRange(dropEvent);
  if (range && tagifyRef && func) {
    const tags = getTagsFromFunction(func);
    const closeTagId = tags[tags.length - 1].id;
    const startTagId = tags[0].id;
    const tagElms: HTMLElement[] = [];
    tags.forEach((tag) => {
      const tagElm = tagifyRef.createTagElem(tag);
      tagElms.push(tagElm);
    });

    const [firstTagElm, ...restTags] = tagElms;
    if (firstTagElm) {
      tagifyRef.injectAtCaret(firstTagElm, range as any);
      tagifyRef.insertAfterTag(firstTagElm, "\u00A0");

      if (restTags.length) {
        let insetAfterElm = firstTagElm;
        restTags.forEach((tagElm) => {
          tagifyRef.insertAfterTag(insetAfterElm, tagElm);
          tagifyRef.insertAfterTag(insetAfterElm, "\u00A0");
          insetAfterElm = tagElm;
        });
      }
    }
    setTimeout(() => {
      tagifyRef.updateValueByDOMTags();
      placeCaretAfterTagId(closeTagId, tagifyRef);
      addEventsToTag(startTagId, tagifyRef);
    }, 0);
  }
};

const onGFMLTagClick = (func: GFMLFunction, tagifyRef: Tagify) => {
  const tags = getTagsFromFunction(func);
  // console.log(
  //   "🚀 ~ file: MixedTagField.tsx:245 ~ onGFMLTagClick ~ tags:",
  //   tags
  // );
  const closeTagId = tags[tags.length - 1].id;
  const startTagId = tags[0].id;

  // console.log({ closeTagId, startTagId });
  tagifyRef.addTags(tags);

  // tags.forEach((tag) => {
  //   tagifyRef.addTags([tag]);
  //   // const elms = tagifyRef.getTagElms();
  //   // const tagElm = elms.find(
  //   //   (elm: any) => elm.__tagifyTagData.value === tag.value
  //   // );
  //   // console.log({ tagifyRef: tagElm });
  //   const tagElm = tagifyRef.getTagElmByValue(tag.value);
  //   if (tagElm) {
  //     tagifyRef.insertAfterTag(tagElm, "\u00A0");
  //   }
  // });

  setTimeout(() => {
    tagifyRef.updateValueByDOMTags();
    placeCaretAfterTagId(closeTagId, tagifyRef);
    addEventsToTag(startTagId, tagifyRef);
  }, 0);
};

const escapeValue = (value: string) => {
  let str = value;
  const tags: string[] = [];
  let startTagIndex = str.indexOf("[[");
  while (startTagIndex !== -1) {
    let endTagIndex = str.indexOf("]]");
    if (endTagIndex === -1) {
      break;
    }
    let tag = str.substring(startTagIndex + 2, endTagIndex);
    tags.push(tag);
    str = str.replace(`[[${tag}]]`, `{{{__tag__}}}`);
    startTagIndex = str.indexOf("[[");
  }

  const escapedValues = str.split("{{{__tag__}}}").map((part) => {
    return escape(part);
  });

  str = escapedValues.join("{{{__tag__}}}");

  tags.forEach((tag) => {
    str = str.replace(`{{{__tag__}}}`, `[[${tag}]]`);
  });

  return str;
};

const EditorHolder = styled(Box)(({ theme }) => ({
  ".tags-input": {
    height: "100%",
  },

  ".tagify": {
    background: theme.palette.background.GF5,
    border: "2px solid transparent",
    borderRadius: "5px",
    minHeight: "40px",
    height: "100%",

    "&:hover": {
      background: theme.palette.background.GF10,
    },

    "&.tagify--focus": {
      border: `2px solid ${theme.palette.text.primary_shades?.["30p"]}`,
    },

    "&.tagify--empty": {
      ".tagify__input": {
        padding: "6px 12px",
      },
    },

    ".tagify__input": {
      padding: "0 12px",
      lineHeight: "36px",
    },

    ".tagify__tag": {
      margin: "2px 1px",

      ".tag-container": {
        padding: "2px 5px",
      },
    },

    ".tagify__tag-text": {
      color: "#ffffff",
      fontSize: "14px",
    },
  },
}));

type MixedTagFieldProps = {} & BaseParamFieldProps;

type MixedTagFieldComponentProps = {
  name: string;
  value: string;
  onChange(value: string): void;
};

const MixedTagFieldComponent: React.FC<MixedTagFieldComponentProps> = (
  props
) => {
  const { name, value, onChange: onChangeFunc } = props;
  const tagifyRef = useRef<Tagify>();
  const lastInputKey = React.useRef<string>("");
  const activeMapperRef = useRef<string | null>(null);
  const mapperContainerRef = useRef<HTMLDivElement>();

  const activeParamMapper = useFusionFlowStore.useActiveParamMapper();
  const setActiveParamMapper = useFusionFlowStore.useSetActiveParamMapper();

  const theme = useTheme();

  // const selectionStart = useRef<any>();

  const onChange = debounce(onChangeFunc, 500);

  useEffect(() => {
    if (value) {
      // console.log(
      //   "🚀 ~ file: MixedTagField.tsx:350 ~ useEffect ~ value:",
      //   value
      // );
      try {
        tagifyRef.current?.parseMixTags(escapeValue(trim(value, "\r\n")));

        const tagElms = tagifyRef.current?.getTagElms() || [];
        tagElms.forEach((elm: HTMLElement) => {
          const tagData = tagifyRef.current?.tagData(elm);

          if (tagData?.draggable) {
            addEventsToTag(tagData.id);
          }
        });
        // setActive(true);
      } catch (e) {}
    }
  }, [value]);

  useEffect(() => {
    return () => {
      if (activeMapperRef.current === name) {
        setActiveParamMapper(null);
      }
    };
  }, []);

  useEffect(() => {
    activeMapperRef.current = activeParamMapper;
  }, [activeParamMapper]);

  useEffect(() => {
    if (tagifyRef.current) {
      const input = tagifyRef.current?.DOM.input;
      if (input) {
        // input.onkeyup = (e: any) => {
        //   const selection = e.target.selectionStart;
        //   console.log(
        //     "🚀 ~ file: MixedTagField.tsx:408 ~ useEffect ~ selection:",
        //     selection,
        //     e
        //   );
        //   console.log({ sel: getCaretPosition(input) });
        //   selectionStart.current = selection;
        // };
        input.ondrop = (e: DragEvent) => {
          try {
            if (!e.dataTransfer) {
              return;
            }
            const data = JSON.parse(e.dataTransfer.getData("text/plain")) as {
              mode: string;
              startTagId: string;
              data: unknown;
              type: string;
            };
            if (data?.mode === "sort") {
              handleSortTag(data.startTagId, e, tagifyRef.current!);
            } else {
              if (data?.type === MappableTagType.Variable) {
                data?.data &&
                  handleDropOperatorTag(data.data, e, tagifyRef.current!);
              } else {
                data?.data &&
                  handleDropTag(
                    data.data as GFMLFunction,
                    e,
                    tagifyRef.current!
                  );
              }
            }
          } catch (e) {}
        };
      }
    }
  }, [tagifyRef]);

  const addEventsToTag = (startTagId: string) => {
    if (startTagId) {
      const tagElms = tagifyRef.current?.getTagElms() || [];
      const startTagElm = tagElms.find((el: Element) => el.id === startTagId);
      if (startTagElm) {
        startTagElm.ondragstart = (evt: any) => {
          evt.dataTransfer.setData(
            "text/plain",
            JSON.stringify({ mode: "sort", startTagId })
          );
        };

        startTagElm.ondragend = (evt: any) => {
          if (evt.dataTransfer.dropEffect === "none") {
            return;
          }
        };
      }
    }
  };

  const addSeparatorWithTag = (value: string) => {
    let str = value;
    const tags: string[] = [];
    let startTagIndex = str.indexOf("[[");
    while (startTagIndex !== -1) {
      let endTagIndex = str.indexOf("]]");
      if (endTagIndex === -1) {
        break;
      }
      let tag = str.substring(startTagIndex + 2, endTagIndex);
      tags.push(tag);
      str = str.replace(`[[${tag}]]`, `{{{__tag__}}}`);
      startTagIndex = str.indexOf("[[");
    }

    const tagId = v4();
    str = str.replace(
      /;/,
      `[[${JSON.stringify({
        value: ";",
        id: tagId,
        slug: ";",
        color: "#ccc",
        draggable: false,
        type: MappableTagType.Separator,
      })}]]`
    );

    tags.forEach((tag) => {
      str = str.replace(`{{{__tag__}}}`, `[[${tag}]]`);
    });

    return { value: str, tagId };
  };

  const placeCaretAfterTagId = (tagId: string) => {
    tagifyRef.current?.DOM.input.focus();
    const el = tagifyRef.current
      ?.getTagElms()
      ?.find((el: Element) => el.id === tagId);
    if (el) {
      tagifyRef.current?.placeCaretAfterNode(el);
    }
  };

  const handleAddOperatorTag = (param: Record<string, any>) => {
    const { operatorStack } = param;
    // console.log({ param });
    const tagIds: string[] = [];
    const tags: any[] = [];
    const [opSlug, ...restSlug] = (param.slug as string).split(".");
    restSlug
      .join(".")
      .split("[]")
      .forEach((s, idx, arr) => {
        // console.log({ s });
        const tagId = v4();
        tagIds.push(tagId);
        tags.push({
          value: `${idx !== 0 ? "]" : ""}${s
            .split(".")
            .map((t) => {
              const found = operatorStack.find((op: any) => op.name === t);
              return found?.label || found?.name;
            })
            .filter(Boolean)
            .join(".")}${idx === arr.length - 1 ? "" : "["}`,
          id: tagId,
          slug: `${idx !== 0 ? "]." : opSlug + "."}${s
            .split(".")
            .map((t) => {
              const found = operatorStack.find((op: any) => op.name === t);
              return found?.name;
            })
            .filter(Boolean)
            .join(".")}${idx === arr.length - 1 ? "" : "["}`,
          color: param.color,
          draggable: true,
          type: MappableTagType.Variable,
        });
      });
    tagifyRef.current?.addTags(tags);
    const sampleTags = [
      {
        value: "op_1.choices[",
        id: v4(),
        slug: "op_1.choices[",
        type: MappableTagType.Variable,
      },
      {
        value: "].texts[",
        id: v4(),
        slug: "].texts[",
        type: MappableTagType.Variable,
      },
      {
        value: "].value",
        id: v4(),
        slug: "].value",
        type: MappableTagType.Variable,
      },
    ];
    const concatOp = {
      value: "op_2.choices",
      id: v4(),
      slug: "op_2.choices",
      type: MappableTagType.Variable,
    };
    console.log(
      `${sampleTags
        .map((t) => "[[" + JSON.stringify(t) + "]]")
        .join(`[[${JSON.stringify(concatOp)}]]`)}`
    );
    console.log(
      parseTagsToExpression(
        `${sampleTags
          .map((t) => "[[" + JSON.stringify(t) + "]]")
          .join(`[[${JSON.stringify(concatOp)}]]`)}`
      )
    );
    setTimeout(() => {
      tagifyRef.current?.updateValueByDOMTags();
      placeCaretAfterTagId(tagIds[0]);
      addEventsToTag(tagIds[0]);
    }, 0);
  };

  return (
    <NodeEditorTooltip
      title={
        <Box ref={mapperContainerRef}>
          <ParamMapper
            onTagClick={(func) => {
              if (tagifyRef.current) {
                onGFMLTagClick(func, tagifyRef.current);
              }
            }}
            onOperatorClick={(param) => {
              handleAddOperatorTag(param);
            }}
            onClose={() => setActiveParamMapper(null)}
          />
        </Box>
      }
      open={activeParamMapper === name}
      onClose={() => setActiveParamMapper(null)}
      placement="left"
      disableFocusListener
      disableHoverListener
      disableTouchListener
    >
      <Box
        onClick={() =>
          activeParamMapper === name
            ? setActiveParamMapper(null)
            : setActiveParamMapper(name)
        }
        sx={{ width: "100%" }}
      >
        <ClickAwayListener
          onClickAway={(e) => {
            if (
              activeParamMapper === name &&
              !mapperContainerRef.current?.contains(e.target as Node)
            ) {
              setActiveParamMapper(null);
            }
          }}
        >
          <EditorHolder>
            <Resizable
              minHeight={36}
              enable={{ bottom: true }}
              handleComponent={{ bottom: <NavigateNext /> }}
              handleStyles={{
                bottom: {
                  bottom: "6px",
                  right: "-10px",
                  transform: "rotate(45deg)",
                  color: theme.palette.text.secondary,
                  width: "auto",
                  left: "auto",
                },
              }}
            >
              <MixedTags
                tagifyRef={tagifyRef}
                settings={{
                  duplicates: true,
                  editTags: false,
                  templates: {
                    tag: (tagData: any) => {
                      const _s: any = tagifyRef.current;
                      return `<span draggable="${tagData.draggable}" title="${
                        tagData.title || tagData.value
                      }"contenteditable='false'spellcheck='false'tabIndex="${
                        _s?.settings.a11y.focusableTags ? 0 : -1
                      }"class="${
                        _s?.settings.classNames.tag ||
                        "tagify__tag tagify--noAnim"
                      } ${
                        tagData.class ? tagData.class : ""
                      }"${_s?.getAttributes(
                        tagData
                      )}><div class="tag-container" style="background: ${
                        tagData.color || "#ccc"
                      };"><span class="${
                        _s?.settings.classNames.tagText || "tagify__tag-text"
                      }">${
                        tagData[_s?.settings.tagTextProp || ""] || tagData.value
                      }</span></div></span>`;
                    },
                  },
                }}
                onChange={(e) => {
                  const inputValue = tagifyRef.current?.getInputValue();
                  onChange(trim(inputValue));
                }}
                onKeydown={(e) => {
                  // if (
                  //   KeyCode.isTextModifyingKeyEvent((e.detail as any).originalEvent)
                  // ) {
                  // }
                  lastInputKey.current = e.detail.event.key;
                }}
                onInput={(e) => {
                  let inputValue = trim(tagifyRef.current?.getInputValue());
                  // if (lastInputKey.current === ";") {
                  //   const { value, tagId } = addSeparatorWithTag(inputValue);
                  //   inputValue = value;
                  //   (tagifyRef.current as any)?.setOriginalInputValue(inputValue);
                  //   tagifyRef.current?.loadOriginalValues("");
                  //   const tagElm = tagifyRef.current
                  //     ?.getTagElms()
                  //     ?.find((el: Element) => el.id === tagId);
                  //   if (tagElm) {
                  //     tagifyRef.current?.insertAfterTag(tagElm, "\u00A0");
                  //     placeCaretAfterTagId(tagId);
                  //   }
                  // }
                  onChange(inputValue);
                }}
              />
            </Resizable>
          </EditorHolder>
        </ClickAwayListener>
      </Box>
    </NodeEditorTooltip>
  );
};

const MixedTagFieldWrapper = forwardRef<
  MixedTagFieldRef | undefined,
  MixedTagFieldComponentProps
>((props, ref) => {
  const { name, value: fieldValue, onChange } = props;

  const [value, setValue] = useState("");
  // console.log("🚀 ~ file: MixedTagField.tsx:628 ~ value:", value);

  useEffect(() => {
    setValue(value);
  }, []);

  useImperativeHandle(ref, () => ({
    setValue: (v) => {
      setValue(v);
    },
  }));

  // useEffect(() => {
  //   if (!value) {
  //     setValue(fieldValue);
  //   }
  // }, [fieldValue]);

  return (
    <MixedTagFieldComponent value={value} onChange={onChange} name={name} />
  );
});

const Field = forwardRef<MixedTagFieldRef | undefined, any>(
  // memo(
  (props, ref) => {
    const { value, onChange, name } = props;

    const fieldRef = useRef<{ setValue(v: string): void }>();

    useEffect(() => {
      fieldRef.current?.setValue(value);
    }, []);

    const setValue = (v: string) => {
      fieldRef.current?.setValue(v);
    };

    useImperativeHandle(ref, () => ({ setValue }));

    return (
      <MixedTagFieldWrapper
        value={value}
        onChange={onChange}
        name={name}
        ref={fieldRef}
      />
    );
  }
  //   (prev, next) => prev.name === next.name && prev.value === next.value
  // )
);

export type MixedTagFieldRef = { setValue: (v: string) => void };

const MixedTagField = forwardRef<
  MixedTagFieldRef | undefined,
  MixedTagFieldProps
>((props, ref) => {
  const { parentNamePath, field } = props;
  const { name: fieldName } = field;

  const name = parentNamePath ? `${parentNamePath}.${fieldName}` : fieldName;

  // useEffect(() => {
  //   console.log("mounting");
  // }, []);

  return (
    <Controller
      name={name}
      control={props.control}
      render={({ field }) => {
        // console.log("🚀 ~ file: MixedTagField.tsx:657 ~ field:", field);
        return (
          <Field
            value={field.value}
            ref={ref}
            onChange={field.onChange}
            name={name}
          />
        );
      }}
    />
  );
});

export default MixedTagField;
