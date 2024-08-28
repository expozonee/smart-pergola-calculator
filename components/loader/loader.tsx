import "./loader.css";

type LoaderProps = {
  color?: string;
};
type LoaderStyles = {
  [key: string]: string;
};

export function Loader({ color }: LoaderProps) {
  const style: LoaderStyles = {
    "--uib-color": color ? color : "black",
  };

  return (
    <div style={style} className="container pt-3">
      <div className="cube">
        <div className="cube__inner"></div>
      </div>
      <div className="cube">
        <div className="cube__inner"></div>
      </div>
      <div className="cube">
        <div className="cube__inner"></div>
      </div>
    </div>
  );
}
