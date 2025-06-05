import classes from "./style.module.css";

type Props = {
  data: { label: string; value: string | number }[];
};

const InfoPanel = ({ data }: Props) => {
  return (
    <div className={classes.infoContainer}>
      {data.map((item, index) => (
        <span className={classes.infoText} key={index}>
          {item.label}: {item.value}
        </span>
      ))}
    </div>
  );
};

export default InfoPanel;
