import { ReactComponent as LoadMoreIcon } from "assets/svgs/load-more.svg";
import { opportunitiesListAtom } from "store/Opportunities";
import { useSetRecoilState } from "recoil";

const LoadMore = () => {
  const setOpportunitiesList = useSetRecoilState(opportunitiesListAtom);

  const onLoadMore = () => {
    setOpportunitiesList((prev) => {
      const newArray = [...prev];
      for (let i = 0; i < 2; i++) {
        newArray.push(prev.length + i);
      }
      return newArray;
    });
  };

  return (
    <div onClick={onLoadMore} className="loading-more">
      <LoadMoreIcon />
      <span>Load more</span>
    </div>
  );
};

export default LoadMore;
