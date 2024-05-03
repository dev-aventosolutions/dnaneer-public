import classes from "./heading.module.scss";

const Heading = ({ heading }) => {
  return <h1 className={classes["heading"]}>{heading}</h1>;
};

export default Heading;
