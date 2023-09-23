import Masonry from "react-masonry-css";
const breakpointColumnsObj = {
    default: 3,
    700: 3,
    900: 2,
    600: 1,
  };
const MasonryGrid = ({ children }) => {
  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="my-masonry-grid"
      columnClassName="my-masonry-grid_column"
    >
      {children}
    </Masonry>
  );
};

export default MasonryGrid;
