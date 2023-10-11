import { createSelectorFunctions } from "auto-zustand-selectors-hook";
import Konva from "konva";
import { Node, NodeConfig } from "konva/lib/Node";
import { MutableRefObject } from "react";
import { useSlideSelectedItemsStore } from "store/stores/presentation/selectedStage";
import useItem from "./useItem";
const useStore = createSelectorFunctions(useSlideSelectedItemsStore);

// import { useI18n } from './i18n-context';

function useStyleSelector() {
  const { updateCanvasItem } = useItem();
  const store = useStore();
  const selecteditems = store?.currentSelectedItems || [];
  const onToggleFontStyle = ({
    key,
    value,
  }: {
    key: string;
    value: number | string;
  }) => {
    if (!selecteditems?.length) {
      return;
    }
    selecteditems.map((item: Node<NodeConfig>) => {
      const dataItemType = item.attrs["data-item-type"];
      if (dataItemType === "text" || "link") {
        let keyValue = item.attrs?.[key] || "";
        const wordToSearch = value;
        const regex = new RegExp(`\\b${wordToSearch}\\b`, "i"); // Create a regex pattern to match the word, ignoring case and word boundaries
        const isMatch = regex.test(keyValue); // Test if the word is found in the text
        if (!!isMatch) {
          let newArttrs = { ...item.attrs };
          const newText = keyValue.replace(regex, "");
          newArttrs[key] = newText?.trim() || "";
          updateCanvasItem(item.attrs?.id, () => ({
            ...newArttrs,
          }));
        } else {
          updateCanvasItem(item.attrs?.id, () => ({
            [key]: `${keyValue} ${value}`,
          }));
        }
      }
      return null;
    });
  };
  const onToggleFontWeight = ({
    key,
    value,
  }: {
    key: string;
    value: number | string;
  }) => {
    if (!selecteditems?.length) {
      return;
    }
    selecteditems.map((item: Node<NodeConfig>) => {
      const dataItemType = item.attrs["data-item-type"];
      if (dataItemType === "text" || dataItemType === "link") {
        let keyValue = item.attrs?.[key] || "";
        const wordToSearch = value;
        const regex = new RegExp(`\\b${wordToSearch}\\b`, "i"); // Create a regex pattern to match the word, ignoring case and word boundaries
        const isMatch = regex.test(keyValue); // Test if the word is found in the text
        if (!!isMatch) {
          let newArttrs = { ...item.attrs };
          const newText = keyValue.replace(regex, "");
          newArttrs.fotWeight = newText?.trim() || "";
          newArttrs[key] = newText?.trim() || "";
          updateCanvasItem(item.attrs?.id, () => ({
            ...newArttrs,
          }));
        } else {
          updateCanvasItem(item.attrs?.id, () => ({
            [key]: `${keyValue} ${value}`,
            fontWeight: value,
          }));
        }
      }
      return null;
    });
  };
  const onUpdateStyle = ({
    key,
    value,
  }: {
    key: string;
    value: number | string;
  }) => {
    if (!selecteditems?.length) {
      return;
    }
    selecteditems.map((item: Node<NodeConfig>) => {
      const dataItemType = item.attrs["data-item-type"];
      if (dataItemType === "text" || dataItemType === "link") {
        updateCanvasItem(item.attrs?.id, () => ({
          [key]: value,
        }));
      } else if (item.attrs["data-item-type"] === "shape") {
        updateCanvasItem(item.attrs?.id, () => ({
          [key]: value,
        }));
      }
      return null;
    });
  };
  const onResetStyle = (stageRef: MutableRefObject<Konva.Stage>) => {
    if (!selecteditems?.length) {
      return;
    }
    selecteditems.forEach((item: Node<NodeConfig>) => {
      switch (item.attrs["data-item-type"]) {
        case "text" || "link":
          updateCanvasItem(item.attrs?.id, () => ({
            fill: "#ffffff",
            fontSize: 18,
            fontFamily: "serif",
            textAlign: "left",
            verticalAlign: "top",
            fontWeight: 400,
            brightness: 0,
          }));
          break;
        case "shape":
          updateCanvasItem(item.attrs?.id, () => ({
            fill: "#ffffff",
            zIndex: 0,
            brightness: 0,
          }));
          break;
        case "image":
          updateCanvasItem(item.attrs?.id, () => ({
            zIndex: 0,
            brightness: 0,
            _filters: ["Brighten"],
          }));
          break;
        default:
          break;
      }
    });
  };
  const onUpdateHyperLink = (value: any) => {
    if (!selecteditems?.length) {
      return;
    }
    selecteditems.map((item: Node<NodeConfig>) => {
      updateCanvasItem(item.attrs?.id, () => ({
        ...value,
      }));

      return null;
    });
  };
  return {
    onUpdateStyle,
    onResetStyle,
    onUpdateHyperLink,
    onToggleFontStyle,
    onToggleFontWeight,
  };
}
export default useStyleSelector;
