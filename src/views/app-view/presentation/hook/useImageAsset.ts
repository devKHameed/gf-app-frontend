import { createSelectorFunctions } from "auto-zustand-selectors-hook";
import Konva from "konva";
import { nanoid } from "nanoid";
import { usePresentationImageAssetsStore } from "store/stores/presentation/imageAssetList";
import { decimalUpToSeven } from "utils/presentation/decimalUpToSeven";

const useStore = createSelectorFunctions(usePresentationImageAssetsStore);

const useImageAsset = () => {
  const store = useStore();
  const setImageAsset = async (imageList: { [key: string]: any }[]) => {
    imageList.map((image) =>
      store.addItem({
        type: image["data-item-type"],
        id: image.id,
        name: image.name,
        src: image.src,
      })
    );
  };

  const getAllImageAsset = (): { [key: string]: any }[] => {
    return Object.values(store.items || {});
  };

  const getImageAssetSrc = (imageId: string) =>
    store.items[imageId].src ?? null;

  const reduceImageSize = (
    base64: string,
    imageId?: string,
    callback?: (src: string) => void
  ) => {
    Konva.Image.fromURL(base64, (imageNode: Konva.Image) => {
      let width;
      let height;
      if (imageNode.width() > imageNode.height()) {
        width = decimalUpToSeven(512);
        height = decimalUpToSeven(
          width * (imageNode.height() / imageNode.width())
        );
      } else {
        height = decimalUpToSeven(512);
        width = decimalUpToSeven(
          height * (imageNode.width() / imageNode.height())
        );
      }
      imageNode.width(width);
      imageNode.height(height);
      const newBase64 = imageNode.toDataURL({
        x: 0,
        y: 0,
        width,
        height,
        pixelRatio: 1.2,
      });
      const id = imageId ?? nanoid();
      if (callback) {
        callback(`find:${id}`);
      }
    });
  };

  return {
    setImageAsset,
    getAllImageAsset,
    getImageAssetSrc,
    reduceImageSize,
  };
};

export default useImageAsset;
