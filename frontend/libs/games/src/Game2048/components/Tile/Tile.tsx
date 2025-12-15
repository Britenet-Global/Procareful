import { useGame2048Store } from '../../store/game2048store';
import { useStyles } from '../../styles';
import { type TileProps } from '../../types';

const Tile = ({ position, value }: TileProps) => {
  const { styles, cx } = useStyles();
  const {
    gameConfig: { tileCount },
  } = useGame2048Store();

  const [x, y] = position;

  // constants matching CSS:
  const columns = tileCount;
  const gapRem = 0.8;
  const paddingRem = 1;

  // calculate absolute positioned tiles to match grid underneath and account for gaps + paddings
  const contentWidth = `calc(100% - ${gapRem * (columns - 1)}rem - ${paddingRem * 2}rem)`;
  // 100% / 6 = 16.66667%, results in 89.98px (and tile underneath is 90px, we are making them slightly bigger on purpose)
  const tileWidth = `calc(${contentWidth} / ${columns} + 0.04px)`;
  const style = {
    left: `calc(${paddingRem}rem + ${x} * (${tileWidth} + ${gapRem}rem))`,
    top: `calc(${paddingRem}rem + ${y} * (${tileWidth} + ${gapRem}rem))`,
    width: tileWidth,
    height: tileWidth,
  };

  return (
    <div className={cx(styles.tile, styles[`tile${value}` as keyof typeof styles])} style={style}>
      {value}
    </div>
  );
};

export default Tile;
